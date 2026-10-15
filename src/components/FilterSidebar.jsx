import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { setFilters, resetFilters, fetchHotels } from '../store/slices/hotelsSlice';
import { apiSimulationConfig } from '../services/mockBackend';

const AMENITY_OPTIONS = [
  'Free High-Speed Wi-Fi',
  'Heated Infinity Pool',
  'Luxury Spa & Sauna',
  'Michelin Star Dining',
  'Traditional Japanese Onsen',
  'Overwater Bungalows',
  'Private White Sand Beach',
  'Direct Ski-in / Ski-out'
];

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.hotels);
  const [latency, setLatency] = React.useState(apiSimulationConfig.latencyMs);
  const [forceError, setForceError] = React.useState(apiSimulationConfig.forceError);
  const [forceExpired, setForceExpired] = React.useState(apiSimulationConfig.forceExpiredToken);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    dispatch(setFilters({ [key]: value }));
    dispatch(fetchHotels(updated));
  };

  const handleReset = () => {
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

  // Toggle backend simulation controls (Experiment 1f & 4f)
  const toggleForceError = () => {
    const nextVal = !forceError;
    setForceError(nextVal);
    apiSimulationConfig.forceError = nextVal;
  };

  const toggleForceExpired = () => {
    const nextVal = !forceExpired;
    setForceExpired(nextVal);
    apiSimulationConfig.forceExpiredToken = nextVal;
  };

  const handleLatencyChange = (e) => {
    const val = Number(e.target.value);
    setLatency(val);
    apiSimulationConfig.latencyMs = val;
  };

  return (
    <aside style={{
      background: 'rgba(23, 32, 51, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={18} color="#fbbf24" />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Filter Hotels</h2>
        </div>
        <button
          onClick={handleReset}
          className="btn btn-secondary btn-sm"
          style={{ padding: '4px 10px', fontSize: '0.78rem', gap: 4 }}
          title="Reset all filters"
          aria-label="Reset all filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
          Sort Results By
        </label>
        <select
          className="form-select"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          style={{ fontSize: '0.88rem', padding: '10px 12px' }}
        >
          <option value="recommended">Featured & Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Guest Rating: Highest First</option>
        </select>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
            Max Price / Night
          </label>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
            ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="300"
          max="2000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#f59e0b',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
          <span>$300</span>
          <span>$1,000</span>
          <span>$2,000+</span>
        </div>
      </div>

      {/* Minimum Star Rating */}
      <div>
        <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
          Minimum Star Rating
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[0, 4.5, 4.8, 5.0].map((star) => {
            const isSelected = filters.rating === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleFilterChange('rating', star)}
                aria-label={star === 0 ? 'All star ratings' : `Minimum ${star} stars`}
                style={{
                  padding: '7px 4px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  cursor: 'pointer'
                }}
              >
                <Star size={12} fill={isSelected ? '#fbbf24' : 'none'} color="#fbbf24" />
                {star === 0 ? 'All' : `${star}+`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter (Exp 1b) */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)'
        }}>
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => handleFilterChange('onlyAvailable', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#10b981', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 500 }}>
            Available Rooms Only
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Exclude fully booked properties
            </div>
          </div>
        </label>
      </div>

      {/* Key Amenities Filter */}
      <div>
        <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
          Signature Amenities
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => handleFilterChange('amenity', 'all')}
            style={{
              textAlign: 'left',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: filters.amenity === 'all' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: filters.amenity === 'all' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
              color: filters.amenity === 'all' ? '#fbbf24' : '#94a3b8',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            All Amenities
          </button>
          {AMENITY_OPTIONS.map((am) => {
            const isSelected = filters.amenity === am;
            return (
              <button
                key={am}
                onClick={() => handleFilterChange('amenity', am)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  color: isSelected ? '#fbbf24' : '#94a3b8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7
                }}
              >
                {isSelected && <CheckCircle2 size={13} color="#fbbf24" />}
                {am}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Simulation Controls (Exp 1f, 3f, 4f) */}
      <div style={{
        marginTop: 6,
        padding: '14px 14px',
        background: 'rgba(244, 63, 94, 0.06)',
        border: '1px dashed rgba(244, 63, 94, 0.3)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <ShieldAlert size={15} color="#fda4af" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fda4af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Lab Test Fault Injection
          </span>
        </div>

        {/* 500 Network Error Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={forceError}
            onChange={toggleForceError}
            style={{ accentColor: '#f43f5e', width: 15, height: 15 }}
          />
          <span>Simulate 500 Network Failure (Exp 1f)</span>
        </label>

        {/* 401 Expired Token Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={forceExpired}
            onChange={toggleForceExpired}
            style={{ accentColor: '#f43f5e', width: 15, height: 15 }}
          />
          <span>Simulate Expired Token / 401 (Exp 4f)</span>
        </label>

        {/* Latency Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>
            <span>Network Latency (Exp 1e)</span>
            <span style={{ color: '#fbbf24' }}>{latency}ms</span>
          </div>
          <input
            type="range"
            min="50"
            max="1500"
            step="50"
            value={latency}
            onChange={handleLatencyChange}
            style={{ width: '100%', accentColor: '#f59e0b', height: 4 }}
          />
        </div>
      </div>
    </aside>
  );
}
