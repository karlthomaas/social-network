package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"
)

var (
	ErrDuplicateInvitation = errors.New("duplicate invitation")
)

type GroupInvitation struct {
	GroupID   string    `json:"group_id"`
	UserID    string    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

type GroupInvitationModel struct {
	DB *sql.DB
}

func (m *GroupInvitationModel) Insert(gi *GroupInvitation) error {
	query := `INSERT INTO group_invitations
	(group_id, user_id) VALUES (?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		gi.GroupID,
		gi.UserID,
	}
	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == "UNIQUE constraint failed: group_invitations.group_id, group_invitations.user_id":
			return ErrDuplicateInvitation
		default:
			return err
		}
	}

	return nil
}

func (m *GroupInvitationModel) Delete(groupID, userID string) error {
	query := `DELETE FROM group_invitations
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

func (m *GroupInvitationModel) Get(groupID, userID string) (*GroupInvitation, error) {
	query := `
	SELECT group_id, user_id, created_at
	FROM group_invitations
	WHERE group_id = ?
	AND user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gi GroupInvitation

	err := m.DB.QueryRowContext(ctx, query, groupID, userID).Scan(
		&gi.GroupID,
		&gi.UserID,
		&gi.CreatedAt,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &gi, nil
}

func (m *GroupInvitationModel) GetAllForGroup(groupID string) ([]*GroupInvitation, error) {
	query := `SELECT group_id, user_id, created_at
	FROM group_invitations
	WHERE group_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil, err
	}

	invitations := []*GroupInvitation{}

	for rows.Next() {
		var invitation GroupInvitation
		err = rows.Scan(
			&invitation.GroupID,
			&invitation.UserID,
			&invitation.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, &invitation)
	}
	return invitations, nil
}

func (m *GroupInvitationModel) GetAllForUser(userID string) ([]*GroupInvitation, error) {
	query := `SELECT group_id, user_id, created_at
	FROM group_invitations
	WHERE user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	invitations := []*GroupInvitation{}

	for rows.Next() {
		var invitation GroupInvitation
		err = rows.Scan(
			&invitation.GroupID,
			&invitation.UserID,
			&invitation.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, &invitation)
	}
	return invitations, nil
}

func ValidateGroupInvitation(v *validator.Validator, gi *GroupInvitation) {
	v.Check(gi.GroupID != "", "group_id", "must be provided")
	v.Check(gi.UserID != "", "user_id", "must be provided")
}
