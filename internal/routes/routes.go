package routes

import (
	"net/http"
	"social-network/internal/handlers"
	"social-network/internal/middleware"
)

func Routes() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /", handlers.HomeHandler)

	router.Handle("GET /test", middleware.ValidateJwt(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Terekest"))
	})))

	return middleware.RecoverPanic(middleware.SecureHeaders(middleware.LogRequest(router)))
}
