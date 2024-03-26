package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"social-network/internal/data"
	"strings"
	"time"
)

type Header struct {
	Alg string
	Typ string
}

type Payload struct {
	UserId string `json:"userId"`
	Exp    int64  `json:"exp"`
}

func (app *application) CreateJWT(userId string) (string, error) {
	header := &Header{
		Alg: "HS256",
		Typ: "JWT",
	}

	payload := &Payload{
		UserId: userId,
		Exp:    time.Now().Add(5 * time.Minute).Unix(),
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
	cookie, err := r.Cookie("token")
	fmt.Println(r.Cookies())
	fmt.Println("😀", cookie)
	if err != nil {
		if err == http.ErrNoCookie {
			return "", errors.New("no token cookie")
		}
		return "", err
	}

	var parts []string = strings.Split(cookie.Value, ".")
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
		fmt.Println(err)
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

func (app *application) createHmacSha256(data string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}

func (app *application) createRefreshToken(userId string) string {

	token, err := app.generateUUID()
	if err != nil {
		return ""
	}

	refreshToken := &data.RefreshToken{
		Token:  token,
		UserId: userId,
		Expiry: time.Now().Add(72 * time.Hour),
	}

	// ensure that the user has only one refresh token
	app.models.Tokens.Delete(userId)
	app.models.Tokens.Insert(refreshToken)

	return token
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
