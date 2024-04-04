package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /",
		app.ValidateJwt(app.HomeHandler))
	router.HandleFunc("GET /apo/users/{id}",
		app.showUserHandler)
	router.HandleFunc("POST /api/users",
		app.createUserHandler)
	router.HandleFunc("GET /api/users/{username}/posts",
		app.getUserPostsHandler)
	router.HandleFunc("GET /api/authenticate",
		app.getUserForToken)
	router.HandleFunc("POST /api/login",
		app.authenticateUser)
	router.HandleFunc("POST /api/refresh_session",
		app.refreshSession)
	router.HandleFunc("POST /api/posts",
		app.ValidateJwt(app.createPostHandler))
	router.HandleFunc("DELETE /api/posts/{id}",
		app.deletePostHandler)
	router.HandleFunc("GET /api/posts/{id}",
		app.showPostHandler)

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
