package data

import (
	"context"
	"database/sql"
	"social-network/internal/validator"
	"time"
)

type Notification struct {
	ID                string    `json:"id"`
	Sender            string    `json:"sender"`
	Receiver          string    `json:"receiver"`
	FollowRequestID   string    `json:"follow_request_id"`
	GroupInvitationID string    `json:"group_invitation_id"`
	GroupRequestID    string    `json:"group_request_id"`
	GroupEventID      string    `json:"group_event_id"`
	CreatedAt         time.Time `json:"created_at"`
	User              User      `json:"user"`
}

type NotificationModel struct {
	DB *sql.DB
}

func (m *NotificationModel) Insert(n *Notification) error {
	query := `
		INSERT INTO notifications (id, sender, receiver, follow_request_id, group_invitation_id, group_request_id, group_event_id, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

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
		SELECT n.id, n.sender, n.receiver, n.follow_request_id, n.group_invitation_id, n.group_request_id, n.group_event_id, n.created_at, u.first_name, u.last_name
		FROM notifications n
		LEFT JOIN users u ON n.sender = u.id
		WHERE receiver = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []*Notification

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
		)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, &n)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
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
