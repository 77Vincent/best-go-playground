package advanced

const Spinner = `// Spinner is a simple spinner animation in the terminal.
package main

import (
	"fmt"
	"time"
)

func main() {
	spinner := []rune{'|', '/', '-', '\\'}
	for i := 0; i < 50; i++ {
		// \r returns the cursor to the beginning of the line.
		fmt.Printf("\x0c\r%c", spinner[i%len(spinner)])
		time.Sleep(100 * time.Millisecond)
	}
	fmt.Print("\rDone!\n")
}`
