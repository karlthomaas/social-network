package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) addEventMemberHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Attendace int `json:"attendance"`
	}

	
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	if input.Attendace != 0 && input.Attendace != 1 {
		app.badRequestResponse(w,r,errors.New("attendance needs to be 0 or 1"))
		return
	}

	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	eventID, err := app.readParam(r, "eventID")
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

	_, err = app.models.GroupMembers.CheckIfMember(groupID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			if user.ID != group.UserID {
				app.unAuthorizedResponse(w, r)
				return
			}
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	eventMember := &data.GroupEventMember{
		UserID:       user.ID,
		GroupEventID: eventID,
		Attendace:    input.Attendace,
	}

	err = app.models.GroupEventMembers.Insert(eventMember)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"group_event_member": eventMember}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}


func (app *application) deleteGroupEventMember(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	_, err := app.readParam(r,"id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	eventID, err := app.readParam(r, "eventID")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}


	err = app.models.GroupEventMembers.Delete(user.ID, eventID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	err = app.writeJSON(w,http.StatusOK, envelope{"message":"group_event_member successfully deleted"},nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}