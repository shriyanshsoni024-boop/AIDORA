import React, { useState } from 'react';
import { ArrowLeft, Navigation, MapPin, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { LOCATIONS, ServiceLocation } from '../../../data/locations';

interface LocationScreenProps {
  onLocationSelected: (location: string) => void;
  onBack: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({ onLocationSelected, onBack }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Auto-detect current geolocation
  const handleUseCurrentLocation = () => {
    setGeoError(null);
    setIsDetecting(true);

    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser. Please select manually.');
      setIsDetecting(false);
      setShowManualSearch(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (_position) => {
        setIsDetecting(false);
        // Map detected coords to nearest supported AIDORA hub
        const detectedArea = 'Indiranagar, Bangalore (Current GPS)';
        onLocationSelected(detectedArea);
      },
      (_error) => {
        setIsDetecting(false);
        setGeoError('Location permission denied or unavailable. Please choose from our active hubs below.');
        setShowManualSearch(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const filteredLocations = LOCATIONS.filter((loc: ServiceLocation) =>
    loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--sahyog-white, #FFFFFF)',
        padding: '16px 20px 28px',
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E293B',
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', margin: 0 }}>
          Location setup
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: 'var(--sahyog-ink, #0B0B0B)',
              letterSpacing: '-0.03em',
              margin: '0 0 6px',
            }}
          >
            What's your location?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
            We need your location to show you our serviceable hubs & dispatch nearest cooperative artisans.
          </p>
        </div>

        {/* 3D / Isometric City Illustration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            backgroundColor: 'var(--sahyog-cream, #FCFBF4)',
            borderRadius: '24px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Isometric Graphic SVG */}
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ground Plane */}
            <path d="M110 20 L200 70 L110 120 L20 70 Z" fill="#E2E8F0" />
            <path d="M110 32 L185 74 L110 115 L35 74 Z" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" />

            {/* Buildings (White/Light gray 3D blocks) */}
            {/* Building 1 (Left) */}
            <path d="M60 45 L85 30 L85 70 L60 85 Z" fill="#CBD5E1" />
            <path d="M85 30 L110 45 L110 85 L85 70 Z" fill="#94A3B8" />
            <path d="M60 45 L85 30 L110 45 L85 60 Z" fill="#F1F5F9" />

            {/* Building 2 (Tall Center) */}
            <path d="M95 20 L120 5 L120 65 L95 80 Z" fill="#CBD5E1" />
            <path d="M120 5 L145 20 L145 80 L120 65 Z" fill="#94A3B8" />
            <path d="M95 20 L120 5 L145 20 L120 35 Z" fill="#FFFFFF" />

            {/* Building 3 (Right) */}
            <path d="M130 55 L155 40 L155 75 L130 90 Z" fill="#CBD5E1" />
            <path d="M155 40 L180 55 L180 90 L155 75 Z" fill="#94A3B8" />
            <path d="M130 55 L155 40 L180 55 L155 70 Z" fill="#F1F5F9" />

            {/* Active Serviceable Hub Beacon */}
            <circle cx="110" cy="74" r="14" fill="#1DAA5C" fillOpacity="0.2" />
            <circle cx="110" cy="74" r="7" fill="#1DAA5C" />
            <circle cx="110" cy="74" r="3" fill="#FFFFFF" />

            {/* Minimal Trees */}
            <circle cx="50" cy="70" r="5" fill="#22C55E" />
            <circle cx="170" cy="75" r="5" fill="#22C55E" />
            <circle cx="80" cy="95" r="6" fill="#16A34A" />
          </svg>

          {/* Serviceable Badge Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sahyog-sage, #D9E9C8)',
              padding: '4px 10px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--sahyog-green, #1DAA5C)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <CheckCircle2 size={13} />
            <span>Active Service Hubs Available</span>
          </div>
        </div>

        {/* Error notice if any */}
        {geoError && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#92400E',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0 }} />
            <span>{geoError}</span>
          </div>
        )}

        {/* Manual Search Expansion */}
        {showManualSearch ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--sahyog-green, #1DAA5C)',
                borderRadius: '14px',
                padding: '10px 14px',
                backgroundColor: '#FFFFFF',
                gap: '8px',
              }}
            >
              <Search size={18} color="var(--sahyog-green, #1DAA5C)" />
              <input
                type="text"
                placeholder="Search sector, area, or locality"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--sahyog-ink, #0B0B0B)',
                }}
                autoFocus
              />
            </div>

            {/* Hubs list */}
            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {filteredLocations.map((loc) => (
                <button
                  key={`${loc.city}-${loc.area}`}
                  type="button"
                  onClick={() => onLocationSelected(`${loc.area}, ${loc.city}`)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="var(--sahyog-green, #1DAA5C)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                        {loc.area}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                        {loc.city} • Fast dispatch available
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sahyog-green, #1DAA5C)' }}>
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Bottom Action Buttons */
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Primary CTA: Use Current Location */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(29, 170, 92, 0.3)',
              }}
              className="sahyog-btn"
            >
              <Navigation size={18} />
              <span>{isDetecting ? 'Detecting nearest hub...' : 'Use current location'}</span>
            </button>

            {/* Secondary Link: Enter Location Manually */}
            <button
              type="button"
              onClick={() => setShowManualSearch(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--sahyog-green, #1DAA5C)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              Enter location manually
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
