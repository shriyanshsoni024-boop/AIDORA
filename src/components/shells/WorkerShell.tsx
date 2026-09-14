import React, { useEffect } from 'react';
import { WorkerHomePage } from '../../pages/worker/WorkerHomePage';
import { WorkerNav } from '../worker/WorkerNav';
import { LanguageToggle } from '../common/LanguageToggle';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../i18n/LanguageContext';
import { useWorker } from '../../context/WorkerContext';
import { getWorkerTheme } from '../../styles/workerThemes';

export const WorkerShell: React.FC = () => {
  const { language } = useLanguage();
  const { worker } = useWorker();

  const theme = getWorkerTheme(worker.professions);

  // Apply dynamic worker theme CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--worker-primary', theme.primary);
    root.style.setProperty('--worker-primary-dark', theme.primaryDark);
    root.style.setProperty('--worker-primary-light', theme.primaryLight);
    root.style.setProperty('--worker-primary-border', theme.primaryBorder);
    root.style.setProperty('--worker-accent', theme.accent);
  }, [theme]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: 'var(--pronto-cream, #FCFBF4)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Worker App Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size="sm" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                AIDORA
              </span>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  backgroundColor: theme.primaryLight,
                  color: theme.primary,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.primaryBorder}`,
                  letterSpacing: '0.04em',
                }}
              >
                ARTISAN PRO
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
              {language === 'hi' ? theme.taglineHi : theme.tagline}
            </div>
          </div>
        </div>

        <LanguageToggle />
      </header>

      {/* Main Tab Content */}
      <main style={{ flex: 1, position: 'relative' }}>
        <WorkerHomePage />
      </main>

      {/* Floating Bottom Navigation */}
      <WorkerNav />
    </div>
  );
};
