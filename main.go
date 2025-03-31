package main

import (
	"fmt"
	"net/http"
	"os"
	"path"
)

func main() {
	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/", http.StripPrefix("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := os.Stat(path.Join("static", r.URL.Path))
		if os.IsNotExist(err) {
			// file does not exist, serve index.html
			http.ServeFile(w, r, "static/index.html")
			return
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// otherwise, use file server for static files
		fs.ServeHTTP(w, r)
	})))

	server := &http.Server{
		Addr:    ":8000",
		Handler: mux,
	}

	if err := server.ListenAndServe(); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}
