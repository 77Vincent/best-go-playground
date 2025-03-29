package advanced

const ConcurrentPrime = `package main

import "fmt"

// generate sends the sequence 2, 3, 4, ... to channel ch.
func generate(ch chan<- int) {
    for i := 2; ; i++ {
        ch <- i
    }
}

// filter copies numbers from in to out, removing those divisible by prime.
func filter(in <-chan int, out chan<- int, prime int) {
    for {
        num := <-in
        if num % prime != 0 {
            out <- num
        }
    }
}

func main() {
    ch := make(chan int)
    go generate(ch)

    // Print the first 100 primes.
    for i := 0; i < 100; i++ {
        prime := <-ch
        fmt.Println(prime)
        ch1 := make(chan int)
        go filter(ch, ch1, prime)
        ch = ch1
    }
}`
