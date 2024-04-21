package main

import (
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
