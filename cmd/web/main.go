package main

import (
	"flag"
	"log"
	"net/http"
	"social-network/internal/db"
	"social-network/internal/helpers"
	"social-network/internal/routes"
)

func main() {

	addr := flag.String("addr", ":4000", "HTTP network address")

	flag.Parse()

	srv := &http.Server{
		Addr:    *addr,
		Handler: routes.Routes(),
	}
	db.MigrateUp()
	helpers.InfoLog.Printf("Starting server on %s\n", *addr)
	log.Fatal(srv.ListenAndServe())
}
