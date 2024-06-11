package data

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrDuplicateRequest = errors.New("duplicate request")
)

type GroupRequest struct {
	ID        string `json:"id"`
	GroupID   string `json:"group_id"`
	UserID    string `json:"user_id"`
	CreatedAt string `json:"created_at"`
	User      User   `json:"user"`
}

type GroupRequestModel struct {
	DB *sql.DB
}

func (m *GroupRequestModel) Insert(gr *GroupRequest) error {
	query := `
	INSERT INTO group_requests (id, group_id, user_id)
	VALUES (?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		gr.ID,
		gr.GroupID,
		gr.UserID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == "UNIQUE constraint failed: group_requests.user_id, group_requests.group_id":
			return ErrDuplicateRequest
		default:
			return err
		}
	}
	return err
}

func (m *GroupRequestModel) Delete(groupID, userID string) error {
	query := `
	DELETE FROM group_requests
	WHERE group_id = ? AND user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, groupID, userID)
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

func (m *GroupRequestModel) Get(groupID, userID string) (*GroupRequest, error) {
	query := `
	SELECT id, group_id, user_id, created_at
	FROM group_requests
	WHERE group_id = ?
	AND user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gr GroupRequest

	err := m.DB.QueryRowContext(ctx, query, groupID, userID).Scan(
		&gr.ID,
		&gr.GroupID,
		&gr.UserID,
		&gr.CreatedAt,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &gr, nil
}

func (m *GroupRequestModel) GetAllGroupRequests(groupID string) ([]*GroupRequest, error) {
	query := `SELECT gr.id, gr.group_id, gr.user_id, gr.created_at, u.first_name, u.last_name
	FROM group_requests gr
	LEFT JOIN users u ON u.id = gr.user_id
	WHERE group_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil, err
	}

	requests := []*GroupRequest{}

	for rows.Next() {
		var request GroupRequest
		err = rows.Scan(
			&request.ID,
			&request.GroupID,
			&request.UserID,
			&request.CreatedAt,
			&request.User.FirstName,
			&request.User.LastName,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, &request)
	}
	return requests, nil
}
