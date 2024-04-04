package main

import (
	"net/http"
	"social-network/internal/data"
)

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		Image   []byte `json:"image"`
		Privacy string `json:"privacy"`
	}

	user := app.contextGetUser(r)

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	postID, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	post := &data.Post{
		ID:      postID,
		UserID:  user.ID,
		Title:   input.Title,
		Content: input.Content,
		Image:   input.Image,
		Privacy: input.Privacy,
	}

	err = app.models.Posts.Insert(post)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"post": post}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

}
