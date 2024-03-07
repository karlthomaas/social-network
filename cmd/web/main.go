package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"social-network/internal/routes"
)


func main() {

	addr := flag.String("addr", ":4000", "HTTP network address")

	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	srv := &http.Server {
		Addr: *addr,
		Handler: routes.Routes(),
	}

	infoLog.Printf("Starting server on %s\n", *addr)
	log.Fatal(srv.ListenAndServe())
}
