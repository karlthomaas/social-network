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
	ID        string    `json:"id"`
	GroupID   string    `json:"group_id"`
	InvitedBy string    `json:"invited_by"`
	UserID    string    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	User      User      `json:"user"`
	Group     Group     `json:"group"`
}

type GroupInvitationModel struct {
	DB *sql.DB
}

func (m *GroupInvitationModel) Insert(gi *GroupInvitation) error {
	query := `INSERT INTO group_invitations
	(id, group_id, invited_by, user_id) VALUES (?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		gi.ID,
		gi.GroupID,
		gi.InvitedBy,
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
	SELECT gi.id, gi.group_id, gi.invited_by, gi.user_id, gi.created_at, u.first.name, u.last_name
	FROM group_invitations gi
	JOIN users u ON gi.user_id = u.id
	WHERE gi.group_id = ?
	AND gi.user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var gi GroupInvitation

	err := m.DB.QueryRowContext(ctx, query, groupID, userID).Scan(
		&gi.ID,
		&gi.GroupID,
		&gi.InvitedBy,
		&gi.UserID,
		&gi.CreatedAt,
		&gi.User.FirstName,
		&gi.User.LastName,
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
	query := `SELECT gi.id, gi.group_id, gi.user_id, gi.created_at, u.first_name, u.last_name
	FROM group_invitations gi
	LEFT JOIN users u ON gi.user_id = u.id
	WHERE gi.group_id = ?`

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
			&invitation.ID,
			&invitation.GroupID,
			&invitation.UserID,
			&invitation.CreatedAt,
			&invitation.User.FirstName,
			&invitation.User.LastName,
		)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, &invitation)
	}
	return invitations, nil
}

func (m *GroupInvitationModel) GetAllForUser(userID string) ([]*GroupInvitation, error) {
	query := `SELECT gi.id, gi.group_id, gi.invited_by, gi.user_id, gi.created_at, g.title, u.first_name, u.last_name
	FROM group_invitations gi
	LEFT JOIN groups g ON gi.group_id = g.id
	LEFT JOIN users u ON gi.invited_by = u.id
	WHERE gi.user_id = ?`

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
			&invitation.ID,
			&invitation.GroupID,
			&invitation.InvitedBy,
			&invitation.UserID,
			&invitation.CreatedAt,
			&invitation.Group.Title,
			&invitation.User.FirstName,
			&invitation.User.LastName,
		)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, &invitation)
	}
	return invitations, nil
}

func (m *GroupInvitationModel) GetYourInvitations(groupID, userID string) ([]*GroupInvitation, error) {
	query := `SELECT gi.id, gi.group_id, gi.invited_by, gi.user_id, gi.created_at, u.first_name, u.last_name
	FROM group_invitations gi
	LEFT JOIN users u ON u.id = gi.user_id
	WHERE group_id = ? AND invited_by = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, groupID, userID)
	if err != nil {
		return nil, err
	}

	invitations := []*GroupInvitation{}

	for rows.Next() {
		var invitation GroupInvitation
		err = rows.Scan(
			&invitation.ID,
			&invitation.GroupID,
			&invitation.InvitedBy,
			&invitation.UserID,
			&invitation.CreatedAt,
			&invitation.User.FirstName,
			&invitation.User.LastName,
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
