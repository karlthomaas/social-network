package main

import (
	"net/http"

)

func (app *application) getUserNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	notifications, err := app.models.Notifications.GetAllForUser(user.ID) 
		if err != nil {
			app.serverErrorResponse(w,r,err)
			return
		}

	err = app.writeJSON(w, http.StatusOK, envelope{"notifications":notifications}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}