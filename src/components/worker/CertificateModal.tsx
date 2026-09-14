import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { X, ShieldCheck, Award, Download, CheckCircle, QrCode, Check } from 'lucide-react';
import { generateSkillCertificatePdf } from '../../services/certificateService';

export const CertificateModal: React.FC = () => {
  const { showCertificateModal, setShowCertificateModal, activeCertificate, worker } = useWorker();
  const { language } = useLanguage();

  if (!showCertificateModal || !activeCertificate) return null;

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={() => setShowCertificateModal(false)}
    >
      <div
        className="animate-modal-enter"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          type="button"
          onClick={() => setShowCertificateModal(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            zIndex: 10,
          }}
        >
          <X size={16} />
        </button>

        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {/* Certificate Container with Clean Border */}
          <div
            style={{
              border: '3px solid var(--primary, #1DAA5C)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 20px',
              backgroundColor: '#FAFAF9',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Top AIDORA Cooperative Crest */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary-dark, #0F7A3E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Award size={22} />
              </div>
            </div>

            <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AIDORA NATIONAL WORKER COOPERATIVE FEDERATION
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 2px', fontFamily: 'Georgia, serif' }}>
              Certificate of Trade Competency
            </h2>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', fontStyle: 'italic', marginBottom: '14px' }}>
              Skill Benchmark Standard • NSDC Level-4 Aligned
            </div>

            <p style={{ fontSize: '0.75rem', color: '#475569', margin: '0 0 6px' }}>
              This is to officially certify that
            </p>

            {/* Worker Name */}
            <div
              style={{
                fontSize: '1.375rem',
                fontWeight: 900,
                color: 'var(--primary)',
                borderBottom: '2px solid #CBD5E1',
                display: 'inline-block',
                paddingBottom: '2px',
                marginBottom: '10px',
                fontFamily: 'Georgia, serif',
              }}
            >
              {activeCertificate.workerName}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#475569', margin: '0 auto 12px', maxWidth: '400px', lineHeight: 1.4 }}>
              has successfully cleared the 10-Mark Practical Skill Assessment with an accredited score of <strong>{activeCertificate.score}/10 ({activeCertificate.score * 10}%)</strong> in:
            </p>

            {/* Profession & Training Name */}
            <div
              style={{
                backgroundColor: 'var(--primary-light, #F0FDF4)',
                border: '1.5px solid var(--primary-border, #D9E9C8)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px 12px',
                marginBottom: '14px',
              }}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary-dark, #0F7A3E)' }}>
                {activeCertificate.profession} — Certified Specialist
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#334155', marginTop: '3px' }}>
                Skills: {activeCertificate.skills.join(' • ')}
              </div>
            </div>

            {/* Verification Metadata & QR Code */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #E2E8F0',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: '0.625rem', color: '#64748B' }}>Certificate ID:</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                  {activeCertificate.certificateNumber}
                </div>
                <div style={{ fontSize: '0.625rem', color: '#64748B', marginTop: '2px' }}>
                  Issue Date: {activeCertificate.issueDate} • Valid: {activeCertificate.expiryDate}
                </div>
              </div>

              {/* QR Code & Verified Status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                  }}
                >
                  <QrCode size={32} />
                </div>
                <span
                  style={{
                    fontSize: '0.5625rem',
                    color: '#059669',
                    fontWeight: 800,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <Check size={10} strokeWidth={3} />
                  Verified Certificate
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                marginTop: '10px',
                fontSize: '0.5625rem',
                color: '#94A3B8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              AIDORA Official Cooperative Skill Registry • Verified Digital Credential
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              className="sahyog-btn"
            >
              <CheckCircle size={15} />
              <span>{language === 'hi' ? 'प्रोफ़ाइल में सहेजें' : 'Save to Profile Wallet'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeCertificate) {
                  generateSkillCertificatePdf({
                    workerName: worker?.name || 'Artisan',
                    phone: worker?.phone,
                    trade: worker?.professions?.[0] || 'Technical Specialist',
                    certificate: activeCertificate,
                  });
                }
                setShowCertificateModal(false);
              }}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                border: '1px solid var(--border-default)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
