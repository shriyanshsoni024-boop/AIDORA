import React from 'react';
import { Role } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { User, HardHat, Building2, Layers } from 'lucide-react';
import { THEMES } from '../../styles/themes';

export interface DemoRoleBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ currentRole, onRoleChange }) => {
  const { language } = useLanguage();

  const ROLES: { id: Role; labelEn: string; labelHi: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'customer',
      labelEn: 'Customer',
      labelHi: 'ग्राहक मंच',
      icon: <User size={12} />,
      color: THEMES.customer.tokens.accent,
    },
    {
      id: 'worker',
      labelEn: 'Artisan Pro',
      labelHi: 'कारीगर साथी',
      icon: <HardHat size={12} />,
      color: THEMES.worker.tokens.accent,
    },
    {
      id: 'admin',
      labelEn: 'Cooperative Hub',
      labelHi: 'सहकारी संघ',
      icon: <Building2 size={12} />,
      color: THEMES.cooperative.tokens.accent,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        color: '#94A3B8',
        fontSize: '0.6875rem',
        zIndex: 100,
        position: 'sticky',
        top: 0,
        height: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        <Layers size={11} color="#38BDF8" />
        <span style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.59375rem', color: '#CBD5E1', textTransform: 'uppercase' }}>
          AIDORA ROLE VIEW
        </span>
      </div>

      {/* Role Switcher Minimalist Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {ROLES.map((role) => {
          const isSelected = currentRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              className="sahyog-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.65625rem',
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#94A3B8',
                border: isSelected ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                height: '22px',
              }}
              aria-pressed={isSelected}
            >
              <span style={{ color: isSelected ? role.color : 'inherit', display: 'flex', alignItems: 'center' }}>
                {role.icon}
              </span>
              <span>{language === 'hi' ? role.labelHi : role.labelEn}</span>
              {isSelected && (
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: role.color,
                    display: 'inline-block',
                    marginLeft: '1px',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
