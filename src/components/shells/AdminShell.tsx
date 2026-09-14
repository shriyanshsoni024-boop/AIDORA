import React from 'react';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { LanguageToggle } from '../common/LanguageToggle';
import { LogOut } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const AdminShell: React.FC = () => {
  const { language } = useLanguage();
  const { logout } = useAuth();

  return (
    <div
      className="container-focused-flow animate-fade-in theme-transition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        boxShadow: '0 0 35px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Top Admin Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--theme-header, #FFFFFF)',
          borderBottom: '1px solid var(--theme-header-border, var(--border-default))',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xs)',
        }}
        className="theme-transition"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size="sm" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 900, color: 'var(--theme-text, #0B0B0B)', letterSpacing: '-0.02em' }}>
                AIDORA
              </span>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--theme-accent-light, #F0FDF4)',
                  color: 'var(--sahyog-green-dark, #0F7A3E)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--theme-accent-border, #D9E9C8)',
                  letterSpacing: '0.03em',
                }}
              >
                FEDERATION OPS
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #8A8A8A)' }}>
              {language === 'hi' ? 'सहकारी संचालन एवं प्रबंधन' : 'Central Operations & Workforce'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageToggle />
          <button
            type="button"
            onClick={() => logout()}
            title="Sign out of Operations Command"
            aria-label="Sign out"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '16px' }}>
        <AdminDashboardPage />
      </main>
    </div>
  );
};

