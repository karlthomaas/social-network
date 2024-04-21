package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type ReplyModel struct {
	DB *sql.DB
}

type Reply struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	PostID    string    `json:"post_id"`
	Content   string    `json:"content"`
	Image     []byte    `json:"image"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (m *ReplyModel) Insert(r *Reply) error {
	query := `
		INSERT INTO replies (id, user_id, post_id ,content, image, updated_at)
		VALUES (?,?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		r.ID,
		r.UserID,
		r.PostID,
		r.Content,
		r.Image,
		r.UpdatedAt,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *ReplyModel) Delete(id string) error {
	query := `
	DELETE FROM replies
	WHERE id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, id)
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

func (m *ReplyModel) Get(id string) (*Reply, error) {
	query := `
	SELECT id, user_id, post_id, content, image, created_at, updated_at
	FROM replies
	WHERE id = ?
	`

	var r Reply

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&r.ID,
		&r.UserID,
		&r.PostID,
		&r.Content,
		&r.Image,
		&r.CreatedAt,
		&r.UpdatedAt,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &r, nil
}

func (m *ReplyModel) Update(r *Reply) error {
	query := `
		UPDATE replies
		SET content = ?, image = ?, updated_at = ?
		WHERE user_id = ? AND id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		r.Content,
		r.Image,
		r.UpdatedAt,
		r.UserID,
		r.ID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}
	return err
}

func (m *ReplyModel) GetAll(postID string) ([]*Reply, error) {
	query := `
	SELECT id, user_id, post_id, content, image, created_at, updated_at
	FROM replies
	WHERE post_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, postID)
	if err != nil {
		return nil, err
	}

	replies := []*Reply{}

	for rows.Next() {
		var r Reply

		err := rows.Scan(
			&r.ID,
			&r.UserID,
			&r.PostID,
			&r.Content,
			&r.Image,
			&r.CreatedAt,
			&r.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

	replies = append(replies, &r)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return replies, nil
}