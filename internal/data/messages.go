package data

import (
	"context"
	"database/sql"
	"time"
)

type Message struct {
	ID        string    `json:"id"`
	Sender    string    `json:"sender"`
	Receiver  string    `json:"receiver"`
	Message   string    `json:"message"`
	GroupID   string    `json:"group_id"`
	CreatedAt time.Time `json:"created_at"`
}

type MessageModel struct {
	DB *sql.DB
}

func (m *MessageModel) Insert(message *Message) error {
	query := `
	INSERT INTO messages
	(id, sender, receiver, message, group_id)
	VALUES (?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
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
