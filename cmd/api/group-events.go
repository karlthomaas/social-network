package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"time"
)

func (app *application) createGroupEventHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Date        string `json:"date"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	date, err := time.Parse("2006-01-02", input.Date)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

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

	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	g := &data.GroupEvent{
		ID:id,
		GroupID: group.ID,
		UserID: user.ID,
		Title: input.Title,
		Description: input.Description,
		Date: date,
		UpdatedAt: time.Now().Truncate(time.Second),
	}

	v := validator.New()

	if data.ValidateGroupEvent(v, g); !v.Valid() {
		app.failedValidationResponse(w,r,v.Errors)
		return
	}

	err = app.models.GroupEvents.Insert(g)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"group_event":g}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}


func (app *application) deleteGroupEventHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	eventID, err := app.readParam(r, "eventID")
	if err != nil {
		app.notFoundResponse(w,r)
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

	err = app.models.GroupEvents.Delete(eventID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}


	err = app.writeJSON(w, http.StatusOK, envelope{"group_event": "event deleted succesfully"},nil)
	if err != nil {
		app.serverErrorResponse(w,r, err)
		return
	}
}

