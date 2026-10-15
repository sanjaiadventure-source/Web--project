import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Star, 
  MapPin, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Bed 
} from 'lucide-react';
import { fetchHotelDetails } from '../store/slices/hotelsSlice';
import { openBookingModal } from '../store/slices/bookingSlice';

export default function HotelCard({ hotel }) {
  const dispatch = useDispatch();

  const handleOpenDetails = () => {
    // Experiment 1d: Fetch individual hotel and room details via API
    dispatch(fetchHotelDetails(hotel.id));
  };

  const handleQuickBook = () => {
    // Experiment 2c: Open booking modal & seed hotel in Redux store
    const firstRoom = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : null;
    dispatch(openBookingModal({ hotel, room: firstRoom }));
  };

  const isSoldOut = hotel.availableRooms === 0;

  return (
    <div style={{
      background: 'rgba(23, 32, 51, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: 'var(--shadow-md)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      e.currentTarget.style.boxShadow = '0 16px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      {/* Featured Image Container */}
      <div style={{ position: 'relative', width: '100%', height: 230, overflow: 'hidden' }}>
        <img
          src={hotel.featuredImage}
          alt={hotel.name}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(11, 15, 23, 0.8) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Rating Badge */}
          <span className="badge badge-gold" style={{ background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(8px)' }}>
            <Star size={12} fill="#fbbf24" color="#fbbf24" />
            {hotel.rating.toFixed(1)} ({hotel.reviewCount})
          </span>

          {/* Availability Status Badge (Exp 1b) */}
          <span className={`badge ${isSoldOut ? 'badge-rose' : 'badge-emerald'}`} style={{ background: 'rgba(11, 15, 23, 0.8)', backdropFilter: 'blur(8px)' }}>
            {isSoldOut ? 'Fully Booked' : `${hotel.availableRooms} Suites Left`}
          </span>
        </div>

        {/* Location Tag */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color: '#cbd5e1',
          fontSize: '0.82rem',
          fontWeight: 500,
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          <MapPin size={13} color="#fbbf24" />
          {hotel.location}
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1, gap: 14 }}>
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: 4,
            lineHeight: 1.3
          }}>
            {hotel.name}
          </h3>
          <p style={{
            fontSize: '0.84rem',
            color: '#94a3b8',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {hotel.tagline}
          </p>
        </div>

        {/* Amenities Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {hotel.amenities.slice(0, 3).map((am, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.74rem',
                color: '#cbd5e1',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}
            >
              {am}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', padding: '3px 4px' }}>
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Price & Action Footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 14,
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
              Starting from
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#fbbf24'
              }}>
                ${hotel.basePrice}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>/ night</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleOpenDetails}
              className="btn btn-secondary btn-sm"
              title="View room details and photo gallery (Exp 1d)"
              aria-label={`View details for ${hotel.name}`}
            >
              <Eye size={15} />
              Details
            </button>

            <button
              onClick={handleQuickBook}
              disabled={isSoldOut}
              className="btn btn-primary btn-sm"
              style={{ opacity: isSoldOut ? 0.4 : 1, cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
              title="Book with Redux state calculation (Exp 2)"
              aria-label={`Book suite at ${hotel.name}`}
            >
              Book
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
