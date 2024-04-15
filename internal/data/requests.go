package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type Request struct {
	UserID     string    `json:"user_id"`
	FollowerID string    `json:"follower_id"`
	CreatedAt  time.Time `json:"created_at"`
	User       User      `json:"user"`
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

func (m *RequestModel) Delete(userID, followerID string) error {
	query := `
	DELETE FROM follow_requests
	WHERE user_id = ?
	AND follower_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, userID, followerID)
	return err
}

func (m *RequestModel) Get(userID, followerID string) (*Request, error) {
	query := `SELECT user_id, follower_id, created_at
		FROM follow_requests
		WHERE user_id = ?
		AND follower_id = ?`

	var request Request
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, userID, followerID).Scan(
		&request.UserID,
		&request.FollowerID,
		&request.CreatedAt,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &request, nil
}

func (m *RequestModel) GetAllRequests(userID string) ([]*Request, error) {
	query := `SELECT r.user_id, r.follower_id, r.created_at, u.nickname, u.image
	FROM follow_requests r
	JOIN users u ON r.follower_id = u.id
	WHERE r.user_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	requests := []*Request{}

	for rows.Next() {
		var request Request
		rows.Scan(
			&request.UserID,
			&request.FollowerID,
			&request.CreatedAt,
			&request.User.Nickname,
			&request.User.Image,
		)

		requests = append(requests, &request)

	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}

func (m *RequestModel) DeleteWithTx(tx *sql.Tx, userID, followerID string) error {
	query := `
	DELETE FROM follow_requests
	WHERE user_id = ?
	AND follower_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, userID, followerID)
	return err
}
