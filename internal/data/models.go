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
	Users     UserModel
	Tokens    TokenModel
	Posts     PostModel
	Followers FollowerModel
	Requests  RequestModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:     UserModel{DB: db},
		Tokens:    TokenModel{DB: db},
		Posts:     PostModel{DB: db},
		Followers: FollowerModel{DB: db},
		Requests:  RequestModel{DB: db},
	}
}
