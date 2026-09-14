import React, { useState, useEffect, useRef } from 'react';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import { Avatar } from '../../components/common/Avatar';
import {
  Phone,
  Mail,
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
  Camera,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { photoStorageService } from '../../services/storage/photoStorageService';
import { User, SavedAddress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Modal } from '../../components/ui/Modal';
import { AddAddressModal } from '../../components/customer/AddAddressModal';

export const CustomerProfilePage: React.FC = () => {
  const { user, logout, refreshSession } = useAuth();
  const { setActiveView } = useBooking();
  const [activeInfoModal, setActiveInfoModal] = useState<{ title: string; content: string } | null>(null);

  const [profile, setProfile] = useState<User>(() => ({
    id: user?.id || '',
    name: user?.name || 'Customer',
    phone: user?.phone || '',
    email: user?.email || '',
    role: 'customer',
    address: user?.address || '',
    locality: user?.locality || '',
    city: user?.city || 'Bangalore',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    emergencyContact: user?.emergencyContact || '',
    savedAddresses: user?.savedAddresses || [],
    isProfileCompleted: user?.isProfileCompleted ?? false,
    profileImage: user?.profileImage || user?.avatar || '',
  }));

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email || '',
    dob: profile.dob || '',
    gender: profile.gender || 'Prefer not to say',
    address: profile.address || '',
    locality: profile.locality || '',
    city: profile.city || 'Bangalore',
    state: profile.state || 'Karnataka',
    pincode: profile.pincode || '',
    preferredLanguage: profile.preferredLanguage || 'en',
    emergencyContact: profile.emergencyContact || '',
  });

  const loadLatestProfile = async () => {
    const res = await userService.getCurrentUser();
    if (res.success && res.data) {
      setProfile(res.data);
      setEditForm({
        name: res.data.name,
        email: res.data.email || '',
        dob: res.data.dob || '',
        gender: res.data.gender || 'Prefer not to say',
        address: res.data.address || '',
        locality: res.data.locality || '',
        city: res.data.city || 'Bangalore',
        state: res.data.state || 'Karnataka',
        pincode: res.data.pincode || '',
        preferredLanguage: res.data.preferredLanguage || 'en',
        emergencyContact: res.data.emergencyContact || '',
      });
    }
  };

  useEffect(() => {
    loadLatestProfile();
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setIsUploadingPhoto(true);

    try {
      const uploadRes = await photoStorageService.uploadProfilePhoto(profile.id, file);
      if (uploadRes.success && uploadRes.url) {
        const photoUrl = uploadRes.url;
        setProfile((prev) => ({ ...prev, profileImage: photoUrl, avatar: photoUrl }));
        await userService.updateUserProfile({
          id: profile.id,
          profileImage: photoUrl,
          avatar: photoUrl,
        });
        setStatusMessage('Profile photo updated successfully.');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setPhotoError(uploadRes.error || 'Failed to upload photo.');
      }
    } catch (err: any) {
      setPhotoError(err?.message || 'Error uploading photo.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    const updates: Partial<User> = {
      id: profile.id,
      name: editForm.name.trim(),
      email: editForm.email.trim() || undefined,
      dob: editForm.dob.trim() || undefined,
      gender: editForm.gender,
      address: editForm.address.trim(),
      locality: editForm.locality.trim() || undefined,
      city: editForm.city.trim() || 'Bangalore',
      state: editForm.state.trim() || 'Karnataka',
      pincode: editForm.pincode.trim() || undefined,
      preferredLanguage: editForm.preferredLanguage as 'en' | 'hi',
      emergencyContact: editForm.emergencyContact.trim() || undefined,
      isProfileCompleted: true,
    };

    setProfile((prev) => ({ ...prev, ...updates }));
    setIsEditModalOpen(false);

    const res = await userService.updateUserProfile(updates);
    if (res.success) {
      setStatusMessage('Profile updated successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
      refreshSession();
    }
  };

  const handleSaveAddress = async (newAddr: Omit<SavedAddress, 'id'>) => {
    if (editingAddress) {
      const updated = { ...editingAddress, ...newAddr };
      const res = await userService.updateSavedAddress(updated);
      if (res.success && res.data) {
        setProfile((prev) => ({ ...prev, savedAddresses: res.data }));
      }
      setEditingAddress(null);
    } else {
      const res = await userService.addSavedAddress(newAddr);
      if (res.success && res.data) {
        setProfile((prev) => ({ ...prev, savedAddresses: res.data }));
      }
    }
    setShowAddressModal(false);
  };

  const handleDeleteAddress = async (addrId: string) => {
    const res = await userService.deleteSavedAddress(addrId);
    if (res.success && res.data) {
      setProfile((prev) => ({ ...prev, savedAddresses: res.data }));
    }
  };

  const handleSetDefaultAddress = async (addrId: string) => {
    const res = await userService.setDefaultSavedAddress(addrId);
    if (res.success && res.data) {
      setProfile((prev) => ({ ...prev, savedAddresses: res.data }));
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Avatar
              src={profile.profileImage || profile.avatar}
              name={profile.name}
              size="xl"
              border="3px solid #FFFFFF"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: 'var(--sahyog-green, #1DAA5C)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
              title="Change Profile Photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                {profile.name}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
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

            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={13} />
              <span>{profile.phone}</span>
            </div>

            {profile.email && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Mail size={12} />
                <span>{profile.email}</span>
              </div>
            )}

            <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '4px' }}>
              {profile.isProfileCompleted ? 'Verified Member • Profile 100% Complete' : 'Profile Incomplete • Complete setup'}
            </div>
          </div>
        </div>
      </div>

      {photoError && (
        <div style={{ margin: '12px 16px 0', padding: '10px 14px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', color: '#B91C1C', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          <span>{photoError}</span>
        </div>
      )}

      {statusMessage && (
        <div style={{ margin: '12px 16px 0', padding: '10px 14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', color: '#166534', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

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

      {/* 3. THREE ACTION CARDS */}
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
          onClick={() => setActiveView('money')}
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
            Money & Credits
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

      {/* 4. SAVED ADDRESSES SECTION */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--sahyog-green, #1DAA5C)" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Saved Addresses ({profile.savedAddresses?.length || 0})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAddress(null);
                setShowAddressModal(true);
              }}
              style={{
                padding: '4px 10px',
                backgroundColor: '#F0FDF4',
                color: 'var(--sahyog-green, #1DAA5C)',
                border: '1px solid var(--sahyog-sage, #D9E9C8)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>

          {(profile.savedAddresses && profile.savedAddresses.length > 0) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: addr.isDefault ? '#F0FDF4' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A' }}>
                        {addr.label || 'Address'}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '0.5625rem', fontWeight: 800, backgroundColor: 'var(--sahyog-green, #1DAA5C)', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px' }}>
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.3 }}>
                      {addr.fullAddress}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--sahyog-green, #1DAA5C)',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(addr);
                        setShowAddressModal(true);
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
              No saved addresses yet. Click "+ Add New" to save your home or office location.
            </div>
          )}
        </div>
      </div>

      {/* 5. LIST MENU ITEMS */}
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
          {/* About AIDORA */}
          <div
            onClick={() => setActiveInfoModal({
              title: 'About AIDORA Cooperative Platform',
              content: 'AIDORA is India’s revolutionary skilled artisans cooperative federation. We eliminate exploitative middleman commissions, providing 100% fair direct artisan earnings, authentic skill verification, and standardized quality pricing.'
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

        {/* 6. LOGOUT BUTTON */}
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

      {/* Edit Profile Full Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Profile"
        maxWidth="440px"
      >
        <form onSubmit={handleSaveProfileForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '6px 0' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
              FULL NAME *
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          {/* Phone (Read Only) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
              PHONE NUMBER (FROM AUTHENTICATION)
            </label>
            <input
              type="text"
              disabled
              value={profile.phone}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.875rem' }}
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
              EMAIL ADDRESS (OPTIONAL)
            </label>
            <input
              type="email"
              placeholder="e.g. user@example.com"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          {/* DOB & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                DATE OF BIRTH
              </label>
              <input
                type="date"
                value={editForm.dob}
                onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                GENDER
              </label>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Primary Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
              PRIMARY ADDRESS
            </label>
            <input
              type="text"
              placeholder="Flat, building, street address"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          {/* Locality & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                LOCALITY
              </label>
              <input
                type="text"
                placeholder="e.g. Indiranagar"
                value={editForm.locality}
                onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                CITY
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* State & Pincode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                STATE
              </label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                PINCODE
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 560038"
                value={editForm.pincode}
                onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value.replace(/\D/g, '') })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Preferred Language & Emergency Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                PREFERRED LANGUAGE
              </label>
              <select
                value={editForm.preferredLanguage}
                onChange={(e) => setEditForm({ ...editForm, preferredLanguage: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                EMERGENCY CONTACT
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={editForm.emergencyContact}
                onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </Modal>

      {/* Add / Edit Address Modal */}
      {showAddressModal && (
        <AddAddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          initialData={editingAddress}
          currentPhone={profile.phone}
        />
      )}

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
