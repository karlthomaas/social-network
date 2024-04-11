package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) addFollowerHandler(w http.ResponseWriter, r *http.Request) {
	followerID := app.contextGetUser(r).ID
	userID, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	var follower interface{}

	user, err := app.models.Users.Get(userID)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	if user.Privacy == "private" {
		follower = &data.Request{
			UserID:     userID,
			FollowerID: followerID,
		}

		request, ok := follower.(*data.Request)
		if !ok {
			app.serverErrorResponse(w, r, errors.New("failed to convert follower to *data.Request"))
		}

		err = app.models.Requests.Insert(request)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	} else {
		follower = &data.Follower{
			UserID:     userID,
			FollowerID: followerID,
		}
		followerData, ok := follower.(*data.Follower)
		if !ok {
			app.serverErrorResponse(w, r, errors.New("failed to convert follower to *data.Follower"))
		}
		err = app.models.Followers.Insert(followerData)

		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"follower": follower}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getUserFollowersHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	followers, err := app.models.Followers.GetAllForUser(id)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"followers": followers}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
