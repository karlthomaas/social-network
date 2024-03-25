package data

import (
	"database/sql"
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

	stmt, err := t.DB.Prepare(query)
	if err != nil {
		fmt.Println(err)
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
	query := `SELECT token, user_id, expiry FROM refresh_tokens WHERE token = ?`

	var rt RefreshToken

	row := t.DB.QueryRow(query, token)
	err := row.Scan(&rt.Token, &rt.UserId, &rt.Expiry)
	if err != nil {
		return nil, err
	}

	return &rt, nil
}

func (t *TokenModel) Delete(user_id string) error {
	query := `DELETE FROM refresh_tokens WHERE user_id = ?`

	stmt, err := t.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(user_id)
	if err != nil {
		return err
	}

	return nil
}
