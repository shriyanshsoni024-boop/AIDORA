import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, IndianRupee, Award, HeartHandshake } from 'lucide-react';

export const CooperativeTrustSection: React.FC = () => {
  const { language } = useLanguage();

  const PILLARS = [
    {
      icon: ShieldCheck,
      title: language === 'hi' ? '100% KYC व पुलिस जांच' : '100% Verified Artisans',
      desc: language === 'hi'
        ? 'आधार, कौशल प्रमाण व पुलिस सत्यापन से प्रमाणित कुशल कार्यबल।'
        : 'Aadhaar KYC, trade credential audit & police background checked.',
    },
    {
      icon: IndianRupee,
      title: language === 'hi' ? 'पारदर्शी निश्चित दरें' : 'Fixed Standard Rates',
      desc: language === 'hi'
        ? 'कोई अप्रत्याशित सर्ज चार्ज नहीं। पारदर्शी लेबर व पार्ट्स दरें।'
        : 'Zero surge pricing. Fixed cooperative rate cards with clear labor costs.',
    },
    {
      icon: Award,
      title: language === 'hi' ? '30-दिन नि:शुल्क वारंटी' : '30-Day AIDORA Cover',
      desc: language === 'hi'
        ? 'संतुष्ट न होने पर 30 दिन के भीतर नि:शुल्क सुधार गारंटी।'
        : 'Free rework protection if the repair has any recurring issue.',
    },
    {
      icon: HeartHandshake,
      title: language === 'hi' ? 'कारीगरों को 0% कमीशन' : '0% Commission Deduction',
      desc: language === 'hi'
        ? '0% बिचौलिया कमीशन। 85-90% मूल्य सीधे कारीगर को मिलता है।'
        : 'Zero middleman cut. 85-90% of service value directly to artisans.',
    },
  ];

  return (
    <section
      style={{
        padding: '20px 0 8px',
        borderTop: '1px solid #E5E7EB',
        marginTop: '6px',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', margin: '0 0 3px' }}>
          {language === 'hi' ? 'AIDORA सहकारी मंच की विशेषताएं' : 'The AIDORA Cooperative Guarantee'}
        </h2>
        <p style={{ fontSize: '0.71875rem', color: '#64748B', margin: 0, maxWidth: '640px' }}>
          {language === 'hi'
            ? 'निजी कंपनियों के भारी कमीशन के विपरीत, हमारा मंच कारीगरों और ग्राहकों दोनों के लिए पारदर्शी है।'
            : 'India’s transparent home-services federation ensuring quality repairs and ethical artisan livelihoods.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}
      >
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid var(--sahyog-sage, #D9E9C8)',
                  color: 'var(--sahyog-green, #1DAA5C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)', margin: '0 0 1px' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.6875rem', color: '#4B5563', margin: 0, lineHeight: 1.35 }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

