import React, { useState } from 'react';
import { SPOTLIGHT_PROMOTIONS, SpotlightItem } from '../../data/marketplaceData';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export interface SpotlightBannerProps {
  onSelectPromotion: (promo: SpotlightItem) => void;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({ onSelectPromotion }) => {
  const { language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  const current = SPOTLIGHT_PROMOTIONS[activeIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', margin: 0 }}>
            {language === 'hi' ? 'विशेष ऑफर एवं अभियान' : 'Featured Deals & Offers'}
          </h2>
          <p style={{ fontSize: '0.71875rem', color: '#64748B', margin: '2px 0 0' }}>
            {language === 'hi' ? 'सहकारी गारंटी के साथ मौसमी छूट' : 'Seasonal discounts backed by 30-day rework cover'}
          </p>
        </div>

        {/* Carousel indicators */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {SPOTLIGHT_PROMOTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              style={{
                width: i === activeIdx ? '16px' : '5px',
                height: '5px',
                borderRadius: '9999px',
                backgroundColor: i === activeIdx ? 'var(--sahyog-green, #1DAA5C)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Promotional Card with Realistic Trade Image & Clean Overlay */}
      <div
        onClick={() => onSelectPromotion(current)}
        style={{
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          minHeight: '136px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '14px 18px',
          color: '#FFFFFF',
          border: '1px solid #E5E7EB',
        }}
        className="hover-card"
      >
        {/* Background Image with Dark Dimmer */}
        {current.image && (
          <img
            src={current.image}
            alt={current.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.72) 65%, rgba(15, 23, 42, 0.35) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Tag & Price */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.5625rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              backgroundColor: '#F8CB46',
              color: '#111827',
              padding: '2px 7px',
              borderRadius: '3px',
              textTransform: 'uppercase',
            }}
          >
            {language === 'hi' ? current.tagHi : current.tag}
          </span>

          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: '#FEF08A',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              padding: '2px 7px',
              borderRadius: '3px',
              border: '1px solid rgba(254, 240, 138, 0.25)',
            }}
          >
            {current.priceTag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div style={{ position: 'relative', zIndex: 2, margin: '6px 0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, margin: '0 0 2px' }}>
            {language === 'hi' ? current.titleHi : current.title}
          </h3>
          <p style={{ fontSize: '0.71875rem', color: '#E2E8F0', margin: 0, lineHeight: 1.3, maxWidth: '80%' }}>
            {language === 'hi' ? current.subtitleHi : current.subtitle}
          </p>
        </div>

        {/* Bottom CTA Row */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65625rem', color: '#CBD5E1' }}>
            <ShieldCheck size={13} color="#34D399" />
            <span>{language === 'hi' ? '30-दिन नि:शुल्क वारंटी' : '30-Day AIDORA Guarantee'}</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: '#FFFFFF',
              color: '#111827',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '3px',
              height: '24px',
            }}
          >
            <span>{language === 'hi' ? current.ctaTextHi : current.ctaText}</span>
            <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </div>
  );
};

