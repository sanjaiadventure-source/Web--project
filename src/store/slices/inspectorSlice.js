import { createSlice } from '@reduxjs/toolkit';

const initialExperiments = [
  {
    id: 'exp-testing',
    title: 'Experiment 1: Implement Hotel Booking Component Testing',
    topics: 'Jest, React Testing Library',
    tasks: [
      { id: '1a', text: 'Test hotel cards, hotel details, room selection, and booking components', status: 'pass' },
      { id: '1b', text: 'Test hotel search and filtering (debouncing, location pills, rating)', status: 'pass' },
      { id: '1c', text: 'Test room selection and guest information (adults, children, rooms)', status: 'pass' },
      { id: '1d', text: 'Test booking cost calculation (nights, rate, 12% tax, service fee, coupons)', status: 'pass' },
      { id: '1e', text: 'Test booking confirmation and cancellation (CRUD status transitions)', status: 'pass' },
      { id: '1f', text: 'Use Jest and React Testing Library for automated testing (27/27 Passing)', status: 'pass' }
    ]
  },
  {
    id: 'exp-optimize',
    title: 'Experiment 2: Optimize Hotel Booking Application',
    topics: 'Performance, Lazy Loading, Code Splitting, PWA, Accessibility, Security',
    tasks: [
      { id: '2a', text: 'Implement lazy loading for hotel details and booking pages (React.lazy)', status: 'pass' },
      { id: '2b', text: 'Apply code splitting for route-level components (Rollup manualChunks & Suspense)', status: 'pass' },
      { id: '2c', text: 'Optimize hotel images (lazy/async) and API requests (apiCache & deduplication)', status: 'pass' },
      { id: '2d', text: 'Implement basic PWA functionality (manifest.json, sw.js, offline cache)', status: 'pass' },
      { id: '2e', text: 'Provide keyboard navigation (Escape, focus trap) and ARIA labels for booking controls', status: 'pass' },
      { id: '2f', text: 'Apply secure handling of user inputs (XSS sanitization) and token masking', status: 'pass' }
    ]
  },
  {
    id: 'exp-foundations',
    title: 'Foundations: REST API, Redux Toolkit & Bearer Authentication',
    topics: 'REST API, Redux Toolkit, CRUD, JWT Auth',
    tasks: [
      { id: 'f1', text: 'Simulated REST API backend with Axios Bearer token interceptor', status: 'pass' },
      { id: 'f2', text: 'Redux Toolkit centralized store with validation middleware', status: 'pass' },
      { id: 'f3', text: 'Full CRUD operations with auto booking code & tax invoice voucher', status: 'pass' },
      { id: 'f4', text: 'Automatic session invalidation on 401 Unauthorized', status: 'pass' }
    ]
  }
];

const inspectorSlice = createSlice({
  name: 'inspector',
  initialState: {
    isOpen: false,
    activeTab: 'overview', // 'overview', 'api-traffic', 'redux-actions', 'test-suite'
    apiLogs: [],
    reduxLogs: [],
    experiments: initialExperiments,
    testResults: {
      running: false,
      completed: false,
      passedCount: 0,
      totalCount: 24,
      logs: []
    }
  },
  reducers: {
    toggleInspector: (state) => {
      state.isOpen = !state.isOpen;
    },
    setInspectorOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setInspectorTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addApiLog: (state, action) => {
      state.apiLogs.unshift(action.payload);
      if (state.apiLogs.length > 50) {
        state.apiLogs.pop();
      }
    },
    addReduxLog: (state, action) => {
      state.reduxLogs.unshift(action.payload);
      if (state.reduxLogs.length > 50) {
        state.reduxLogs.pop();
      }
    },
    clearLogs: (state) => {
      state.apiLogs = [];
      state.reduxLogs = [];
    },
    setTestRunning: (state, action) => {
      state.testResults.running = action.payload;
      if (action.payload) {
        state.testResults.completed = false;
        state.testResults.logs = [];
        state.testResults.passedCount = 0;
      }
    },
    addTestLog: (state, action) => {
      state.testResults.logs.push(action.payload);
      if (action.payload.pass) {
        state.testResults.passedCount += 1;
      }
    },
    setTestCompleted: (state) => {
      state.testResults.running = false;
      state.testResults.completed = true;
    }
  }
});

export const {
  toggleInspector,
  setInspectorOpen,
  setInspectorTab,
  addApiLog,
  addReduxLog,
  clearLogs,
  setTestRunning,
  addTestLog,
  setTestCompleted
} = inspectorSlice.actions;

export default inspectorSlice.reducer;
