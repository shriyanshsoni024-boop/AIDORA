import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, MapPin, RefreshCw, Edit2, AlertCircle, CheckCircle2, MoreVertical } from 'lucide-react';
import { DEFAULT_LOCATION } from '../../data/locations';
import { isValidIndianMobile } from '../../lib/supabase';

interface CustomerLoginPageProps {
  initialView?: 'LOGIN' | 'SIGNUP';
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({ initialView }) => {
  const { sendPhoneOtp, verifyPhoneOtp, currentPath, navigate } = useAuth();

  // Determine initial view based on props or current path
  const [authView, setAuthView] = useState<'LOGIN' | 'SIGNUP'>(() => {
    if (initialView) return initialView;
    return currentPath === '/customer/signup' ? 'SIGNUP' : 'LOGIN';
  });

  // Steps: 'FORM' | 'OTP'
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

  // Form Fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [locality, setLocality] = useState(DEFAULT_LOCATION);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

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

  // Sync state if currentPath changes externally
  useEffect(() => {
    if (currentPath === '/customer/signup' && authView !== 'SIGNUP') {
      setAuthView('SIGNUP');
      setStep('FORM');
      setErrorMsg(null);
      setSuccessMsg(null);
    } else if (currentPath === '/customer/login' && authView !== 'LOGIN') {
      setAuthView('LOGIN');
      setStep('FORM');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [currentPath]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (step === 'OTP' && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, countdown]);

  const switchView = (newView: 'LOGIN' | 'SIGNUP') => {
    setAuthView(newView);
    setStep('FORM');
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpCode('');
    navigate(newView === 'SIGNUP' ? '/customer/signup' : '/customer/login');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!isValidIndianMobile(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (authView === 'SIGNUP') {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!locality.trim()) {
        setErrorMsg('Please enter your service locality.');
        return;
      }
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(res.message || 'Demo OTP: 123456');
        setStep('OTP');
        setCountdown(45);
        setCanResend(false);
      } else {
        setErrorMsg(res.error || 'Failed to send verification code. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const token = otpCode.trim();
    if (!token) {
      setErrorMsg('Please enter the verification OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyPhoneOtp({
        phone: phone.trim().replace(/\D/g, ''),
        token,
        role: 'customer',
        name: name.trim() || 'SAHYOG Customer',
        locality: locality.trim() || DEFAULT_LOCATION,
        email: email.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid OTP');
      }
    } catch {
      setErrorMsg('Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isSubmitting) return;
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(res.message || 'Demo OTP: 123456');
        setCountdown(45);
        setCanResend(false);
      } else {
        setErrorMsg(res.error || 'Failed to resend code.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
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
                  navigate('/admin/login');
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
                <span>Cooperative Admin Login</span>
                <span style={{ color: '#475569', fontWeight: 700 }}>→</span>
              </button>
            </div>
          )}
        </div>

        {/* SAHYOG Branding & Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#1DAA5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0B0B0B',
              letterSpacing: '-0.02em',
              margin: '0 0 2px',
              fontFamily: 'var(--font-display)',
            }}
          >
            SAHYOG
          </h1>

          <h2
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#334155',
              margin: '0 0 6px',
            }}
          >
            {step === 'OTP'
              ? 'Verification Code'
              : authView === 'SIGNUP'
              ? 'Create Account'
              : 'Customer Login'}
          </h2>

          <p
            style={{
              fontSize: '0.8125rem',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {step === 'OTP'
              ? `Enter the 6-digit code sent to +91 ${phone}`
              : authView === 'SIGNUP'
              ? 'Sign up to access verified neighborhood services'
              : 'Sign in with your mobile number to continue'}
          </p>
        </div>

        {/* Error / Success Alerts */}
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

        {successMsg && !errorMsg && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#15803D',
              lineHeight: 1.4,
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'FORM' ? (
          /* ========================================================= */
          /* STEP 1: FORM VIEW (LOGIN OR SIGNUP)                       */
          /* ========================================================= */
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Mobile Number Field (Present in both Login and Sign Up) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="customer-phone-input"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1E293B',
                }}
              >
                Mobile Number
              </label>

              <div
                className="sahyog-input-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                  height: '46px',
                }}
              >
                <div
                  style={{
                    padding: '0 12px',
                    backgroundColor: '#F8FAFC',
                    borderRight: '1px solid #E2E8F0',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '100%',
                    userSelect: 'none',
                  }}
                >
                  <span aria-hidden="true">🇮🇳</span>
                  <span>+91</span>
                </div>

                <input
                  id="customer-phone-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '0 12px',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: '#0F172A',
                    backgroundColor: 'transparent',
                    height: '100%',
                  }}
                  required
                />
              </div>
            </div>

            {/* Additional Customer Profile Fields (Shown on Sign Up) */}
            {authView === 'SIGNUP' && (
              <>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="customer-signup-name"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    id="customer-signup-name"
                    type="text"
                    placeholder="e.g. Ananya Deshmukh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      height: '44px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0 12px',
                      fontSize: '0.875rem',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>

                {/* Service Locality / Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="customer-signup-locality"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    Service Locality / Location
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
                      height: '44px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <MapPin size={15} color="#94A3B8" style={{ flexShrink: 0, marginRight: '8px' }} />
                    <input
                      id="customer-signup-locality"
                      type="text"
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
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

                {/* Email Address (Optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label
                      htmlFor="customer-signup-email"
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#1E293B',
                      }}
                    >
                      Email Address
                    </label>
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>Optional</span>
                  </div>
                  <input
                    id="customer-signup-email"
                    type="email"
                    placeholder="e.g. ananya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      height: '44px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0 12px',
                      fontSize: '0.875rem',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            {/* Primary Action Button */}
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
              <span>
                {isSubmitting
                  ? 'Sending OTP...'
                  : authView === 'SIGNUP'
                  ? 'Send OTP & Continue'
                  : 'Send OTP'}
              </span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        ) : (
          /* ========================================================= */
          /* STEP 2: OTP VERIFICATION                                 */
          /* ========================================================= */
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Phone Summary & Change Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' }}>
                +91 {phone}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('FORM');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1DAA5C',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 4px',
                }}
              >
                <Edit2 size={12} />
                <span>Change</span>
              </button>
            </div>

            {/* Demo OTP Banner */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#15803D" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#14532D' }}>
                    Demo OTP: 123456
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                    Enter 123456 to log in instantly
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode('123456')}
                style={{
                  padding: '4px 10px',
                  backgroundColor: '#1DAA5C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Auto Fill
              </button>
            </div>

            {/* OTP Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                htmlFor="otp-code-input"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  textAlign: 'center',
                }}
              >
                Enter 6-Digit Code
              </label>

              <div
                className="sahyog-input-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  height: '52px',
                }}
              >
                <input
                  id="otp-code-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textAlign: 'center',
                    color: '#0B0B0B',
                    backgroundColor: 'transparent',
                  }}
                  required
                />
              </div>
            </div>

            {/* Resend OTP */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {!canResend ? (
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Resend code in <strong>{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1DAA5C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 4px',
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Resend Demo OTP</span>
                </button>
              )}
            </div>

            {/* Verify CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
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
              <span>
                {isSubmitting
                  ? 'Verifying...'
                  : authView === 'SIGNUP'
                  ? 'Verify & Create Account'
                  : 'Verify & Continue'}
              </span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* Bottom Switch between Login and Sign Up */}
        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            paddingTop: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {authView === 'LOGIN' ? (
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchView('SIGNUP')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1DAA5C',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.8125rem',
                }}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchView('LOGIN')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1DAA5C',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.8125rem',
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
