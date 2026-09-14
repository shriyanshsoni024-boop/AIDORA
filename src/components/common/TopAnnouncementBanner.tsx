import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { X, ChevronRight } from 'lucide-react';

export interface TopAnnouncementBannerProps {
  currentRole: 'customer' | 'worker' | 'cooperative' | 'admin';
  onNavigateToEmergency?: () => void;
}

export const TopAnnouncementBanner: React.FC<TopAnnouncementBannerProps> = ({
  currentRole,
  onNavigateToEmergency,
}) => {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getAnnouncement = () => {
    switch (currentRole) {
      case 'worker':
        return {
          tag: language === 'hi' ? 'कारीगर लाइव' : 'Artisan Network',
          text: language === 'hi'
            ? 'सहकारी दर कार्ड सक्रिय: 85-90% मूल्य सीधे आपके खाते में • 0% कमीशन'
            : 'Cooperative Rate Card: 85-90% direct payout to artisan • 0% middleman commission',
        };
      case 'cooperative':
      case 'admin':
        return {
          tag: language === 'hi' ? 'सहकारी संघ' : 'Federation Node',
          text: language === 'hi'
            ? 'राष्ट्रीय कुशल कार्यबल संघ: 128 पंजीकृत कारीगर • रीयल-टाइम मांग आवंटन'
            : 'Artisan Federation: 128 verified artisans • Real-time demand allocation active',
        };
      case 'customer':
      default:
        return {
          tag: language === 'hi' ? 'सहकारी गारंटी' : 'Cooperative Cover',
          text: language === 'hi'
            ? '48 सत्यापित कारीगर उपलब्ध • निश्चित दरें, 0% सर्ज एवं 30-दिन नि:शुल्क वारंटी'
            : '48 Verified Artisans nearby • Upfront standard rates & 30-Day AIDORA guarantee',
        };
    }
  };

  const item = getAnnouncement();

  return (
    <div
      style={{
        backgroundColor: 'var(--theme-banner)',
        color: 'var(--theme-banner-text)',
        borderBottom: '1px solid var(--theme-banner-border)',
        padding: '3px 12px',
        fontSize: '0.6875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        transition: 'background-color var(--transition-theme), color var(--transition-theme), border-color var(--transition-theme)',
        zIndex: 40,
        height: '26px',
      }}
      className="theme-transition"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: '0.59375rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flexShrink: 0,
            opacity: 0.9,
          }}
        >
          {item.tag}:
        </span>

        <span
          style={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
          }}
        >
          {item.text}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {onNavigateToEmergency && currentRole === 'customer' && (
          <button
            type="button"
            onClick={onNavigateToEmergency}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--theme-banner-text)',
              fontSize: '0.65625rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
            className="hide-mobile"
          >
            <span>{language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency Help'}</span>
            <ChevronRight size={11} />
          </button>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: '1px',
            cursor: 'pointer',
            color: 'var(--theme-banner-text)',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Dismiss announcement"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
