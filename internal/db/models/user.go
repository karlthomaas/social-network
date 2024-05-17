package models

import (
    "time"
)

type User struct {
    Id          string    `db:"id" json:"id"`
    Password    string    `db:"password" json:"password"`
    FirstName   string    `db:"first_name" json:"first_name"`
    LastName    string    `db:"last_name" json:"last_name"`
    DateOfBirth time.Time `db:"date_of_birth" json:"date_of_birth"`
    Image       []byte    `db:"image" json:"image"`
    Nickname    string    `db:"nickname" json:"nickname"`
    AboutMe     string    `db:"about_me" json:"about_me"`
    CreatedAt   time.Time `db:"created_at" json:"created_at"`
    Privacy     string    `db:"privacy" json:"privacy"`
}
