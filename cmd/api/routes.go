package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /", app.ValidateJwt(http.HandlerFunc(app.HomeHandler)))
	router.HandleFunc("POST /api/testjwt", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.CreateJWT("fawf", w, r)
	}))
	router.HandleFunc("POST /api/users", app.createUserHandler)
	router.HandleFunc("GET /users/{id}", app.showUserHandler)

	return app.RecoverPanic(app.SecureHeaders(app.LogRequest(router)))
}
