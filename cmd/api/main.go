package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"social-network/internal/data"
)

type application struct {
	logger *log.Logger
	models data.Models
}

func main() {

	addr := flag.String("addr", ":4000", "HTTP network address")

	flag.Parse()
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &application{
		logger: logger,
		//models: data.NewModels(db) After making connection to db
	}

	srv := &http.Server{
		Addr:    *addr,
		Handler: app.routes(),
	}

	logger.Printf("Starting server on %s\n", *addr)
	log.Fatal(srv.ListenAndServe())
}
