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

	user := &data.User{
		ID:          id,
		Email:       input.Email,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		DateOfBirth: dateOfBirth,
		Image:       input.Image,
		Nickname:    input.Nickname,
		AboutMe:     input.AboutMe,
		Privacy:     "public",
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
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
		app.invalidCredentialsResponse(w, r)
		return
	}

	match, err := user.Password.Matches(password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !match {
		app.invalidCredentialsResponse(w, r)
		return
	}

	token, err := app.createJWT(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return

	}

	refreshToken, err := app.createRefreshToken(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// todo make jwtCookie and refreshTokenCookie a function or global variable
	jwtToken := http.Cookie{
		Name:     "Token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(720 * time.Hour), // real expiry is in jwt payload
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	refreshTokenCookie := http.Cookie{
		Name:     "Refresh-Token",
		Value:    refreshToken,
		Path:     "/",
		Expires:  time.Now().Add(720 * time.Hour), // 30 days
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &refreshTokenCookie)
	http.SetCookie(w, &jwtToken)

	err = app.writeJSON(w, http.StatusOK, envelope{"token": token}, nil)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getUserForToken(w http.ResponseWriter, r *http.Request) {
	userID, err := app.DecodeAndValidateJwt(w, r)
	if err != nil {
		if err.Error() == "token expired" {
			refreshToken, err := app.validateRefreshToken(w, r)
			if err != nil {
				app.invalidAuthenticationTokenResponse(w, r)
				return
			}
			jwt, err := app.createJWT(refreshToken.UserId)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}
			jwtToken := http.Cookie{
				Name:     "Token",
				Value:    jwt,
				Path:     "/",
				Expires:  time.Now().Add(720 * time.Hour),
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteLaxMode,
			}
			http.SetCookie(w, &jwtToken)
			userID = refreshToken.UserId

		} else {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}
	}
	user, err := app.models.Users.Get(userID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	var userResponse = &data.User{
		ID:          user.ID,
		Email:       user.Email,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		DateOfBirth: user.DateOfBirth,
		Nickname:    user.Nickname,
		AboutMe:     user.AboutMe,
		CreatedAt:   user.CreatedAt,
		Privacy:     user.Privacy,
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"user": userResponse}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
