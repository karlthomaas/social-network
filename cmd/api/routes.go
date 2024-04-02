package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /", app.ValidateJwt(http.HandlerFunc(app.HomeHandler)))
	router.HandleFunc("GET /users/{id}", app.showUserHandler)
	router.HandleFunc("GET /api/authenticate", app.getUserForToken)
	router.HandleFunc("POST /api/users", app.createUserHandler)
	router.HandleFunc("POST /api/login", app.authenticateUser)
	router.HandleFunc("POST /api/refresh_session", app.refreshSession)

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
