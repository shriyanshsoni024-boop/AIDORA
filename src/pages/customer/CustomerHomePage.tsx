import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_CATEGORIES } from '../../data/services';
import { PRONTO_SERVICES } from '../../data/prontoServicesData';
import { CategoryTabsBar } from '../../components/customer/CategoryTabsBar';
import { ProntoServiceCard, ServiceItemData } from '../../components/customer/ProntoServiceCard';
import { AddressSelectorModal } from '../../components/customer/AddressSelectorModal';
import { Avatar } from '../../components/common/Avatar';
import { getCategoryTheme, CategoryTheme } from '../../styles/categoryThemes';
import { Search, X, Mic, MapPin, ChevronDown, Wallet, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface CustomerHomePageProps {
  onOpenOnboarding?: () => void;
}

export const CustomerHomePage: React.FC<CustomerHomePageProps> = ({ onOpenOnboarding }) => {
  const { user } = useAuth();
  const {
    startServiceBooking,
    setProblemDescription,
    bookings,
    selectedLocation,
    setSelectedLocation,
    setActiveView,
    setCurrentBookingId,
  } = useBooking();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const activeTheme: CategoryTheme = getCategoryTheme(selectedCategoryId);

  // Active ongoing booking check
  const activeBooking = bookings.find(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  );

  // Filter services by Category and Search Query
  const filteredServices = PRONTO_SERVICES.filter((service) => {
    // 1. Category filter
    const matchesCategory =
      selectedCategoryId === 'all' || service.categoryId === selectedCategoryId;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.categoryId.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service: ServiceItemData) => {
    // Map service to existing booking flow category
    let categoryKey = service.categoryId;
    if (categoryKey === 'ac') categoryKey = 'ac_repair';
    if (categoryKey === 'cleaning') categoryKey = 'cleaner';
    if (categoryKey === 'plumbing') categoryKey = 'plumber';
    if (categoryKey === 'painting') categoryKey = 'painter';

    const matchedCategory =
      SERVICE_CATEGORIES.find((c) => c.id === categoryKey) ||
      SERVICE_CATEGORIES[0];

    setProblemDescription(service.name);
    startServiceBooking(matchedCategory, false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--sahyog-cream, #FCFBF4)',
        paddingBottom: '90px',
      }}
    >
      {/* 1. TOP HEADER WITH HOME TITLE, LOCATION, WALLET & PROFILE ICONS */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          padding: '14px 16px 10px',
          borderBottom: '1px solid var(--sahyog-sage, #D9E9C8)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Home Title & Selectable Location */}
          <div>
            <h1
              style={{
                fontSize: '1.1875rem',
                fontWeight: 900,
                color: 'var(--sahyog-ink, #0B0B0B)',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Home
            </h1>

            {/* Clickable Location Row */}
            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                padding: '2px 0 0',
                cursor: 'pointer',
                color: '#64748B',
                fontSize: '0.75rem',
                fontWeight: 600,
                maxWidth: '220px',
                textAlign: 'left',
              }}
            >
              <MapPin size={13} color="var(--sahyog-green, #1DAA5C)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#334155',
                }}
              >
                {selectedLocation || 'Indiranagar, Bangalore'}
              </span>
              <ChevronDown size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
            </button>
          </div>

          {/* Right: Wallet/Money and Profile Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Wallet Button */}
            <button
              type="button"
              onClick={() => setActiveView('money')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid var(--sahyog-sage, #D9E9C8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sahyog-green, #1DAA5C)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
              className="sahyog-btn"
              aria-label="Open Wallet / Money"
              title="Wallet & Earnings"
            >
              <Wallet size={18} />
            </button>

            {/* Profile Avatar Button */}
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sahyog-ink, #0B0B0B)',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                transition: 'all 120ms ease',
              }}
              className="sahyog-btn"
              aria-label="Open Profile"
            >
              <Avatar
                src={user?.profileImage || user?.avatar}
                name={user?.name || 'Customer'}
                size={36}
                shape="rounded"
              />
            </button>
          </div>
        </div>

        {/* 2. SEARCH BAR */}
        <div style={{ marginTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--sahyog-sage, #D9E9C8)',
              padding: '8px 12px',
              gap: '8px',
            }}
          >
            <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />

            <input
              type="text"
              placeholder="Search for cleaning, electrician, AC, plumbing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--sahyog-ink, #0B0B0B)',
                backgroundColor: 'transparent',
              }}
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                <X size={16} />
              </button>
            ) : (
              <Mic size={16} color="var(--sahyog-green, #1DAA5C)" style={{ flexShrink: 0, opacity: 0.8 }} />
            )}
          </div>
        </div>
      </header>

      {/* 3. ACTIVE ONGOING BOOKING LIVE TRACKING BANNER (IF ACTIVE) */}
      {activeBooking && (
        <div style={{ padding: '12px 14px 0' }}>
          <div
            onClick={() => {
              setCurrentBookingId(activeBooking.id);
              setActiveView('tracking');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid var(--sahyog-sage, #D9E9C8)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(29, 170, 92, 0.08)',
              cursor: 'pointer',
            }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sahyog-green, #1DAA5C)',
                  flexShrink: 0,
                }}
              >
                <Zap size={18} fill="var(--sahyog-green, #1DAA5C)" />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{activeBooking.serviceName}</span>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeBooking.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.65625rem', color: '#64748B' }}>
                  OTP: <strong>{activeBooking.otp || '4829'}</strong> • Track Technician
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.6875rem', fontWeight: 800, color: 'var(--sahyog-green, #1DAA5C)' }}>
              <span>Track</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      )}

      {/* 4. CATEGORY FILTER TABS BAR */}
      <div style={{ margin: '8px 0 6px' }}>
        <CategoryTabsBar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
            setSearchQuery('');
          }}
          activeTheme={activeTheme}
        />
      </div>

      {/* 5. ALL HOUSE HELP SERVICES SECTION (3-COLUMN GRID) */}
      <section style={{ padding: '6px 10px 14px' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h2
              style={{
                fontSize: '1.0625rem',
                fontWeight: 900,
                color: 'var(--sahyog-ink, #0B0B0B)',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              All house help services
            </h2>
            <p style={{ fontSize: '0.6875rem', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
              Schedule & book for later
            </p>
          </div>

          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: '#F0FDF4',
              color: 'var(--sahyog-green, #1DAA5C)',
              border: '1px solid var(--sahyog-sage, #D9E9C8)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            {filteredServices.length} options
          </span>
        </div>

        {/* 3-Column Service Grid */}
        {filteredServices.length > 0 ? (
          <div className="house-help-grid">
            {filteredServices.map((service) => (
              <ProntoServiceCard
                key={service.id}
                service={service}
                theme={activeTheme}
                onBook={() => handleBookService(service)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
              No services found
            </div>
            <p style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '4px' }}>
              Try searching for cleaning, AC, fan, or switch category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
              }}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. COOPERATIVE GUARANTEE TRUST FOOTER */}
      <div style={{ padding: '8px 14px 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid var(--sahyog-sage, #D9E9C8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sahyog-green, #1DAA5C)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                Cooperative Backed & Insured
              </div>
              <div style={{ fontSize: '0.65625rem', color: '#64748B', marginTop: '1px' }}>
                100% KYC verified artisans • Standard rates • 30-day rework warranty
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selector Bottom Sheet Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedLocation}
        onSelectAddress={(newLoc) => setSelectedLocation(newLoc)}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          if (onOpenOnboarding) {
            onOpenOnboarding();
          }
        }}
      />
    </div>
  );
};
