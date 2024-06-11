package data

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound         = errors.New("record not found")
	ErrUniqueConstraintFailed = errors.New("UNIQUE constraint failed")
)

type Models struct {
	Users             UserModel
	Tokens            TokenModel
	Posts             PostModel
	Followers         FollowerModel
	Requests          RequestModel
	Reactions         ReactionModel
	Replies           ReplyModel
	Groups            GroupModel
	GroupInvitations  GroupInvitationModel
	GroupMembers      GroupMemberModel
	GroupRequests     GroupRequestModel
	GroupEvents       GroupEventModel
	GroupEventMembers GroupEventMemberModel
	Messages          MessageModel
	Notifications     NotificationModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:             UserModel{DB: db},
		Tokens:            TokenModel{DB: db},
		Posts:             PostModel{DB: db},
		Followers:         FollowerModel{DB: db},
		Requests:          RequestModel{DB: db},
		Reactions:         ReactionModel{DB: db},
		Replies:           ReplyModel{DB: db},
		Groups:            GroupModel{DB: db},
		GroupInvitations:  GroupInvitationModel{DB: db},
		GroupMembers:      GroupMemberModel{DB: db},
		GroupRequests:     GroupRequestModel{DB: db},
		GroupEvents:       GroupEventModel{DB: db},
		GroupEventMembers: GroupEventMemberModel{DB: db},
		Messages:          MessageModel{DB: db},
		Notifications:     NotificationModel{DB: db},
	}
}
