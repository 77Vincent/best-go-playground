package advanced

const ProgressBar = `// A terminal progress bar in Go.
package main

import (
	"fmt"
	"time"
)

func main() {
	total := 50
	for i := 0; i <= total; i++ {
		percent := float64(i) / float64(total) * 100
		bar := ""
		for j := 0; j < i; j++ {
			bar += "="
		}
		for j := i; j < total; j++ {
			bar += " "
		}
		// \r returns the cursor to the beginning of the line.
		fmt.Printf("\x0c\r[%s] %.0f%%", bar, percent)
		time.Sleep(100 * time.Millisecond)
	}
	fmt.Print("\nCompleted!\n")
}`
