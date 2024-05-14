package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) getAllGroupMembersHandler(w http.ResponseWriter, r *http.Request) {

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

	members, err := app.models.GroupMembers.GetAllGroupMembers(groupID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	_, err = app.models.GroupMembers.CheckIfMember(group.ID, user.ID)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			if (group.UserID != user.ID)  {
				app.unAuthorizedResponse(w,r)
				return
			}
		} else {
			app.serverErrorResponse(w,r,err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"members": members}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}


func (app *application) deleteGroupMemberHandler(w http.ResponseWriter, r *http.Request) {

	// delete group member, authorized by group owner and member
	user := app.contextGetUser(r)

	deletableUserID, err := app.readParam(r,"userID")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	group, err := app.models.Groups.Get(groupID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	if deletableUserID != user.ID && group.UserID != user.ID {
		app.unAuthorizedResponse(w,r)
		return
	}

	err = app.models.GroupMembers.Delete(groupID, deletableUserID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"group_member":"group member deleted succesfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}