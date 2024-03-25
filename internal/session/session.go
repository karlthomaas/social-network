package session

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"social-network/internal/helpers"
	"std/encoding/base64"
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

func CreateJwtCookie(userId string, w http.ResponseWriter) {
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
		helpers.ServerError(w, err)
		return
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		helpers.ServerError(w, err)
	}

	signature := createHmacSha256(strings.Join([]string{
		base64.RawURLEncoding.EncodeToString(headerBytes),
		base64.RawURLEncoding.EncodeToString(payloadBytes),
	}, "."), os.Getenv("JWT_SECRET"))

	token := strings.Join([]string{
		base64.RawURLEncoding.EncodeToString(headerBytes),
		base64.RawURLEncoding.EncodeToString(payloadBytes),
		signature,
	}, ".")

	http.SetCookie(w, &http.Cookie{
		Name:     "Authorization",
		Value:    token,
		Expires:  time.Now().Add(1 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
}

func DecodeAndValidateJwt(w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie("Authorization")
	if err != nil {
		return err
	}
	var parts []string = strings.Split(cookie.Value, ".")
	if len(parts) != 3 {
		return errors.New("invalid token")
	}

	signature := createHmacSha256(strings.Join([]string{
		parts[0],
		parts[1],
	}, "."), os.Getenv("JWT_SECRET"))

	if signature != parts[2] {
		err := errors.New("invalid secret")
		return err
	}

	payloadBytes, err := base64.URLEncoding.DecodeString(parts[1])
	if err != nil {
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

func createHmacSha256(data string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(h.Sum(nil))
}
