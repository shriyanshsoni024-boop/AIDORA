import React from 'react';
import { MapPin, ChevronDown, Zap, Calendar, Sparkles } from 'lucide-react';
import { CategoryTheme } from '../../styles/categoryThemes';

interface ProntoHeroHeaderProps {
  currentLocation: string;
  onOpenLocationSelector: () => void;
  onOpenProfile: () => void;
  theme: CategoryTheme;
  onInstantServiceClick: () => void;
  onScheduleServiceClick: () => void;
}

export const ProntoHeroHeader: React.FC<ProntoHeroHeaderProps> = ({
  currentLocation,
  onOpenLocationSelector,
  onOpenProfile,
  theme,
  onInstantServiceClick,
  onScheduleServiceClick,
}) => {
  return (
    <div
      style={{
        background: theme.headerBg,
        borderRadius: '0 0 28px 28px',
        padding: '16px 16px 24px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        transition: 'background 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms ease',
      }}
    >
      {/* Background Decorative Circles */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. TOP BAR: Address on Left & Profile Avatar on Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Selectable Address */}
        <button
          type="button"
          onClick={onOpenLocationSelector}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '9999px',
            padding: '6px 14px 6px 10px',
            color: '#FFFFFF',
            cursor: 'pointer',
            maxWidth: '280px',
            textAlign: 'left',
            transition: 'all 150ms ease',
          }}
          className="sahyog-btn"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.primary,
              flexShrink: 0,
            }}
          >
            <MapPin size={14} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.85, letterSpacing: '0.04em' }}>
              Service Location
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentLocation}
            </span>
          </div>

          <ChevronDown size={16} opacity={0.8} style={{ flexShrink: 0 }} />
        </button>

        {/* Profile Avatar Icon */}
        <button
          type="button"
          onClick={onOpenProfile}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
          aria-label="Open Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="User"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </button>
      </div>

      {/* 2. HERO HEADLINE & WORKER PHOTO CONTAINER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '210px' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={11} />
            <span>AIDORA Certified</span>
          </div>

          <h1
            style={{
              fontSize: '1.5625rem',
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              margin: '0 0 6px',
            }}
          >
            One professional,{'\n'}multiple home services
          </h1>

          <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0, lineHeight: 1.3 }}>
            {theme.tagline}
          </p>
        </div>

        {/* Worker Graphic / Photo */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80"
            alt="Verified Artisan"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              insetInline: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
              padding: '4px 6px',
              textAlign: 'center',
              fontSize: '0.625rem',
              fontWeight: 800,
            }}
          >
            ★ 4.9 Verified Pro
          </div>
        </div>
      </div>

      {/* 3. TWO LARGE ACTION CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Instant Service Card */}
        <button
          type="button"
          onClick={onInstantServiceClick}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transition: 'all 150ms ease',
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626',
              }}
            >
              <Zap size={20} strokeWidth={2.5} fill="#DC2626" />
            </div>

            <span
              style={{
                fontSize: '0.5625rem',
                fontWeight: 900,
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '2px 6px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              15 MINS
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Get Instant Service
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
              Emergency breakdown & quick fix
            </div>
          </div>
        </button>

        {/* Schedule for Later Card */}
        <button
          type="button"
          onClick={onScheduleServiceClick}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transition: 'all 150ms ease',
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-light, #F0FDF4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary, #1DAA5C)',
              }}
            >
              <Calendar size={20} strokeWidth={2.3} />
            </div>

            <span
              style={{
                fontSize: '0.5625rem',
                fontWeight: 800,
                backgroundColor: 'var(--primary-light, #F0FDF4)',
                color: 'var(--primary-dark, #0F7A3E)',
                border: '1px solid var(--primary-border, #D9E9C8)',
                padding: '1px 6px',
                borderRadius: '9999px',
              }}
            >
              Pick a slot
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Schedule for Later
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
              Choose your convenient time
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
