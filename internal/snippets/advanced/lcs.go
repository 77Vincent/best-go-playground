package advanced

const LCS = `package main

import "fmt"

// LCS computes the length of the longest common subsequence between s1 and s2.
func LCS(s1, s2 string) int {
	m, n := len(s1), len(s2)
	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if s1[i-1] == s2[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				if dp[i-1][j] > dp[i][j-1] {
					dp[i][j] = dp[i-1][j]
				} else {
					dp[i][j] = dp[i][j-1]
				}
			}
		}
	}
	return dp[m][n]
}

func main() {
	s1 := "AGGTAB"
	s2 := "GXTXAYB"
	fmt.Printf("LCS length between %q and %q is: %d\n", s1, s2, LCS(s1, s2))
}`
