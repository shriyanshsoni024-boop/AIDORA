import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ArrowLeft, MapPin, Briefcase, Award, Clock, RefreshCw, Edit2, AlertCircle, CheckCircle2, MoreVertical } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { isValidIndianMobile } from '../../lib/supabase';
import { DEFAULT_LOCATION } from '../../data/locations';

const TRADE_OPTIONS = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Cleaner',
  'Painter',
  'Appliance Technician',
  'Other',
];

const AVAILABILITY_OPTIONS = [
  { label: 'Available Full-Time', value: 'AVAILABLE' as const },
  { label: 'Available Part-Time / Flexible', value: 'AVAILABLE' as const },
  { label: 'On-Demand & Emergency Ready', value: 'AVAILABLE' as const },
];

interface WorkerLoginPageProps {
  initialView?: 'LOGIN' | 'SIGNUP';
}

export const WorkerLoginPage: React.FC<WorkerLoginPageProps> = ({ initialView }) => {
  const { sendPhoneOtp, verifyPhoneOtp, currentPath, navigate } = useAuth();

  // Mode: 'LOGIN' | 'SIGNUP'
  const [authView, setAuthView] = useState<'LOGIN' | 'SIGNUP'>(() => {
    if (initialView) return initialView;
    return currentPath === '/worker/signup' ? 'SIGNUP' : 'LOGIN';
  });

  // Signup Multi-Step: 1 (Basic Details) | 2 (Worker Details)
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Auth Step: 'FORM' | 'OTP'
  const [authStep, setAuthStep] = useState<'FORM' | 'OTP'>('FORM');

  // Form Fields - Page 1 (Basic Details)
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [locality, setLocality] = useState(DEFAULT_LOCATION);

  // Form Fields - Page 2 (Worker Details)
  const [profession, setProfession] = useState('Electrician');
  const [skillsText, setSkillsText] = useState('');
  const [experienceYears, setExperienceYears] = useState('1');
  const [cooperativeBranch, setCooperativeBranch] = useState('');
  const [availability, setAvailability] = useState<'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE'>('AVAILABLE');
  const [email, setEmail] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // UI Feedback States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (currentPath === '/worker/signup' && authView !== 'SIGNUP') {
      setAuthView('SIGNUP');
      setSignupStep(1);
      setAuthStep('FORM');
      setErrorMsg(null);
      setSuccessMsg(null);
    } else if (currentPath === '/worker/login' && authView !== 'LOGIN') {
      setAuthView('LOGIN');
      setSignupStep(1);
      setAuthStep('FORM');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [currentPath]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (authStep === 'OTP' && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authStep, countdown]);

  const switchView = (newView: 'LOGIN' | 'SIGNUP') => {
    setAuthView(newView);
    setSignupStep(1);
    setAuthStep('FORM');
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpCode('');
    navigate(newView === 'SIGNUP' ? '/worker/signup' : '/worker/login');
  };

  // Handle Page 1 Submission (Login or Signup Step 1)
  const handlePage1Submit = async (e: React.FormEvent) => {
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
        setErrorMsg('Please enter your full name as per official ID.');
        return;
      }
      if (!locality.trim()) {
        setErrorMsg('Please enter your service locality / area.');
        return;
      }

      // Validated Page 1 -> Move to Page 2
      setSignupStep(2);
      return;
    }

    // In Login mode -> Send OTP directly
    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(res.message || 'Demo OTP: 123456');
        setAuthStep('OTP');
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

  // Handle Page 2 Submission (Signup Step 2 -> Send OTP)
  const handlePage2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!profession.trim()) {
      setErrorMsg('Please select your service trade / category.');
      return;
    }
    if (!skillsText.trim()) {
      setErrorMsg('Please list the specific services or skills you provide.');
      return;
    }
    const expNum = parseInt(experienceYears, 10);
    if (isNaN(expNum) || expNum < 0 || expNum > 50) {
      setErrorMsg('Please enter valid years of experience (1-50).');
      return;
    }
    if (!cooperativeBranch.trim()) {
      setErrorMsg('Please specify your cooperative union branch or service hub.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(res.message || 'Demo OTP: 123456');
        setAuthStep('OTP');
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

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const token = otpCode.trim();
    if (!token) {
      setErrorMsg('Please enter the verification OTP.');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      const res = await verifyPhoneOtp({
        phone: phone.trim().replace(/\D/g, ''),
        token,
        role: 'worker',
        name: name.trim() || 'Artisan Partner',
        locality: locality.trim() || DEFAULT_LOCATION,
        email: email.trim() || undefined,
        profession: profession.trim() || 'Electrician',
        skills: parsedSkills.length > 0 ? parsedSkills : [profession],
        experienceYears: parseInt(experienceYears, 10) || 1,
        cooperativeBranch: cooperativeBranch.trim() || 'AIDORA Cooperative Federation',
        availability,
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

  // Handle OTP Resend
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
            {authStep === 'OTP'
              ? 'Verification Code'
              : authView === 'LOGIN'
              ? 'Worker Login'
              : signupStep === 1
              ? 'Create Worker Account'
              : 'Worker Details'}
          </h2>

          <p
            style={{
              fontSize: '0.8125rem',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {authStep === 'OTP'
              ? `Enter the 6-digit code sent to +91 ${phone}`
              : authView === 'LOGIN'
              ? 'Sign in to manage your services and bookings'
              : signupStep === 1
              ? 'Join as a certified cooperative service professional'
              : 'Tell us about your trade, skills and experience'}
          </p>

          {/* Minimal Step Indicator for Sign Up */}
          {authView === 'SIGNUP' && authStep === 'FORM' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '4px',
                  borderRadius: '9999px',
                  backgroundColor: '#1DAA5C',
                }}
              />
              <div
                style={{
                  width: '24px',
                  height: '4px',
                  borderRadius: '9999px',
                  backgroundColor: signupStep === 2 ? '#1DAA5C' : '#E2E8F0',
                  transition: 'background-color 200ms ease',
                }}
              />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', marginLeft: '4px' }}>
                Step {signupStep} of 2
              </span>
            </div>
          )}
        </div>

        {/* Alerts */}
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

        {authStep === 'FORM' ? (
          authView === 'LOGIN' ? (
            /* ========================================================= */
            /* WORKER LOGIN FORM                                         */
            /* ========================================================= */
            <form onSubmit={handlePage1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="worker-login-phone"
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
                    id="worker-login-phone"
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
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          ) : signupStep === 1 ? (
            /* ========================================================= */
            /* WORKER SIGNUP - PAGE 1: BASIC DETAILS                     */
            /* ========================================================= */
            <form onSubmit={handlePage1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Mobile Number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="worker-signup-phone"
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
                    id="worker-signup-phone"
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

              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="worker-signup-name"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  Full Name
                </label>
                <input
                  id="worker-signup-name"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
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

              {/* Service Locality / Location (Area only) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="worker-signup-locality"
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
                    id="worker-signup-locality"
                    type="text"
                    placeholder="e.g. Sector 62, Noida"
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

              {/* Page 1 CTA */}
              <button
                type="submit"
                style={{
                  marginTop: '4px',
                  height: '46px',
                  backgroundColor: '#1DAA5C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 150ms ease, opacity 150ms ease, transform 100ms ease',
                }}
                className="sahyog-btn"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* ========================================================= */
            /* WORKER SIGNUP - PAGE 2: WORKER DETAILS                    */
            /* ========================================================= */
            <form onSubmit={handlePage2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Back to Page 1 trigger */}
              <button
                type="button"
                onClick={() => {
                  setSignupStep(1);
                  setErrorMsg(null);
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 0',
                  margin: '-4px 0 2px',
                }}
              >
                <ArrowLeft size={13} />
                <span>Back to Basic Details</span>
              </button>

              {/* Trade / Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label
                  htmlFor="worker-profession-select"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  Service Category / Trade
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
                  <Briefcase size={15} color="#1DAA5C" style={{ flexShrink: 0, marginRight: '8px' }} />
                  <select
                    id="worker-profession-select"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.875rem',
                      color: '#0F172A',
                      backgroundColor: 'transparent',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    required
                  >
                    {TRADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills / Services Offered */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label
                  htmlFor="worker-skills-input"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  Skills / Services Offered
                </label>
                <input
                  id="worker-skills-input"
                  type="text"
                  placeholder="e.g. Wiring, MCB Setup, Fan Fitting"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
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

              {/* Experience & Availability Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label
                    htmlFor="worker-exp-input"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    Experience (Yrs)
                  </label>
                  <input
                    id="worker-exp-input"
                    type="number"
                    min="1"
                    max="40"
                    placeholder="e.g. 5"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label
                    htmlFor="worker-avail-select"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    Availability
                  </label>
                  <div
                    className="sahyog-input-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      padding: '0 8px',
                      height: '44px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Clock size={14} color="#1DAA5C" style={{ flexShrink: 0, marginRight: '4px' }} />
                    <select
                      id="worker-avail-select"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as any)}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.75rem',
                        color: '#0F172A',
                        backgroundColor: 'transparent',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cooperative Branch / Service Hub */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label
                  htmlFor="worker-coop-input"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  Cooperative Branch / Service Hub
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
                  <Award size={15} color="#1DAA5C" style={{ flexShrink: 0, marginRight: '8px' }} />
                  <input
                    id="worker-coop-input"
                    type="text"
                    placeholder="e.g. Noida District Artisan Federation"
                    value={cooperativeBranch}
                    onChange={(e) => setCooperativeBranch(e.target.value)}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label
                    htmlFor="worker-email-input"
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
                  id="worker-email-input"
                  type="email"
                  placeholder="e.g. ramesh.kumar@example.com"
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

              {/* Page 2 Primary CTA */}
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
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP & Create Account'}</span>
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
            </form>
          )
        ) : (
          /* ========================================================= */
          /* OTP VERIFICATION STEP                                     */
          /* ========================================================= */
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Phone Summary & Change Link */}
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
                +91 {phone} {profession ? `(${profession})` : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthStep('FORM');
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
                htmlFor="worker-otp-input"
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
                  id="worker-otp-input"
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
