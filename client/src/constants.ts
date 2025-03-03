export const VIM_MODE_KEY = "isVimMode";
export const AUTO_RUN_KEY = "isAutoRum";
export const DARK_MODE_KEY = "isDarkMode";
export const EDITOR_SIZE_KEY = "editorSize";


export const DEFAULT_VIM_MODE = "false";
export const DEFAULT_AUTO_RUN = "true";
export const DEFAULT_SIZE = "50";
export const DEFAULT_LINE = 1;
export const DEFAULT_CODE = `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"
)

const (
	portEnv    = "PORT"
	latencyEnv = "LATENCY"
	res        = \`{"message":"pong"}\`
)

func main() {
	// read env for port
	var (
		port    = os.Getenv(portEnv)
		latency = os.Getenv(latencyEnv)
	)

	if port == "" {
		port = "8080"
	}

	if latency == "" {
		latency = "0"
	}

	p, err := strconv.Atoi(port)
	if err != nil {
		panic(fmt.Errorf("PORT must be a number, got %s", port))
	}

	l, err := strconv.Atoi(latency)
	if err != nil {
		panic(fmt.Errorf("LATENCY must be a number, got %s", latency))
	}

	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		time.Sleep(time.Duration(l) * time.Millisecond)
		w.Header().Set("Content-Type", "application/json")

		response := map[string]string{
			"message": "world",
			"latency": time.Since(start).String(),
		}
		if err := json.NewEncoder(w).Encode(response); err != nil {
			panic(err)
		}
	})

	http.HandleFunc("/world", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		time.Sleep(time.Duration(l) * time.Millisecond)
		w.Header().Set("Content-Type", "application/json")

		response := map[string]string{
			"message": "hello",
			"latency": time.Since(start).String(),
		}
		if err := json.NewEncoder(w).Encode(response); err != nil {
			panic(err)
		}
	})

	ps := fmt.Sprintf(":%d", p)
	fmt.Printf("Listening on %s\n", ps)
	if err := http.ListenAndServe(ps, nil); err != nil {
		panic(err)
	}
}

`
