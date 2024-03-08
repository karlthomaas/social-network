package routes

import (
	"social-network/internal/middleware"
	"net/http"
	"social-network/internal/handlers"
)

func Routes() http.Handler {
    router := http.NewServeMux()

    router.HandleFunc("GET /", handlers.HomeHandler)

    return middleware.RecoverPanic(middleware.SecureHeaders(middleware.LogRequest(router)))
}