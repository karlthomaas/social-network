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
	"social-network/internal/db/models"
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

func (app *application) CreateJWT(userId string, w http.ResponseWriter, r *http.Request) {
	header := &Header{
		Alg: "HS256",
		Typ: "JWT",
	}

	payload := &Payload{
		UserId: userId,
		Exp:    time.Now().Add(1 * time.Hour).Unix(),
	}

	headerBytes, err := json.Marshal(header)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	signature := app.createHmacSha256(strings.Join([]string{base64.RawURLEncoding.EncodeToString(headerBytes), base64.RawURLEncoding.EncodeToString(payloadBytes)}, "."), os.Getenv("JWT_SECRET"))

	token := strings.Join([]string{
		base64.RawURLEncoding.EncodeToString(headerBytes),
		base64.RawURLEncoding.EncodeToString(payloadBytes),
		signature,
	}, ".")

	app.writeJSON(w, http.StatusOK, envelope{"token": token}, nil)
}

func (app *application) DecodeAndValidateJwt(w http.ResponseWriter, r *http.Request) error {
	header := r.Header.Get("Authorization")
	var headerValues []string = strings.Split(header, " ")

	if len(headerValues) != 2 {
		return errors.New("invalid token")
	}

	var parts []string = strings.Split(headerValues[1], ".")
	if len(parts) != 3 {
		return errors.New("invalid token")
	}

	signature := app.createHmacSha256(strings.Join([]string{
		parts[0],
		parts[1],
	}, "."), os.Getenv("JWT_SECRET"))

	if signature != parts[2] {
		err := errors.New("invalid secret")
		return err
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		fmt.Println(err)
		return err
	}

	var payload Payload

	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return err
	}

	if time.Now().Unix() > payload.Exp {
		return errors.New("token expired")
	}

	return nil
}

func (app *application) createHmacSha256(data string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}

func (app *application) createRefreshToken(u *models.User) string {

	// create variable that is uuid
	token, err := app.generateUUID()
	if err != nil {
		return ""
	}

	refreshToken := &data.RefreshToken{
		Token:  token,
		UserId: u.Id,
		Expiry: time.Now().Add(72 * time.Hour),
	}

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
