package data

import (
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

func (u *UserModel) Insert(user *User) error {
	query := `INSERT INTO Users (id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, privacy) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := u.DB.Exec(query, user.ID, user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, user.Image, user.Nickname, user.AboutMe, user.Privacy)

	return err
}

func (u *UserModel) Get(id string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE id=?`

	var user User

	err := u.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Image,
		&user.Nickname,
		&user.AboutMe,
		&user.CreatedAt,
		&user.Privacy,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err

		}
	}

	return &user, nil
}

func (u *UserModel) Update(user *User) error {
	return nil
}

func (u *UserModel) Delete(id string) error {
	return nil
}

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Password    string    `json:"password"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Image       []byte    `json:"image"`
	Nickname    string    `json:"nickname"`
	AboutMe     string    `json:"about_me"`
	CreatedAt   time.Time `json:"created_at"`
	Privacy     string    `json:"privacy"`
}

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(validator.Matches(email, *validator.EmailRX), "email", "must be a valid email address")
}

func ValidatePassword(v *validator.Validator, password string) {
	v.Check(password != "", "password", "must be procided")
	// TODO:CHANGE PASSWORD LENGTH
	v.Check(len(password) >= 2, "password", "must be at least 8 character long")
	v.Check(len(password) <= 72, "password", "must not me more than 72 characters long")
}

func ValidateUser(v *validator.Validator, user *User) {
	v.Check(user.FirstName != "", "first_name", "must be provided")
	v.Check(user.LastName != "", "last_name", "must be provided")
	v.Check(user.Privacy != "", "privacy", "must be provided")

	ValidateEmail(v, user.Email)
	ValidatePassword(v, user.Password)
}
