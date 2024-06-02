package data

import (
	"context"
	"database/sql"
	"errors"
	"slices"
	"social-network/internal/validator"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserModel struct {
	DB *sql.DB
}

var (
	privacies            = []string{"public", "private"}
	ErrDuplicateNickname = errors.New("duplicate nickname")
	ErrDuplicateEmail    = errors.New("duplicate email")
)

type password struct {
	plainText *string
	hash      []byte
}

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Password    password  `json:"-"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Image       []byte    `json:"image"`
	Nickname    string    `json:"nickname"`
	AboutMe     string    `json:"about_me"`
	CreatedAt   time.Time `json:"created_at"`
	Privacy     string    `json:"privacy"`
}

func (m *UserModel) Insert(user *User) error {
	query := `INSERT INTO users (id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, privacy) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := m.DB.ExecContext(ctx, query, user.ID, user.Email, user.Password.hash, user.FirstName, user.LastName, user.DateOfBirth, user.Image, user.Nickname, user.AboutMe, user.Privacy)
	if err != nil {
		switch {
		case err.Error() == "UNIQUE constraint failed: users.nickname":
			return ErrDuplicateNickname
		case err.Error() == "UNIQUE constraint failed: users.email":
			return ErrDuplicateEmail
		default:
			return err
		}
	}
	return nil
}

func (m *UserModel) Get(id string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE id=?`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
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

func (m *UserModel) Update(user *User) error {
	query := `UPDATE users
	SET image = ?, nickname = ?, about_me = ?, privacy = ?
	WHERE id = ?
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	args := []interface{}{
		user.Image,
		user.Nickname,
		user.AboutMe,
		user.Privacy,
		user.ID,
	}

	_, err := m.DB.ExecContext(ctx, query, args...)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		case err.Error() == "UNIQUE constraint failed: users.nickname":
			return ErrDuplicateNickname
		case err.Error() == "UNIQUE constraint failed: users.email":
			return ErrDuplicateEmail
		default:
			return err
		}
	}
	return nil
}

func (m *UserModel) Delete(id string) error {
	return nil
}

func (m *UserModel) GetByNickname(nickname string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE nickname = ?`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, nickname).Scan(
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

func (m *UserModel) GetByEmail(email string) (*User, error) {
	query := `SELECT id, email, password, first_name, last_name, date_of_birth, image, nickname, about_me, created_at, privacy
	FROM users
	WHERE email=?`

	var user User

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, email).Scan(
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
	v.Check(user.Nickname != "", "nickname", "must be provided")
	v.Check(user.LastName != "", "last_name", "must be provided")
	v.Check(user.Privacy != "", "privacy", "must be provided")
	v.Check(user.DateOfBirth.Before(time.Now()), "date_of_birth", "must not be in the future")
	v.Check(slices.Contains(privacies, user.Privacy), "privacy", `must be one of these types: "public", "private",`)

	ValidateEmail(v, user.Email)
	ValidatePassword(v, *user.Password.plainText)

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

func ValidateUserUpdate(v *validator.Validator, user *User) {
	v.Check(user.FirstName != "", "first_name", "must be provided")
	v.Check(user.Nickname != "", "nickname", "must be provided")
	v.Check(user.LastName != "", "last_name", "must be provided")
	v.Check(user.Privacy != "", "privacy", "must be provided")
	v.Check(user.DateOfBirth.Before(time.Now()), "date_of_birth", "must not be in the future")
	v.Check(slices.Contains(privacies, user.Privacy), "privacy", `must be one of these types: "public", "private",`)

	ValidateEmail(v, user.Email)
}
