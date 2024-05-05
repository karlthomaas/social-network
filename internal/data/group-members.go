package data

import (
	"context"
	"database/sql"
	"errors"
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
