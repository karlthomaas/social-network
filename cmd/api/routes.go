package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /", app.HomeHandler)
	router.HandleFunc("POST /api/users", app.createUserHandler)
	router.HandleFunc("GET /users/{id}", app.showUserHandler)

	return app.RecoverPanic(app.SecureHeaders(app.LogRequest(router)))
}
