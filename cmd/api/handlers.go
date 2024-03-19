package main

import (
	"net/http"
)

type test struct {
	Jou string
}

// TEST
func (app *application) HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		app.notFoundResponse(w, r)
		return
	}

	data := &test{
		Jou: "tere",
	}
	app.writeJSON(w, http.StatusOK, envelope{"test": data}, nil)
}
