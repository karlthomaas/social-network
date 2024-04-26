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
	router.HandleFunc("GET /api/users/{nickname}/followers",
		app.ValidateJwt(app.getUserFollowersHandler))
	router.HandleFunc("GET /api/users/{id}/follow_status",
		app.ValidateJwt(app.checkFollowPermissionsHandler),
	)
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

	router.HandleFunc("GET /api/posts/{id}/reply",
		app.ValidateJwt(app.getAllPostRepliesHandler))
	router.HandleFunc("POST /api/posts/{id}/reply",
		app.ValidateJwt(app.createReplyHandler))
	router.HandleFunc("DELETE /api/posts/{id}/reply/{replyID}",
		app.ValidateJwt(app.deleteReplyHandler))
	router.HandleFunc("PATCH /api/posts/{id}/reply/{replyId}",
		app.ValidateJwt(app.updateReplyHandler))

	router.HandleFunc("POST /api/users",
		app.createUserHandler)
	router.HandleFunc("GET /api/authenticate",
		app.getUserForToken)
	router.HandleFunc("POST /api/login",
		app.authenticateUser)
	router.HandleFunc("POST /api/refresh_session",
		app.refreshSession)

	router.HandleFunc("POST /api/users/{id}/followers",
		app.ValidateJwt(app.addFollowerHandler))
	router.HandleFunc("DELETE /api/users/{id}/followers",
		app.ValidateJwt(app.unFollowHandler))
	router.HandleFunc("GET /api/users/{id}/follow_requests",
		app.ValidateJwt(app.getAllRequestsHandler))
	router.HandleFunc("POST /api/users/{id}/follow_requests",
		app.ValidateJwt(app.acceptFollowRequestHandler))
	router.HandleFunc("DELETE /api/users/{id}/follow_requests",
		app.ValidateJwt(app.cancelRequestHandler))

	router.HandleFunc("GET /api/posts/{id}/reactions",
		app.ValidateJwt(app.getPostReactionHandler))
	router.HandleFunc("POST /api/posts/{id}/reactions",
		app.ValidateJwt(app.addPostReactionHandler))
	router.HandleFunc("DELETE /api/posts/{id}/reactions/{reactionID}",
		app.ValidateJwt(app.deletePostReactionHandler))


		router.HandleFunc("GET /api/posts/{id}/replies/{replyID}/reactions",
		app.ValidateJwt(app.getReplyReactionHandler))
	router.HandleFunc("POST /api/posts/{id}/replies/{replyID}/reactions",
		app.ValidateJwt(app.addReplyReactionHandler))
	router.HandleFunc("DELETE /api/posts/{id}/replies/{replyID}/reactions/{reactionID}",
		app.ValidateJwt(app.deleteReplyReactionHandler))

	

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
