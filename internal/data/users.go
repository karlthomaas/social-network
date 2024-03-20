package data

import (
	"database/sql"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

func (u *UserModel) Insert(user *User) error {
	return nil
}

func (m *UserModel) Get(id int64) (*User, error) {
	return nil, nil
}

func (m *UserModel) Update(user *User) error {
	return nil
}

func (m *UserModel) Delete(id int64) error {
	return nil
}

type User struct {
	ID          string    `json:"id"`
	Password    string    `json:"password"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth string    `json:"date_of_birth"`
	Image       []byte    `json:"image"`
	Nickname    string    `json:"nickname"`
	AboutMe     string    `json:"about_me"`
	CreatedAt   time.Time `json:"created_at"`
	Privacy     string    `json:"privacy"`
}
