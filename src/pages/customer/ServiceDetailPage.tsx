import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/Button';
import { AddressSelectorModal } from '../../components/customer/AddressSelectorModal';
import {
  ArrowLeft,
  Clock,
  Zap,
  MapPin,
  Sparkles,
  Check,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ServiceTier } from '../../types';
import { aiService } from '../../services/aiService';

export const ServiceDetailPage: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    selectedCategory,
    selectedTier,
    setSelectedTier,
    urgency,
    setUrgency,
    problemDescription,
    setProblemDescription,
    photoEstimate,
    setPhotoEstimate,
    setActiveView,
    selectedLocation,
    setSelectedLocation,
  } = useBooking();

  const [simulatingAi, setSimulatingAi] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');
  const [showAddressModal, setShowAddressModal] = useState(false);

  if (!selectedCategory) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Please select a service category to continue.</p>
        <Button onClick={() => setActiveView('home')} style={{ marginTop: '12px' }}>
          Back to Home
        </Button>
      </div>
    );
  }

  const categoryName = language === 'hi' ? selectedCategory.nameHi : selectedCategory.name;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRealPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSimulatingAi(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const result = await aiService.analyzeJobPhoto(
          base64Data,
          selectedCategory?.name || 'General Service',
          problemDescription || 'Inspection photo'
        );
        setPhotoEstimate({
          detected: result.detected,
          tier: result.tier,
          confidence: result.confidence,
          label: result.label,
        });
        setSelectedTier(result.tier);
        setSimulatingAi(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Error analyzing photo:', err);
      setSimulatingAi(false);
    }
  };

  const handleTriggerPhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getTierPrice = (tier: ServiceTier) => {
    const base = selectedCategory.basePrice;
    if (tier === 'SMALL') return base;
    if (tier === 'MEDIUM') return Math.round(base * 1.8);
    return Math.round(base * 2.8);
  };

  const currentPrice = getTierPrice(selectedTier);
  const connectionFee = 25;
  const totalPrice = currentPrice + connectionFee;

  const tiers: { tier: ServiceTier; title: string; desc: string; duration: string }[] = [
    {
      tier: 'SMALL',
      title: 'Small / Minor Fix',
      desc: 'Quick single-point repair, switch or tap fix',
      duration: 'Up to 30 mins',
    },
    {
      tier: 'MEDIUM',
      title: 'Medium / Standard Job',
      desc: 'Standard circuit, servicing or pipe repair',
      duration: 'Up to 60 mins',
    },
    {
      tier: 'LARGE',
      title: 'Large / Major Work',
      desc: 'Multi-point setup, major overhaul or wiring',
      duration: 'Up to 120 mins',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        position: 'relative',
      }}
    >
      {/* 1. TOP COMPACT HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              color: '#0F172A',
              transition: 'background-color 150ms ease',
            }}
            aria-label="Back to home"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              {categoryName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 500 }}>
                {selectedCategory.category}
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.6875rem' }}>•</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#1DAA5C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <ShieldCheck size={12} />
                Cooperative Backed
              </span>
            </div>
          </div>
        </div>

        {/* Urgency Quick Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '10px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setUrgency('NORMAL')}
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: urgency === 'NORMAL' ? '#FFFFFF' : 'transparent',
              color: urgency === 'NORMAL' ? '#1DAA5C' : '#64748B',
              boxShadow: urgency === 'NORMAL' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease',
            }}
          >
            <Clock size={11} />
            <span>Standard</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUrgency('EMERGENCY');
              setSelectedTier('MEDIUM');
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: urgency === 'EMERGENCY' ? '#DC2626' : 'transparent',
              color: urgency === 'EMERGENCY' ? '#FFFFFF' : '#64748B',
              boxShadow: urgency === 'EMERGENCY' ? '0 1px 3px rgba(220,38,38,0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease',
            }}
          >
            <Zap size={11} />
            <span>Urgent</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT AREA */}
      <main
        style={{
          flex: 1,
          padding: '14px 16px 100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* SECTION 1: SERVICE TIER SELECTION */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Service Tier
            </h2>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B' }}>
              Fixed Standard Rates
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tiers.map(({ tier, title, desc, duration }) => {
              const isSelected = selectedTier === tier;
              const price = getTierPrice(tier);
              const isPopular = tier === 'MEDIUM';

              return (
                <div
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  style={{
                    position: 'relative',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? '#1DAA5C' : '#E2E8F0'}`,
                    backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: isSelected
                      ? '0 2px 8px rgba(29, 170, 92, 0.08)'
                      : '0 1px 3px rgba(0, 0, 0, 0.02)',
                    transition: 'all 150ms ease',
                  }}
                  className="hover-card"
                >
                  {/* "MOST POPULAR" Badge on Medium Tier */}
                  {isPopular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '14px',
                        backgroundColor: '#F4C430',
                        color: '#0B0B0B',
                        fontSize: '0.5625rem',
                        fontWeight: 900,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                        border: '1px solid #EAB308',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      ★ MOST POPULAR
                    </div>
                  )}

                  {/* Left: Radio Dot + Titles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    {/* Custom Radio Button */}
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#1DAA5C' : '#CBD5E1'}`,
                        backgroundColor: isSelected ? '#1DAA5C' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 150ms ease',
                      }}
                    >
                      {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3.5} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          color: isSelected ? '#1DAA5C' : '#0B0B0B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          color: '#64748B',
                          marginTop: '1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {duration}
                        </span>
                        <span>•</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {desc}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0B0B0B' }}>
                      ₹{price}
                    </div>
                    <div style={{ fontSize: '0.5625rem', color: '#1DAA5C', fontWeight: 700 }}>
                      Fixed Rate
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: PICK DATE & TIME */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#1DAA5C" />
              <h2 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B0B0B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pick Date & Time
              </h2>
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#1DAA5C', backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: '6px' }}>
              Instant Dispatch Available
            </span>
          </div>

          {/* Date Selector (Today / Tomorrow) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedSlot('today')}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: `1.5px solid ${selectedSlot === 'today' ? '#1DAA5C' : '#E2E8F0'}`,
                backgroundColor: selectedSlot === 'today' ? '#F0FDF4' : '#FFFFFF',
                color: selectedSlot === 'today' ? '#1DAA5C' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 120ms ease',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: selectedSlot === 'today' ? '#1DAA5C' : '#94A3B8',
                }}
              />
              <span>Today (Earliest)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSlot('tomorrow')}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: `1.5px solid ${selectedSlot === 'tomorrow' ? '#1DAA5C' : '#E2E8F0'}`,
                backgroundColor: selectedSlot === 'tomorrow' ? '#F0FDF4' : '#FFFFFF',
                color: selectedSlot === 'tomorrow' ? '#1DAA5C' : '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 120ms ease',
              }}
            >
              <span>Tomorrow</span>
            </button>
          </div>

          {/* Time Slots (Morning / Afternoon / Evening) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { id: 'morning', label: '9 AM - 12 PM', slotName: 'Morning' },
              { id: 'afternoon', label: '12 PM - 4 PM', slotName: 'Afternoon' },
              { id: 'evening', label: '4 PM - 8 PM', slotName: 'Evening' },
            ].map((slot) => {
              const isSelected = selectedTimeSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? '#1DAA5C' : '#E2E8F0'}`,
                    backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                    color: isSelected ? '#1DAA5C' : '#334155',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1px',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span style={{ color: isSelected ? '#1DAA5C' : '#64748B', fontSize: '0.5625rem', fontWeight: 600 }}>
                    {slot.slotName}
                  </span>
                  <span style={{ fontSize: '0.6875rem' }}>{slot.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: SERVICE LOCATION */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#F0FDF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#1DAA5C',
              }}
            >
              <MapPin size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Service Location
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0B0B0B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedLocation || 'Indiranagar 4th Block, Bangalore'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #D9E9C8',
              backgroundColor: '#F0FDF4',
              color: '#1DAA5C',
              fontSize: '0.6875rem',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Change
          </button>
        </section>

        {/* SECTION 4: OPTIONAL PROBLEM NOTE & AI SCAN */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Problem Note & Photo (Optional)
            </span>
            {photoEstimate ? (
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#1DAA5C', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={11} /> AI Analyzed ({photoEstimate.tier})
              </span>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleRealPhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleTriggerPhotoUpload}
                  disabled={simulatingAi}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#1DAA5C',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <Sparkles size={12} />
                  <span>{simulatingAi ? 'Analyzing with AI...' : 'Upload & Analyze Photo'}</span>
                </button>
              </>
            )}
          </div>

          <input
            type="text"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="e.g. Switch sparking, water leakage under sink..."
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '0.75rem',
              color: '#0B0B0B',
              backgroundColor: '#F8FAFC',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </section>
      </main>

      {/* 3. STICKY BOTTOM ACTION BAR */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
          zIndex: 40,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '0.5625rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estimated Total
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B0B0B', letterSpacing: '-0.02em' }}>
              ₹{totalPrice}
            </span>
            <span style={{ fontSize: '0.5625rem', color: '#94A3B8', fontWeight: 600 }}>
              (incl. ₹{connectionFee} fee)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('worker-matching')}
          style={{
            flex: 1,
            backgroundColor: urgency === 'EMERGENCY' ? '#E0472C' : '#1DAA5C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: urgency === 'EMERGENCY' ? '0 4px 12px rgba(220, 38, 38, 0.25)' : '0 4px 12px rgba(12, 131, 31, 0.2)',
            transition: 'transform 120ms ease, background-color 150ms ease',
          }}
          className="hover-card"
        >
          <span>{urgency === 'EMERGENCY' ? 'Find Emergency Workers' : t('find_workers_cta')}</span>
          <ArrowRight size={16} />
        </button>
      </footer>

      {/* Global Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedLocation}
        onSelectAddress={(loc) => setSelectedLocation(loc)}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          setActiveView('home');
        }}
      />
    </div>
  );
};
