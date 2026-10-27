/**
 * High-Performance In-Memory LRU Cache with TTL for ExamAI
 * Designed for sub-100ms (typically sub-5ms) note retrieval
 */
class NotesLRUCache {
  constructor(maxSize = 1000, defaultTTL = 30 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL; // 30 minutes default
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const entry = this.cache.get(key);

    // Check expiration
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU position by re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    // If key already exists, delete it first to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict oldest item (first item in Map iteration order)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  del(key) {
    return this.cache.delete(key);
  }

  delPattern(prefix) {
    let deletedCount = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? (this.hits / total).toFixed(3) : "0.000",
    };
  }
}

export const notesCache = new NotesLRUCache(1000, 30 * 60 * 1000);
export default notesCache;
