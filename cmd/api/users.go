package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"time"
)

func (app *application) createUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Password    string    `json:"password"`
		FirstName   string    `json:"first_name"`
		LastName    string    `json:"last_name"`
		DateOfBirth time.Time `json:"date_of_birth"`
		Image       []byte    `json:"image"`
		Nickname    string    `json:"nickname"`
		AboutMe     string    `json:"about_me"`
		Privacy     string    `json:"privacy"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	user := &data.User{
		ID:          id,
		Password:    input.Password,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		DateOfBirth: input.DateOfBirth,
		Image:       input.Image,
		Nickname:    input.Nickname,
		AboutMe:     input.AboutMe,
		Privacy:     input.Privacy,
	}

	err = app.models.Users.Insert(user)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)

	err = app.writeJSON(w, http.StatusCreated, envelope{"user": user.ID}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showUserHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	user, err := app.models.Users.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
