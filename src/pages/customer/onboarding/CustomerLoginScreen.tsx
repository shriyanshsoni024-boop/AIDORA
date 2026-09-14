import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../../components/common/Logo';

interface CustomerLoginScreenProps {
  onContinue: (phone: string) => void;
  onSkip: () => void;
}

// Visual Gallery images for the 2 horizontal staggered rows
const GALLERY_ROW_1 = [
  { title: 'Full Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=260&auto=format&fit=crop&q=80', tag: 'Top Rated' },
  { title: 'Electrician', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=260&auto=format&fit=crop&q=80', tag: 'Fast 15m' },
  { title: 'AC Service', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=260&auto=format&fit=crop&q=80', tag: 'Summer Deal' },
  { title: 'Plumbing', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=260&auto=format&fit=crop&q=80', tag: 'Certified' },
];

const GALLERY_ROW_2 = [
  { title: 'Appliance Repair', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=260&auto=format&fit=crop&q=80', tag: 'Warranty' },
  { title: 'Carpentry', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=260&auto=format&fit=crop&q=80', tag: 'Master Wood' },
  { title: 'Deep Cleaning', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=260&auto=format&fit=crop&q=80', tag: 'Sanitized' },
  { title: 'Painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=260&auto=format&fit=crop&q=80', tag: 'Fresh Wall' },
];

export const CustomerLoginScreen: React.FC<CustomerLoginScreenProps> = ({ onContinue, onSkip }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const isValidPhone = cleanNumber.length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPhone) {
      onContinue(cleanNumber);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. TOP GREEN HERO SECTION */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1DAA5C 0%, #0F7A3E 100%)',
          borderRadius: '0 0 28px 28px',
          padding: '24px 20px 32px',
          color: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(29, 170, 92, 0.2)',
        }}
      >
        {/* Top Bar: Brand & Skip Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size="sm" />
            <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              AIDORA
            </div>
          </div>

          <button
            type="button"
            onClick={onSkip}
            style={{
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '9999px',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            Skip login
          </button>
        </div>

        {/* Large Headline */}
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: '280px',
          }}
        >
          Get professional{'\n'}home help in minutes!
        </h1>
      </div>

      {/* 2. HORIZONTALLY SCROLLABLE SERVICE IMAGE GALLERY */}
      <div style={{ padding: '20px 0 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Row 1 */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingLeft: '16px',
            paddingRight: '16px',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {GALLERY_ROW_1.map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: '0 0 140px',
                height: '92px',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F1F5F9',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  right: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    backgroundColor: '#1DAA5C',
                    color: '#FFFFFF',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '2px',
                  }}
                >
                  {item.tag}
                </span>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 (Staggered) */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingLeft: '32px',
            paddingRight: '16px',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {GALLERY_ROW_2.map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: '0 0 140px',
                height: '92px',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F1F5F9',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  right: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '2px',
                  }}
                >
                  {item.tag}
                </span>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. LOGIN / SIGNUP FORM SECTION */}
      <div style={{ padding: '16px 20px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#111827',
            textAlign: 'center',
            margin: '0 0 18px',
            letterSpacing: '-0.02em',
          }}
        >
          Log in or Sign up
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Large Outlined Phone Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: `2px solid ${isValidPhone ? '#1DAA5C' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              boxShadow: isValidPhone ? '0 0 0 3px rgba(29, 170, 92, 0.12)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B', fontWeight: 800, fontSize: '1rem', paddingRight: '8px', borderRight: '1.5px solid #E2E8F0' }}>
              <span style={{ fontSize: '1.25rem' }}>🇮🇳</span>
              <span>+91</span>
            </div>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: '#0B0B0B',
                backgroundColor: 'transparent',
                letterSpacing: '0.04em',
              }}
              autoFocus
            />

            {isValidPhone && (
              <span style={{ color: '#1DAA5C', display: 'flex', alignItems: 'center' }}>
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Error text if entered invalid */}
          {phoneNumber.length > 0 && phoneNumber.length < 10 && (
            <span style={{ fontSize: '0.75rem', color: '#64748B', paddingLeft: '4px' }}>
              Please enter {10 - phoneNumber.length} more digit{10 - phoneNumber.length > 1 ? 's' : ''}
            </span>
          )}

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={!isValidPhone}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isValidPhone ? '#1DAA5C' : '#E2E8F0',
              color: isValidPhone ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isValidPhone ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 150ms ease',
              boxShadow: isValidPhone ? '0 4px 14px rgba(29, 170, 92, 0.3)' : 'none',
            }}
            className={isValidPhone ? 'sahyog-btn' : ''}
          >
            <span>Send OTP</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          {/* Referral Code Expandable */}
          <div style={{ marginTop: '4px' }}>
            {!showReferral ? (
              <button
                type="button"
                onClick={() => setShowReferral(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Have a referral code?</span>
                <span style={{ color: '#1DAA5C', fontWeight: 700 }}>Apply</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  placeholder="Enter Referral Code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />
                <button
                  type="button"
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#1DAA5C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
