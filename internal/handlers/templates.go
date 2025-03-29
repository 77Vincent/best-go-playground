package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/tianqi-wen_frgr/go-sandbox/internal/snippets/advanced"
	"github.com/tianqi-wen_frgr/go-sandbox/internal/snippets/basic"
	"github.com/tianqi-wen_frgr/go-sandbox/internal/snippets/design_pattern"
	"net/http"
)

const (
	notFoundError = "template not found"
	// basic
	helloWorld        = "helloWorld"
	sleepCase         = "sleep"
	switchCaseCase    = "switchCase"
	goroutineCase     = "goroutine"
	channelCase       = "channel"
	deferCase         = "defer"
	assertionCase     = "assertion"
	fileIOCase        = "fileIO"
	contextCancelCase = "contextCancel"
	jsonCase          = "json"
	mutexCase         = "mutex"
	tickerCase        = "ticker"
	// advanced
	fibonacciCase         = "fibonacci"
	progressBarCase       = "progressBar"
	quickSortCase         = "quickSort"
	mergeSortCase         = "mergeSort"
	binarySearchCase      = "binarySearch"
	bfsCase               = "bfs"
	dfsCase               = "dfs"
	lruCase               = "lru"
	lcsCase               = "lcs"
	spinner               = "spinner"
	httpServerCase        = "httpServer"
	gameOfLifeCase        = "gameOfLife"
	concurrentPrimeCase   = "concurrentPrime"
	diningPhilosopherCase = "diningPhilosophers"
	// design patterns
	singletonCase = "singleton"
	factoryCase   = "factory"
	strategyCase  = "strategy"
	prototypeCase = "prototype"
	decoratorCase = "decorator"
	templateCase  = "template"
	facadeCase    = "facade"
	adaptorCase   = "adaptor"
)

func GetTemplate(c *gin.Context) {
	var (
		id     = c.Param("id")
		output = ""
	)
	switch id {
	case helloWorld:
		output = basic.HelloSandbox
	case sleepCase:
		output = basic.Sleep
	case switchCaseCase:
		output = basic.SwitchCase
	case goroutineCase:
		output = basic.Goroutine
	case channelCase:
		output = basic.Channel
	case deferCase:
		output = basic.Defer
	case assertionCase:
		output = basic.Assertion
	case fileIOCase:
		output = basic.FileIO
	case contextCancelCase:
		output = basic.ContextCancel
	case jsonCase:
		output = basic.JSON
	case mutexCase:
		output = basic.Mutex
	case tickerCase:
		output = basic.Ticker

	// advanced
	case spinner:
		output = advanced.Spinner
	case progressBarCase:
		output = advanced.ProgressBar
	case httpServerCase:
		output = advanced.HttpServer
	case gameOfLifeCase:
		output = advanced.GameOfLife
	case concurrentPrimeCase:
		output = advanced.ConcurrentPrime
	case diningPhilosopherCase:
		output = advanced.DiningPhilosopher
	case fibonacciCase:
		output = advanced.Fibonacci
	case quickSortCase:
		output = advanced.QuickSort
	case mergeSortCase:
		output = advanced.MergeSort
	case binarySearchCase:
		output = advanced.BinarySearch
	case bfsCase:
		output = advanced.Bfs
	case dfsCase:
		output = advanced.Dfs
	case lruCase:
		output = advanced.LRU
	case lcsCase:
		output = advanced.LCS

	// design patterns
	case singletonCase:
		output = design_pattern.Singleton
	case factoryCase:
		output = design_pattern.Factory
	case strategyCase:
		output = design_pattern.Strategy
	case prototypeCase:
		output = design_pattern.Prototype
	case decoratorCase:
		output = design_pattern.Decorator
	case templateCase:
		output = design_pattern.TemplatePattern
	case facadeCase:
		output = design_pattern.Facade
	case adaptorCase:
		output = design_pattern.Adaptor

	default:
		c.String(http.StatusNotFound, notFoundError)
	}

	c.String(http.StatusOK, output)
}
