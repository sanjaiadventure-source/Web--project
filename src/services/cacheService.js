/**
 * API Request Caching & Deduplication Service
 * EXPERIMENT 2c: Optimize hotel images and API requests
 */

class ApiCacheService {
  constructor() {
    this.memoryCache = new Map();
    this.pendingRequests = new Map();
    this.defaultTTL = 60 * 1000; // 60 seconds TTL for hotel catalog & details
    this.metrics = {
      hits: 0,
      misses: 0,
      deduped: 0,
      bandwidthSavedKb: 0
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const stats = this.getStats();
    this.listeners.forEach(fn => {
      try {
        fn(stats);
      } catch (e) {
        console.error('Cache listener error:', e);
      }
    });
  }

  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  get(key) {
    const entry = this.memoryCache.get(key);
    if (!entry) {
      this.metrics.misses++;
      this.notify();
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.memoryCache.delete(key);
      this.metrics.misses++;
      this.notify();
      return null;
    }

    this.metrics.hits++;
    this.metrics.bandwidthSavedKb += Math.round(entry.estimatedSizeKb || 12);
    this.notify();
    return entry.data;
  }

  set(key, data, ttlMs = this.defaultTTL) {
    const estimatedSizeKb = Math.round(JSON.stringify(data).length / 1024) || 2;
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
      timestamp: Date.now(),
      estimatedSizeKb
    });
    this.notify();
  }

  clear() {
    this.memoryCache.clear();
    this.notify();
  }

  /**
   * Request Deduplication: Wraps an async request executor so duplicate concurrent
   * calls for the same resource share a single ongoing promise.
   */
  async dedupe(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      this.metrics.deduped++;
      this.notify();
      return this.pendingRequests.get(key);
    }

    const promise = (async () => {
      try {
        const result = await requestFn();
        return result;
      } finally {
        this.pendingRequests.delete(key);
      }
    })();

    this.pendingRequests.set(key, promise);
    return promise;
  }

  getStats() {
    return {
      size: this.memoryCache.size,
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      deduped: this.metrics.deduped,
      bandwidthSavedKb: this.metrics.bandwidthSavedKb,
      hitRate: this.metrics.hits + this.metrics.misses > 0
        ? Math.round((this.metrics.hits / (this.metrics.hits + this.metrics.misses)) * 100)
        : 0
    };
  }
}

export const apiCache = new ApiCacheService();
