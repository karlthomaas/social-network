package data

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"
)

type (
	RefreshToken struct {
		Token  string    `json:"token"`
		UserId string    `json:"-"`
		Expiry time.Time `json:"expiry"`
	}

	TokenModel struct {
		DB      *sql.DB
		InfoLog *log.Logger
		Error   *log.Logger
	}
)

func (t *TokenModel) Insert(token *RefreshToken) error {
	query := `INSERT INTO refresh_tokens (token, user_id, expiry_date) VALUES (?, ?, ?)`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := t.DB.ExecContext(ctx, query, token.Token, token.UserId, token.Expiry)
	if err != nil {
		return err
	}

	return nil
}

func (t *TokenModel) Get(token string) (*RefreshToken, error) {
	query := `SELECT token, user_id, expiry_date FROM refresh_tokens WHERE token = ?`
	var rt RefreshToken

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	row := t.DB.QueryRowContext(ctx, query, token)
	err := row.Scan(&rt.Token, &rt.UserId, &rt.Expiry)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no refresh token found")
	}
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (t *TokenModel) Delete(user_id string) error {
	query := `DELETE FROM refresh_tokens WHERE user_id = ?`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := t.DB.ExecContext(ctx, query, user_id)
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
