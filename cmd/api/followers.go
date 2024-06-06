package main

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
)

func (app *application) addFollowerHandler(w http.ResponseWriter, r *http.Request) {
	followerID := app.contextGetUser(r).ID
	userID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	var follower interface{}

	user, err := app.models.Users.Get(userID)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if user.Privacy == "private" {
		follower = &data.Request{
			ID:         id,
			UserID:     userID,
			FollowerID: followerID,
		}

		request, ok := follower.(*data.Request)
		if !ok {
			app.serverErrorResponse(w, r, errors.New("failed to convert follower to *data.Request"))
		}

		err = app.models.Requests.Insert(request)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		v := validator.New()

		notification := &data.Notification{
			Sender:          user.ID,
			Receiver:        userID,
			FollowRequestID: id,
		}

		if data.ValidateNotification(v, notification); !v.Valid() {
			app.failedValidationResponse(w, r, v.Errors)
			return
		}

		err = app.createNotification(notification, r)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

	} else {
		follower = &data.Follower{
			UserID:     userID,
			FollowerID: followerID,
		}
		followerData, ok := follower.(*data.Follower)
		if !ok {
			app.serverErrorResponse(w, r, errors.New("failed to convert follower to *data.Follower"))
		}
		err = app.models.Followers.Insert(followerData)

		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"follower": follower, "privacy": user.Privacy}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getUserFollowersHandler(w http.ResponseWriter, r *http.Request) {
	nickname := r.PathValue("nickname")

	user, err := app.models.Users.GetByNickname(nickname)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	followers, err := app.models.Followers.GetAllForUser(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"followers": followers}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) checkFollowPermissionsHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	var permission int

	currentUserID := app.contextGetUser(r).ID

	_, err = app.models.Followers.Get(id, currentUserID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			_, err = app.models.Requests.Get(id, currentUserID)
			if err != nil {
				switch {
				case errors.Is(err, data.ErrRecordNotFound):
					permission = 0
				default:
					app.serverErrorResponse(w, r, err)
					return
				}
			} else {
				permission = 2
			}
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	} else {
		permission = 1
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"permission": permission}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getAllRequestsHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	requests, err := app.models.Requests.GetAllRequests(currentUser.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"requests": requests}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) acceptFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	requesterID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	follower := &data.Follower{
		UserID:     currentUser.ID,
		FollowerID: requesterID,
	}

	tx, err := app.models.Followers.DB.Begin()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	defer tx.Rollback()

	err = app.models.Requests.DeleteWithTx(tx, currentUser.ID, requesterID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.models.Followers.InsertWithTx(tx, follower)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if err := tx.Commit(); err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"message": "follow request accepted"}, nil)
}

func (app *application) unFollowHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	targetID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	if currentUser.ID == targetID {
		app.badRequestResponse(w, r, errors.New("user can't unfollow himself"))
		return
	}

	err = app.models.Followers.Delete(currentUser.ID, targetID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "successfully unfollowed"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) removeFollowerHandler(w http.ResponseWriter, r *http.Request) {
	currentUser := app.contextGetUser(r)

	targetID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Followers.Delete(targetID, currentUser.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "successfully unfollowed"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) cancelRequestHandler(w http.ResponseWriter, r *http.Request) {

	currentUser := app.contextGetUser(r)
	targetID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	var request *data.Request

	option := r.PathValue("option")
	fmt.Println(option)
	if option != "cancel" && option != "decline" {
		app.badRequestResponse(w, r, errors.New("invalid option parameter"))
	}

	var current, target string
	switch option {
    case "decline":
        current, target = currentUser.ID, targetID
    case "cancel":
        current, target = targetID, currentUser.ID
    }

	request, err = app.models.Requests.Get(current, target)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}
		err = app.models.Requests.Delete(current, target)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

	err = app.models.Notifications.DeleteByType(request.ID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "request cancelled succesfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getContacts(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	// followerID, err := app.readParam(r, "userID")
	// if err != nil {
	// 	app.notFoundResponse(w,r)
	// 	return
	// }

	contacts, err := app.models.Followers.GetContacts(user.ID)
	if err != nil {
		app.serverErrorResponse(w,r,err)
	}

	err = app.writeJSON(w,http.StatusOK, envelope{"contacts": contacts}, nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}
