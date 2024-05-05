package main

import (
	"errors"
	"fmt"
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

func (app *application) inviteToGroupHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	invitedUserID, err := app.readParam(r, "userID")
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
	v := validator.New()

	if user.ID != group.UserID {
		app.unAuthorizedResponse(w, r)
		return
	}
	if invitedUserID == user.ID {
		v.AddError("invitation", "you cant invite yourself to the grouo")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	invitation := &data.GroupInvitation{
		GroupID: group.ID,
		UserID:  invitedUserID,
	}

	if data.ValidateGroupInvitation(v, invitation); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.GroupInvitations.Insert(invitation)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateInvitation):
			v.AddError("invitation", "user already invited to this group")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"invitations": invitation}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) acceptInvitationHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	invitedUser, err := app.models.GroupInvitations.Get(groupID, user.ID)
	if err != nil {
		fmt.Println("mv", err)
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	groupMember := &data.GroupMember{
		GroupID: invitedUser.GroupID,
		UserID:  invitedUser.UserID,
	}

	fmt.Println(groupMember)

	err = app.models.GroupMembers.Insert(groupMember)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.models.GroupInvitations.Delete(invitedUser.GroupID, invitedUser.UserID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"message": "invitation accepted"}, nil)
}

func (app *application) getAllInvitedUsersHandler(w http.ResponseWriter, r *http.Request) {
	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	invitations, err := app.models.GroupInvitations.GetAllForGroup(groupID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
	}


	err = app.writeJSON(w,http.StatusOK, envelope{"invitations": invitations}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}


func (app *application) getAllGroupInvitationsHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := app.readParam(r,"id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}
	user  := app.contextGetUser(r)

	if userID != user.ID {
		app.unAuthorizedResponse(w,r)
		return
	}
	invitations, err := app.models.GroupInvitations.GetAllForUser(user.ID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
	}


	err = app.writeJSON(w,http.StatusOK, envelope{"invitations": invitations}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}