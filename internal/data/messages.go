package data

import (
	"context"
	"database/sql"
	"social-network/internal/validator"
	"time"
)

type Message struct {
	ID           string    `json:"id"`
	Sender       string    `json:"sender"`
	Receiver     string    `json:"receiver"`
	Message      string    `json:"message"`
	GroupID      string    `json:"group_id"`
	CreatedAt    time.Time `json:"created_at"`
	SenderUser   User      `json:"sender_user"`
	ReceiverUser User      `json:"receiver_user"`
}

type MessageModel struct {
	DB *sql.DB
}

func (m *MessageModel) Insert(message *Message) error {
	query := `
	INSERT INTO messages
	(id, sender, receiver, message, group_id)
	VALUES (?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		message.ID,
		message.Sender,
		message.Receiver,
		message.Message,
		message.GroupID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *MessageModel) GetAllPrivateMessages(user1, user2 string) ([]*Message, error) {
	query := `
	SELECT 
		m.id, 
		m.sender, 
		m.receiver, 
		m.message, 
		m.group_id, 
		m.created_at,
		sender.first_name, sender.last_name,
		receiver.first_name, receiver.last_name
	FROM messages m
	LEFT JOIN users sender ON m.sender = sender.id
	LEFT JOIN users receiver ON m.receiver = receiver.id
	WHERE 
		(m.sender = ? AND m.receiver = ?) OR 
		(m.sender = ? AND m.receiver = ?)
	ORDER BY m.created_at DESC`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, user1, user2, user2, user1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []*Message
	for rows.Next() {
		var message Message
		err := rows.Scan(
			&message.ID,
			&message.Sender,
			&message.Receiver,
			&message.Message,
			&message.GroupID,
			&message.CreatedAt,
			&message.SenderUser.FirstName,
			&message.SenderUser.LastName,
			&message.ReceiverUser.FirstName,
			&message.ReceiverUser.LastName,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, &message)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

func (m *MessageModel) GetAllGroupMessages(groupID string) ([]*Message, error) {
	query := `
	SELECT m.id, m.sender, m.receiver, m.message, m.group_id, m.created_at, sender.first_name, sender.last_name
	FROM messages m
	LEFT JOIN users sender ON m.sender = sender.id
	WHERE m.group_id = ?
	ORDER BY m.created_at`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []*Message
	for rows.Next() {
		var message Message
		err := rows.Scan(
			&message.ID,
			&message.Sender,
			&message.Receiver,
			&message.Message,
			&message.GroupID,
			&message.CreatedAt,
			&message.SenderUser.FirstName,
			&message.SenderUser.LastName,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, &message)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

func ValidateChatMessage(v *validator.Validator, message *Message) {
	v.Check(message.Message != "", "message", "must not be empty")
	v.Check(message.Receiver != "", "receiver", "must not be empty")
	v.Check(message.GroupID == "", "group_id", "must be empty")
	v.Check(message.Sender != "", "sender", "must not be empty")
	v.Check(message.ID != "", "id", "must not be empty")
}

func ValidateGroupMessage(v *validator.Validator, message *Message) {
	v.Check(message.Message != "", "message", "must not be empty")
	v.Check(message.GroupID != "", "group_id", "must not be empty")
	v.Check(message.Receiver == "", "receiver", "must be empty")
	v.Check(message.Sender != "", "sender", "must not be empty")
	v.Check(message.ID != "", "id", "must not be empty")
}
