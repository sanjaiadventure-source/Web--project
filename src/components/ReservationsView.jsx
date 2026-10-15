import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CalendarCheck, 
  MapPin, 
  Calendar, 
  Users, 
  Edit3, 
  Trash2, 
  Printer, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  fetchReservations, 
  updateReservation, 
  cancelReservation, 
  setEditingReservation, 
  closeEditModal 
} from '../store/slices/reservationsSlice';
import { calculatePricing } from '../store/slices/bookingSlice';

export default function ReservationsView({ openAuthModal }) {
  const dispatch = useDispatch();
  const { items: reservations, loading, actionLoading, error, editingReservation, isEditModalOpen } = useSelector(state => state.reservations);
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'canceled'
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Edit Modal Local State
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editAdults, setEditAdults] = useState(2);
  const [editRooms, setEditRooms] = useState(1);
  const [editNotes, setEditNotes] = useState('');

  // Initial load when authenticated (Exp 3e & 4c)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchReservations());
    }
  }, [isAuthenticated]);

  // Sync edit modal state when editingReservation changes
  useEffect(() => {
    if (editingReservation) {
      setEditCheckIn(editingReservation.checkInDate || '');
      setEditCheckOut(editingReservation.checkOutDate || '');
      setEditAdults(editingReservation.guests?.adults || 2);
      setEditRooms(editingReservation.guests?.roomsCount || 1);
      setEditNotes(editingReservation.specialRequests || '');
    }
  }, [editingReservation]);

  // Handle Edit Submission (Experiment 3c: PUT/PATCH)
  const handleSaveEdit = () => {
    if (!editingReservation) return;

    // Recalculate duration & pricing
    const newPricing = calculatePricing({
      ratePerNight: editingReservation.pricing?.ratePerNight || 500,
      checkInDate: editCheckIn,
      checkOutDate: editCheckOut,
      roomsCount: editRooms,
      discountAmount: editingReservation.pricing?.discount || 0
    });

    const updatePayload = {
      checkInDate: editCheckIn,
      checkOutDate: editCheckOut,
      nights: newPricing.nights,
      guests: {
        ...editingReservation.guests,
        adults: editAdults,
        roomsCount: editRooms
      },
      specialRequests: editNotes,
      pricing: {
        ...editingReservation.pricing,
        ...newPricing
      },
      status: 'MODIFIED'
    };

    dispatch(updateReservation({
      reservationId: editingReservation.id,
      updateData: updatePayload
    }));
  };

  // Handle Cancel Submission (Experiment 3d: DELETE)
  const handleCancelBooking = (id, bookingCode) => {
    if (window.confirm(`Are you sure you want to cancel reservation ${bookingCode}? Full refund will be credited under our 24h luxury policy.`)) {
      dispatch(cancelReservation(id));
    }
  };

  // Filter reservations by tab
  const filteredReservations = reservations.filter(r => {
    if (activeTab === 'confirmed') return r.status === 'CONFIRMED' || r.status === 'MODIFIED';
    if (activeTab === 'canceled') return r.status === 'CANCELED';
    return true;
  });

  // Guard: If not authenticated, display protected screen (Exp 4d)
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '50px 30px' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={28} color="#fbbf24" />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: 12 }}>
            EXPERIMENT 4d: PROTECTED API OPERATION
          </span>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10 }}>
            Authentication Required to Access Reservations
          </h2>

          <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
            In accordance with Experiment 4, the <code>GET /api/reservations</code> endpoint requires a valid Bearer token attached to the request headers. Please sign in to verify.
          </p>

          <button
            onClick={() => openAuthModal('Sign in to attach your Bearer token and retrieve reservation history.')}
            className="btn btn-primary btn-lg"
            style={{ gap: 8 }}
          >
            <ShieldCheck size={18} />
            Sign In / Quick Demo Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1240, margin: '30px auto', padding: '0 24px 60px' }}>
      {/* View Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 30
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-gold">EXPERIMENT 3: CRUD OPERATIONS</span>
            <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> Bearer Token Attached (Exp 4c)
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            My Hotel Reservations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: 4 }}>
            Manage active bookings, edit travel dates (PUT/PATCH), cancel reservations (DELETE), or view official receipts.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: 4
        }}>
          {['all', 'confirmed', 'canceled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab ? 700 : 500,
                background: activeTab === tab ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
                color: activeTab === tab ? '#0b0f19' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.18s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State (Exp 3f) */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map(n => (
            <div key={n} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      )}

      {/* Error State (Exp 3f) */}
      {error && !loading && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 20,
          textAlign: 'center',
          marginBottom: 20
        }}>
          <p style={{ color: '#fda4af', fontWeight: 600, marginBottom: 10 }}>
            {error}
          </p>
          <button
            onClick={() => dispatch(fetchReservations())}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} /> Retry GET /api/reservations
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReservations.length === 0 && !error && (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <CalendarCheck size={48} color="#94a3b8" style={{ marginBottom: 16, opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
            No Reservations Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 20px' }}>
            {activeTab === 'all' 
              ? 'You have not booked any stays yet. Explore our premier hotel collection to make a reservation.'
              : `You have no ${activeTab} reservations.`}
          </p>
        </div>
      )}

      {/* Reservations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredReservations.map((res) => {
          const isCanceled = res.status === 'CANCELED';
          const isModified = res.status === 'MODIFIED';

          return (
            <div
              key={res.id}
              style={{
                background: 'rgba(23, 32, 51, 0.8)',
                backdropFilter: 'blur(16px)',
                border: isCanceled 
                  ? '1px solid rgba(244, 63, 94, 0.25)' 
                  : isModified 
                  ? '1px solid rgba(168, 85, 247, 0.3)' 
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                display: 'grid',
                gridTemplateColumns: '170px 1fr auto',
                gap: 24,
                alignItems: 'center',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}
            >
              {/* Hotel Thumbnail */}
              <div style={{ position: 'relative', height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                  src={res.hotelImage}
                  alt={res.hotelName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8
                }}>
                  <span className={`badge ${isCanceled ? 'badge-rose' : isModified ? 'badge-purple' : 'badge-emerald'}`} style={{ fontSize: '0.68rem' }}>
                    {res.status}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.04em' }}>
                    REF: {res.bookingCode}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Booked by {res.guestName}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>
                  {res.hotelName}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.86rem', color: '#cbd5e1', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={14} color="#fbbf24" />
                    {res.hotelLocation}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={14} color="#fbbf24" />
                    {res.checkInDate} → {res.checkOutDate} ({res.nights} Nights)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Users size={14} color="#fbbf24" />
                    {res.guests?.adults} Adults · {res.guests?.roomsCount} Room
                  </span>
                </div>

                {res.specialRequests && (
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <b>Special Notes:</b> {res.specialRequests}
                  </div>
                )}
              </div>

              {/* Price & Actions (CRUD operations c, d) */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Total Charged
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isCanceled ? '#94a3b8' : '#fbbf24', textDecoration: isCanceled ? 'line-through' : 'none' }}>
                    ${res.pricing?.totalAmount?.toFixed(2)}
                  </div>
                  {isCanceled && (
                    <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
                      Refund Processed
                    </span>
                  )}
                </div>

                {/* CRUD Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setSelectedVoucher(res)}
                    className="btn btn-secondary btn-sm"
                    title="View & Print Reservation Voucher"
                  >
                    <Printer size={14} /> Voucher
                  </button>

                  {!isCanceled && (
                    <>
                      <button
                        onClick={() => dispatch(setEditingReservation(res))}
                        className="btn btn-secondary btn-sm"
                        title="Update Reservation Dates & Guests (PUT/PATCH - Exp 3c)"
                      >
                        <Edit3 size={14} /> Edit (PUT)
                      </button>

                      <button
                        onClick={() => handleCancelBooking(res.id, res.bookingCode)}
                        className="btn btn-danger btn-sm"
                        disabled={actionLoading}
                        title="Cancel Reservation (DELETE - Exp 3d)"
                      >
                        <Trash2 size={14} /> Cancel (DELETE)
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPERIMENT 3c: Edit Reservation Modal (PUT/PATCH) */}
      {isEditModalOpen && editingReservation && (
        <div className="modal-overlay" onClick={() => dispatch(closeEditModal())}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: 4 }}>
                  EXPERIMENT 3c: UPDATE RESERVATION (PUT)
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Modify Reservation: {editingReservation.bookingCode}
                </h3>
              </div>
              <button onClick={() => dispatch(closeEditModal())} className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    New Check-in Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    New Check-out Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Adult Guests
                  </label>
                  <select
                    className="form-select"
                    value={editAdults}
                    onChange={(e) => setEditAdults(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Rooms Count
                  </label>
                  <select
                    className="form-select"
                    value={editRooms}
                    onChange={(e) => setEditRooms(Number(e.target.value))}
                  >
                    {[1, 2, 3].map(n => <option key={n} value={n}>{n} Rooms</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Special Request Notes
                </label>
                <textarea
                  className="form-input"
                  rows="2"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: '#cbd5e1'
              }}>
                Recalculates stay duration and total cost automatically according to nightly rate.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => dispatch(closeEditModal())}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={actionLoading}
                  className="btn btn-primary"
                >
                  {actionLoading ? 'Saving via PUT...' : 'Save Changes (PUT)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Voucher / Receipt Modal */}
      {selectedVoucher && (
        <div className="modal-overlay" onClick={() => setSelectedVoucher(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620, padding: 32 }}>
            <div style={{ borderBottom: '2px solid #fbbf24', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  LUXE<span style={{ color: '#fbbf24' }}>HAVEN</span>
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Official Hotel Reservation Voucher & Tax Invoice
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Booking Ref</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                  {selectedVoucher.bookingCode}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.9rem', marginBottom: 24 }}>
              <div><b>Hotel:</b> {selectedVoucher.hotelName} ({selectedVoucher.hotelLocation})</div>
              <div><b>Room Category:</b> {selectedVoucher.roomName}</div>
              <div><b>Guest Name:</b> {selectedVoucher.guestName} ({selectedVoucher.guestEmail})</div>
              <div><b>Dates:</b> {selectedVoucher.checkInDate} to {selectedVoucher.checkOutDate} ({selectedVoucher.nights} nights)</div>
              <div><b>Guests:</b> {selectedVoucher.guests?.adults} Adults · {selectedVoucher.guests?.roomsCount} Room</div>
              <div><b>Status:</b> <span style={{ color: '#10b981', fontWeight: 700 }}>{selectedVoucher.status}</span></div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginTop: 8
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Room Cost:</span>
                  <span>${selectedVoucher.pricing?.roomCost?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Resort & Service Fee:</span>
                  <span>${selectedVoucher.pricing?.serviceFee?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Hospitality Tax & VAT (12%):</span>
                  <span>${selectedVoucher.pricing?.taxes?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 6, fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem' }}>
                  <span>Total Amount Paid:</span>
                  <span>${selectedVoucher.pricing?.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Printer size={15} /> Print Document
              </button>
              <button onClick={() => setSelectedVoucher(null)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
