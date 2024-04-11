package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type Follower struct {
	UserID     string    `json:"user_id"`
	FollowerID string    `json:"follower_id"`
	CreatedAt  time.Time `json:"created_at"`
}

type FollowerModel struct {
	DB *sql.DB
}

func (m *FollowerModel) Insert(follower *Follower) error {
	query := `INSERT INTO followers (user_id, follower_id)
	VALUES (?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		follower.UserID,
		follower.FollowerID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *FollowerModel) Get(userID, followerID string) (*Follower, error) {
	query := `SELECT user_id, follower_id, created_at
		FROM followers
		WHERE user_id = ?
		AND follower_id = ?`

	var follower Follower
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, userID, followerID).Scan(
		&follower.UserID,
		&follower.FollowerID,
		&follower.CreatedAt,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &follower, nil
}

func (m *FollowerModel) GetAllForUser(userID string) ([]*Follower, error) {
	query := `SELECT user_id, follower_id, created_at
	FROM followers
	WHERE user_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	followers := []*Follower{}

	for rows.Next() {
		var follower Follower
		rows.Scan(
			&follower.UserID,
			&follower.FollowerID,
			&follower.CreatedAt,
		)

		followers = append(followers, &follower)

	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil

}
