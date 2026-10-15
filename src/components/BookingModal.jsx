import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  Calendar, 
  Users, 
  Tag, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Bed,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  closeBookingModal, 
  setDates, 
  setGuests, 
  setSpecialRequests, 
  applyCoupon, 
  resetBookingDraft 
} from '../store/slices/bookingSlice';
import { createReservation } from '../store/slices/reservationsSlice';
import { sanitizeInput } from '../utils/security';

export default function BookingModal({ openAuthModal, onBookingConfirmed }) {
  const dispatch = useDispatch();
  const { 
    isModalOpen, 
    selectedHotel, 
    selectedRoom, 
    checkInDate, 
    checkOutDate, 
    guests, 
    specialRequests, 
    promoCode, 
    promoApplied, 
    stayDuration, 
    pricing, 
    validationError 
  } = useSelector(state => state.booking);

  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const { actionLoading, error: resError } = useSelector(state => state.reservations);

  const [inputCoupon, setInputCoupon] = useState(promoCode || '');
  const [localNotes, setLocalNotes] = useState(specialRequests || '');

  // EXPERIMENT 2e: Keyboard navigation (Escape key to dismiss modal)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        dispatch(closeBookingModal());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isModalOpen]);

  if (!isModalOpen || !selectedHotel) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeBookingModal());
  };

  const handleDatesChange = (inDate, outDate) => {
    // Experiment 2c & 2e: Dispatches setDates which triggers Redux Middleware validation & storage persistence
    dispatch(setDates({ checkInDate: inDate, checkOutDate: outDate }));
  };

  const handleGuestsChange = (field, value) => {
    dispatch(setGuests({ [field]: Number(value) }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    dispatch(applyCoupon(inputCoupon));
  };

  const handleConfirmReservation = async () => {
    // EXPERIMENT 4d: Route & Action Protection
    if (!isAuthenticated) {
      // Require login, opening AuthModal with callback
      openAuthModal('Please sign in or select a demo account to confirm your reservation and secure your booking token.');
      return;
    }

    // Prepare reservation payload (Experiment 3b: POST /api/reservations)
    const reservationPayload = {
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      hotelLocation: selectedHotel.location,
      hotelImage: selectedHotel.featuredImage,
      roomId: selectedRoom?.id || 'standard-room',
      roomName: selectedRoom?.name || 'Grand Deluxe Room',
      checkInDate,
      checkOutDate,
      nights: stayDuration,
      guests,
      guestName: user?.name || 'Valued Guest',
      guestEmail: user?.email || 'guest@luxehaven.com',
      specialRequests: localNotes,
      pricing: {
        ratePerNight: pricing.ratePerNight,
        roomCost: pricing.roomCost,
        taxes: pricing.taxes,
        serviceFee: pricing.serviceFee,
        discount: pricing.discount,
        totalAmount: pricing.totalAmount
      }
    };

    // EXPERIMENT 3b & 4c: Dispatches createReservation with Bearer token attached
    const actionResult = await dispatch(createReservation(reservationPayload));
    if (createReservation.fulfilled.match(actionResult)) {
      dispatch(resetBookingDraft());
      if (onBookingConfirmed) {
        onBookingConfirmed(actionResult.payload);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose} role="presentation">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 840 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Modal Header */}
        <div style={{
          padding: '22px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-gold">EXPERIMENT 2 & 3</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Redux State & CRUD Operation</span>
            </div>
            <h3 id="booking-modal-title" style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
              Complete Your Luxury Reservation
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: 36, height: 36, padding: 0 }}
            aria-label="Close booking modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
          padding: 28
        }}>
          {/* Left Column: Booking Details Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Selected Hotel & Room Preview */}
            <div style={{
              display: 'flex',
              gap: 14,
              padding: 14,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)'
            }}>
              <img
                src={selectedRoom?.image || selectedHotel.featuredImage}
                alt={selectedHotel.name}
                style={{ width: 85, height: 85, borderRadius: 8, objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
                  {selectedHotel.location}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 2 }}>
                  {selectedHotel.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Bed size={13} color="#94a3b8" />
                  {selectedRoom?.name || 'Grand Suite'} (${pricing.ratePerNight}/night)
                </div>
              </div>
            </div>

            {/* Date Pickers (Exp 2b) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={checkInDate}
                  onChange={(e) => handleDatesChange(e.target.value, checkOutDate)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={checkOutDate}
                  onChange={(e) => handleDatesChange(checkInDate, e.target.value)}
                />
              </div>
            </div>

            {/* Guests & Room Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Adults
                </label>
                <select
                  className="form-select"
                  aria-label="Adults"
                  value={guests.adults}
                  onChange={(e) => handleGuestsChange('adults', e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Adults</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Children
                </label>
                <select
                  className="form-select"
                  aria-label="Children"
                  value={guests.children}
                  onChange={(e) => handleGuestsChange('children', e.target.value)}
                >
                  {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Children</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Rooms
                </label>
                <select
                  className="form-select"
                  aria-label="Rooms"
                  value={guests.roomsCount}
                  onChange={(e) => handleGuestsChange('roomsCount', e.target.value)}
                >
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Rooms</option>)}
                </select>
              </div>
            </div>

            {/* Special Requests (Exp 2b & 2f Sanitization) */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                Special Requests & Preferences
              </label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="e.g. Quiet room on high floor, late check-in at 8 PM, airport chauffeur..."
                value={localNotes}
                onChange={(e) => {
                  const sanitized = sanitizeInput(e.target.value);
                  setLocalNotes(sanitized);
                  dispatch(setSpecialRequests(sanitized));
                }}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Promo Code (try LUXE20 or VIP100)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                style={{ textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                <Tag size={15} /> Apply
              </button>
            </form>

            {validationError && (
              <div style={{ color: '#fda4af', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} /> {validationError}
              </div>
            )}
          </div>

          {/* Right Column: Mathematical Calculation Summary (Exp 2d) */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Price Breakdown
                </h4>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  Auto Calculated (Exp 2d)
                </span>
              </div>

              {/* Breakdown Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Stay Duration:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    {stayDuration} Night{stayDuration > 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>
                    ${pricing.ratePerNight} × {stayDuration} night{stayDuration > 1 ? 's' : ''} × {guests.roomsCount} room:
                  </span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    ${pricing.roomCost.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Resort & Butler Fee:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    ${pricing.serviceFee.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Hospitality Tax & VAT (12%):</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    ${pricing.taxes.toFixed(2)}
                  </span>
                </div>

                {pricing.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                    <span>Promo Discount ({promoCode}):</span>
                    <span>-${pricing.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Calculation Highlight */}
              <div style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
                    Total Estimated Amount
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Inclusive of all taxes & resort fees
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  textShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                }}>
                  ${pricing.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Security & Token Status (Exp 4) */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isAuthenticated ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: isAuthenticated ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
                color: isAuthenticated ? '#6ee7b7' : '#fef08a',
                marginBottom: 14
              }}>
                {isAuthenticated ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>Authenticated as <b>{user?.name}</b> (Token attached via Axios Interceptor)</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Guest checkout: Sign-in required on submission to issue Bearer token</span>
                  </>
                )}
              </div>

              {resError && (
                <div style={{
                  color: '#fda4af',
                  fontSize: '0.82rem',
                  marginBottom: 10,
                  background: 'rgba(244, 63, 94, 0.1)',
                  padding: '8px 12px',
                  borderRadius: 6
                }}>
                  {resError}
                </div>
              )}

              {/* Submission Action */}
              <button
                onClick={handleConfirmReservation}
                disabled={actionLoading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: 8 }}
              >
                {actionLoading ? (
                  'Processing POST /api/reservations...'
                ) : isAuthenticated ? (
                  <>
                    <CheckCircle2 size={18} />
                    Confirm & Reserve Suite (POST)
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Sign In & Confirm Reservation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
