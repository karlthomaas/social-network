package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
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
	Image     string    `json:"image"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	User      User      `json:"user"`
	Reactions int       `json:"reactions"`
	Reaction  Reaction  `json:"reaction"`
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
	SELECT r.id, r.user_id, r.post_id, r.content, r.image, r.created_at, r.updated_at, u.first_name, u.last_name, u.image, u.nickname, react.user_id
	FROM replies r
	JOIN users u ON u.id = r.user_id
	LEFT JOIN reactions react ON react.reply_id = r.id
	WHERE r.id = ?
	`

	var r Reply

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var RUserID sql.NullString

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&r.ID,
		&r.UserID,
		&r.PostID,
		&r.Content,
		&r.Image,
		&r.CreatedAt,
		&r.UpdatedAt,
		&r.User.FirstName,
		&r.User.LastName,
		&r.User.Image,
		&r.User.Nickname,
		&RUserID,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	if !RUserID.Valid {
		r.Reaction.UserID = ""
	} else {
		r.Reaction.UserID = RUserID.String
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

func (m *ReplyModel) GetAll(postID, loggedInUser string) ([]*Reply, error) {
	query := `
	SELECT r.id, r.user_id, r.post_id, r.content, r.image, r.created_at, r.updated_at, u.first_name, u.last_name, u.image, u.nickname, react.id
	FROM replies r
	JOIN users u ON r.user_id = u.id
	LEFT JOIN reactions react ON r.id = react.reply_id
	AND react.user_id = ?
	WHERE r.post_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, loggedInUser, postID)
	if err != nil {
		return nil, err
	}

	replies := []*Reply{}

	for rows.Next() {
		var r Reply
		var reactionID sql.NullString

		err := rows.Scan(
			&r.ID,
			&r.UserID,
			&r.PostID,
			&r.Content,
			&r.Image,
			&r.CreatedAt,
			&r.UpdatedAt,
			&r.User.FirstName,
			&r.User.LastName,
			&r.User.Image,
			&r.User.Nickname,
			&reactionID,
		)

		if err != nil {
			return nil, err
		}
		if !reactionID.Valid {
			r.Reaction.ID = ""
		} else {
			r.Reaction.ID = reactionID.String
		}

		replies = append(replies, &r)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return replies, nil
}

func (m *ReplyModel) InsertImage(replyID, images string) error {
	query := `
	UPDATE replies
	SET image = ?
	WHERE id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, images, replyID)
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

func ValidateReply(v *validator.Validator, reply *Reply) {
	v.Check(reply.Content != "", "content", "must not be empty")
	v.Check(len(reply.Content) <= 2000, "content", "must not be more than 2000 characters long")

	v.Check(reply.UserID != "", "user_id", "must not be empty")
}
