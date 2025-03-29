package advanced

const DiningPhilosopher = `// Dining Philosophers Problem
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Fork struct {
	sync.Mutex
}

type Philosopher struct {
	id               int
	leftFork, rightFork *Fork
}

func (p Philosopher) dine(wg *sync.WaitGroup) {
	defer wg.Done()
	for i := 0; i < 3; i++ {
		// Philosopher is thinking.
		fmt.Printf("Philosopher %d is thinking.\n", p.id)
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)

		// Pick up left and right forks.
		p.leftFork.Lock()
		p.rightFork.Lock()

		// Eating.
		fmt.Printf("Philosopher %d is eating.\n", p.id)
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)

		// Put down the forks.
		p.rightFork.Unlock()
		p.leftFork.Unlock()
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())
	const numPhilosophers = 5

	// Create forks.
	forks := make([]*Fork, numPhilosophers)
	for i := 0; i < numPhilosophers; i++ {
		forks[i] = new(Fork)
	}

	// Create philosophers.
	philosophers := make([]*Philosopher, numPhilosophers)
	for i := 0; i < numPhilosophers; i++ {
		philosophers[i] = &Philosopher{
			id:        i + 1,
			leftFork:  forks[i],
			rightFork: forks[(i+1)%numPhilosophers],
		}
	}

	var wg sync.WaitGroup
	for _, p := range philosophers {
		wg.Add(1)
		go p.dine(&wg)
	}
	wg.Wait()
}`
