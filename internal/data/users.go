package data

import (
	"context"
	"database/sql"
	"errors"
	"social-network/internal/validator"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserModel struct {
	DB *sql.DB
}

func (u *UserModel) Insert(user *User) error {
	query := `INSERT INTO Users (id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, privacy) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := u.DB.ExecContext(ctx, query, user.ID, user.Email, user.Password.hash, user.FirstName, user.LastName, user.DateOfBirth, user.Image, user.Nickname, user.AboutMe, user.Privacy)

	return err
}

func (u *UserModel) GetUserForToken(jwt string) {

}

func (u *UserModel) Get(id string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE id=?`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := u.DB.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password.hash,
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

func (u *UserModel) GetByEmail(email string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE email=?`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := u.DB.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password.hash,
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

func (p *password) Set(plainTextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plainTextPassword), 12)
	if err != nil {
		return err
	}

	p.plainText = &plainTextPassword
	p.hash = hash

	return nil
}

func (p *password) Matches(plainTextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(p.hash), []byte(plainTextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}

	return true, nil
}

type password struct {
	plainText *string
	hash      []byte
}

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Password    password  `json:"password"`
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
	v.Check(user.DateOfBirth.Before(time.Now()), "date_of_birth", "must not be in the future")

	ValidateEmail(v, user.Email)
	ValidatePassword(v, *user.Password.plainText)

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}
