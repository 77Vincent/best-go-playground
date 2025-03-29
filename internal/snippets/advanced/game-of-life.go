package advanced

const GameOfLife = `// Conway's Game of Life in Go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

const (
	width  = 40
	height = 20
)

// printGrid outputs the grid to the console.
func printGrid(grid [][]bool) {
	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			if grid[i][j] {
				fmt.Print("*")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

// countNeighbors counts live neighbors of cell (x, y).
func countNeighbors(grid [][]bool, x, y int) int {
	count := 0
	for i := x - 1; i <= x+1; i++ {
		for j := y - 1; j <= y+1; j++ {
			if i == x && j == y {
				continue
			}
			if i >= 0 && i < height && j >= 0 && j < width && grid[i][j] {
				count++
			}
		}
	}
	return count
}

// nextGeneration computes the next state of the grid.
func nextGeneration(grid [][]bool) [][]bool {
	newGrid := make([][]bool, height)
	for i := range newGrid {
		newGrid[i] = make([]bool, width)
	}
	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			neighbors := countNeighbors(grid, i, j)
			if grid[i][j] {
				// Live cell survives with 2 or 3 neighbors.
				newGrid[i][j] = (neighbors == 2 || neighbors == 3)
			} else {
				// Dead cell becomes live with exactly 3 neighbors.
				newGrid[i][j] = (neighbors == 3)
			}
		}
	}
	return newGrid
}

func main() {
	rand.Seed(time.Now().UnixNano())

	// Initialize the grid with random live cells.
	grid := make([][]bool, height)
	for i := range grid {
		grid[i] = make([]bool, width)
		for j := 0; j < width; j++ {
			grid[i][j] = rand.Float32() < 0.3
		}
	}

	// Run for a fixed number of generations.
	for gen := 0; gen < 100; gen++ {
		fmt.Print("\x0c") // Clear screen.
		fmt.Printf("Generation %d:\n", gen)
		printGrid(grid)
		grid = nextGeneration(grid)
		time.Sleep(50 * time.Millisecond)
	}
}`
