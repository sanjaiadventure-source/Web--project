import axios from 'axios';
import { mockBackendHandler } from './mockBackend';
import { apiCache } from './cacheService';

// Event emitter pattern for UI API Inspector
export const apiEventBus = {
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },
  emit(event) {
    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (e) {
        console.error('Inspector listener error:', e);
      }
    });
  }
};

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Custom adapter with EXPERIMENT 2c: API caching & Request Deduplication
  adapter: async (config) => {
    const method = (config.method || 'get').toLowerCase();
    const url = config.url || '';
    const isCacheable = method === 'get' && (url.startsWith('/api/hotels'));

    if (isCacheable) {
      const cacheKey = apiCache.generateKey(url, config.params || {});
      const cached = apiCache.get(cacheKey);
      if (cached) {
        apiEventBus.emit({
          type: 'RESPONSE_RECEIVED',
          timestamp: new Date().toLocaleTimeString(),
          method: 'GET',
          url,
          status: 200,
          durationMs: 0,
          data: cached,
          fromCache: true
        });
        return {
          data: cached,
          status: 200,
          statusText: 'OK (Memory Cache)',
          headers: { 'x-cache': 'HIT' },
          config,
          request: {}
        };
      }

      // Dedupe concurrent identical requests (Exp 2c)
      const res = await apiCache.dedupe(cacheKey, async () => {
        const networkRes = await mockBackendHandler(config);
        if (networkRes.status === 200) {
          apiCache.set(cacheKey, networkRes.data);
        }
        return networkRes;
      });

      return {
        ...res,
        statusText: res.statusText || (res.status === 200 ? 'OK' : 'OK'),
        headers: { ...(res.headers || {}), 'x-cache': 'MISS' },
        config,
        request: {}
      };
    }

    try {
      const res = await mockBackendHandler(config);
      // Invalidate cache on mutations
      if (method === 'post' || method === 'put' || method === 'delete') {
        apiCache.clear();
      }
      return {
        ...res,
        statusText: res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : 'OK'),
        headers: res.headers || {},
        config: config,
        request: {}
      };
    } catch (err) {
      if (!err.config) err.config = config;
      if (err.response && !err.response.config) err.response.config = config;
      return Promise.reject(err);
    }
  }
});

// ============================================================================
// EXPERIMENT 4c: Attach Authentication Token to Outgoing Requests
// ============================================================================
apiClient.interceptors.request.use(
  (config) => {
    const startTime = performance.now();
    config.metadata = { startTime };

    // Retrieve token from localStorage if available
    let token = null;
    try {
      const storedToken = localStorage.getItem('luxehaven_auth_token_v1');
      if (storedToken) {
        token = JSON.parse(storedToken);
      }
    } catch {
      token = localStorage.getItem('luxehaven_auth_token_v1');
    }

    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const method = (config?.method || 'GET').toUpperCase();
    const url = config?.url || '';

    // Notify API Inspector of outgoing request
    apiEventBus.emit({
      type: 'REQUEST_SENT',
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      params: config.params,
      data: config.data,
      headers: {
        ...(config.headers || {}),
        Authorization: config.headers?.['Authorization'] || 'None (Public Request)'
      }
    });

    return config;
  },
  (error) => {
    apiEventBus.emit({
      type: 'REQUEST_ERROR',
      timestamp: new Date().toLocaleTimeString(),
      error: error?.message || 'Request creation failed'
    });
    return Promise.reject(error);
  }
);

// ============================================================================
// EXPERIMENT 4f: Handle 401 Unauthorized & Expired Token Responses
// EXPERIMENT 1f & 3f: Handle Loading, Error, and Network Responses
// ============================================================================
apiClient.interceptors.response.use(
  (response) => {
    const config = response?.config || {};
    const method = (config?.method || 'GET').toUpperCase();
    const url = config?.url || response?.config?.url || '';
    const duration = config?.metadata?.startTime
      ? Math.round(performance.now() - config.metadata.startTime)
      : 0;

    apiEventBus.emit({
      type: 'RESPONSE_RECEIVED',
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      status: response?.status || 200,
      durationMs: duration,
      data: response?.data
    });

    return response;
  },
  (error) => {
    const config = error?.config || error?.response?.config || {};
    const method = (config?.method || 'HTTP').toUpperCase();
    const url = config?.url || error?.config?.url || 'API';
    const duration = config?.metadata?.startTime
      ? Math.round(performance.now() - config.metadata.startTime)
      : 0;

    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';

    apiEventBus.emit({
      type: 'RESPONSE_ERROR',
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      status,
      durationMs: duration,
      message,
      data: error.response?.data
    });

    // Experiment 4f: If 401 Unauthorized or expired token, clear invalid credentials
    if (status === 401) {
      console.warn('[Security Interceptor] 401 Unauthorized encountered. Session expired or token invalid.');
      localStorage.removeItem('luxehaven_auth_token_v1');
      localStorage.removeItem('luxehaven_auth_user_v1');

      // Dispatch global event for auth state sync
      window.dispatchEvent(new CustomEvent('luxehaven:token_expired', {
        detail: { message }
      }));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
