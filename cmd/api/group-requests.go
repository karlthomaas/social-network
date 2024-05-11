package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
)

func (app *application) addGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	/* Route that allows user to create join request into a group */
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	v := validator.New()

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

	if user.ID == group.UserID {
		v.AddError("request", "group owner cant request to be in the group")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	member, err := app.models.GroupMembers.CheckIfMember(group.ID, user.ID)
	if err != nil {
		switch {
		case !errors.Is(err, data.ErrRecordNotFound):
			app.serverErrorResponse(w, r, err)
			return
		}
	}
	if member != nil {
		v.AddError("member", "user is already member of the group")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	request := &data.GroupRequest{
		GroupID: group.ID,
		UserID:  user.ID,
	}

	err = app.models.GroupRequests.Insert(request)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateRequest):
			v.AddError("request", "user has already sent request to this group")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"request": request}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) acceptGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	requestingUserID, err := app.readParam(r, "userID")
	if err != nil {
		app.serverErrorResponse(w, r, err)
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

	if group.UserID != user.ID {
		app.unAuthorizedResponse(w, r)
		return
	}

	member := &data.GroupMember{
		GroupID: group.ID,
		UserID:  requestingUserID,
	}

	v := validator.New()

	err = app.models.GroupMembers.Insert(member)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateMember):
			v.AddError("member", "user is already member of this group")
			app.failedValidationResponse(w, r, v.Errors)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.models.GroupRequests.Delete(group.ID, requestingUserID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "group request accepted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteGroupRequestHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	deletableUserID, err := app.readParam(r, "userID")
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

	if deletableUserID != user.ID && user.ID != group.UserID {
		app.unAuthorizedResponse(w, r)
		return
	}

	err = app.models.GroupRequests.Delete(group.ID, deletableUserID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "request succesfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}


func (app *application) getAllGroupRequestsHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r,"id")
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

	if group.UserID != user.ID {
		app.unAuthorizedResponse(w,r)
		return
	}


	requests, err := app.models.GroupRequests.GetAllGroupRequests(groupID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}


	err = app.writeJSON(w, http.StatusOK, envelope{"requests":requests}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}


}