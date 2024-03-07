package routes

import (
    "net/http"
    "social-network/internal/handlers"
)

func Routes() http.Handler {
    router := http.NewServeMux()

    router.HandleFunc("/", handlers.HomeHandler)

    return router
}