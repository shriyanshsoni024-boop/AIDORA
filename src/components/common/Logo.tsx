import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  alt?: string;
  priority?: boolean;
}

const SIZE_MAP: Record<string, { height: number }> = {
  xs: { height: 34 },
  sm: { height: 42 },
  md: { height: 64 },
  lg: { height: 92 },
  xl: { height: 140 },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  style,
  onClick,
  alt = 'AIDORA - Cooperative Skilled Workforce Platform',
}) => {
  let heightPx: number;

  if (typeof size === 'number') {
    heightPx = size;
  } else {
    heightPx = SIZE_MAP[size]?.height || 40;
  }

  return (
    <img
      src="/logo.png"
      alt={alt}
      onClick={onClick}
      className={`aidora-logo ${className}`}
      style={{
        height: `${heightPx}px`,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        userSelect: 'none',
        ...style,
      }}
      loading="eager"
      decoding="async"
    />
  );
};
