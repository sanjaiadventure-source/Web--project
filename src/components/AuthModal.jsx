import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  User, 
  Lock, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { loginUser, setDemoAuth, clearAuthSession } from '../store/slices/authSlice';
import { DEMO_USERS } from '../services/mockData';
import { sanitizeInput } from '../utils/security';

export default function AuthModal({ isOpen, onClose, contextMessage }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('praveen@luxehaven.com');
  const [password, setPassword] = useState('password123');

  // EXPERIMENT 2e: Keyboard navigation (Escape key to close modal)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = sanitizeInput(email);
    const result = await dispatch(loginUser({ email: cleanEmail, password }));
    if (loginUser.fulfilled.match(result)) {
      onClose();
    }
  };

  const handleDemoSelect = (demoUser) => {
    dispatch(setDemoAuth({
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        avatar: demoUser.avatar
      },
      token: demoUser.token
    }));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, padding: 32 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: 6 }}>
              EXPERIMENT 4: AUTH & TOKEN MANAGEMENT
            </span>
            <h2 id="auth-modal-title" style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Member Authentication
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: 34, height: 34, padding: 0 }}
            aria-label="Close authentication modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Optional Context Message (Exp 4d Protection) */}
        {contextMessage && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.84rem',
            color: '#fef08a',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Lock size={15} color="#fbbf24" />
            <span>{contextMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Profiles (Convenient for Lab Evaluation) */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
            Quick 1-Click Demo Profiles
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_USERS.map((demo) => (
              <div
                key={demo.id}
                onClick={() => handleDemoSelect(demo)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={demo.avatar}
                    alt={demo.name}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {demo.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {demo.role} · {demo.email}
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} color="#fbbf24" />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Or Sign In With API</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Login Form (Exp 4a) */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. praveen@luxehaven.com"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ color: '#fda4af', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 6 }}
          >
            {loading ? 'Authenticating via POST /api/auth/login...' : 'Sign In & Issue Token (Exp 4a)'}
          </button>
        </form>

        {/* Security Technical Note */}
        <div style={{
          marginTop: 20,
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.74rem',
          color: '#94a3b8',
          lineHeight: 1.5,
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <b>Academic Note (Exp 4b & 4c):</b> Upon login, a JWT token is generated and stored in <code>localStorage</code>. Axios interceptors automatically attach <code>Authorization: Bearer &lt;token&gt;</code> to all subsequent reservation requests.
        </div>
      </div>
    </div>
  );
}
