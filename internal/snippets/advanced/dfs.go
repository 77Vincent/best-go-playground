package advanced

const Dfs = `package main

import "fmt"

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func dfs(root *TreeNode) {
    if root == nil {
        return
    }
    // Use a slice as a stack and initialize with the root.
    stack := []*TreeNode{root}
    for len(stack) > 0 {
        // Pop the last element from the stack.
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        fmt.Print(node.Val, " ")
        // Push right child first, so the left child is processed first.
        if node.Right != nil {
            stack = append(stack, node.Right)
        }
        if node.Left != nil {
            stack = append(stack, node.Left)
        }
    }
}

func main() {
    // Construct a small binary tree:
    //         1
    //        / \
    //       2   3
    //      / \
    //     4   5
    root := &TreeNode{Val: 1}
    root.Left = &TreeNode{Val: 2}
    root.Right = &TreeNode{Val: 3}
    root.Left.Left = &TreeNode{Val: 4}
    root.Left.Right = &TreeNode{Val: 5}

    fmt.Println("DFS traversal of the tree:")
    dfs(root) // Expected output (pre-order): 1 2 4 5 3
    fmt.Println()
}`
