package data

import (
	"context"
	"database/sql"
	"time"
)

type PostVisibilityModel struct {
	DB *sql.DB
}

type PostVisibilities struct {
	PostID    string `json:"user_id"`
	VisibleTo string `json:"visible_to"`
}

func (m *PostVisibilityModel) AddPostVisibilities(postVisibilities *PostVisibilities) error {
	query := `
	INSERT INTO post_visibilities
	(user_id, visible_to)
	VALUES (?,?)
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, postVisbilities.PostID, postVisbilities.VisibleTo)

	return err
}

func (m *PostVisibilityModel) DeletePostVisibilities(postID string) error {
	query := `DELETE from post_visibilities
		WHERE post_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, postID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}
	return nil
}
