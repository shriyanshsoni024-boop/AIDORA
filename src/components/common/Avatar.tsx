import React, { useState } from 'react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  shape?: 'circle' | 'rounded';
  border?: string;
  ringColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showBadge?: boolean;
  badgeContent?: React.ReactNode;
}

const SIZE_MAP: Record<string, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 60,
  xl: 72,
  '2xl': 96,
};

const GRADIENTS = [
  'linear-gradient(135deg, #1DAA5C 0%, #0F7A3E 100%)',
  'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
  'linear-gradient(135deg, #059669 0%, #047857 100%)',
  'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
];

const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getGradientForName = (name?: string): string => {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = 'User',
  size = 'md',
  shape = 'circle',
  border,
  ringColor,
  className = '',
  style = {},
  onClick,
  showBadge = false,
  badgeContent,
}) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size] || 44;
  const borderRadius = shape === 'circle' ? '50%' : '14px';
  const fontSize = Math.max(11, Math.round(dimension * 0.38));
  const initials = getInitials(name);
  const gradient = getGradientForName(name);

  const hasValidImage = src && !imgError && !src.includes('undefined') && !src.includes('null');
  const computedBorder = border || (ringColor ? `2.5px solid ${ringColor}` : 'none');

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${dimension}px`,
        height: `${dimension}px`,
        flexShrink: 0,
        ...style,
      }}
      className={className}
      onClick={onClick}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius,
          border: computedBorder,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F1F5F9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        {hasValidImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: gradient,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${fontSize}px`,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {showBadge && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            zIndex: 2,
          }}
        >
          {badgeContent}
        </div>
      )}
    </div>
  );
};
