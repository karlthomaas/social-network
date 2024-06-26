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
	User       User      `json:"user"`
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

func (m *FollowerModel) Delete(followerID, userID string) error {
	query := `DELETE from followers
	WHERE user_id = ?
	AND follower_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, userID, followerID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
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
	query := `SELECT f.user_id, f.follower_id, f.created_at, u.first_name, u.last_name, u.image, u.nickname
	FROM followers f
	JOIN users u ON f.follower_id = u.id
	WHERE f.user_id = ?
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
			&follower.User.FirstName,
			&follower.User.LastName,
			&follower.User.Image,
			&follower.User.Nickname,
		)

		followers = append(followers, &follower)

	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func (m *FollowerModel) GetAllUserFollowing(userID string) ([]*Follower, error) {
	query := `SELECT f.user_id, f.follower_id, f.created_at, u.first_name, u.last_name, u.image ,u.nickname
	FROM followers f
	JOIN users u ON f.user_id = u.id
	WHERE f.follower_id = ?
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
			&follower.User.FirstName,
			&follower.User.LastName,
			&follower.User.Image,
			&follower.User.Nickname,
		)

		followers = append(followers, &follower)

	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func (m *FollowerModel) GetContacts(userID string) ([]*Follower, error) {
	query := `
		SELECT 
			CASE 
				WHEN f.user_id = ? THEN f.follower_id
				WHEN f.follower_id = ? THEN f.user_id
			END AS contact_id,
			f.created_at, 
			u.first_name, 
			u.last_name, 
			u.image
		FROM followers f
		JOIN users u ON u.id = CASE 
			WHEN f.user_id = ? THEN f.follower_id
			WHEN f.follower_id = ? THEN f.user_id
		END
		WHERE (f.user_id = ? OR f.follower_id = ?)
		GROUP BY contact_id
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID, userID, userID, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []*Follower

	for rows.Next() {
		var follower Follower
		err := rows.Scan(
			&follower.FollowerID,
			&follower.CreatedAt,
			&follower.User.FirstName,
			&follower.User.LastName,
			&follower.User.Image,
		)
		if err != nil {
			return nil, err
		}

		follower.UserID = userID

		followers = append(followers, &follower)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func (m *FollowerModel) InsertWithTx(tx *sql.Tx, follower *Follower) error {
	query := `INSERT INTO followers (user_id, follower_id)
	VALUES (?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		follower.UserID,
		follower.FollowerID,
	}

	_, err := tx.ExecContext(ctx, query, args...)
	return err
}
