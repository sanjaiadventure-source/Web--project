import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  Sparkles, 
  AlertCircle, 
  RotateCcw, 
  Terminal, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import FilterSidebar from './components/FilterSidebar';
import HotelCard from './components/HotelCard';
import ToastContainer from './components/ToastContainer';
import { pwaManager } from './utils/pwaManager';

// EXPERIMENT 2a & 2b: Code Splitting & Lazy Loading of Route & Modal Components
const HotelDetailModal = React.lazy(() => import('./components/HotelDetailModal'));
const BookingModal = React.lazy(() => import('./components/BookingModal'));
const ReservationsView = React.lazy(() => import('./components/ReservationsView'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const ExperimentInspector = React.lazy(() => import('./components/ExperimentInspector'));

// Shimmering fallback during chunk resolution (Exp 2a)
const ChunkLoadingFallback = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(11, 15, 23, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'rgba(23, 32, 51, 0.95)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      borderRadius: 'var(--radius-lg)',
      padding: '28px 36px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-xl)'
    }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto 14px' }} />
      <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
        Loading Component Chunk...
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
        React.lazy & Suspense Code-Splitting Active (Exp 2a/2b)
      </div>
    </div>
  </div>
);

import { fetchHotels, setFilters, resetFilters } from './store/slices/hotelsSlice';
import { fetchReservations } from './store/slices/reservationsSlice';
import { triggerSessionExpired } from './store/slices/authSlice';
import { toggleInspector } from './store/slices/inspectorSlice';

export default function App() {
  const dispatch = useDispatch();

  // Redux state
  const { items: hotels, loading: hotelsLoading, error: hotelsError, filters } = useSelector(state => state.hotels);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Local View States
  const [currentView, setCurrentView] = useState('explore'); // 'explore' | 'reservations'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authContextMessage, setAuthContextMessage] = useState('');
  const [pwaState, setPwaState] = useState(pwaManager.getState());

  // EXPERIMENT 2d: Subscribe to PWA online/offline & install prompt state
  useEffect(() => {
    return pwaManager.subscribe((state) => {
      setPwaState(state);
    });
  }, []);

  // Initial Fetch: Hotels (Exp 1a)
  useEffect(() => {
    dispatch(fetchHotels(filters));
  }, [dispatch]);

  // Initial Fetch: Reservations if authenticated (Exp 3e & 4c)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchReservations());
    }
  }, [dispatch, isAuthenticated]);

  // EXPERIMENT 4f: Listen for 401 Unauthorized token expired event from Axios Interceptor
  useEffect(() => {
    const handleTokenExpired = (e) => {
      dispatch(triggerSessionExpired(e.detail?.message));
    };

    window.addEventListener('luxehaven:token_expired', handleTokenExpired);
    return () => {
      window.removeEventListener('luxehaven:token_expired', handleTokenExpired);
    };
  }, [dispatch]);

  const openAuthModal = (message = '') => {
    setAuthContextMessage(message);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthContextMessage('');
  };

  const handleBookingConfirmed = () => {
    // Navigate smoothly to reservations view
    setCurrentView('reservations');
  };

  const handleClearAllFilters = () => {
    dispatch(resetFilters());
    dispatch(fetchHotels({
      search: '',
      location: 'all',
      minPrice: 0,
      maxPrice: 2000,
      rating: 0,
      amenity: 'all',
      onlyAvailable: false,
      sortBy: 'recommended'
    }));
  };

  const handleSearchWorldwide = () => {
    dispatch(setFilters({ location: 'all' }));
    dispatch(fetchHotels({ ...filters, location: 'all' }));
  };

  // Sort hotels according to selected sort criteria
  const sortedHotels = [...hotels].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (filters.sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'recommended'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner for Academic Scenario */}
      <div style={{
        background: 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '6px 16px',
        fontSize: '0.78rem',
        color: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontWeight: 700 }}>
          <Sparkles size={13} /> Scenario 4: Hotel Room Booking Web Application
        </span>
        <span style={{ color: '#64748b' }}>|</span>
        <span style={{ color: '#cbd5e1' }}>
          Exp 1: Component Testing (Jest & RTL) · Exp 2: Performance, Code Splitting, PWA & Security
        </span>

        {/* PWA Offline / Online Status Indicator (Exp 2d) */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: pwaState.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.2)',
          color: pwaState.isOnline ? '#34d399' : '#f87171',
          border: `1px solid ${pwaState.isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.4)'}`,
          fontWeight: 600,
          fontSize: '0.72rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: pwaState.isOnline ? '#10b981' : '#f43f5e' }} />
          {pwaState.isOnline ? 'PWA Online (SW Active)' : 'PWA Offline Mode (Cached Data)'}
        </span>

        {pwaState.isInstallable && (
          <button
            onClick={() => pwaManager.promptInstall()}
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              border: 'none',
              color: '#0b0f19',
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ⚡ Install App (PWA)
          </button>
        )}

        <button
          onClick={() => dispatch(toggleInspector())}
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: '0.72rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Open Lab Verification Runner ↗
        </button>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={() => openAuthModal('Sign in to manage bookings and secure your JWT token.')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'explore' ? (
          <>
            {/* Hero & Search Header */}
            <HeroSearch />

            {/* Hotel Catalog Section */}
            <section style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px 60px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 310px) 1fr',
                gap: 28,
                alignItems: 'start'
              }} className="explore-grid">
                {/* Left Sidebar: Filter Controls */}
                <FilterSidebar />

                {/* Right Content: Hotels Results */}
                <div>
                  {/* Results Count & Active Filters Summary */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                    padding: '12px 18px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Showing <b style={{ color: '#fbbf24' }}>{sortedHotels.length}</b> luxury destination{sortedHotels.length !== 1 ? 's' : ''}
                      {filters.location !== 'all' && (
                        <span> in <b>{filters.location}</b></span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      REST API: <code>GET /api/hotels</code> (Exp 1)
                    </div>
                  </div>

                  {/* Loading State: Skeletons (Exp 1f) */}
                  {hotelsLoading && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: 24
                    }}>
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          style={{
                            height: 380,
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(23, 32, 51, 0.5)',
                            padding: 16
                          }}
                        >
                          <div className="skeleton" style={{ height: 200, borderRadius: 12, marginBottom: 16 }} />
                          <div className="skeleton" style={{ height: 24, width: '70%', marginBottom: 10 }} />
                          <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 20 }} />
                          <div className="skeleton" style={{ height: 36, width: '100%', borderRadius: 8 }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error State with Retry (Exp 1f) */}
                  {hotelsError && !hotelsLoading && (
                    <div style={{
                      background: 'rgba(244, 63, 94, 0.08)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '40px 24px',
                      textAlign: 'center'
                    }}>
                      <AlertCircle size={40} color="#fb7185" style={{ marginBottom: 12 }} />
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 6 }}>
                        API Request Failed (Simulated or Network Error)
                      </h3>
                      <p style={{ color: '#fda4af', maxWidth: 450, margin: '0 auto 20px', fontSize: '0.9rem' }}>
                        {hotelsError}
                      </p>
                      <button
                        onClick={() => dispatch(fetchHotels(filters))}
                        className="btn btn-primary btn-sm"
                        style={{ gap: 6 }}
                      >
                        <RotateCcw size={14} /> Retry GET /api/hotels
                      </button>
                    </div>
                  )}

                  {/* Empty Search Results */}
                  {!hotelsLoading && !hotelsError && sortedHotels.length === 0 && (
                    <div className="glass-panel" style={{ padding: '50px 24px', textAlign: 'center' }}>
                      <Building2 size={44} color="#fbbf24" style={{ marginBottom: 14, opacity: 0.8 }} />
                      <h3 style={{ fontSize: '1.35rem', marginBottom: 8, fontWeight: 700 }}>
                        No Luxury Properties Found
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
                        {filters.search && filters.location !== 'all' ? (
                          <>
                            You searched for <b>"{filters.search}"</b> specifically in <b>"{filters.location}"</b>. This hotel might be in another destination (e.g. The Ritz-Carlton is in <b>Paris, France</b>).
                          </>
                        ) : (
                          'No hotels match the current search keyword, price range, or amenities. Try relaxing your filters or resetting search.'
                        )}
                      </p>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {filters.location !== 'all' && (
                          <button
                            onClick={handleSearchWorldwide}
                            className="btn btn-primary btn-sm"
                            style={{ gap: 6 }}
                          >
                            <Sparkles size={14} /> Search Worldwide (All Destinations)
                          </button>
                        )}
                        <button
                          onClick={handleClearAllFilters}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: 6 }}
                        >
                          <RotateCcw size={14} /> Reset All Filters & Search
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hotel Cards Grid (Exp 1b & 1c) */}
                  {!hotelsLoading && !hotelsError && sortedHotels.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: 24
                    }}>
                      {sortedHotels.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Reservations View (Exp 2b: Code-Split Route) */
          <React.Suspense fallback={
            <div style={{ maxWidth: 1240, margin: '40px auto', padding: '0 24px' }}>
              <div className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)', marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />
            </div>
          }>
            <ReservationsView openAuthModal={openAuthModal} />
          </React.Suspense>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#090d16',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '36px 24px',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: '#94a3b8'
      }}>
        <div style={{
          maxWidth: 1360,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
                LUXE<span style={{ color: '#fbbf24' }}>HAVEN</span>
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                EXPERIMENT VERIFIED
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem' }}>
              Full-Stack Hotel Booking Application Architecture · React + Redux Toolkit + Axios REST Suite
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              onClick={() => dispatch(toggleInspector())}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6 }}
            >
              <Terminal size={14} color="#fbbf24" />
              Open Lab Inspector
            </button>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Built for Laboratory & Academic Demonstration
            </span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals (Exp 2a: React.lazy & Suspense Code Splitting) */}
      <React.Suspense fallback={<ChunkLoadingFallback />}>
        <HotelDetailModal />
        <BookingModal
          openAuthModal={openAuthModal}
          onBookingConfirmed={handleBookingConfirmed}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          contextMessage={authContextMessage}
        />
        <ExperimentInspector />
      </React.Suspense>
      <ToastContainer />

      {/* Responsive Media Query Helper */}
      <style>{`
        @media (max-width: 900px) {
          .explore-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
