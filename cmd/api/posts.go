package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"strings"
	"time"
)

func (app *application) createPostHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Content   string   `json:"content"`
		Image     []byte   `json:"image"`
		Privacy   string   `json:"privacy"`
		VisibleTo []string `json:"visible_to"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	postID, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	post := &data.Post{
		ID:        postID,
		UserID:    user.ID,
		Content:   input.Content,
		Image:     input.Image,
		Privacy:   input.Privacy,
		UpdatedAt: time.Now().Truncate(time.Second),
	}

	v := validator.New()

	if data.ValidatePost(v, post); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Posts.Insert(post)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if post.Privacy == "almost_private" && len(input.VisibleTo) > 0 {
		err := app.models.Posts.AddPostVisibilities(postID, input.VisibleTo)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"post": post}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getUserPostsHandler(w http.ResponseWriter, r *http.Request) {
	userName := r.PathValue("username")

	parts := strings.Split(userName, ".")
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

func (app *application) deletePostHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Posts.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": "post successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) showPostHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	post, err := app.models.Posts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": post}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updatePostHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	post, err := app.models.Posts.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Content   *string  `json:"content"`
		Image     *[]byte  `json:"image"`
		Privacy   *string  `json:"privacy"`
		VisibleTo []string `json:"visible_to"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Content != nil {
		post.Content = *input.Content
	}

	if input.Image != nil {
		post.Image = *input.Image
	}

	if input.Privacy != nil {
		post.Privacy = *input.Privacy
	}

	post.CreatedAt = time.Now().Truncate(time.Second)

	v := validator.New()
	if data.ValidatePost(v, post); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Posts.Update(post)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
	}

	if post.Privacy == "almost_private" && len(input.VisibleTo) > 0 {
		currentUserIDs, err := app.models.Posts.GetPostVisibilities(post.ID)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		if len(currentUserIDs) > 0 {
			err = app.models.Posts.UpdatePostVisibilities(post.ID, input.VisibleTo, currentUserIDs)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}
		} else {
			app.models.Posts.AddPostVisibilities(post.ID, input.VisibleTo)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"post": post}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
