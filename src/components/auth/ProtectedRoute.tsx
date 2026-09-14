import React from 'react';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole: Role;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { session, navigate } = useAuth();

  const isRoleMatch = session.isAuthenticated && session.role === requiredRole;

  if (!session.isAuthenticated || !isRoleMatch) {
    const roleLabels: Record<Role, { title: string; subtitle: string; loginPath: string; accentColor: string }> = {
      customer: {
        title: 'Customer Authentication Required',
        subtitle: 'Please sign in with your customer account to access the marketplace, bookings, and profile.',
        loginPath: '/customer/login',
        accentColor: '#1DAA5C',
      },
      worker: {
        title: 'Artisan Pro Access Restricted',
        subtitle: 'This workspace is restricted to registered & verified AIDORA cooperative artisans.',
        loginPath: '/worker/login',
        accentColor: '#1DAA5C',
      },
      admin: {
        title: 'Cooperative Federation Security Gate',
        subtitle: 'Restricted administrative portal for authorized cooperative officers & nodal coordinators.',
        loginPath: '/admin/login',
        accentColor: '#1DAA5C',
      },
    };

    const target = roleLabels[requiredRole];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: '24px 16px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}
        >
          {target.title}
        </h2>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#4B5563',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}
        >
          {target.subtitle}
        </p>

        {session.isAuthenticated && session.role !== requiredRole && (
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#92400E',
              marginBottom: '20px',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <strong>Note:</strong> You are currently signed in as <strong>{session.role.toUpperCase()}</strong> ({session.user?.name}). You cannot view {requiredRole} protected routes directly.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button
            type="button"
            onClick={() => navigate(target.loginPath)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: target.accentColor,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            className="sahyog-btn"
          >
            <LogIn size={18} />
            <span>Go to {requiredRole.toUpperCase()} Login</span>
          </button>

          {session.isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                switch (session.role) {
                  case 'worker':
                    navigate('/worker/home');
                    break;
                  case 'admin':
                    navigate('/admin/dashboard');
                    break;
                  case 'customer':
                  default:
                    navigate('/customer/home');
                    break;
                }
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#4B5563',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={16} />
              <span>Return to my {session.role.toUpperCase()} Home</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
