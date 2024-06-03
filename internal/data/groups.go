package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"
)

type GroupModel struct {
	DB *sql.DB
}

type Group struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (m *GroupModel) Insert(g *Group) error {
	query := `
		INSERT INTO groups (id, user_id, title, description, updated_at) 
		VALUES (?,?,?,?,?)
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		g.ID,
		g.UserID,
		g.Title,
		g.Description,
		g.UpdatedAt,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err

}

func (m *GroupModel) Delete(groupID string) error {

	query := `
		DELETE FROM groups
		WHERE id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, groupID)
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

func (m *GroupModel) Update(g *Group) error {
	query := `UPDATE groups
	SET title = ?, description = ?, updated_at = ?
	WHERE id = ? AND user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		g.Title,
		g.Description,
		g.UpdatedAt,
		g.ID,
		g.UserID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}
	return err
}

func (m *GroupModel) Get(groupID string) (*Group, error) {
	query := `SELECT id, user_id, title, description, created_at, updated_at
		FROM groups
		WHERE id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var group Group

	err := m.DB.QueryRowContext(ctx, query, groupID).Scan(
		&group.ID,
		&group.UserID,
		&group.Title,
		&group.Description,
		&group.CreatedAt,
		&group.UpdatedAt,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}
	return &group, nil
}

func (m *GroupModel) GetAll() ([]*Group, error) {
	query := `
	SELECT * from groups`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	groups := []*Group{}

	for rows.Next() {
		var group Group

		err := rows.Scan(
			&group.ID,
			&group.UserID,
			&group.Title,
			&group.Description,
			&group.CreatedAt,
			&group.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		groups = append(groups, &group)
	}

	return groups, nil

}

func (m GroupModel) GetAllForUser(userID string) ([]*Group, error) {
	query := `
        SELECT g.id, g.title, g.description, g.updated_at
        FROM groups g
        INNER JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
    `

	rows, err := m.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []*Group

	for rows.Next() {
		var group Group
		err := rows.Scan(&group.ID, &group.Title, &group.Description, &group.UpdatedAt)
		if err != nil {
			return nil, err
		}
		groups = append(groups, &group)
	}

	if err = rows.Err(); err != nil {
		return groups, err
	}

	return groups, nil
}

func ValidateGroup(v *validator.Validator, group *Group) {

	v.Check(group.ID != "", "id", "must not be empty")

	v.Check(group.Title != "", "title", "must not be empty")
	v.Check(len(group.Title) <= 500, "title", "must not be more than 500 characters")

	v.Check(group.Description != "", "description", "must not be empty")
	v.Check(len(group.Description) <= 2000, "description", "must not be more than 2000 characters long")

	v.Check(group.UserID != "", "user_id", "must not be empty")
}
