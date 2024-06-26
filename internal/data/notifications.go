package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"
)

type Notification struct {
	ID                string     `json:"id"`
	Sender            string     `json:"sender"`
	Receiver          string     `json:"receiver"`
	FollowRequestID   string     `json:"follow_request_id"`
	GroupInvitationID string     `json:"group_invitation_id"`
	GroupRequestID    string     `json:"group_request_id"`
	GroupEventID      string     `json:"group_event_id"`
	CreatedAt         time.Time  `json:"created_at"`
	User              User       `json:"user"`
	Group             Group      `json:"group"`
	GroupEvent        GroupEvent `json:"group_event"`
}

type NotificationModel struct {
	DB *sql.DB
}

func (m *NotificationModel) Insert(n *Notification) error {
	query := `
		INSERT INTO notifications (id, sender, receiver, follow_request_id, group_invitation_id, group_request_id, group_event_id)
		VALUES (?, ?, ?, ?, ?, ?, ?)`

	args := []interface{}{
		n.ID,
		n.Sender,
		n.Receiver,
		n.FollowRequestID,
		n.GroupInvitationID,
		n.GroupRequestID,
		n.GroupEventID,
		n.CreatedAt,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}

	return nil
}

func (m *NotificationModel) Delete(id string) error {
	query := `
		DELETE FROM notifications
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

func (m *NotificationModel) GetAllForUser(userID string) ([]*Notification, error) {
	query := `
		SELECT n.id, n.sender, n.receiver, n.follow_request_id, n.group_invitation_id, n.group_request_id, n.group_event_id, n.created_at, 
		       u.first_name, u.last_name,
			   g.id,
		       g.title,
		       ge.title
		FROM notifications n
		LEFT JOIN users u ON n.sender = u.id
		LEFT JOIN group_invitations gi ON gi.id = n.group_invitation_id
		LEFT JOIN group_requests gr ON gr.id = n.group_request_id
		LEFT JOIN group_events ge ON ge.id = n.group_event_id
		LEFT JOIN groups g ON g.id = gi.group_id OR g.id = gr.group_id OR g.id = ge.group_id
		LEFT JOIN group_events e ON e.id = n.group_event_id
		WHERE n.receiver = ?
		ORDER BY n.created_at DESC
		`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []*Notification
	var tempGroupTitle sql.NullString
	var tempEventTitle sql.NullString
	var groupID sql.NullString

	for rows.Next() {
		var n Notification
		err := rows.Scan(
			&n.ID,
			&n.Sender,
			&n.Receiver,
			&n.FollowRequestID,
			&n.GroupInvitationID,
			&n.GroupRequestID,
			&n.GroupEventID,
			&n.CreatedAt,
			&n.User.FirstName,
			&n.User.LastName,
			&groupID,
			&tempGroupTitle,
			&tempEventTitle,
		)
		if err != nil {
			return nil, err
		}

		if groupID.Valid {
			n.Group.ID = groupID.String
		}

		if tempGroupTitle.Valid {
			n.Group.Title = tempGroupTitle.String
		}

		if tempEventTitle.Valid {
			n.GroupEvent.Title = tempEventTitle.String
		}
		notifications = append(notifications, &n)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (m *NotificationModel) Get(id string) (*Notification, error) {
	query := `
		SELECT id, sender, receiver, follow_request_id, group_invitation_id, group_request_id, group_event_id, created_at
		FROM notifications
		WHERE id = ?`

	var n Notification

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&n.ID,
		&n.Sender,
		&n.Receiver,
		&n.FollowRequestID,
		&n.GroupInvitationID,
		&n.GroupRequestID,
		&n.GroupEventID,
		&n.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecordNotFound
		}
		return nil, err
	}

	return &n, nil
}

func (m *NotificationModel) DeleteByType(id string) error {
	query := `
		DELETE FROM notifications
		WHERE follow_request_id = ? OR group_invitation_id = ? OR group_request_id = ? OR group_event_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, id, id, id, id)
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

func ValidateNotification(v *validator.Validator, n *Notification) {
	v.Check(n.Sender != "", "sender", "must not be empty")
	v.Check(n.Receiver != "", "receiver", "must not be empty")

	isEmpty := n.FollowRequestID == "" && n.GroupInvitationID == "" && n.GroupRequestID == "" && n.GroupEventID == ""

	v.Check(!isEmpty, "type", "must not be empty")
}
