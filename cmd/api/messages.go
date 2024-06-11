package main

import (
	"errors"
	"net/http"
	"social-network/internal/data"
)

func (app *application) getPrivateMessagesHandler(w http.ResponseWriter, r *http.Request) {
	// Return messages between 2 users. Includes messages, first- and lastname for both receiver and sender
	user := app.contextGetUser(r)

	receiver, err := app.readParam(r, "userID")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	messages, err := app.models.Messages.GetAllPrivateMessages(user.ID, receiver)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"messages": messages}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getGroupMessagesHandler(w http.ResponseWriter, r *http.Request) {
	// Return messages all group messages. Includes messages, first- and lastname for sender
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "groupID")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	_, err = app.models.GroupMembers.CheckIfMember(groupID, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.unAuthorizedResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	messages, err := app.models.Messages.GetAllGroupMessages(groupID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"messages": messages}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
