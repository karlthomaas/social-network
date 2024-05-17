package main

import (
	"errors"
	"fmt"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
)

func (app *application) inviteToGroupHandler(w http.ResponseWriter, r *http.Request) {
	/* Route that handles HTTP requests for inviting a user to a group */
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

	member, err := app.models.GroupMembers.CheckIfMember(group.ID, user.ID)
	if err != nil {
		switch {
		case !errors.Is(err, data.ErrRecordNotFound):
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	if user.ID != group.UserID && member == nil {
		app.unAuthorizedResponse(w, r)
		return
	}

	invitedUser, err := app.models.GroupMembers.Get(invitedUserID)
	if err != nil {
		if !errors.Is(err, data.ErrRecordNotFound) {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	if invitedUser != nil {
		v.AddError("invitation", "user is already member of this group")
		app.failedValidationResponse(w, r, v.Errors)
	}
	if invitedUserID == user.ID {
		v.AddError("invitation", "you cant invite yourself to the grouo")
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	invitation := &data.GroupInvitation{
		GroupID:   group.ID,
		InvitedBy: user.ID,
		UserID:    invitedUserID,
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
	/* Route that is used for accepting incoming group invitations */

	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	invitedUser, err := app.models.GroupInvitations.Get(groupID, user.ID)
	if err != nil {
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
		app.serverErrorResponse(w, r, err)
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"invitations": invitations}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getAllGroupInvitationsHandler(w http.ResponseWriter, r *http.Request) {
	/* Route that shows all incoming group invitations */

	userID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}
	user := app.contextGetUser(r)

	if userID != user.ID {
		app.unAuthorizedResponse(w, r)
		return
	}
	invitations, err := app.models.GroupInvitations.GetAllForUser(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"invitations": invitations}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getMyInvitedUsersHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	_, err = app.models.Groups.Get(groupID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	invitations, err := app.models.GroupInvitations.GetYourInvitations(groupID, user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"invitations": invitations}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getInvitableUsersHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	members, err := app.models.GroupMembers.GetAllGroupMembers(groupID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	followers, err := app.models.Followers.GetAllForUser(user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	invitable := []*data.Follower{}

	if len(members) == 0 {
		invitable = followers
	} else {
		for _, follower := range followers {
			var isMember bool
			if follower.UserID == user.ID {
				for _, member := range members {
					if member.UserID == follower.FollowerID {
						isMember = true
						break
					}
				}
				if !isMember {
					invitable = append(invitable, follower)
				}
				
			}
		}
	} 

	fmt.Println(invitable)

	err = app.writeJSON(w, http.StatusOK, envelope{"user": invitable}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}


func (app *application) deleteGroupInvitationHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	groupID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	userID, err := app.readParam(r, "userID")
	if err != nil {
		app.notFoundResponse(w,r)
		return
	}

	invitation, err := app.models.GroupInvitations.Get(groupID, userID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	if invitation.InvitedBy != user.ID {
		app.unAuthorizedResponse(w,r)
		return
	}

	err = app.models.GroupInvitations.Delete(groupID, userID)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w,r)
		default:
			app.serverErrorResponse(w,r,err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message":"invitation cancelled"},nil)
	if err != nil {
		app.serverErrorResponse(w,r,err)
		return
	}
}
