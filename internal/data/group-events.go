package data

import (
	"context"
	"database/sql"
	"social-network/internal/validator"
	"time"
)

type GroupEvent struct {
	ID          string    `json:"id"`
	GroupID     string    `json:"group_id"`
	UserID      string    `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type GroupEventModel struct {
	DB *sql.DB
}

func (m *GroupEventModel) Insert(g *GroupEvent) error {
	query := `INSERT INTO group_events
	(id, group_id, user_id,title, description, date, updated_at)
	VALUES (?,?,?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		g.ID,
		g.GroupID,
		g.UserID,
		g.Title,
		g.Description,
		g.Date,
		g.UpdatedAt,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		// case err.Error() == "tere":
		// 	return ErrDuplicateInvitation
		default:
			return err
		}
	}

	return nil
}

func (m *GroupEventModel) Delete(eventID string) error {
	query := `DELETE FROM group_events
			WHERE id= ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, eventID)
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

func ValidateGroupEvent(v *validator.Validator, g *GroupEvent) {
	v.Check(g.Title != "", "title", "must not be empty")
	v.Check(len(g.Title) < 500, "title", "must not be more than 500 characters")

	v.Check(g.Description != "", "description", "must not be empty")
	v.Check(len(g.Description) < 2000, "description", "must not be more than 2000 characters")

	v.Check(g.Date.Before(time.Now()), "date_of_birth", "must not be in the future")
}
