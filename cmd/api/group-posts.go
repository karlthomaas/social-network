package main

import (
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"social-network/internal/data"
	"social-network/internal/validator"
	"time"
)

func (app *application) createGroupPostHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Content   string   `json:"content"`
		Image     []byte   `json:"image"`
		Privacy   string   `json:"privacy"`
		VisibleTo []string `json:"visible_to"`
	}

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	group, err := app.models.Groups.Get(groupID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	user := app.contextGetUser(r)

	_, err = app.models.GroupMembers.CheckIfMember(group.ID, user.ID)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			if group.UserID != user.ID {
				app.unAuthorizedResponse(w, r)
				return
			}
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.readJSON(w, r, &input)
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
		ID:        postID,
		UserID:    user.ID,
		Content:   input.Content,
		GroupID:   group.ID,
		Image:     input.Image,
		Privacy:   input.Privacy,
		UpdatedAt: time.Now().Truncate(time.Second),
	}

	v := validator.New()

	if len(post.Image) != 0 {
		path := filepath.Join("internal", "images", string(post.Image))
		file, err := os.Create(path)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		defer file.Close()

		_, err = file.Write(post.Image)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

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


func (app *application) getAllGroupPosts(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	group, err := app.models.Groups.Get(groupID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	_, err = app.models.GroupMembers.CheckIfMember(group.ID, user.ID)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			if (group.UserID != user.ID)  {
				app.unAuthorizedResponse(w,r)
				return
			}
		} else {
			app.serverErrorResponse(w,r,err)
			return
		}
	}


	posts, err := app.models.Posts.GetAllGroupPosts(groupID, user.ID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	for _, post := range posts {
		reactions, err := app.models.Reactions.GetReactions(post.ID)
		if err != nil {
			app.serverErrorResponse(w,r,err)
			return
		}
		post.Reactions = reactions
	}

	err = app.writeJSON(w,http.StatusOK, envelope{"group_posts": posts}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}