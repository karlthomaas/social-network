package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"social-network/internal/data"
)

func (app *application) createImageHandler(w http.ResponseWriter, r *http.Request) {

	user := app.contextGetUser(r)
	IDParam, err := app.readParam(r, "id")
	if err != nil {
		app.notFoundResponse(w, r)
	}

	options := r.PathValue("options")

	if options == "users" {
		if user.ID != IDParam {
			app.unAuthorizedResponse(w, r)
			return
		}
	}
	id, err := app.generateUUID()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = r.ParseMultipartForm(32 << 20)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	files := r.MultipartForm.File["images"]
	if len(files) <= 0 {
		app.badRequestResponse(w, r, errors.New("incorrect filelist"))
		return
	}

	var filePaths string
	var publicFilePaths string
	var output []string

	for _, fileHeader := range files {
		extension := filepath.Ext(fileHeader.Filename)

		file, err := fileHeader.Open()
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		defer file.Close()

		filePath := filepath.Join("./internal/images", id+extension)
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
		publicFilePaths += "/api/images/" + id + extension + ","
		output = append(output, publicFilePaths)

	}
	fmt.Println("nonii")

	publicFilePaths = publicFilePaths[:len(publicFilePaths)-1]

	switch options {
	case "posts":
		err = app.models.Posts.InsertImage(IDParam, publicFilePaths)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

	case "users":
		err = app.models.Users.InsertImage(IDParam, publicFilePaths)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				app.notFoundResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
			}
			return
		}

	case "replies":
		err = app.models.Replies.InsertImage(IDParam, publicFilePaths)
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

	err = app.writeJSON(w, http.StatusOK, envelope{"images": output}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	fmt.Println(filePaths[:len(filePaths)-1])
}
