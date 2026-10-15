# LuxeHaven | Hotel Room Booking Web Application
### Scenario 4: Component Testing & Application Optimization (Experiments 1 & 2)

An ultra-luxury Hotel Room Booking Web Application built with **React 19**, **Vite**, **Redux Toolkit**, **Jest / React Testing Library**, and **PWA Offline Service Worker**, featuring comprehensive component test suites, dynamic code splitting with `React.lazy`, client-side API caching with request deduplication, WCAG AA accessible booking controls, and strict input sanitization.

---

## 🌟 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated Jest & React Testing Library test suite (27/27 Passing)
npm test

# 4. Build optimized production bundle with route-level code splitting
npm run build
npm run preview
```

---

## 📑 Experiments Matrix & Implementation

### Experiment 1: Implement Hotel Booking Component Testing
**Topics:** `Jest`, `React Testing Library`, `Component Testing`, `Unit Testing`

- **a) Test hotel cards, hotel details, room selection, and booking components**:
  - `src/test/HotelCard.test.jsx`: Tests card presentation (name, location, price, rating, reviews), available room status badge vs "Fully Booked", "Details" button dispatching details fetch, and "Book" button opening booking modal.
  - `src/test/HotelDetailModal.test.jsx`: Tests room specifications (bed types, sq footage, guest limits), photo gallery rendering, suite tier selection, and loading/error states.
  - `src/test/BookingModal.test.jsx`: Tests modal lifecycle, hotel & room summary presentation, and date pickers.
- **b) Test hotel search and filtering**:
  - `src/test/SearchAndFilter.test.jsx`: Tests 350ms debounced search text input, location pills (`Paris`, `Maldives`, `All`), minimum star rating filters (`4.8+`), and "Reset All Filters" button state resets.
- **c) Test room selection and guest information**:
  - Verified suite tier selection transferring price rate to booking store.
  - Guest selector test updates (`adults`, `children`, `roomsCount`) and updates price calculation dynamically.
- **d) Test booking cost calculation**:
  - `src/test/costCalculation.test.js`: Comprehensive unit tests for math calculation engine:
    $$\text{Room Cost} = \text{Rate Per Night} \times \text{Nights} \times \text{Rooms}$$
    $$\text{Taxes (12\%)} = \text{Room Cost} \times 0.12$$
    $$\text{Total Amount} = \text{Room Cost} + \text{Taxes} + \text{Service Fee (\$45)} - \text{Discount}$$
    - Tests promo coupon deductions (`LUXE20` 20% off, `VIP100` $100 off).
    - Tests edge cases: 0-night or reversed calendar dates safely clamped to 1-night minimum.
- **e) Test booking confirmation and cancellation**:
  - `src/test/ReservationsView.test.jsx`: Tests reservation list rendering for authenticated users, tab filtering (`All`, `Confirmed`, `Canceled`), cancellation trigger (`window.confirm` dialog and DELETE action), and unauthenticated access protection banner.
- **f) Use Jest and React Testing Library for testing**:
  - Automated test runner configured with `@testing-library/react`, `@testing-library/jest-dom`, and Vitest / Jest compatibility layer.
  - **27 out of 27 automated tests passing with 100% success rate.**

---

### Experiment 2: Optimize Hotel Booking Application
**Topics:** `Performance`, `Lazy Loading`, `Code Splitting`, `PWA`, `Accessibility`, `Security`

- **a) Implement lazy loading for hotel details and booking pages**:
  - Dynamic imports using `React.lazy()` for `HotelDetailModal`, `BookingModal`, `AuthModal`, and `ExperimentInspector`.
  - Wrapped with `<React.Suspense fallback={<ChunkLoadingFallback />}>` providing shimmering luxury skeleton loaders while chunks stream in.
- **b) Apply code splitting for route-level components**:
  - `ReservationsView` route is dynamically code-split with `React.lazy()` and Suspense.
  - Configured Rollup `manualChunks` in `vite.config.js`:
    - `vendor-react` (`react`, `react-dom`)
    - `vendor-redux` (`@reduxjs/toolkit`, `react-redux`)
    - `vendor-icons` (`lucide-react`)
    - `vendor-axios` (`axios`)
    - Individual chunks for route views and modals (`BookingModal`, `HotelDetailModal`, `ReservationsView`, `AuthModal`, `ExperimentInspector`).
- **c) Optimize hotel images and API requests**:
  - **Images**: Added `loading="lazy"` and `decoding="async"` attributes across all hotel cards and modal gallery images, reducing initial load bandwidth.
  - **API Requests**: Created `src/services/cacheService.js` with `apiCache`:
    - In-memory cache with configurable 60-second TTL for GET `/api/hotels` and `/api/hotels/:id`.
    - Request deduplication (`apiCache.dedupe`): prevents duplicate concurrent HTTP requests by sharing in-flight promises.
    - Automatic cache invalidation upon reservation creation (`POST`), update (`PUT`), or cancellation (`DELETE`).
- **d) Implement basic PWA functionality**:
  - Created `public/manifest.json` with app name, theme color `#fbbf24`, background color `#0b0f17`, standalone display mode, and responsive icons.
  - Created `public/sw.js` (Service Worker) with cache-first strategy for static assets and network-first with cache fallback for catalog data.
  - Created `src/utils/pwaManager.js` to register the service worker, track online/offline connectivity, and handle the `beforeinstallprompt` event with a 1-click **"Install App (PWA)"** button.
  - Real-time **PWA Online / Offline indicator** in the application header banner.
- **e) Provide keyboard navigation and ARIA labels for booking controls**:
  - Modal accessibility: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-label="Close modal"` on dismiss buttons.
  - Keyboard navigation: Global `Escape` key event listeners on `HotelDetailModal`, `BookingModal`, and `AuthModal` for effortless keyboard dismissal.
  - Real-time price updates announced via `aria-live="polite"`.
  - Accessible form controls: `aria-label="Adults"`, `aria-label="Children"`, `aria-label="Rooms"`, and detailed button labels (`aria-label="Book suite at The Ritz-Carlton Paris"`).
- **f) Apply secure handling of user inputs and authentication information**:
  - Created `src/utils/security.js`:
    - `sanitizeInput(str)`: Strips `<script>`, `<iframe>`, inline `on*` event handlers, and `javascript:` pseudoprotocols to prevent Cross-Site Scripting (XSS).
    - `validateInput(type, value, context)`: Strict RFC email validation, name regex, and chronological date range validation.
    - `maskToken(token)`: Safely displays masked JWT tokens (`eyJhbGci...[MASKED-SECURE-TOKEN]`) to avoid credential leakage.
    - `maskCardNumber(cardNumber)`: PCI-DSS compliant payment card masking (`•••• •••• •••• 4242`).
    - Added security headers and Content Security Policy (CSP) meta tags in `index.html`.

---

## 🛠️ Academic Experiment Lab & Telemetry Inspector

Click the **"Lab Inspector"** button in the top navigation bar to access:
1. **Experiments Matrix**: Real-time status checklist for Experiment 1 (a–f) and Experiment 2 (a–f).
2. **Automated Verification Runner**: Executes an end-to-end 12-step verification suite across all testing and optimization features with live pass badges.
3. **Live REST API Inspector**: Real-time HTTP method badges (`GET`, `POST`, `PUT`, `DELETE`), headers (`Authorization: Bearer`), and cache status (`HIT` / `MISS`).
4. **Redux Middleware Audit**: Intercepted state transitions, chronological date validations, and telemetry events.

---

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx             # Exp 2e/2f: Accessible login modal & XSS sanitization
│   │   ├── BookingModal.jsx          # Exp 1a/1c/1d, 2a/2e: Lazy booking modal, ARIA & pricing engine
│   │   ├── ExperimentInspector.jsx   # Interactive Academic Verification Suite & Telemetry
│   │   ├── FilterSidebar.jsx         # Exp 1b: Search filters, star rating & fault injection
│   │   ├── HeroSearch.jsx            # Exp 1b: Debounced search dock & destination pills
│   │   ├── HotelCard.jsx             # Exp 1a, 2c/2e: Lazy loaded images & ARIA accessible controls
│   │   ├── HotelDetailModal.jsx      # Exp 1a/1c, 2a/2e: Lazy modal, specifications & Escape key
│   │   ├── Navbar.jsx                # Exp 2e/2f: Accessible navigation & masked token display
│   │   ├── ReservationsView.jsx      # Exp 1e, 2b: Code-split CRUD reservations view
│   │   └── ToastContainer.jsx        # Notification toasts
│   ├── services/
│   │   ├── api.js                    # Exp 2c: Axios instance with apiCache & Bearer interceptor
│   │   ├── cacheService.js           # Exp 2c: Request deduplication & TTL memory cache
│   │   ├── mockBackend.js            # Simulated REST API backend
│   │   └── mockData.js               # Luxury hotel catalog, suites & demo profiles
│   ├── store/
│   │   ├── index.js                  # Centralized Redux store configuration
│   │   ├── middleware/
│   │   │   └── bookingMiddleware.js  # Validation & audit middleware
│   │   └── slices/
│   │       ├── authSlice.js          # Authentication state & thunks
│   │       ├── bookingSlice.js       # Exp 1d: Pricing math calculation engine
│   │       ├── hotelsSlice.js        # Catalog state & filter thunks
│   │       ├── inspectorSlice.js     # Verification suite state & telemetry logs
│   │       └── reservationsSlice.js  # Exp 1e: CRUD operations & thunks
│   ├── test/
│   │   ├── BookingModal.test.jsx     # Exp 1a, 1c, 1d, 1e: Booking & guest tests
│   │   ├── costCalculation.test.js   # Exp 1d: Mathematical cost calculation unit tests
│   │   ├── HotelCard.test.jsx        # Exp 1a: Hotel card component tests
│   │   ├── HotelDetailModal.test.jsx # Exp 1a, 1c: Hotel details & room selection tests
│   │   ├── ReservationsView.test.jsx # Exp 1e: Confirmation & cancellation tests
│   │   ├── SearchAndFilter.test.jsx  # Exp 1b: Debounced search & filter tests
│   │   ├── setup.js                  # Jest-dom & polyfill setup
│   │   └── test-utils.jsx            # Redux Provider test render wrapper
│   ├── utils/
│   │   ├── pwaManager.js             # Exp 2d: PWA service worker & install manager
│   │   └── security.js               # Exp 2f: XSS sanitization, validation & token masking
│   ├── App.jsx                       # Exp 2a/2b: React.lazy & Suspense code splitting
│   ├── index.css                     # Ultra-luxury dark-mode CSS design system
│   └── main.jsx                      # React entry point
├── public/
│   ├── manifest.json                 # Exp 2d: Web App Manifest
│   ├── sw.js                         # Exp 2d: Offline caching Service Worker
│   ├── favicon.svg
│   └── icons.svg
├── index.html                        # PWA links & security CSP meta tags
├── package.json                      # Test scripts (npm test) & dependencies
└── vite.config.js                    # Exp 1f, 2b: Vitest/Jest config & Rollup manualChunks
```

---

## 🧪 Automated Test Verification

To execute the entire 27-test suite:
```bash
npm test
```

Expected Output:
```text
 ✓ src/test/costCalculation.test.js (5 tests)
 ✓ src/test/HotelCard.test.jsx (4 tests)
 ✓ src/test/HotelDetailModal.test.jsx (5 tests)
 ✓ src/test/BookingModal.test.jsx (5 tests)
 ✓ src/test/ReservationsView.test.jsx (4 tests)
 ✓ src/test/SearchAndFilter.test.jsx (4 tests)

 Test Files  6 passed (6)
      Tests  27 passed (27)
```
