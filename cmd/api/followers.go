package main

import (
	"net/http"
	"social-network/internal/data"
)

func (app *application) addFollowerHandler(w http.ResponseWriter, r *http.Request) {
	followerID := app.contextGetUser(r).ID
	userID := r.PathValue("id")

	follower := &data.Follower{
		UserID:     userID,
		FollowerID: followerID,
	}

	err := app.models.Followers.Insert(follower)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"follower": follower}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getAllFollowers(w http.ResponseWriter, r *http.Request) {

}
