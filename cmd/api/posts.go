package main

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/internal/data"
	"strings"
	"time"
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
		UpdatedAt: time.Now().Truncate(time.Second),
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

func (app *application) getUserPostsHandler(w http.ResponseWriter, r *http.Request) {
	userName := r.PathValue("username")
	fmt.Println(userName)

	parts := strings.Split(userName, ".")
	fmt.Println(parts)
	firstName := parts[0]
	lastName := parts[1]

	user, err := app.models.Users.GetByName(firstName, lastName)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	posts, err := app.models.Posts.GetAllForUser(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"posts": posts}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

}
