package data

import (
	"context"
	"database/sql"
	"errors"
	"slices"
	"social-network/internal/validator"
	"time"

	"github.com/gofrs/uuid"
)

type PostModel struct {
	DB *sql.DB
}

var (
	permissions = []string{"public", "private", "almost_private"}
)

type Post struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Content   string    `json:"content"`
	GroupID   string    `json:"group_id"`
	Image     []byte    `json:"image"`
	Privacy   string    `json:"privacy"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	User      User      `json:"user"`
	Reaction  Reaction  `json:"reaction"`
	Reactions int       `json:"reactions"`
}

type PostVisibility struct {
	ID     string `json:"-"`
	PostID string `json:"user_id"`
	UserID string `json:"visible_to"`
}

func (m *PostModel) Get(id string) (*Post, error) {
	query := `
	SELECT p.id, p.user_id, p.content, p.group_id, p.image, p.privacy, p.created_at, p.updated_at, u.first_name, u.last_name, r.user_id
	FROM posts p 
	JOIN users u ON p.user_id = u.id
	LEFT JOIN reactions r ON p.id = r.post_id
	WHERE p.id = ?`

	var post Post

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var RUserID sql.NullString

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&post.ID,
		&post.UserID,
		&post.Content,
		&post.GroupID,
		&post.Image,
		&post.Privacy,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.User.FirstName,
		&post.User.LastName,
		&RUserID,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	if !RUserID.Valid {
		post.Reaction.UserID = ""
	} else {
		post.Reaction.UserID = RUserID.String
	}

	return &post, nil
}

func (m *PostModel) Insert(post *Post) error {
	query := `
		INSERT INTO posts (id, user_id, content, group_id, image, privacy, updated_at)
		VALUES (?,?,?,?,?,?,?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		post.ID,
		post.UserID,
		post.Content,
		post.GroupID,
		post.Image,
		post.Privacy,
		post.UpdatedAt,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	return err
}

func (m *PostModel) Update(post *Post) error {
	query := `
		UPDATE posts
		SET content = ?, image = ?, updated_at = ?, privacy = ?
		WHERE user_id = ? AND id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		post.Content,
		post.Image,
		post.UpdatedAt,
		post.Privacy,
		post.UserID,
		post.ID,
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

func (m *PostModel) Delete(id string) error {
	query := `
	DELETE FROM posts
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

func (m *PostModel) GetAllForUser(userID string, loggedInUser string) ([]*Post, error) {
	query := `
	SELECT p.id, p.user_id, p.content, p.group_id ,p.image, p.privacy, p.created_at, p.updated_at, u.first_name, u.last_name, r.id
	FROM posts p 
	JOIN users u ON p.user_id = u.id
	LEFT JOIN reactions r ON p.id = r.post_id
	AND r.user_id = ?
	WHERE p.user_id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, loggedInUser, userID)
	if err != nil {
		return nil, err
	}

	posts := []*Post{}

	for rows.Next() {
		var post Post
		var reactionID sql.NullString

		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Content,
			&post.GroupID,
			&post.Image,
			&post.Privacy,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.User.FirstName,
			&post.User.LastName,
			&reactionID,
		)

		if err != nil {
			return nil, err
		}

		if !reactionID.Valid {
			post.Reaction.ID = ""
		} else {
			post.Reaction.ID = reactionID.String
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (m *PostModel) GetAll(loggedInUser string) ([]*Post, error) {

	query := `
	SELECT p.id, p.user_id, p.content, p.group_id,p.image, p.privacy, p.created_at, p.updated_at, 
	u.first_name, u.last_name, r.id
	FROM posts p 
	JOIN users u ON p.user_id = u.id
	LEFT JOIN followers f ON f.user_id = p.user_id AND f.follower_id = ?
	LEFT JOIN reactions r ON p.id = r.post_id AND r.user_id = ?
	LEFT JOIN post_visibilities pv ON pv.post_id = p.id
	WHERE (p.privacy = "public" OR 
       (p.privacy = "private" AND (f.follower_id = ? OR p.user_id = ?)) OR 
       (p.privacy = "almost_private" AND pv.user_id = ?))
	ORDER BY p.created_at DESC
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, loggedInUser, loggedInUser, loggedInUser, loggedInUser, loggedInUser)
	if err != nil {
		return nil, err
	}

	posts := []*Post{}

	for rows.Next() {
		var post Post
		var reactionID sql.NullString

		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Content,
			&post.GroupID,
			&post.Image,
			&post.Privacy,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.User.FirstName,
			&post.User.LastName,
			&reactionID,
		)

		if err != nil {
			return nil, err
		}

		if !reactionID.Valid {
			post.Reaction.ID = ""
		} else {
			post.Reaction.ID = reactionID.String
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (m *PostModel) AddPostVisibilities(postID string, users []string) error {
	query := "INSERT INTO post_visibilities (id, post_id, user_id) VALUES"
	var values []interface{}

	for index, userID := range users {
		id, err := uuid.NewV4()
		if err != nil {
			return err
		}
		query += "(?, ?, ?)"
		values = append(values, id, postID, userID)
		if index < len(users)-1 {
			query += ","
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, values...)

	return err
}

func (m *PostModel) GetPostVisibilities(postID string) ([]string, error) {
	query := `SELECT user_id FROM post_visibilities
	WHERE post_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, postID)
	if err != nil {
		return nil, err
	}

	userIDs := []string{}

	for rows.Next() {
		var userID string

		err := rows.Scan(&userID)
		if err != nil {
			return nil, err
		}

		userIDs = append(userIDs, userID)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return userIDs, nil
}

func (m *PostModel) RemovePostVisibilities(postID string, userIDs []string) error {
	query := `DELETE FROM post_visibilities WHERE post_id = ? AND user_id IN (`
	var args []interface{}
	args = append(args, postID)

	for i, userID := range userIDs {
		if i > 0 {
			query += ", "
		}
		query += "?"
		args = append(args, userID)
	}

	query += ")"

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}
	return nil
}

func (m *PostModel) UpdatePostVisibilities(postID string, newUserIDs, currentUserIDs []string) error {
	currentUserIDMap := make(map[string]bool)
	for _, userID := range currentUserIDs {
		currentUserIDMap[userID] = true
	}

	newUserIDMap := make(map[string]bool)
	for _, userID := range newUserIDs {
		newUserIDMap[userID] = true
	}

	var userIDsToRemove, userIDsToAdd []string
	for userID := range currentUserIDMap {
		if !newUserIDMap[userID] {
			userIDsToRemove = append(userIDsToRemove, userID)
		}
	}

	for userID := range newUserIDMap {
		if !currentUserIDMap[userID] {
			userIDsToAdd = append(userIDsToAdd, userID)
		}
	}

	if len(userIDsToRemove) > 0 {
		err := m.RemovePostVisibilities(postID, userIDsToRemove)
		if err != nil {
			return err
		}
	}
	if len(userIDsToAdd) > 0 {
		err := m.AddPostVisibilities(postID, userIDsToAdd)
		if err != nil {
			return err
		}
	}
	return nil
}

func (m *PostModel) GetAllGroupPosts(groupID, loggedInUser string) ([]*Post, error) {
	query := `
	SELECT p.id, p.user_id, p.content, p.group_id, p.image, p.privacy, p.created_at, p.updated_at, 
	u.first_name, u.last_name, r.id
	FROM posts p 
	JOIN users u ON p.user_id = u.id
	LEFT JOIN reactions r ON p.id = r.post_id AND r.user_id = ?
	WHERE p.group_id = ?
	ORDER BY p.created_at DESC
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query, loggedInUser, groupID)
	if err != nil {
		return nil, err
	}

	posts := []*Post{}

	for rows.Next() {
		var post Post
		var reactionID sql.NullString

		err := rows.Scan(
			&post.ID,
			&post.UserID,
			&post.Content,
			&post.GroupID,
			&post.Image,
			&post.Privacy,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.User.FirstName,
			&post.User.LastName,
			&reactionID,
		)

		if err != nil {
			return nil, err
		}

		if !reactionID.Valid {
			post.Reaction.ID = ""
		} else {
			post.Reaction.ID = reactionID.String
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (m *PostModel) InsertImage(postID, images string) error {
	query := `
	UPDATE posts
	SET image = ?
	WHERE id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err:= m.DB.ExecContext(ctx, query, images, postID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}
	return nil
}

func ValidatePost(v *validator.Validator, post *Post) {
	v.Check(post.Content != "", "content", "must not be empty")
	v.Check(len(post.Content) <= 2000, "content", "must not be more than 2000 characters long")

	v.Check(post.Privacy != "", "privacy", "must not be empty")
	v.Check(slices.Contains(permissions, post.Privacy), "privacy", `must be one of these types: "public", "private", "almost_private"`)

	v.Check(post.UserID != "", "user_id", "must not be empty")
}
