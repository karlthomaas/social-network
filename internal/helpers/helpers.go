package helpers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime/debug"
)

var InfoLog = log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

var errorLog *log.Logger

func ServerError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	errorLog.Output(2, trace)
  
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func ClientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func NotFound(w http.ResponseWriter) {
	ClientError(w, http.StatusBadRequest)
}
