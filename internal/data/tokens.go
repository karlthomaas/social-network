package data

import (
	"database/sql"
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
	query := `INSERT INTO tokens (token, user_id, expiry) VALUES (?, ?, ?)`

	stmt, err := t.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(token.Token, token.UserId, token.Expiry)
	if err != nil {
		return err
	}

	return nil
}

func (t *TokenModel) Get(token string) (*RefreshToken, error) {
	query := `SELECT token, user_id, expiry FROM tokens WHERE token = ?`

	var rt RefreshToken

	row := t.DB.QueryRow(query, token)
	err := row.Scan(&rt.Token, &rt.UserId, &rt.Expiry)
	if err != nil {
		return nil, err
	}

	return &rt, nil
}
