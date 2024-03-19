package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()


	router.HandleFunc("GET /", app.HomeHandler)

	return app.RecoverPanic(app.SecureHeaders(app.LogRequest(router)))
}
