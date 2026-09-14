import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Phone, Mail, ExternalLink, Heart } from 'lucide-react';
import { Logo } from './Logo';

export const MarketplaceFooter: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveView } = useBooking();

  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        padding: '30px 16px 20px',
        borderTop: '1px solid #1E293B',
        marginTop: '20px',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Top Tier: Brand, Tagline & Helpline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size="sm" />
            <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              AIDORA
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: '#6EE7B7',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                letterSpacing: '0.04em',
              }}
            >
              COOPERATIVE FEDERATION
            </span>
          </div>

          <p style={{ color: '#CBD5E1', fontSize: '0.75rem', lineHeight: 1.4, margin: 0, maxWidth: '640px' }}>
            {language === 'hi'
              ? 'AIDORA भारत का पहला राष्ट्रीय सहकारी कुशल कार्यबल मंच है, जो कारीगरों को सम्मानजनक आजीविका और ग्राहकों को पारदर्शी व प्रमाणित सेवाएं प्रदान करता है।'
              : 'AIDORA is India’s national worker cooperative platform connecting households with verified electricians, plumbers, carpenters, and appliance specialists under transparent, standard rate cards.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F8FAFC' }}>
              <Phone size={13} color="#34D399" />
              <span>24x7 Helpline: <strong>1800-AIDORA-CARE</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F8FAFC' }}>
              <Mail size={13} color="#34D399" />
              <span>help@aidora-coop.org.in</span>
            </div>
          </div>
        </div>

        {/* Middle Tier: Grid of Directory Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #1E293B',
          }}
        >
          {/* Services */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '8px' }}>
              {language === 'hi' ? 'सेवाएं' : 'Home Services'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>Electrician Services</span></li>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>AC Repair & Jet Wash</span></li>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>Plumbing & Drainage</span></li>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>Carpentry & Locks</span></li>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>Deep Home Cleaning</span></li>
              <li><span style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setActiveView('home')}>Appliance Servicing</span></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '8px' }}>
              {language === 'hi' ? 'लोकप्रिय शहर' : 'Service Cities'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><span>Delhi NCR (Noida / Gurgaon / Delhi)</span></li>
              <li><span>Bengaluru (Indiranagar / HSR / Koramangala)</span></li>
              <li><span>Mumbai & Navi Mumbai</span></li>
              <li><span>Pune & Pimpri</span></li>
              <li><span>Hyderabad & Secunderabad</span></li>
              <li><span>Lucknow & Kanpur</span></li>
            </ul>
          </div>

          {/* Trust & Cooperative */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '8px' }}>
              {language === 'hi' ? 'सहकारी संगठन' : 'Cooperative Union'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><span>About Federation</span></li>
              <li><span>Cooperative Bylaws</span></li>
              <li><span>Worker Welfare Fund</span></li>
              <li><span>30-Day Guarantee Policy</span></li>
              <li><span>Grievance Officer</span></li>
              <li><span>Safety & Insurance Cover</span></li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '8px' }}>
              {language === 'hi' ? 'कारीगरों के लिए' : 'For Professionals'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0, color: '#94A3B8', lineHeight: 1.35 }}>
                {language === 'hi'
                  ? 'सत्यापित सहकारी कारीगर बनें और 85-90% पारिश्रमिक प्राप्त करें।'
                  : 'Join as a certified artisan partner and earn fair cooperative wages.'}
              </p>
              <button
                type="button"
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: 'fit-content',
                }}
              >
                <span>{language === 'hi' ? 'कारीगर साथी बनें' : 'Join as Artisan Partner'}</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Trust Badges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: '16px',
            borderTop: '1px solid #1E293B',
            alignItems: 'center',
            textAlign: 'center',
            color: '#64748B',
            fontSize: '0.6875rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <span>✓ 100% Aadhaar KYC Verified</span>
            <span>✓ Police Clearance Backed</span>
            <span>✓ NSDC / Skill India Recognized</span>
            <span>✓ Fixed Standard Rates</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>© 2026 AIDORA National Worker Cooperative Federation Ltd. Made with</span>
            <Heart size={11} color="#EF4444" fill="#EF4444" />
            <span>for Indian Artisans & Citizens.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
