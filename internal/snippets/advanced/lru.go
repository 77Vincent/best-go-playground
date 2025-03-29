package advanced

const LRU = `package main

import (
    "container/list"
    "fmt"
)

// pair represents a key-value entry in the cache.
type pair struct {
    key, value int
}

// LRUCache holds the cache data, its capacity, and the recency list.
type LRUCache struct {
    capacity int
    cache    map[int]*list.Element
    list     *list.List
}

// NewLRUCache creates a new LRU cache with the given capacity.
func NewLRUCache(capacity int) *LRUCache {
    return &LRUCache{
        capacity: capacity,
        cache:    make(map[int]*list.Element),
        list:     list.New(),
    }
}

// Get retrieves a value from the cache by key.
// If the key exists, it moves the element to the front (most recently used) and returns its value.
func (c *LRUCache) Get(key int) (int, bool) {
    if elem, ok := c.cache[key]; ok {
        c.list.MoveToFront(elem)
        return elem.Value.(pair).value, true
    }
    return 0, false
}

// Put adds a key-value pair to the cache.
// If the key exists, it updates the value and moves the element to the front.
// If adding the new key exceeds the capacity, it evicts the least recently used element.
func (c *LRUCache) Put(key, value int) {
    if elem, ok := c.cache[key]; ok {
        // Key exists, update value and move to front.
        c.list.MoveToFront(elem)
        elem.Value = pair{key, value}
        return
    }
    // Evict the least recently used element if at capacity.
    if c.list.Len() >= c.capacity {
        back := c.list.Back()
        if back != nil {
            c.list.Remove(back)
            kv := back.Value.(pair)
            delete(c.cache, kv.key)
        }
    }
    // Insert the new element at the front.
    elem := c.list.PushFront(pair{key, value})
    c.cache[key] = elem
}

func main() {
    cache := NewLRUCache(3)
    
    cache.Put(1, 100)
    cache.Put(2, 200)
    cache.Put(3, 300)
    
    // Access key 2 to update its recency.
    if val, ok := cache.Get(2); ok {
        fmt.Println("Get 2:", val)
    }
    
    // Insert a new element which should evict the least recently used (key 1).
    cache.Put(4, 400)
    
    if _, ok := cache.Get(1); !ok {
        fmt.Println("Key 1 evicted")
    }
    
    if val, ok := cache.Get(3); ok {
        fmt.Println("Get 3:", val)
    }
    if val, ok := cache.Get(4); ok {
        fmt.Println("Get 4:", val)
    }
}`
