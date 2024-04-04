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
		INSERT INTO posts (id, title, user_id, content, image, privacy, updated_at)
		VALUES (?,?,?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		post.ID,
		post.Title,
		post.UserID,
		post.Content,
		post.Image,
		post.Privacy,
		post.UpdatedAt,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *PostModel) Update(post *Post) error {
	query := `
		UPDATE posts
		SET title = ?, content = ?, image = ?
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

func (m *PostModel) GetAllForUser(userID string) ([]*Post, error) {
	query := `
		SELECT id, title, user_id, content, image, privacy, created_at, updated_at
		FROM posts
		WHERE user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	posts := []*Post{}

	for rows.Next() {
		var post Post

		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.UserID,
			&post.Content,
			&post.Image,
			&post.Privacy,
			&post.CreatedAt,
			&post.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}