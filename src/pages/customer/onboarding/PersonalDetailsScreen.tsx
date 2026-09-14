import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail } from 'lucide-react';
import { Logo } from '../../../components/common/Logo';

interface PersonalDetailsScreenProps {
  onConfirm: (details: { firstName: string; lastName: string; email: string }) => void;
  onBack: () => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ onConfirm, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');

  const isValid = firstName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onConfirm({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
    }
  };



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
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
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
          Profile details
        </h1>
        <Logo size="xs" style={{ marginLeft: 'auto' }} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              margin: '0 0 8px',
            }}
          >
            Help us{' '}
            <span style={{ color: '#1DAA5C' }}>
              know you better
            </span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
            This helps our verified technicians identify and coordinate your home visits smoothly.
          </p>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* First Name (Required) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              First name*
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <User size={18} color="#64748B" />
              <input
                type="text"
                placeholder="e.g. Ananya"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Last Name (Optional) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Last name (Optional)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <User size={18} color="#64748B" />
              <input
                type="text"
                placeholder="e.g. Deshmukh"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Email ID (for invoices & receipts)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <Mail size={18} color="#64748B" />
              <input
                type="email"
                placeholder="e.g. ananya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
              }}
            >
              Gender (Optional)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(['Female', 'Male', 'Other'] as const).map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      border: `1.5px solid ${isSelected ? '#1DAA5C' : '#E2E8F0'}`,
                      backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                      color: isSelected ? '#1DAA5C' : '#475569',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Confirm Button */}
          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <button
              type="submit"
              disabled={!isValid}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: isValid ? '#1DAA5C' : '#E2E8F0',
                color: isValid ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: isValid ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isValid ? '0 4px 16px rgba(29, 170, 92, 0.3)' : 'none',
                transition: 'all 200ms ease',
              }}
              className={isValid ? 'sahyog-btn' : ''}
            >
              <span>Confirm details</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>


      </div>
    </div>
  );
};
