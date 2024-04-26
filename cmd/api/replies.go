package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"time"
)

func (app *application) createReplyHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Content string `json:"content"`
		Image   []byte `json:"image"`
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
		ID:      replyID,
		UserID:  user.ID,
		PostID:  postID,
		Content: input.Content,
		Image:   input.Image,
		UpdatedAt: time.Now().Truncate(time.Second),
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
		app.notFoundResponse(w,r)
		return
	}

	reply, err := app.models.Replies.Get(replyID)
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	if reply.UserID != currentUser.ID {
		app.unAuthorizedResponse(w,r)
		return
	}

	err = app.models.Replies.Delete(replyID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	err = app.writeJSON(w,http.StatusOK,envelope{"reply":"successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}


func (app *application) getAllPostRepliesHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	replies, err := app.models.Replies.GetAll(postID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	for _, reply := range replies {
		reactions, err := app.models.Reactions.GetReactions(reply.ID)
		if err != nil {
			app.serverErrorResponse(w,r,err)
			return
		}
		reply.Reactions = reactions
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"replies":replies}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}

func (app *application) updateReplyHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	var input struct {
		Content *string `json:"content"`
		Image   *[]byte `json:"image"`
	}

	replyID, err := app.readParam(r, "replyID")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	reply, err := app.models.Replies.Get(replyID)
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	if reply.UserID != currentUser.ID {
		app.unAuthorizedResponse(w,r)
		return
	}

	if input.Content != nil {
		reply.Content = *input.Content
	}

	if input.Image != nil {
		reply.Image = *input.Image
	}

	if input.Image != nil {
		reply.Image = *input.Image
	}

	reply.UpdatedAt = time.Now().Truncate(time.Second)

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