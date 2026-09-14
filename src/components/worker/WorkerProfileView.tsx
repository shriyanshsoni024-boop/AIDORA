import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import {
  ShieldCheck,
  Award,
  Star,
  Edit3,
  ChevronRight,
  Phone,
  MapPin,
  LogOut,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWorkerTheme } from '../../styles/workerThemes';

export const WorkerProfileView: React.FC = () => {
  const { logout } = useAuth();
  const {
    worker,
    certificates,
    setActiveCertificate,
    setShowCertificateModal,
    setShowOnboardingModal,
    isEmergencyAvailable,
    setIsEmergencyAvailable,
    skillsMatrix,
  } = useWorker();
  const { language } = useLanguage();

  const theme = getWorkerTheme(worker.professions);

  const handleOpenCert = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId) || certificates[0];
    if (cert) {
      setActiveCertificate(cert);
      setShowCertificateModal(true);
    }
  };

  const verifiedSkillsCount = skillsMatrix.filter((s) => s.verified).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px 16px 90px',
      }}
    >
      {/* 1. Large Artisan Identity Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px 18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={worker.avatar}
              alt={worker.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: `2.5px solid ${theme.primary}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              <ShieldCheck size={12} strokeWidth={3} />
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.1875rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                {worker.name}
              </h2>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: '#ECFDF5',
                  color: '#1DAA5C',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  border: '1px solid #A7F3D0',
                }}
              >
                KYC VERIFIED
              </span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: theme.primaryDark, fontWeight: 700, marginTop: '2px' }}>
              {worker.professions.join(' • ')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  padding: '2px 6px',
                  borderRadius: '6px',
                }}
              >
                <Star size={11} fill="#D97706" color="#D97706" />
                {worker.rating || 5.0} ({worker.reviewCount || 0} reviews)
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                • {worker.experienceYears || 1}+ Yrs Exp • {worker.completedJobs || 0} Jobs Done
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Zone Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
            <Phone size={14} color="#64748B" />
            <span style={{ fontWeight: 600 }}>{worker.phone || 'Registered Phone'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#475569' }}>
            <MapPin size={14} color="#64748B" />
            <span style={{ fontWeight: 600 }}>{worker.zone || 'Bangalore Urban'}</span>
          </div>
        </div>

        {/* Edit Profile Action */}
        <button
          type="button"
          onClick={() => setShowOnboardingModal(true)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Edit3 size={15} />
          <span>Update Professional Profile</span>
        </button>
      </div>

      {/* 2. Professional Identity & Trade Skills */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px',
          }}
        >
          Professional Identity & Guild Rank
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>Artisan Guild:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A' }}>
              {worker.cooperativeName || 'Noida District Artisan Federation'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>National Aadhaar:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
              {worker.aadhaarNumber || 'XXXX-XXXX-8921'} (Verified)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>Skill Matrix Badges:</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#1DAA5C',
                backgroundColor: '#ECFDF5',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #A7F3D0',
              }}
            >
              {verifiedSkillsCount} NSDC Verified
            </span>
          </div>
        </div>
      </div>

      {/* 3. Cooperative Safety Net & Insurance */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 16px',
          border: '1.5px solid #BBF7D0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <HeartHandshake size={20} color="#1DAA5C" />
          <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#065F46' }}>
            Cooperative Safety Net
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                ₹5,00,000 Accidental Cover
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                Active on every on-duty dispatch job
              </div>
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1DAA5C' }}>Active ✓</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                15-Min Emergency Squad
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                Priority dispatches with +25% payout bonus
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEmergencyAvailable(!isEmergencyAvailable)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: isEmergencyAvailable ? theme.primaryLight : '#F1F5F9',
                color: isEmergencyAvailable ? theme.primary : '#64748B',
                border: `1px solid ${isEmergencyAvailable ? theme.primaryBorder : '#CBD5E1'}`,
                fontSize: '0.6875rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isEmergencyAvailable ? 'Opted In' : 'Opt In'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Certificate Wallet Document Cards */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            paddingLeft: '4px',
          }}
        >
          Certificate Wallet ({certificates.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => handleOpenCert(cert.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              className="hover-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: theme.primaryLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.primary,
                  }}
                >
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                    {cert.profession} Certified
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                    ID: {cert.certificateNumber} • {cert.issueDate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: theme.primary, fontSize: '0.75rem', fontWeight: 700 }}>
                <span>View</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. App Settings & Language */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '14px 16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
          {language === 'hi' ? 'ऐप भाषा' : 'App Language'}
        </span>
        <LanguageToggle />
      </div>

      {/* 6. Logout Button */}
      <button
        type="button"
        onClick={logout}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '16px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          fontSize: '0.9375rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <LogOut size={18} />
        <span>Log Out of Artisan Account</span>
      </button>
    </div>
  );
};
