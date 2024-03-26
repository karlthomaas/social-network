package main

import (
	"fmt"
	"net/http"
)

func (app *application) SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy",
			"default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com")
		w.Header().Set("Referrer-Policy", "origin-when-cross-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "0")

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.logger.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())
		next.ServeHTTP(w, r)
	})
}

func (app *application) RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("%s", err))
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func (app *application) ValidateJwt(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := app.DecodeAndValidateJwt(w, r)
		if err != nil {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// func (app *application) rateLimit(next http.Handler) http.Handler {
// 	type client struct {
// 		limiter  *rate.Limiter
// 		lastSeen time.Time
// 	}
// 	var (
// 		mu      sync.Mutex
// 		clients = make(map[string]*client)
// 	)

// 	go func() {
// 		for {
// 			time.Sleep(time.Minute)

// 			mu.Lock()

// 			for ip, client := range clients {
// 				if time.Since(client.lastSeen) > 3*time.Minute {
// 					delete(clients, ip)
// 				}
// 			}
// 			mu.Unlock()
// 		}
// 	}()

// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		ip, _, err := net.SplitHostPort(r.RemoteAddr)
// 		if err != nil {
// 			app.serverErrorResponse(w, r, err)
// 			return
// 		}
// 		mu.Lock()

// 		if _, found := clients[ip]; !found {
// 			clients[ip] = &client{limiter: rate.NewLimiter(2, 4)}
// 		}

// 		clients[ip].lastSeen = time.Now()

// 		if !clients[ip].limiter.Allow() {
// 			mu.Unlock()
// 			app.rateLimitExceededResponse(w, r)
// 			return
// 		}
// 		mu.Unlock()

// 		next.ServeHTTP(w, r)
// 	})
// }
