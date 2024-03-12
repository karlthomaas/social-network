package middleware

import (
	"fmt"
	"net/http"
	"social-network/internal/helpers"
	"social-network/internal/session"
)

func SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy",
		"default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com")
		w.Header().Set("Referrer-Policy", "origin-when-cross-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "0")

		next.ServeHTTP(w, r)
	}) 
}

func LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		helpers.InfoLog.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())
		next.ServeHTTP(w, r)
	})
}

func RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				helpers.ServerError(w, fmt.Errorf("%s", err))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func ValidateJwt(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := session.DecodeAndValidateJwt(w, r)
		if err != nil {
			helpers.ClientError(w, http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}