package main

import (
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"social-network/internal/data"
)

func (app *application) createImageHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	files := r.MultipartForm.File["images"]
	if files == nil {
		app.badRequestResponse(w, r, err)
		return
	}
	var filePaths string
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		defer file.Close()

		filePath := filepath.Join("./internal/images", fileHeader.Filename)
		dst, err := os.Create(filePath)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		_, err = io.Copy(dst, file)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		filePaths += filePath + ","

	}

	postID, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
	}
	filePaths = filePaths[:len(filePaths)-1]

	options := r.PathValue("options")

	switch options {
	case "posts":
		err = app.models.Posts.InsertImage(postID, filePaths)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"images": "image uploaded succesfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}
