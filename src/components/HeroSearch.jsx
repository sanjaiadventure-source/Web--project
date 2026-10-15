import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Filter, 
  ChevronDown 
} from 'lucide-react';
import { fetchHotels, setFilters } from '../store/slices/hotelsSlice';
import { setDates, setGuests } from '../store/slices/bookingSlice';

const POPULAR_LOCATIONS = ['All', 'Paris', 'Maldives', 'New York', 'Kyoto', 'Dubai', 'Zermatt'];

export default function HeroSearch() {
  const dispatch = useDispatch();
  const { filters, loading } = useSelector(state => state.hotels);
  const { checkInDate, checkOutDate, guests } = useSelector(state => state.booking);

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showGuestMenu, setShowGuestMenu] = useState(false);

  // Sync localSearch when Redux filters.search is changed externally (e.g., Reset Filters)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  // Debounced search for API calls (Experiment 1c & 1e)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setFilters({ search: localSearch }));
        dispatch(fetchHotels({ ...filters, search: localSearch }));
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [localSearch]);

  const handleLocationClick = (loc) => {
    const locationVal = loc === 'All' ? 'all' : loc;
    dispatch(setFilters({ location: locationVal }));
    dispatch(fetchHotels({ ...filters, location: locationVal }));
  };

  const handleDatesChange = (inDate, outDate) => {
    dispatch(setDates({ checkInDate: inDate, checkOutDate: outDate }));
  };

  const handleGuestsUpdate = (type, delta) => {
    const updated = Math.max(1, (guests[type] || 1) + delta);
    dispatch(setGuests({ [type]: updated }));
  };

  return (
    <section style={{
      position: 'relative',
      padding: '50px 24px 35px',
      maxWidth: 1360,
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* Hero Badge */}
      <div style={{ display: 'inline-flex', marginBottom: 16 }}>
        <span className="badge badge-gold" style={{ padding: '6px 16px', fontSize: '0.82rem', gap: 7 }}>
          <Sparkles size={14} /> Full-Stack REST API & Redux State Demonstration
        </span>
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
        lineHeight: 1.15,
        marginBottom: 14,
        fontWeight: 800
      }}>
        Reserve Extraordinary Escapes <br />
        <span className="gold-gradient-text">Crafted for Discerning Travelers</span>
      </h1>

      <p style={{
        fontSize: '1.08rem',
        color: '#94a3b8',
        maxWidth: 720,
        margin: '0 auto 36px',
        lineHeight: 1.6
      }}>
        Explore verified luxury hotels with real-time REST API fetching, reactive Redux Toolkit state calculations, Bearer token authentication, and instant CRUD reservations.
      </p>

      {/* Luxury Search Dock Bar */}
      <div style={{
        background: 'rgba(23, 32, 51, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px 20px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto',
        gap: 16,
        alignItems: 'center',
        textAlign: 'left'
      }}>
        {/* Search Field */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Search size={13} color="#fbbf24" /> Search Hotel / City
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ritz-Carlton, Paris, Maldives..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ paddingLeft: 14, height: 44, fontSize: '0.92rem' }}
          />
        </div>

        {/* Location Dropdown */}
        <div>
          <label style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <MapPin size={13} color="#fbbf24" /> Destination
          </label>
          <select
            className="form-select"
            value={filters.location}
            onChange={(e) => {
              dispatch(setFilters({ location: e.target.value }));
              dispatch(fetchHotels({ ...filters, location: e.target.value }));
            }}
            style={{ height: 44, fontSize: '0.92rem', cursor: 'pointer' }}
          >
            <option value="all">Global Destinations (All)</option>
            <option value="Paris">Paris, France</option>
            <option value="Maldives">Baa Atoll, Maldives</option>
            <option value="New York">New York, USA</option>
            <option value="Kyoto">Kyoto, Japan</option>
            <option value="Dubai">Dubai, UAE</option>
            <option value="Zermatt">Zermatt, Switzerland</option>
          </select>
        </div>

        {/* Check-In / Check-Out */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <Calendar size={13} color="#fbbf24" /> Check-in
            </label>
            <input
              type="date"
              className="form-input"
              value={checkInDate}
              onChange={(e) => handleDatesChange(e.target.value, checkOutDate)}
              style={{ height: 44, padding: '8px 10px', fontSize: '0.85rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <Calendar size={13} color="#fbbf24" /> Check-out
            </label>
            <input
              type="date"
              className="form-input"
              value={checkOutDate}
              onChange={(e) => handleDatesChange(checkInDate, e.target.value)}
              style={{ height: 44, padding: '8px 10px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Guests & Rooms */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Users size={13} color="#fbbf24" /> Guests & Rooms
          </label>
          <button
            type="button"
            className="form-input"
            onClick={() => setShowGuestMenu(!showGuestMenu)}
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.92rem'
            }}
          >
            <span>{guests.adults} Adults · {guests.roomsCount} Room</span>
            <ChevronDown size={16} color="#94a3b8" />
          </button>

          {/* Guests Popover */}
          {showGuestMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              zIndex: 100,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Adults</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ages 13+</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button 
                    onClick={() => handleGuestsUpdate('adults', -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 28, height: 28, padding: 0 }}
                  >-</button>
                  <span style={{ fontWeight: 700, width: 16, textAlign: 'center' }}>{guests.adults}</span>
                  <button 
                    onClick={() => handleGuestsUpdate('adults', 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 28, height: 28, padding: 0 }}
                  >+</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Rooms</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Suite count</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button 
                    onClick={() => handleGuestsUpdate('roomsCount', -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 28, height: 28, padding: 0 }}
                  >-</button>
                  <span style={{ fontWeight: 700, width: 16, textAlign: 'center' }}>{guests.roomsCount}</span>
                  <button 
                    onClick={() => handleGuestsUpdate('roomsCount', 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 28, height: 28, padding: 0 }}
                  >+</button>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', marginTop: 6 }}
                onClick={() => setShowGuestMenu(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Search Submit Button */}
        <div>
          <button
            onClick={() => dispatch(fetchHotels(filters))}
            className="btn btn-primary"
            style={{
              height: 48,
              padding: '0 24px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%'
            }}
            disabled={loading}
          >
            <Search size={18} />
            {loading ? 'Fetching...' : 'Find Hotels'}
          </button>
        </div>
      </div>

      {/* Quick Location Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
      }}>
        <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginRight: 4 }}>
          Quick Filter:
        </span>
        {POPULAR_LOCATIONS.map((loc) => {
          const isActive = (loc === 'All' && filters.location === 'all') || filters.location.toLowerCase() === loc.toLowerCase();
          return (
            <button
              key={loc}
              onClick={() => handleLocationClick(loc)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#0b0f19' : '#cbd5e1',
                border: isActive ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.09)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              {loc}
            </button>
          );
        })}
      </div>
    </section>
  );
}
