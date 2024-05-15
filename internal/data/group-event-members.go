package data

import (
	"context"
	"database/sql"
	"time"
)

type GroupEventMember struct {
	UserID       string `json:"user_id"`
	GroupEventID string `json:"group_event_id"`
	Attendace    int    `json:"attendance"`
}

type GroupEventMembersModel struct {
	DB *sql.DB
}

func (m *GroupEventMembersModel) Insert(eventMember *GroupEventMember) error {
	query := `INSERT INTO group_event_members
	(user_id, group_event, attendance)
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
