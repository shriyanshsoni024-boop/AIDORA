import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight, KeyRound, AlertCircle, MoreVertical } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage: React.FC = () => {
  const { login, navigate } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Top-Right Three-Dot Menu State & Click-Outside Ref
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = identifier.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter your federation official email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login('admin', { identifier: cleanEmail, password });
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify federation administrative credentials.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '410px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top-Right Three-Dot Menu */}
        <div ref={menuRef} style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 30 }}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: menuOpen ? '#F1F5F9' : '#FFFFFF',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
            aria-label="Other Login Options"
            aria-expanded={menuOpen}
          >
            <MoreVertical size={18} />
          </button>

          {/* Clean Modern Dropdown Menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                padding: '6px',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 50,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/worker/login');
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#1E293B',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Worker Login</span>
                <span style={{ color: '#1DAA5C', fontWeight: 700 }}>→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/customer/login');
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#1E293B',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Customer Login</span>
                <span style={{ color: '#1DAA5C', fontWeight: 700 }}>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Logo size="lg" style={{ marginBottom: '14px' }} />

          <h2
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#334155',
              margin: '0 0 6px',
            }}
          >
            Cooperative Admin Login
          </h2>

          <p
            style={{
              fontSize: '0.8125rem',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Central operations, artisan KYC verification & cooperative management
          </p>
        </div>

        {/* Security Advisory Badge */}
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#FEF9C3',
            border: '1px solid #FDE047',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#854D0E',
            lineHeight: 1.4,
          }}
        >
          <KeyRound size={16} color="#854D0E" style={{ flexShrink: 0 }} />
          <span>
            Authorized Personnel Only. Public customer/worker signups are restricted.
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#B91C1C',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Forgot Password Notice */}
        {showForgotNotice && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#15803D',
              lineHeight: 1.4,
            }}
          >
            <strong>Security Notice:</strong> Administrative credentials are provisioned by the Central Federation IT desk. Please contact your nodal officer for access recovery.
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN SIGN IN FORM                                        */}
        {/* ========================================================= */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="admin-email"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#1E293B',
              }}
            >
              Federation Official Email / Officer ID
            </label>
            <div
              className="sahyog-input-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                padding: '0 12px',
                height: '46px',
                boxSizing: 'border-box',
              }}
            >
              <Mail size={16} color="#1DAA5C" style={{ flexShrink: 0, marginRight: '8px' }} />
              <input
                id="admin-email"
                type="email"
                placeholder="e.g. operations@aidora.coop"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  color: '#0F172A',
                  backgroundColor: 'transparent',
                  height: '100%',
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1E293B',
                }}
              >
                Administrative Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotNotice(!showForgotNotice)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1DAA5C',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            <div
              className="sahyog-input-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                padding: '0 12px',
                height: '46px',
                boxSizing: 'border-box',
              }}
            >
              <Lock size={16} color="#1DAA5C" style={{ flexShrink: 0, marginRight: '8px' }} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin security password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  color: '#0F172A',
                  backgroundColor: 'transparent',
                  height: '100%',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '4px',
              height: '46px',
              backgroundColor: '#1DAA5C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'background-color 150ms ease, opacity 150ms ease, transform 100ms ease',
            }}
            className="sahyog-btn"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Operations Command'}</span>
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};
