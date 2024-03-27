package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"social-network/internal/data"
	"strings"
	"time"
	"github.com/gofrs/uuid"
)

type Header struct {
	Alg string
	Typ string
}

type Payload struct {
	UserId string `json:"userId"`
	Exp    int64  `json:"exp"`
}

func (app *application) createJWT(userId string) (string, error) {
	header := &Header{
		Alg: "HS256",
		Typ: "JWT",
	}

	payload := &Payload{
		UserId: userId,
		Exp:    time.Now().Add(1 * time.Minute).Unix(),
	}

	headerBytes, err := json.Marshal(header)
	if err != nil {
		return "", err
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	signature := app.createHmacSha256(strings.Join([]string{base64.RawURLEncoding.EncodeToString(headerBytes), base64.RawURLEncoding.EncodeToString(payloadBytes)}, "."), os.Getenv("JWT_SECRET"))

	token := strings.Join([]string{
		base64.RawURLEncoding.EncodeToString(headerBytes),
		base64.RawURLEncoding.EncodeToString(payloadBytes),
		signature,
	}, ".")

	return token, nil
}

func (app *application) DecodeAndValidateJwt(w http.ResponseWriter, r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		return "", errors.New("missing auth header")
	}
	bearerToken := strings.Split(authHeader, " ")
	if len(bearerToken) != 2 {
		return "", errors.New("invalid authorization header format")
	}
	var parts []string = strings.Split(bearerToken[1], ".")
	if len(parts) != 3 {
		return "", errors.New("invalid token")
	}

	signature := app.createHmacSha256(strings.Join([]string{
		parts[0],
		parts[1],
	}, "."), os.Getenv("JWT_SECRET"))

	if signature != parts[2] {
		err := errors.New("invalid secret")
		return "", err
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return "", err
	}

	var payload Payload

	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return "", err
	}

	if time.Now().Unix() > payload.Exp {
		return "", errors.New("token expired")
	}

	return payload.UserId, nil
}

func (app *application) validateRefreshToken(w http.ResponseWriter, r *http.Request) (*data.RefreshToken, error) {
	cookie, err := r.Cookie("Refresh-Token")
	if err != nil {
		if err == http.ErrNoCookie {
			return nil, errors.New("no refresh token cookie")
		}
		return nil, err
	}

	_, err = uuid.FromString(cookie.Value)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}
	refreshToken, err := app.models.Tokens.Get(cookie.Value)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	if time.Now().After(refreshToken.Expiry) {
		return nil, errors.New("refresh token expired")
	}
	return refreshToken, err
}

func (app *application) createHmacSha256(data string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}

func (app *application) createRefreshToken(userId string) (string, error) {

	token, err := app.generateUUID()
	if err != nil {
		return "", err
	}

	refreshToken := &data.RefreshToken{
		Token:  token,
		UserId: userId,
		Expiry: time.Now().Add(720 * time.Hour),
	}

	// ensure that the user has only one refresh token
	err = app.models.Tokens.Delete(userId)
	if err != nil {
		return "", err
	}
	
	err = app.models.Tokens.Insert(refreshToken)
	if err != nil {
		return "", err
	}

	return token, nil
}

// func (app *application) RefreshToken(w http.ResponseWriter, r *http.Request) {
// 	cookie, err := r.Cookie("Refresh-Token")

// 	if err != nil {
// 		// Generate new token
// 		return
// 	}

// 	//todo  Decode token

// 	//todo  Validate token

// 	//todo  Generate new token
// }
