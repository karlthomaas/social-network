package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type ReactionModel struct {
	DB *sql.DB
}

type Reaction struct {
	ID      string `json:"id"`
	UserID  string `json:"user_id"`
	PostID  string `json:"post_id"`
	ReplyID string `json:"reply_id"`
}

func (m *ReactionModel) Insert(r *Reaction) error {
	query := `INSERT INTO reactions (id, user_id, post_id, reply_id)
	VALUES (?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		r.ID,
		r.UserID,
		r.PostID,
		r.ReplyID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == "FOREIGN KEY constraint failed":
			return nil
		default:
			return err
		}
	}
	return nil
}

func (m *ReactionModel) Delete(reactionID string) error {
	query := `DELETE FROM reactions WHERE id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, reactionID)
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

func (m *ReactionModel) Get(userID, parentID string) (*Reaction, error) {
	query := `SELECT id, user_id, reply_id, post_id FROM reactions 
	WHERE user_id = ?
	AND (post_id = ? OR reply_id = ?)`

	var reaction Reaction

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, userID, parentID, parentID).Scan(
		&reaction.ID,
		&reaction.UserID,
		&reaction.PostID,
		&reaction.ReplyID,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &reaction, nil
}

func (m *ReactionModel) GetReactions(parentID string) (int, error) {
	query := `SELECT COUNT(*) FROM reactions 
    WHERE post_id = ? OR reply_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var count int
	err := m.DB.QueryRowContext(ctx, query, parentID, parentID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}
