package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"time"
)

func (app *application) createGroupHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	groupID, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	group := &data.Group{
		ID:          groupID,
		UserID:      user.ID,
		Title:       input.Title,
		Description: input.Description,
		UpdatedAt:   time.Now().Truncate(time.Second),
	}

	groupMember := &data.GroupMember{
		GroupID: group.ID,
		UserID: user.ID,
	}

	v := validator.New()

	if data.ValidateGroup(v, group); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}


	err = app.models.Groups.Insert(group)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.models.GroupMembers.Insert(groupMember)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"group": group}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteGroupHandler(w http.ResponseWriter, r *http.Request) {

	user := app.contextGetUser(r)

	id, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	group, err := app.models.Groups.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	if group.UserID != user.ID {
		app.unAuthorizedResponse(w, r)
		return
	}

	err = app.models.Groups.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"group": "group successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) showGroupHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	group, err := app.models.Groups.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"group": group}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateGroupHandler(w http.ResponseWriter, r *http.Request) {

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	group, err := app.models.Groups.Get(groupID)
	if err != nil {
		switch {
		case errors.Is(data.ErrRecordNotFound, err):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	if group.UserID != user.ID {
		app.unAuthorizedResponse(w, r)
		return
	}

	if input.Title != nil {
		group.Title = *input.Title
	}

	if input.Description != nil {
		group.Description = *input.Description
	}

	group.UpdatedAt = time.Now().Truncate(time.Second)

	v := validator.New()

	if data.ValidateGroup(v, group); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Groups.Update(group)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"group": group}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}


func (app *application) getAllGroups(w http.ResponseWriter, r *http.Request) {
	groups, err := app.models.Groups.GetAll()
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}

	err = app.writeJSON(w,http.StatusOK, envelope{"groups":groups}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
	}
}
