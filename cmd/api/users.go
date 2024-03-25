package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"time"
)

func (app *application) createUserHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		DateOfBirth string `json:"date_of_birth"`
		Image       []byte `json:"image"`
		Nickname    string `json:"nickname"`
		AboutMe     string `json:"about_me"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	dateOfBirth, err := time.Parse("2006-01-02", input.DateOfBirth)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	passwordHash, err := app.models.Users.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
	// TODO: change password type to type password {plaintext, hash}
	user := &data.User{
		ID:          id,
		Email:       input.Email,
		Password:    string(passwordHash),
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		DateOfBirth: dateOfBirth,
		Image:       input.Image,
		Nickname:    input.Nickname,
		AboutMe:     input.AboutMe,
		Privacy:     "public",
	}

	v := validator.New()

	if data.ValidateUser(v, user); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
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

func (app *application) authenticateUser(w http.ResponseWriter, r *http.Request) {
	email, password, ok := r.BasicAuth()
	if !ok {
		app.serverErrorResponse(w, r, errors.New("invalid authentication header"))
	}

	user, err := app.models.Users.GetByEmail(email)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	match, err := user.Matches(password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !match {
		app.serverErrorResponse(w, r, err)
		return
	}

	token, err := app.CreateJWT(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return

	}

	refreshToken := app.createRefreshToken(user.ID)

	err = app.writeJSON(w, http.StatusOK, envelope{"token": token, "refresh_tokens": refreshToken}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
