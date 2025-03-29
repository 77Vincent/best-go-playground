package advanced

const HttpServer = `// An example of a simple HTTP server in Go.
package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// helloHandler handles requests to the root URL.
func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}

// healthHandler handles requests to /health for a basic health check.
func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "OK")
}

// startServer starts the HTTP server on port 8080.
func startServer() {
	// Map URL paths to handler functions.
	http.HandleFunc("/", helloHandler)
	http.HandleFunc("/health", healthHandler)

	port := ":8080"
	fmt.Printf("Server is listening on port %s\n", port)
	// Start the HTTP server (this call blocks).
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func main() {
	// Start the HTTP server in a separate goroutine.
	go startServer()

	// Allow the server some time to start.
	time.Sleep(1 * time.Second)

	// Sample Request 1: Request to the root endpoint.
	resp, err := http.Get("http://localhost:8080/")
	if err != nil {
		log.Fatalf("Failed to make request to /: %v", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response from /: %v", err)
	}
	fmt.Printf("Response from /:\n%s\n", body)

	// Sample Request 2: Request to the /health endpoint.
	resp, err = http.Get("http://localhost:8080/health")
	if err != nil {
		log.Fatalf("Failed to make request to /health: %v", err)
	}
	defer resp.Body.Close()
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response from /health: %v", err)
	}
	fmt.Printf("Response from /health:\n%s\n", body)
}`
