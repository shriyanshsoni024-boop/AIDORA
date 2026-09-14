import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { LanguageToggle } from './LanguageToggle';
import { MapPin, ChevronDown, ShieldCheck, User, CalendarCheck, Zap, Check, X, Edit3, LocateFixed, Loader2, AlertCircle, Search } from 'lucide-react';
import { findNearestLocation } from '../../data/locations';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const {
    setActiveView,
    bookings,
    selectedLocation,
    setSelectedLocation,
    showLocationModal,
    setShowLocationModal,
    locations,
  } = useBooking();

  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const activeBookingsCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
        }}
        className="theme-transition"
      >
        {/* ========================================================= */}
        {/* DESKTOP HEADER (Single Row, >= 768px)                      */}
        {/* ========================================================= */}
        <div
          className="hide-mobile show-desktop-flex"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '8px 16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            minHeight: '56px',
            height: '56px',
            width: '100%',
          }}
        >
          {/* Left: Brand Logo & Locality Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0,
              }}
              title="AIDORA Home"
            >
              <Logo size="sm" />
              <div>
                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 900,
                    color: 'var(--sahyog-ink, #0B0B0B)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  AIDORA
                </span>
                <span
                  style={{
                    fontSize: '0.53125rem',
                    fontWeight: 800,
                    color: 'var(--sahyog-green, #1DAA5C)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginTop: '1px',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div style={{ width: '1px', height: '18px', backgroundColor: '#E5E7EB' }} />

            {/* Location Selector */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
                maxWidth: '240px',
                minWidth: 0,
              }}
              title="Change locality"
            >
              <MapPin size={13} color="var(--sahyog-green, #1DAA5C)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--sahyog-ink, #0B0B0B)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedLocation}
              </span>
              <ChevronDown size={11} color="#6B7280" style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* Right: Actions (Desktop Bookings/Account + Language Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Quick Emergency 15m Dispatch CTA */}
            <button
              type="button"
              onClick={() => setActiveView('service-detail')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                backgroundColor: '#FEF2F2',
                color: 'var(--sahyog-red, #E0472C)',
                border: '1px solid #FECACA',
                borderRadius: '4px',
                fontSize: '0.71875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <Zap size={12} fill="var(--sahyog-red, #E0472C)" />
              <span>{language === 'hi' ? '15m आपातकाल' : '15m Emergency'}</span>
            </button>

            {/* My Bookings Action */}
            <button
              type="button"
              onClick={() => setActiveView('history')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: activeBookingsCount > 0 ? 'var(--sahyog-green, #1DAA5C)' : 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <CalendarCheck size={14} color="currentColor" />
              <span>{language === 'hi' ? 'बुकिंग्स' : 'Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--theme-accent-light, #F0FDF4)',
                    color: 'var(--sahyog-green, #1DAA5C)',
                    border: '1px solid var(--sahyog-sage, #D9E9C8)',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                  }}
                >
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* Profile Action */}
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <User size={14} color="var(--theme-text-secondary, #374151)" />
              <span>{language === 'hi' ? 'खाता' : 'Account'}</span>
            </button>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE HEADER (Structured 2-Row Layout, < 768px)          */}
        {/* ========================================================= */}
        <div
          className="hide-desktop show-mobile-flex"
          style={{
            flexDirection: 'column',
            gap: '6px',
            padding: '8px 14px',
            width: '100%',
          }}
        >
          {/* Row 1: Brand Identity on Left, Language Switcher on Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Logo size="xs" />
              <div>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: 'var(--sahyog-ink, #0B0B0B)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  AIDORA
                </span>
                <span
                  style={{
                    fontSize: '0.5rem',
                    fontWeight: 800,
                    color: 'var(--sahyog-green, #1DAA5C)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginTop: '1px',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>

          {/* Row 2: Location Selector on Left, Booking Status/Badge on Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '8px',
              paddingTop: '2px',
            }}
          >
            {/* Location Selector (Safe Truncation) */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                minWidth: 0,
                flex: 1,
              }}
              title="Change locality"
            >
              <MapPin size={13} color="var(--sahyog-green, #1DAA5C)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--sahyog-ink, #0B0B0B)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {selectedLocation}
              </span>
              <ChevronDown size={11} color="#6B7280" style={{ flexShrink: 0 }} />
            </div>

            {/* Right: Active Bookings Pill OR Zone Trust Badge */}
            {activeBookingsCount > 0 ? (
              <button
                type="button"
                onClick={() => setActiveView('history')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 7px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid var(--sahyog-sage, #D9E9C8)',
                  borderRadius: '9999px',
                  color: 'var(--sahyog-green, #1DAA5C)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  height: '22px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                    display: 'inline-block',
                  }}
                />
                <span>
                  {activeBookingsCount} {language === 'hi' ? 'सक्रिय बुकिंग' : 'Active'}
                </span>
                <CalendarCheck size={11} />
              </button>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 7px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  color: '#64748B',
                  fontSize: '0.59375rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  height: '20px',
                }}
              >
                <ShieldCheck size={10} color="var(--sahyog-green, #1DAA5C)" />
                <span>{language === 'hi' ? '48 कारीगर लाइव' : '48 Pros Live'}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => {
            setShowLocationModal(false);
            setManualMode(false);
            setGeoError(null);
            setSearchQuery('');
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              maxWidth: '430px',
              width: '100%',
              padding: '18px 16px',
              boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid #E5E7EB',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} color="var(--sahyog-green, #1DAA5C)" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', margin: 0 }}>
                  {language === 'hi' ? 'स्थान' : 'Location'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLocationModal(false);
                  setManualMode(false);
                  setGeoError(null);
                  setSearchQuery('');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* 1. Auto-Detect Location Button */}
            <button
              type="button"
              disabled={isDetecting}
              onClick={() => {
                if (typeof window === 'undefined' || !navigator.geolocation) {
                  setGeoError(
                    language === 'hi'
                      ? 'स्थान का पता नहीं चल सका। कृपया मैन्युअल रूप से अपना क्षेत्र चुनें।'
                      : "Couldn't detect your location. Please select your area manually."
                  );
                  return;
                }

                setIsDetecting(true);
                setGeoError(null);

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setIsDetecting(false);
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const nearest = findNearestLocation(lat, lng);
                    setSelectedLocation(nearest.area);
                    setShowLocationModal(false);
                    setSearchQuery('');
                    setGeoError(null);
                    setManualMode(false);
                  },
                  (error) => {
                    setIsDetecting(false);
                    let errorMsg =
                      language === 'hi'
                        ? 'स्थान का पता नहीं चल सका। कृपया मैन्युअल रूप से अपना क्षेत्र चुनें।'
                        : "Couldn't detect your location. Please select your area manually.";

                    if (error.code === error.PERMISSION_DENIED) {
                      errorMsg =
                        language === 'hi'
                          ? 'स्थान अनुमति अस्वीकृत। कृपया नीचे मैन्युअल रूप से अपना क्षेत्र चुनें।'
                          : 'Location permission denied. Please select your area manually.';
                    } else if (error.code === error.TIMEOUT) {
                      errorMsg =
                        language === 'hi'
                          ? 'स्थान अनुरोध समय समाप्त। कृपया नीचे मैन्युअल रूप से चुनें।'
                          : 'Location request timed out. Please select your area manually.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                      errorMsg =
                        language === 'hi'
                          ? 'स्थान जानकारी अनुपलब्ध है। कृपया नीचे मैन्युअल रूप से चुनें।'
                          : 'Location information is unavailable. Please select your area manually.';
                    }

                    setGeoError(errorMsg);
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                  }
                );
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#F0FDF4',
                border: '1.5px solid var(--sahyog-sage, #D9E9C8)',
                borderRadius: '7px',
                color: 'var(--sahyog-green, #1DAA5C)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: isDetecting ? 'wait' : 'pointer',
                transition: 'all 120ms ease',
                width: '100%',
              }}
              className="hover-card"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{language === 'hi' ? 'स्थान का पता लगाया जा रहा है...' : 'Detecting your location...'}</span>
                </>
              ) : (
                <>
                  <LocateFixed size={16} color="var(--sahyog-green, #1DAA5C)" />
                  <span>{language === 'hi' ? 'मेरे वर्तमान स्थान का उपयोग करें' : 'Use my current location'}</span>
                </>
              )}
            </button>

            {/* Geolocation Graceful Error Notice */}
            {geoError && (
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  fontSize: '0.71875rem',
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  lineHeight: 1.35,
                }}
              >
                <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{geoError}</span>
              </div>
            )}

            {/* 2. Search / Filter Locality Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                borderRadius: '6px',
                padding: '7px 10px',
                border: '1px solid #CBD5E1',
              }}
            >
              <Search size={14} color="#64748B" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'स्थान खोजें...' : 'Search location...'}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.78125rem',
                  outline: 'none',
                  color: 'var(--sahyog-ink, #0B0B0B)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '1px' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Active Custom Location Indicator (if current location is not in predefined list) */}
            {!locations.some((l) => l.area.toLowerCase() === selectedLocation.toLowerCase()) && selectedLocation && !searchQuery && (
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--sahyog-green, #1DAA5C)',
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                    {selectedLocation}
                  </div>
                  <div style={{ fontSize: '0.65625rem', color: 'var(--sahyog-green, #1DAA5C)', fontWeight: 600 }}>
                    {language === 'hi' ? 'कस्टम दर्ज स्थान • वर्तमान सक्रिय' : 'Custom locality • Currently active'}
                  </div>
                </div>
                <Check size={15} color="var(--sahyog-green, #1DAA5C)" strokeWidth={2.5} />
              </div>
            )}

            {/* Available / Matching Locations List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto' }}>
              {locations
                .filter((loc) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    loc.area.toLowerCase().includes(q) ||
                    loc.city.toLowerCase().includes(q) ||
                    loc.tag.toLowerCase().includes(q)
                  );
                })
                .map((loc, idx) => {
                  const isSelected = selectedLocation === loc.area;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedLocation(loc.area);
                        setShowLocationModal(false);
                        setManualMode(false);
                        setSearchQuery('');
                        setGeoError(null);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#E5E7EB'}`,
                        backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background-color 120ms ease',
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color={isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#64748B'} style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                            {loc.area}, {loc.city}
                          </div>
                          <div style={{ fontSize: '0.65625rem', color: isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#6B7280' }}>
                            {loc.tag}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={15} color="var(--sahyog-green, #1DAA5C)" strokeWidth={2.5} />}
                    </div>
                  );
                })}
            </div>

            {/* If search query does not match any predefined location, show quick custom selector */}
            {searchQuery.trim().length > 1 &&
              !locations.some((l) => l.area.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                <div
                  onClick={() => {
                    setSelectedLocation(searchQuery.trim());
                    setShowLocationModal(false);
                    setSearchQuery('');
                    setManualMode(false);
                    setGeoError(null);
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1.5px dashed var(--sahyog-green, #1DAA5C)',
                    backgroundColor: '#F0FDF4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <MapPin size={15} color="var(--sahyog-green, #1DAA5C)" />
                    <div>
                      <div style={{ fontSize: '0.78125rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                        "{searchQuery.trim()}"
                      </div>
                      <div style={{ fontSize: '0.65625rem', color: 'var(--sahyog-green, #1DAA5C)', fontWeight: 600 }}>
                        {language === 'hi' ? 'कस्टम स्थान के रूप में चुनें' : 'Use as custom location'}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '3px 8px',
                      backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                      color: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                    }}
                  >
                    {language === 'hi' ? 'पुष्टि करें' : 'Confirm'}
                  </span>
                </div>
              )}

            {/* 3. Manual Location Entry Form Section */}
            {!manualMode ? (
              <button
                type="button"
                onClick={() => {
                  setManualMode(true);
                  setManualInput(selectedLocation || '');
                }}
                style={{
                  marginTop: '2px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--sahyog-green, #1DAA5C)',
                  width: '100%',
                }}
                className="hover-card"
              >
                <Edit3 size={13} />
                <span>{language === 'hi' ? '+ स्थान मैन्युअल रूप से दर्ज करें' : '+ Enter location manually'}</span>
              </button>
            ) : (
              <div
                style={{
                  marginTop: '2px',
                  padding: '10px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="var(--sahyog-green, #1DAA5C)" />
                  <span>{language === 'hi' ? 'अपना इलाका / क्षेत्र दर्ज करें' : 'Enter your locality / area'}</span>
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. Sector 62, Noida, Indiranagar...' : 'e.g. Sector 62, Noida, Indiranagar, Bengaluru...'}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--sahyog-ink, #0B0B0B)',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualInput.trim()) {
                      e.preventDefault();
                      setSelectedLocation(manualInput.trim());
                      setShowLocationModal(false);
                      setManualMode(false);
                      setSearchQuery('');
                      setGeoError(null);
                    }
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={!manualInput.trim()}
                    onClick={() => {
                      if (manualInput.trim()) {
                        setSelectedLocation(manualInput.trim());
                        setShowLocationModal(false);
                        setManualMode(false);
                        setSearchQuery('');
                        setGeoError(null);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      backgroundColor: manualInput.trim() ? 'var(--sahyog-green, #1DAA5C)' : '#94A3B8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: manualInput.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    className="sahyog-btn"
                  >
                    <Check size={14} />
                    <span>{language === 'hi' ? 'स्थान की पुष्टि करें' : 'Confirm Location'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualMode(false)}
                    style={{
                      padding: '7px 10px',
                      backgroundColor: '#FFFFFF',
                      color: '#64748B',
                      border: '1px solid #CBD5E1',
                      borderRadius: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    className="sahyog-btn"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
