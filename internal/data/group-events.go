package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"
)

type GroupEvent struct {
	ID               string           `json:"id"`
	GroupID          string           `json:"group_id"`
	UserID           string           `json:"user_id"`
	Title            string           `json:"title"`
	Description      string           `json:"description"`
	Date             time.Time        `json:"date"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
	User             User             `json:"user"`
	GroupEventMember GroupEventMember `json:"group_event_member"`
	Attendance       Attendance       `json:"attendance"`
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

func (m *GroupEventModel) Update(ge *GroupEvent) error {
	// Update Group Event
	query := `UPDATE group_events
	SET title = ?, description = ?, date = ?, updated_at = ?
	WHERE id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		ge.Title,
		ge.Description,
		ge.Date,
		ge.UpdatedAt,
		ge.ID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *GroupEventModel) Get(eventID, userID string) (*GroupEvent, error) {
	query := `SELECT ge.id, ge.group_id, ge.user_id, ge.title, ge.description, ge.date, ge.created_at, ge.updated_at,gem.attendance
	FROM group_events ge
	LEFT JOIN group_event_members gem ON gem.user_id = ? AND gem.group_event_id = ge.id
	WHERE ge.id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var event GroupEvent
	var attendance sql.NullInt16

	err := m.DB.QueryRowContext(ctx, query, userID, eventID).Scan(
		&event.ID,
		&event.GroupID,
		&event.UserID,
		&event.Title,
		&event.Description,
		&event.Date,
		&event.CreatedAt,
		&event.UpdatedAt,
		&attendance,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	if !attendance.Valid {
		event.GroupEventMember.Attendace = 2
	} else {
		event.GroupEventMember.Attendace = int(attendance.Int16)
	}

	return &event, err
}

func (m *GroupEventModel) GetAllForGroup(groupID, userID string) ([]*GroupEvent, error) {
	query := `
	SELECT ge.id, ge.group_id, ge.user_id, ge.title, ge.description, ge.date, ge.created_at, ge.updated_at, u.first_name, u.last_name, gem.attendance
	FROM group_events ge
	LEFT JOIN group_event_members gem ON gem.user_id = ? AND gem.group_event_id = ge.id
	JOIN users u ON ge.user_id = u.id
	WHERE ge.group_id = ?
	ORDER BY ge.created_at ASC
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID, groupID)
	if err != nil {
		return nil, err
	}
	groupEvents := []*GroupEvent{}

	for rows.Next() {
		var groupEvent GroupEvent
		var attendance sql.NullInt16

		err := rows.Scan(
			&groupEvent.ID,
			&groupEvent.GroupID,
			&groupEvent.UserID,
			&groupEvent.Title,
			&groupEvent.Description,
			&groupEvent.Date,
			&groupEvent.CreatedAt,
			&groupEvent.UpdatedAt,
			&groupEvent.User.FirstName,
			&groupEvent.User.LastName,
			&attendance,
		)
		if err != nil {
			return nil, err
		}

		if !attendance.Valid {
			groupEvent.GroupEventMember.Attendace = 2
		} else {
			groupEvent.GroupEventMember.Attendace = int(attendance.Int16)
		}

		groupEvents = append(groupEvents, &groupEvent)
	}
	return groupEvents, nil
}

func ValidateGroupEvent(v *validator.Validator, g *GroupEvent) {
	v.Check(g.Title != "", "title", "must not be empty")
	v.Check(len(g.Title) < 500, "title", "must not be more than 500 characters")

	v.Check(g.Description != "", "description", "must not be empty")
	v.Check(len(g.Description) < 2000, "description", "must not be more than 2000 characters")

	v.Check(g.Date.After(time.Now()), "date_of_birth", "must not be in the past")
}
