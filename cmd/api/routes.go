package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /api/healthcheck",
		app.healthCheckHandler)

	router.Handle("GET /",
		app.ValidateJwt(app.HomeHandler))
	router.HandleFunc("GET /api/users/me",
		app.ValidateJwt(app.getSessionUserHandler))
	router.HandleFunc("PATCH /api/users/me",
		app.ValidateJwt(app.updateUserHandler))
	router.HandleFunc("GET /api/users/{nickname}",
		app.ValidateJwt(app.showUserHandler))
	router.HandleFunc("POST /api/logout",
		app.ValidateJwt(app.deleteSession))

	router.HandleFunc("GET /api/users/{nickname}/posts",
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

	router.HandleFunc("POST /api/users/{id}/follow",
		app.ValidateJwt(app.addFollowerHandler))

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
