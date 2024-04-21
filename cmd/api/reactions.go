package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) addPostReactionHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := app.readParam(r, "id")
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	user := app.contextGetUser(r)

	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	reaction := &data.Reaction{
		ID:     id,
		UserID: user.ID,
		PostID: postID,
	}

	react, err := app.models.Reactions.Get(user.ID, postID)
	if react != nil {
		app.badRequestResponse(w, r, errors.New("you have already liked this post"))
		return
	}

	err = app.models.Reactions.Insert(reaction)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"reaction": reaction}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteReactionHandler(w http.ResponseWriter, r *http.Request) {
	userID := app.contextGetUser(r).ID

	postID, err := app.readParam(r, "id")
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	reactionID, err := app.readParam(r, "reactionID")
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	reaction, err := app.models.Reactions.Get(userID, postID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if reaction.UserID != userID {
		app.unAuthorizedResponse(w, r)
		return
	}

	err = app.models.Reactions.Delete(reactionID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "reaction successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getReactionHandler(w http.ResponseWriter, r *http.Request) {

	parentId, err := app.readParam(r, "id")
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	reaction, err := app.models.Reactions.Get(user.ID, parentId)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			reaction = nil
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"reaction": reaction}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
