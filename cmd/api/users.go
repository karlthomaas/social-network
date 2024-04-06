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
		return
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
		return
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

	err = app.createSession(w, user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	err = app.writeJSON(w, http.StatusCreated, envelope{"user": user.ID}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
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
		return
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

	err = app.createSession(w, user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"message": "successfully logged in"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getUserForToken(w http.ResponseWriter, r *http.Request) {
	userID, err := app.DecodeAndValidateJwt(w, r)
	if err != nil {
		if err.Error() == "token expired" {
			refreshToken, err := app.validateRefreshToken(r)
			if err != nil {
				app.invalidAuthenticationTokenResponse(w, r)
				return
			}
			userID = refreshToken.UserId
			err = app.createSession(w, userID)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}

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

func (app *application) createSession(w http.ResponseWriter, userId string) error {
	// Create a new JWT for the user.
	token, err := app.createJWT((userId))
	if err != nil {
		return err
	}
	// Create a new refresh token for the user.
	refreshToken, err := app.createRefreshToken((userId))
	if err != nil {
		return err
	}
	jwtToken := http.Cookie{
		Name:     "Token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(5 * time.Minute),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	refreshTokenCookie := http.Cookie{
		Name:     "Refresh-Token",
		Value:    refreshToken,
		Path:     "/",
		Expires:  time.Now().Add(720 * time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &jwtToken)
	http.SetCookie(w, &refreshTokenCookie)

	return nil
}

func (app *application) getSessionUserHandler(w http.ResponseWriter, r *http.Request) {
	/* Returns the session user object */
	user := app.contextGetUser(r)

	err := app.writeJSON(w, http.StatusOK, envelope{"user": user}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteSession(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	jwtToken := http.Cookie{
		Name:     "Token",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	refreshTokenCookie := http.Cookie{
		Name:     "Refresh-Token",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &jwtToken)
	http.SetCookie(w, &refreshTokenCookie)

	err := app.models.Tokens.Delete(user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"user": "user succesfully logged out"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
