package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("GET /api/healthcheck",
		app.healthCheckHandler)

	router.Handle("GET /api/posts/feed",
		app.ValidateJwt(app.getFeedPostsHandlder))
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
	router.HandleFunc("PATCH /api/posts/{id}/reply/{replyID}",
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

	router.HandleFunc("POST /api/groups",
		app.ValidateJwt(app.createGroupHandler))
	router.HandleFunc("DELETE /api/groups/{id}",
		app.ValidateJwt(app.deleteGroupHandler))
	router.HandleFunc("GET /api/groups/{id}",
		app.ValidateJwt(app.showGroupHandler))
	router.HandleFunc("PATCH /api/groups/{id}",
		app.ValidateJwt(app.updateGroupHandler))
	router.HandleFunc("GET /api/groups",
		app.ValidateJwt(app.getAllGroups))

	router.HandleFunc("POST /api/groups/{id}/users/{userID}",
		app.ValidateJwt(app.inviteToGroupHandler))
	router.HandleFunc("POST /api/groups/{id}/group_invitations",
		app.ValidateJwt(app.acceptInvitationHandler))
	router.HandleFunc("GET /api/groups/{id}/invitations",
		app.ValidateJwt(app.getMyInvitedUsersHandler))
	router.HandleFunc("GET /api/users/{id}/group_invitations",
		app.ValidateJwt(app.getAllGroupInvitationsHandler))
	router.HandleFunc("GET /api/groups/{id}/invitable_users",
		app.ValidateJwt(app.getInvitableUsersHandler))
	router.HandleFunc("GET /api/groups/{id}/members",
		app.ValidateJwt(app.getAllGroupMembersHandler))
	router.HandleFunc("DELETE /api/groups/{id}/group_invitations/users/{userID}",
		app.ValidateJwt(app.deleteGroupInvitationHandler))

	router.HandleFunc("POST /api/groups/{id}/requests",
		app.ValidateJwt(app.addGroupRequestHandler))
	router.HandleFunc("POST /api/groups/{id}/requests/users/{userID}",
		app.ValidateJwt(app.acceptGroupRequestHandler))
	router.HandleFunc("DELETE /api/groups/{id}/requests/users/{userID}",
		app.ValidateJwt(app.deleteGroupRequestHandler))
	router.HandleFunc("GET /api/groups/{id}/requests",
		app.ValidateJwt(app.getAllGroupRequestsHandler))
	router.HandleFunc("GET /api/groups/{id}/join-request-status",
		app.ValidateJwt(app.getGroupRequestHandler))

	router.HandleFunc("POST /api/groups/{id}/posts",
		app.ValidateJwt(app.createGroupPostHandler))
	router.HandleFunc("GET /api/groups/{id}/posts",
		app.ValidateJwt(app.getAllGroupPosts))

	router.HandleFunc("POST /api/groups/{id}/group_events",
		app.ValidateJwt(app.createGroupEventHandler))
	router.HandleFunc("DELETE /api/groups/{id}/group_events/{eventID}",
		app.ValidateJwt(app.deleteGroupEventHandler))

	return app.RecoverPanic(app.rateLimit(app.SecureHeaders(app.LogRequest(router))))
}
