package data

import (
	"context"
	"database/sql"
	"time"
)

type PostModel struct {
	DB *sql.DB
}

type Post struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	UserID    string    `json:"user_id"`
	Content   string    `json:"content"`
	Image     []byte    `json:"image"`
	Privacy   string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (m *PostModel) Insert(post *Post) error {
	query := `
		INSERT INTO posts (id, user_id, content, image, privacy)
		VALUES (?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		post.ID,
		post.UserID,
		post.Content,
		post.Image,
		post.Privacy,
	}

	return m.DB.QueryRowContext(ctx, query, args...).Scan(&post.ID, &post.UserID, &post.CreatedAt)
}

func (m *PostModel) Update(post *Post) error {
	query := `
		UPDATE posts
		SET title = ? content = ?, image = ?
		WHERE user_id = ? AND id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		post.Title,
		post.Content,
		post.Image,
		post.UserID,
		post.ID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}
