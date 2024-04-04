package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /", app.ValidateJwt(app.HomeHandler))
	router.HandleFunc("GET /users/{id}", app.showUserHandler)
	router.HandleFunc("GET /api/authenticate", app.getUserForToken)
	router.HandleFunc("POST /api/users", app.createUserHandler)
	router.HandleFunc("POST /api/login", app.authenticateUser)
	router.HandleFunc("POST /api/refresh_session", app.refreshSession)
	router.HandleFunc("POST /api/posts", app.ValidateJwt(app.createPostHandler))

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
