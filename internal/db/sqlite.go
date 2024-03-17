package db

import (
	"database/sql"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/file"
)

func MigrateUp() {

	db, err := sql.Open("sqlite3", "internal/db/sqlite/database.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	instance, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		panic(err)
	}

	src, err := (&file.File{}).Open("internal/db/migrations")
	if err != nil {
		panic(err)
	}

	m, err := migrate.NewWithInstance("file", src, "sqlite", instance)
	if err != nil {
		panic(err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		panic(err)
	}
}
