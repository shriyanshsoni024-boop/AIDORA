import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start entrance animation
    setIsAnimating(true);

    // Optional auto-advance after 3.2 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(145deg, #1DAA5C 0%, #0F7A3E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
      className="theme-transition"
    >
      {/* Background Decorative Rings */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Center Branding Block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%',
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Official AIDORA Logo */}
        <Logo size="xl" style={{ marginBottom: '20px', filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.25))' }} />

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: '0 0 14px',
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          AIDORA
        </h1>

        {/* Thin Decorative Line */}
        <div
          style={{
            width: '48px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '2px',
            marginBottom: '14px',
          }}
        />

        {/* Headline */}
        <p
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.92)',
            margin: '0 0 28px',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
          }}
        >
          Get professional home help in minutes!
        </p>

        {/* Skip / Enter Action */}
        <button
          type="button"
          onClick={onDismiss}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          className="sahyog-btn"
        >
          <Sparkles size={15} />
          <span>Get Started</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Bottom Trust Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          fontSize: '0.6875rem',
          color: 'rgba(255, 255, 255, 0.65)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Verified Cooperative Network • 30-Day Guarantee
      </div>
    </div>
  );
};
