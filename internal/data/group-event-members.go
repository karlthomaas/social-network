package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type GroupEventMember struct {
	UserID       string `json:"user_id"`
	GroupEventID string `json:"group_event_id"`
	Attendace    int    `json:"attendance"`
}

type GroupEventMemberModel struct {
	DB *sql.DB
}

func (m *GroupEventMemberModel) Insert(eventMember *GroupEventMember) error {
	query := `INSERT INTO group_event_members
	(user_id, group_event_id, attendance)
	VALUES (?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		eventMember.UserID,
		eventMember.GroupEventID,
		eventMember.Attendace,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *GroupEventMemberModel) Delete(userID,eventID string) error {
	query := `DELETE FROM group_event_members
	WHERE group_event_id = ?
	AND user_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, eventID, userID)
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

func (m *GroupEventMemberModel) Get(userID, eventID string) (*GroupEventMember, error) {
	query := `SELECT user_id, group_event_id, attendance
	FROM group_event_members
	WHERE user_id = ? 
	AND group_event_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var eventMember GroupEventMember

	err := m.DB.QueryRowContext(ctx, query, eventID).Scan(
		&eventMember.UserID,
		&eventMember.GroupEventID,
		&eventMember.Attendace,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &eventMember, err
}
