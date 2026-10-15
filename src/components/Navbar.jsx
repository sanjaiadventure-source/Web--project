import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  CalendarCheck, 
  Terminal, 
  User, 
  LogOut, 
  KeyRound, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice';
import { toggleInspector } from '../store/slices/inspectorSlice';

export default function Navbar({ currentView, setCurrentView, openAuthModal }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const { items: reservations } = useSelector(state => state.reservations);
  const { isOpen: isInspectorOpen } = useSelector(state => state.inspector);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const activeReservationsCount = reservations.filter(r => r.status !== 'CANCELED').length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'rgba(11, 15, 23, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: 1360,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('explore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
          }}>
            <Building2 size={24} color="#0b0f19" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                LUXE<span style={{ color: '#fbbf24' }}>HAVEN</span>
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>
                HOTEL LAB
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Grand Resort & Room Booking Architecture
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'none', gap: 8, alignItems: 'center' }} className="desktop-nav">
          <button
            onClick={() => setCurrentView('explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              border: currentView === 'explore' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              background: currentView === 'explore' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentView === 'explore' ? '#fbbf24' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={18} />
            Explore Hotels
          </button>

          <button
            onClick={() => setCurrentView('reservations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              border: currentView === 'reservations' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              background: currentView === 'reservations' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: currentView === 'reservations' ? '#fbbf24' : '#94a3b8',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <CalendarCheck size={18} />
            My Reservations
            {activeReservationsCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#0b0f19',
                fontSize: '0.72rem',
                fontWeight: 800,
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {activeReservationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile Navigation Pills */}
          <div style={{ display: 'flex', gap: 6 }} className="mobile-nav-toggle">
            <button
              onClick={() => setCurrentView('explore')}
              style={{
                background: currentView === 'explore' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: currentView === 'explore' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                color: currentView === 'explore' ? '#fbbf24' : '#cbd5e1',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Explore
            </button>
            <button
              onClick={() => setCurrentView('reservations')}
              style={{
                background: currentView === 'reservations' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: currentView === 'reservations' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                color: currentView === 'reservations' ? '#fbbf24' : '#cbd5e1',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Bookings
              {activeReservationsCount > 0 && (
                <span style={{
                  background: '#f59e0b',
                  color: '#0b0f19',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeReservationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Experiment Lab Inspector Toggle */}
          <button
            onClick={() => dispatch(toggleInspector())}
            aria-label="Toggle Experiment Lab Inspector & Verification Suite"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: isInspectorOpen ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'rgba(30, 41, 59, 0.8)',
              color: isInspectorOpen ? '#0b0f19' : '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: isInspectorOpen ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
            title="Open Experiment Lab Verification & Live API / Redux Inspector"
          >
            <Terminal size={16} />
            <span className="lab-btn-text">Lab Inspector</span>
            <span className="badge badge-gold" style={{ 
              fontSize: '0.65rem', 
              padding: '1px 6px',
              background: isInspectorOpen ? '#0b0f19' : 'rgba(245, 158, 11, 0.2)',
              color: isInspectorOpen ? '#fbbf24' : '#fef08a'
            }}>
              Exp 1 & 2
            </span>
          </button>

          {/* Authentication Badge & Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={user?.name || "User"}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #fbbf24'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {user?.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <ShieldCheck size={11} /> Token Active (Secured)
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout (Experiment 4e)"
                aria-label="Log out of account"
                style={{ padding: '7px 12px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="btn btn-primary btn-sm"
              style={{ gap: 7 }}
            >
              <KeyRound size={16} />
              Sign In / Auth
            </button>
          )}
        </div>
      </div>

      {/* Subnav for Desktop & Mobile queries */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 540px) {
          .lab-btn-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
