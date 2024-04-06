package main

import (
	"context"
	"database/sql"
	"flag"
	"log"
	"os"
	"social-network/internal/data"
	"sync"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type config struct {
	port int
	env  string
}

type application struct {
	config config
	logger *log.Logger
	models data.Models
	wg     sync.WaitGroup
}

func main() {

	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "emv", "development", "Environment(development|staging|production)")

	flag.Parse()
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)
	db, err := OpenDB()
	if err != nil {
		logger.Fatal(err)
	}

	defer db.Close()

	logger.Printf("database connection pool established")

	app := &application{
		config: cfg,
		logger: logger,
		models: data.NewModels(db),
	}

	err = app.serve()
	if err != nil {
		logger.Fatal(err, nil)
	}

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
