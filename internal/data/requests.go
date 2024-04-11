package data

import (
	"context"
	"database/sql"
	"time"
)

type Request struct {
	UserID     string    `json:"user_id"`
	FollowerID string    `json:"follower_id"`
	CreatedAt  time.Time `json:"created_at"`
}

type RequestModel struct {
	DB *sql.DB
}

func (m *RequestModel) Insert(request *Request) error {
	query := `
	INSERT INTO follow_requests (user_id, follower_id)
	VALUES (?,?)
	`
	args := []interface{}{
		request.UserID,
		request.FollowerID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err

}
