package advanced

const BinarySearch = `package main

import "fmt"

func binarySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := (low + high) / 2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return -1 // not found
}

func main() {
    arr := []int{1, 3, 5, 7, 9, 11}
    target := 7
    index := binarySearch(arr, target)
    fmt.Printf("Searching for %d, found at index: %d\n", target, index)
}`
