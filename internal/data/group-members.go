package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type GroupMember struct {
	GroupID   string
	UserID    string
	CreatedAt time.Time
}

type GroupMemberModel struct {
	DB *sql.DB
}

var (
	ErrDuplicateMember = errors.New("duplicate member")
)

func (m *GroupMemberModel) Insert(gm *GroupMember) error {
	query := `INSERT INTO group_members
	(group_id, user_id) VALUES (?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		gm.GroupID,
		gm.UserID,
	}
	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case err.Error() == "UNIQUE constraint failed: group_members.group_id, group_members.user_id":
			return ErrDuplicateMember
		default:
			return err
		}
	}
	return nil
}

func (m *GroupMemberModel) Get(userID string) (*GroupMember, error) {
	query := `SELECT group_id, user_id, created_at
	FROM group_members
	WHERE user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var groupMember GroupMember

	err := m.DB.QueryRowContext(ctx, query, userID).Scan(
		&groupMember.GroupID,
		&groupMember.UserID,
		&groupMember.CreatedAt,
	)

	if err != nil {
		fmt.Println("error", err)
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &groupMember, nil
}

func (m *GroupMemberModel) Delete(groupID, userID string) error {
	query := `DELETE FROM group_members
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

func (m *GroupMemberModel) GetAllGroupMembers(groupID string) ([]*GroupMember, error) {
	query := `SELECT group_id, user_id, created_at
	FROM group_members
	WHERE group_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, groupID)
	if err != nil {
		return nil, err
	}

	members := []*GroupMember{}

	for rows.Next() {
		var member GroupMember
		err = rows.Scan(
			&member.GroupID,
			&member.UserID,
			&member.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		members = append(members, &member)
	}
	return members, nil
}

func (m *GroupMemberModel) CheckIfMember(groupID, userID string) (*GroupMember, error) {
	query := `
	SELECT group_id, user_id, created_at
	FROM group_members
	WHERE group_id = ?
	AND user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var member GroupMember

	err := m.DB.QueryRowContext(ctx, query, groupID, userID).Scan(
		&member.GroupID,
		&member.UserID,
		&member.CreatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &member, nil
}
