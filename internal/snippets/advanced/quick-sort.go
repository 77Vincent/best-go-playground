package advanced

const QuickSort = `package main

import "fmt"

func quickSort(arr []int) []int {
    if len(arr) < 2 {
        return arr
    }

    left, right := 0, len(arr)-1
    pivotIndex := len(arr) / 2

    // Move the pivot to the right end
    arr[pivotIndex], arr[right] = arr[right], arr[pivotIndex]

    // Partition step
    for i := range arr {
        if arr[i] < arr[right] {
            arr[i], arr[left] = arr[left], arr[i]
            left++
        }
    }

    // Move pivot to its final place
    arr[left], arr[right] = arr[right], arr[left]

    // Recursively sort elements on both sides
    quickSort(arr[:left])
    quickSort(arr[left+1:])

    return arr
}

func main() {
    nums := []int{10, 7, 8, 9, 1, 5}
    fmt.Println("Unsorted:", nums)
    sorted := quickSort(nums)
    fmt.Println("Sorted:  ", sorted)
}`
