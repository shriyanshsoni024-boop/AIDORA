import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { WorkerProvider } from './context/WorkerContext';
import { TopAnnouncementBanner } from './components/common/TopAnnouncementBanner';
import { CustomerShell } from './components/shells/CustomerShell';
import { WorkerShell } from './components/shells/WorkerShell';
import { AdminShell } from './components/shells/AdminShell';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { WorkerLoginPage } from './pages/auth/WorkerLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { getThemeCssVariables } from './styles/themes';
import { Logo } from './components/common/Logo';

import { ResourcesPage } from './pages/public/ResourcesPage';

const AppRouter: React.FC = () => {
  const { session, currentRole, currentPath, isLoading } = useAuth();

  const themeKey = currentRole === 'admin' ? 'cooperative' : currentRole;
  const themeVariables = getThemeCssVariables(themeKey);

  // Check if we are on a standalone public page or login page
  const isStandalonePage =
    currentPath === '/customer/login' ||
    currentPath === '/customer/signup' ||
    currentPath === '/worker/login' ||
    currentPath === '/worker/signup' ||
    currentPath === '/admin/login' ||
    currentPath === '/resources' ||
    (!session.isAuthenticated && currentPath === '/');

  // Loading state during initial Supabase session verification
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <Logo size="lg" style={{ marginBottom: '16px' }} />
        <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          AIDORA
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
          Verifying secure session...
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    // 0. Public Project Resources Route
    if (currentPath === '/resources') {
      return <ResourcesPage />;
    }

    // 1. Standalone Login Routes & Unauthenticated Root
    if (currentPath === '/customer/login' || currentPath === '/customer/signup') {
      return <CustomerLoginPage />;
    }
    if (currentPath === '/worker/login' || currentPath === '/worker/signup') {
      return <WorkerLoginPage />;
    }
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }

    // If unauthenticated on root "/", ALWAYS show the real customer login page
    if (!session.isAuthenticated && currentPath === '/') {
      return <CustomerLoginPage />;
    }

    // 2. Protected Worker Routes
    if (currentPath.startsWith('/worker')) {
      return (
        <ProtectedRoute requiredRole="worker">
          <WorkerShell />
        </ProtectedRoute>
      );
    }

    // 3. Protected Admin Routes
    if (currentPath.startsWith('/admin')) {
      return (
        <ProtectedRoute requiredRole="admin">
          <AdminShell />
        </ProtectedRoute>
      );
    }

    // 4. Authenticated Root ("/") Routing by User Role
    if (currentPath === '/') {
      if (session.role === 'worker') {
        return (
          <ProtectedRoute requiredRole="worker">
            <WorkerShell />
          </ProtectedRoute>
        );
      }
      if (session.role === 'admin') {
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminShell />
          </ProtectedRoute>
        );
      }
      return (
        <ProtectedRoute requiredRole="customer">
          <div style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}>
            <CustomerShell />
          </div>
        </ProtectedRoute>
      );
    }

    // 5. Default Customer Protected Routes (/customer/*)
    return (
      <ProtectedRoute requiredRole="customer">
        <div style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}>
          <CustomerShell />
        </div>
      </ProtectedRoute>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        ...themeVariables,
      }}
      className="theme-transition"
    >
      {/* Contextual Top Announcement Banner (Hidden on clean login/resources screens) */}
      {!isStandalonePage && session.isAuthenticated && <TopAnnouncementBanner currentRole={themeKey} />}

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        {renderCurrentView()}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <WorkerProvider>
            <AppRouter />
          </WorkerProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
