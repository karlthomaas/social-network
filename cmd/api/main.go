package main

import (
	"flag"
	"log"
	"net/http"
	"os"
)

type application struct {
	logger *log.Logger
}

func main() {

	addr := flag.String("addr", ":4000", "HTTP network address")

	flag.Parse()
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &application{
		logger: logger,
	}

	srv := &http.Server{
		Addr:    *addr,
		Handler: app.routes(),
	}

	logger.Printf("Starting server on %s\n", *addr)
	log.Fatal(srv.ListenAndServe())
}
