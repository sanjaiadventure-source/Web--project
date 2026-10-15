import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  MapPin, 
  Star, 
  Sparkles, 
  Check, 
  Bed, 
  Maximize2, 
  Users, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck 
} from 'lucide-react';
import { clearSelectedHotel, fetchHotelDetails } from '../store/slices/hotelsSlice';
import { openBookingModal } from '../store/slices/bookingSlice';

export default function HotelDetailModal() {
  const dispatch = useDispatch();
  const { selectedHotel, detailsLoading, detailsError } = useSelector(state => state.hotels);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedHotel && !detailsLoading && !detailsError) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearSelectedHotel());
  };

  const handleBookRoom = (room) => {
    dispatch(openBookingModal({ hotel: selectedHotel, room }));
  };

  // EXPERIMENT 2e: Keyboard navigation (Escape key to close modal)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="modal-overlay" onClick={handleClose} role="presentation">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 940, maxHeight: '92vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotel-detail-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close hotel details"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 20,
            background: 'rgba(11, 15, 23, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f43f5e'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(11, 15, 23, 0.75)'}
        >
          <X size={20} />
        </button>

        {/* Loading State (Exp 1f) */}
        {detailsLoading && (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 320, width: '100%', marginBottom: 24, borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 32, width: '60%', margin: '0 auto 16px' }} />
            <div className="skeleton" style={{ height: 20, width: '40%', margin: '0 auto 28px' }} />
            <p style={{ color: '#fbbf24', fontWeight: 600 }}>
              Fetching individual hotel and room specifications via REST API...
            </p>
          </div>
        )}

        {/* Error State (Exp 1f) */}
        {detailsError && !detailsLoading && (
          <div style={{ padding: '50px 30px', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              maxWidth: 500,
              margin: '0 auto'
            }}>
              <h3 style={{ color: '#fda4af', marginBottom: 8 }}>API Fetch Error</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: 18 }}>
                {detailsError}
              </p>
              <button
                onClick={() => dispatch(fetchHotelDetails(selectedHotel?.id || 'hotel-1'))}
                className="btn btn-primary btn-sm"
              >
                <RotateCcw size={14} /> Retry API Request
              </button>
            </div>
          </div>
        )}

        {/* Content Loaded */}
        {selectedHotel && !detailsLoading && (
          <div>
            {/* Gallery Header */}
            <div style={{ position: 'relative', height: 360, width: '100%', background: '#0b0f19' }}>
              <img
                src={selectedHotel.images ? selectedHotel.images[activeImageIndex] : selectedHotel.featuredImage}
                alt={selectedHotel.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(17, 24, 39, 0.95) 100%)'
              }} />

              {/* Badges on Image */}
              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 24,
                right: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-gold">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      {selectedHotel.rating} Stars ({selectedHotel.reviewCount} Reviews)
                    </span>
                    <span className="badge badge-emerald">
                      {selectedHotel.availableRooms} Suites Available
                    </span>
                  </div>
                  <h2 id="hotel-detail-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff' }}>
                    {selectedHotel.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontSize: '0.88rem', marginTop: 4 }}>
                    <MapPin size={15} color="#fbbf24" />
                    <span>{selectedHotel.address || selectedHotel.location}</span>
                  </div>
                </div>

                {/* Thumbnail strip */}
                {selectedHotel.images && selectedHotel.images.length > 1 && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selectedHotel.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Thumbnail"
                        onClick={() => setActiveImageIndex(idx)}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: activeImageIndex === idx ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.3)',
                          opacity: activeImageIndex === idx ? 1 : 0.65,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Description */}
              <div>
                <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em', marginBottom: 8 }}>
                  About the Property
                </h4>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.94rem' }}>
                  {selectedHotel.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Featured Hotel Amenities
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 10
                }}>
                  {selectedHotel.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.86rem',
                        color: '#f1f5f9',
                        border: '1px solid rgba(255, 255, 255, 0.07)'
                      }}
                    >
                      <Sparkles size={14} color="#fbbf24" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXPERIMENT 1d: Individual Room Types & Pricing */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                      Available Suites & Room Types
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      Experiment 1d: Real-time room specifications fetched from API
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedHotel.rooms?.map((room) => (
                    <div
                      key={room.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: 18,
                        display: 'grid',
                        gridTemplateColumns: '190px 1fr auto',
                        gap: 20,
                        alignItems: 'center'
                      }}
                    >
                      {/* Room Image */}
                      <img
                        src={room.image}
                        alt={room.name}
                        style={{
                          width: '100%',
                          height: 125,
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover'
                        }}
                      />

                      {/* Room Specs */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                            {room.type}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                            {room.availableCount} available
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
                          {room.name}
                        </h4>

                        {/* Specs Badges */}
                        <div style={{ display: 'flex', gap: 14, color: '#94a3b8', fontSize: '0.82rem', marginBottom: 8 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Bed size={14} color="#fbbf24" /> {room.bedType}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Maximize2 size={14} color="#fbbf24" /> {room.sizeSqFt} sq ft
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Users size={14} color="#fbbf24" /> Up to {room.maxGuests} guests
                          </span>
                        </div>

                        {/* Features list */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {room.features.slice(0, 3).map((f, i) => (
                            <span key={i} style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>
                              • {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Selection */}
                      <div style={{ textAlign: 'right', minWidth: 150 }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                          Nightly Rate
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                          ${room.pricePerNight}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: 10 }}>
                          Excl. 12% tax & fees
                        </div>
                        <button
                          onClick={() => handleBookRoom(room)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', gap: 6 }}
                          aria-label={`Select suite ${room.name}`}
                        >
                          Select Suite
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
