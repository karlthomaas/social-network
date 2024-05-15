package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) addEventMember(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Attendace int `json:"attendance"`
	}

	user := app.contextGetUser(r)

	groupID, err := app.readParam("id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	eventID, err := app.readParam("eventID")
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

	_, err := app.models.GroupMembers.CheckIfMember(groupID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
			if user.ID != group.UserID {
				app.unAuthorizedResponse(w, r)
				return
			}
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	}

}
