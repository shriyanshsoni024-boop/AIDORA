import React, { useState, useEffect } from 'react';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import {
  Phone,
  MapPin,
  Calendar,
  Wallet,
  Headphones,
  ChevronRight,
  ShieldCheck,
  FileText,
  Lock,
  Trash2,
  LogOut,
  Edit3,
  Award,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Modal } from '../../components/ui/Modal';

interface CustomerProfilePageProps {
  onOpenAddresses?: () => void;
}

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({ onOpenAddresses }) => {
  const { user, logout } = useAuth();
  const { setActiveView } = useBooking();
  const [activeInfoModal, setActiveInfoModal] = useState<{ title: string; content: string } | null>(null);

  const [profile, setProfile] = useState<User>(() => ({
    id: user?.id || '',
    name: user?.name || 'Customer',
    phone: user?.phone || '',
    email: user?.email || '',
    role: 'customer',
    address: user?.address || 'Indiranagar, Bangalore',
    city: user?.city || 'Bangalore',
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        address: user.address || prev.address,
        city: user.city || prev.city,
      }));
      setEditName(user.name);
    }
    userService.getCurrentUser().then((res) => {
      if (res.success && res.data) {
        setProfile(res.data);
        setEditName(res.data.name);
      }
    });
  }, [user]);

  const handleSaveEdit = async () => {
    const updatedName = editName.trim();
    if (!updatedName) return;
    setProfile((prev) => ({ ...prev, name: updatedName }));
    setIsEditing(false);
    await userService.updateUserProfile({ name: updatedName });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--sahyog-cream, #FCFBF4)',
        paddingBottom: '80px',
      }}
    >
      {/* 1. TOP DARK GREEN PROFILE HEADER */}
      <div
        style={{
          background: 'linear-gradient(150deg, var(--sahyog-green, #1DAA5C) 0%, var(--sahyog-green-dark, #0F7A3E) 100%)',
          borderRadius: '0 0 28px 28px',
          padding: '24px 20px 28px',
          color: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(29, 170, 92, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '1.125rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ← Profile
          </button>

          <LanguageToggle />
        </div>

        {/* Profile Avatar & Info Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              padding: '3px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt={profile.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--sahyog-ink, #0B0B0B)',
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--sahyog-green-dark, #0F7A3E)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                  {profile.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Edit3 size={11} />
                  <span>Edit</span>
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={13} />
              <span>{profile.phone}</span>
            </div>

            <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
              Member since Jan 2026 • Verified Customer
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMOTIONAL PASS CARD */}
      <div style={{ padding: '0 16px', marginTop: '-12px' }}>
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: '16px',
            border: '1px solid #FDE68A',
            padding: '14px 16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sahyog-forest, #173318)',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--sahyog-forest, #173318)' }}>
                AIDORA Cooperative Pass
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#B45309' }}>
                ₹0 platform fee & 100% direct artisan compensation
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              backgroundColor: 'var(--sahyog-yellow, #F4C430)',
              color: 'var(--sahyog-ink, #0B0B0B)',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            ACTIVE
          </span>
        </div>
      </div>

      {/* 3. THREE LARGE ROUNDED ACTION CARDS */}
      <div style={{ padding: '16px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {/* My Bookings */}
        <button
          type="button"
          onClick={() => setActiveView('history')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
          className="hover-card"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sahyog-green, #1DAA5C)',
            }}
          >
            <Calendar size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
            My bookings
          </span>
        </button>

        {/* Money */}
        <button
          type="button"
          onClick={() => setActiveView('history')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
          className="hover-card"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--sahyog-blue-tint, #D9E6F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sahyog-navy, #152B54)',
            }}
          >
            <Wallet size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
            Money (₹450)
          </span>
        </button>

        {/* Help & Support */}
        <button
          type="button"
          onClick={() => setActiveInfoModal({
            title: 'Cooperative 24x7 Help & Support',
            content: 'Toll-free Federation Helpline: 1800-AIDORA-COOP\nDirect Email: support@aidora.app\nCooperative Guild Support: Active 24x7 with live grievance arbitration.'
          })}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
          className="hover-card"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sahyog-ink, #0B0B0B)',
            }}
          >
            <Headphones size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
            Help & Support
          </span>
        </button>
      </div>

      {/* 4. LIST MENU ITEMS */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '6px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          {/* Saved Addresses */}
          <div
            onClick={onOpenAddresses}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F1F5F9',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} color="#64748B" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                Saved addresses
              </span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* About AIDORA */}
          <div
            onClick={() => setActiveInfoModal({
              title: 'About AIDORA Cooperative Platform',
              content: 'AIDORA (SIH Problem Statement 26089) is India’s revolutionary skilled artisans cooperative federation. We eliminate exploitative middleman commissions, providing 100% fair direct artisan earnings, authentic skill verification, and standardized quality pricing.'
            })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F1F5F9',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={18} color="#64748B" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                About AIDORA Cooperative
              </span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Terms of Services */}
          <div
            onClick={() => setActiveInfoModal({
              title: 'Terms of Service & Assurance',
              content: '1. 30-Day Work Guarantee: Complete free rework on verified quality defects.\n2. Transparent Cooperative Escrow: 100% of base labor is transferred directly to the skilled worker.\n3. Safety Protocol: Verified UIDAI Aadhaar and skill credentials on every dispatch.'
            })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F1F5F9',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} color="#64748B" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                Terms of services
              </span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Privacy Policy */}
          <div
            onClick={() => setActiveInfoModal({
              title: 'Privacy & Data Governance',
              content: 'Your privacy is paramount. Customer phone numbers and addresses are tokenized and protected under Indian Data Protection Standards. We never sell personal data to third-party ad networks.'
            })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F1F5F9',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={18} color="#64748B" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                Privacy policy
              </span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>

          {/* Request Account Deletion */}
          <div
            onClick={() => setActiveInfoModal({
              title: 'Account Privacy Request',
              content: 'Account deletion request received. In accordance with cooperative compliance, an SMS confirmation has been triggered to your registered number.'
            })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Trash2 size={18} color="var(--sahyog-red, #E0472C)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--sahyog-red, #E0472C)' }}>
                Request account deletion
              </span>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>
        </div>

        {/* 5. LOGOUT BUTTON */}
        <button
          type="button"
          onClick={() => logout()}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#FEF2F2',
            color: 'var(--sahyog-red, #E0472C)',
            border: '1px solid #FECACA',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
          }}
          className="sahyog-btn"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={!!activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
        title={activeInfoModal?.title || 'AIDORA Information'}
        maxWidth="400px"
      >
        <div style={{ padding: '8px 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {activeInfoModal?.content}
        </div>
      </Modal>
    </div>
  );
};
