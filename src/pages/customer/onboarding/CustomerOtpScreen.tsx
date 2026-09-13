import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface CustomerOtpScreenProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export const CustomerOtpScreen: React.FC<CustomerOtpScreenProps> = ({ phone, onVerified, onBack }) => {
  const { verifyPhoneOtp, sendPhoneOtp } = useAuth();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(44);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Handle individual digit input
  const handleChange = (index: number, value: string) => {
    setErrorMsg(null);
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance focus to next field
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically trigger verification
    if (newOtp.every((d) => d !== '') && digit) {
      handleCompleteOtp(newOtp.join(''));
    }
  };

  // Support Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Support Pasting complete 6-digit OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextFocusIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    if (pasted.length === 6) {
      handleCompleteOtp(pasted);
    }
  };

  const handleCompleteOtp = async (code: string) => {
    if (!code) {
      setErrorMsg('Please enter the verification OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await verifyPhoneOtp({
        phone,
        token: code,
        role: 'customer',
      });

      if (res.success) {
        onVerified();
      } else {
        setErrorMsg(res.error || 'Invalid OTP');
      }
    } catch {
      setErrorMsg('Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setCountdown(44);
    setOtp(['', '', '', '', '', '']);
    setErrorMsg(null);
    inputRefs.current[0]?.focus();
    try {
      await sendPhoneOtp({ phone });
    } catch {
      setErrorMsg('Failed to resend code.');
    }
  };

  const autoFillOtp = () => {
    const demoDigits = ['1', '2', '3', '4', '5', '6'];
    setOtp(demoDigits);
    setErrorMsg(null);
    handleCompleteOtp('123456');
  };

  const maskedPhone = phone.length >= 10
    ? `+91 ${phone.slice(0, 5)} •••••`
    : `+91 ${phone}`;

  const isFullOtp = otp.every((d) => d !== '');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '16px 20px 28px',
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E293B',
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          OTP verification
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: '0 0 6px',
            }}
          >
            Enter the OTP sent to
          </h2>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1DAA5C' }}>
            {maskedPhone}
          </div>
        </div>

        {/* Demo OTP Helper Banner */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#14532D' }}>
              Demo OTP: 123456
            </div>
            <div style={{ fontSize: '0.75rem', color: '#166534' }}>
              Enter 123456 to continue
            </div>
          </div>
          <button
            type="button"
            onClick={autoFillOtp}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1DAA5C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Auto Fill
          </button>
        </div>

        {/* 6 OTP Input Boxes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          {otp.map((digit, index) => {
            const isFilled = digit !== '';
            return (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
                style={{
                  width: '46px',
                  height: '52px',
                  borderRadius: '12px',
                  border: `2px solid ${isFilled ? '#1DAA5C' : '#CBD5E1'}`,
                  backgroundColor: isFilled ? '#F0FDF4' : '#FFFFFF',
                  textAlign: 'center',
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  color: '#0B0B0B',
                  outline: 'none',
                  boxShadow: isFilled ? '0 2px 8px rgba(29, 170, 92, 0.15)' : 'none',
                  transition: 'all 150ms ease',
                }}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#DC2626',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Resend SMS Timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          {countdown > 0 ? (
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
              Resend code in <strong style={{ color: '#0B0B0B' }}>{countdown}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: '#1DAA5C',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              <RefreshCw size={14} />
              <span>Resend Demo OTP</span>
            </button>
          )}

          <span style={{ fontSize: '0.6875rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#1DAA5C" />
            <span>Encrypted Verification</span>
          </span>
        </div>

        {/* Verify CTA */}
        <button
          type="button"
          onClick={() => handleCompleteOtp(otp.join(''))}
          disabled={!isFullOtp || isVerifying}
          style={{
            padding: '15px',
            backgroundColor: isFullOtp ? '#1DAA5C' : '#E2E8F0',
            color: isFullOtp ? '#FFFFFF' : '#94A3B8',
            border: 'none',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: isFullOtp ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isFullOtp ? '0 4px 16px rgba(29, 170, 92, 0.3)' : 'none',
            transition: 'all 200ms ease',
          }}
          className={isFullOtp ? 'sahyog-btn' : ''}
        >
          <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
