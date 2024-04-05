package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /",
		app.ValidateJwt(app.HomeHandler))
	router.HandleFunc("GET /api/users/me",
		app.ValidateJwt(app.getSessionUserHandler))
	router.HandleFunc("GET /api/users/{id}",
		app.ValidateJwt(app.showUserHandler))

	router.HandleFunc("GET /api/users/{username}/posts",
		app.ValidateJwt(app.getUserPostsHandler))
	router.HandleFunc("POST /api/posts",
		app.ValidateJwt(app.createPostHandler))
	router.HandleFunc("DELETE /api/posts/{id}",
		app.ValidateJwt(app.deletePostHandler))
	router.HandleFunc("GET /api/posts/{id}",
		app.ValidateJwt(app.showPostHandler))
	router.HandleFunc("PATCH /api/posts/{id}",
		app.ValidateJwt(app.updatePostHandler))

	router.HandleFunc("POST /api/users",
		app.createUserHandler)
	router.HandleFunc("GET /api/authenticate",
		app.getUserForToken)
	router.HandleFunc("POST /api/login",
		app.authenticateUser)
	router.HandleFunc("POST /api/refresh_session",
		app.refreshSession)

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
