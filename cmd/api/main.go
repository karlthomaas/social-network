package main

import (
	"context"
	"database/sql"
	"flag"
	"log"
	"net/http"
	"os"
	"social-network/internal/data"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type application struct {
	logger *log.Logger
	models data.Models
}

func main() {

	addr := flag.String("addr", ":4000", "HTTP network address")

	flag.Parse()
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)
	db, err := OpenDB()
	if err != nil {
		logger.Fatal(err)
	}

	defer db.Close()

	logger.Printf("database connection pool established")

	app := &application{
		logger: logger,
		models: data.NewModels(db),
	}

	srv := &http.Server{
		Addr:    *addr,
		Handler: app.routes(),
	}

	logger.Printf("Starting server on %s\n", *addr)
	log.Fatal(srv.ListenAndServe())
}

func OpenDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "internal/db/database.db")
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxIdleTime(time.Minute * 15)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}
