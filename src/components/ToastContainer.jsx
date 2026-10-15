import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, AlertCircle, X, ShieldAlert, Sparkles } from 'lucide-react';
import { clearReservationFeedback } from '../store/slices/reservationsSlice';
import { dismissSessionNotice } from '../store/slices/authSlice';

export default function ToastContainer() {
  const dispatch = useDispatch();
  const { successMessage: resSuccess, error: resError } = useSelector(state => state.reservations);
  const { sessionExpiredNotice, sessionExpiredMessage } = useSelector(state => state.auth);
  const { error: hotelError } = useSelector(state => state.hotels);

  // Auto-dismiss reservation success
  useEffect(() => {
    if (resSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearReservationFeedback());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resSuccess, dispatch]);

  if (!resSuccess && !resError && !sessionExpiredNotice && !hotelError) {
    return null;
  }

  return (
    <div className="toast-fixed-container">
      {/* Reservation Success Toast */}
      {resSuccess && (
        <div className="toast-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: '#064e3b' }}>
          <CheckCircle2 size={22} color="#34d399" />
          <div style={{ flex: 1, fontSize: '0.88rem', color: '#ecfdf5', fontWeight: 500 }}>
            {resSuccess}
          </div>
          <button
            onClick={() => dispatch(clearReservationFeedback())}
            style={{ background: 'transparent', border: 'none', color: '#ecfdf5', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Session Expired / 401 Notice (Experiment 4f) */}
      {sessionExpiredNotice && (
        <div className="toast-card" style={{ borderColor: 'rgba(244, 63, 94, 0.5)', background: '#4c0519' }}>
          <ShieldAlert size={22} color="#fb7185" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              Experiment 4f: 401 Unauthorized Handled
            </div>
            <div style={{ fontSize: '0.78rem', color: '#fda4af' }}>
              {sessionExpiredMessage}
            </div>
          </div>
          <button
            onClick={() => dispatch(dismissSessionNotice())}
            style={{ background: 'transparent', border: 'none', color: '#fda4af', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Reservation Error */}
      {resError && (
        <div className="toast-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', background: '#4c0519' }}>
          <AlertCircle size={22} color="#fb7185" />
          <div style={{ flex: 1, fontSize: '0.86rem', color: '#ffe4e6' }}>
            {resError}
          </div>
          <button
            onClick={() => dispatch(clearReservationFeedback())}
            style={{ background: 'transparent', border: 'none', color: '#ffe4e6', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hotels Fetch Error */}
      {hotelError && (
        <div className="toast-card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)', background: '#451a03' }}>
          <AlertCircle size={22} color="#fbbf24" />
          <div style={{ flex: 1, fontSize: '0.86rem', color: '#fef3c7' }}>
            {hotelError}
          </div>
        </div>
      )}
    </div>
  );
}
