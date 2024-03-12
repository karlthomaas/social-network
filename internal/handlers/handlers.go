package handlers

import (
	"encoding/json"
	"net/http"
	"social-network/internal/helpers"
	"social-network/internal/session"
)

// TEST
func HomeHandler(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/" {
        helpers.NotFound(w)
        return
    }

    session.CreateJwtCookie("tere", w)

    w.Header().Set("Content-Type", "application/json")
    jsonData, err := json.Marshal("teree hommikust")
    if err != nil {
        helpers.ServerError(w, err)
        return
    }
    w.Write(jsonData)
}
