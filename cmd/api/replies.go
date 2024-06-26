package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"time"
)

func (app *application) createReplyHandler(w http.ResponseWriter, r *http.Request) {

	var input struct {
		Content string `json:"content"`
	}

	postID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	user := app.contextGetUser(r)

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	replyID, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	reply := &data.Reply{
		ID:        replyID,
		UserID:    user.ID,
		PostID:    postID,
		Content:   input.Content,
		UpdatedAt: time.Now().Truncate(time.Second),
		CreatedAt: time.Now().Truncate(time.Second),
	}

	reply.User = *user

	v := validator.New()

	if data.ValidateReply(v, reply); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Replies.Insert(reply)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"reply": reply}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteReplyHandler(w http.ResponseWriter, r *http.Request) {

	currentUser := app.contextGetUser(r)

	replyID, err := app.readParam(r, "replyID")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	reply, err := app.models.Replies.Get(replyID)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	if reply.UserID != currentUser.ID {
		app.unAuthorizedResponse(w, r)
		return
	}

	err = app.models.Replies.Delete(replyID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"reply": "successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getAllPostRepliesHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	user := app.contextGetUser(r)

	replies, err := app.models.Replies.GetAll(postID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	for _, reply := range replies {
		reactions, err := app.models.Reactions.GetReactions(reply.ID)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		reply.Reactions = reactions
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"replies": replies}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) updateReplyHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	var input struct {
		Content *string `json:"content"`
	}

	replyID, err := app.readParam(r, "replyID")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	reply, err := app.models.Replies.Get(replyID)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	if reply.UserID != currentUser.ID {
		app.unAuthorizedResponse(w, r)
		return
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Content != nil {
		reply.Content = *input.Content
	}

	reply.UpdatedAt = time.Now().Truncate(time.Second)

	v := validator.New()

	if data.ValidateReply(v, reply); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Replies.Update(reply)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"reply": reply}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
