import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Navigation, Home, Building, Check, MapPin, Trash2, Edit2 } from 'lucide-react';
import { SavedAddress } from '../../types';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { AddAddressModal } from './AddAddressModal';

interface AddressSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
  onAddNewAddress?: () => void;
}

export const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [activeAddressId, setActiveAddressId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const loadAddresses = async () => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
      setSavedAddresses(user.savedAddresses);
      const defaultAddr = user.savedAddresses.find((a) => a.isDefault);
      if (defaultAddr) setActiveAddressId(defaultAddr.id);
    } else {
      const res = await userService.getCurrentUser();
      if (res.success && res.data?.savedAddresses) {
        setSavedAddresses(res.data.savedAddresses);
        const defaultAddr = res.data.savedAddresses.find((a) => a.isDefault);
        if (defaultAddr) setActiveAddressId(defaultAddr.id);
      } else {
        setSavedAddresses([]);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSelect = (addr: SavedAddress) => {
    setActiveAddressId(addr.id);
    onSelectAddress(addr.fullAddress);
    onClose();
  };

  const handleUseLocationGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onSelectAddress('Indiranagar, Bangalore (Current GPS Location)');
          onClose();
        },
        () => {
          onSelectAddress('Indiranagar, Bangalore');
          onClose();
        }
      );
    } else {
      onSelectAddress('Indiranagar, Bangalore');
      onClose();
    }
  };

  const handleSaveNewAddress = async (newAddr: Omit<SavedAddress, 'id'>) => {
    if (editingAddress) {
      const updatedItem: SavedAddress = {
        ...editingAddress,
        ...newAddr,
      };
      const res = await userService.updateSavedAddress(updatedItem);
      if (res.success && res.data) {
        setSavedAddresses(res.data);
      }
      setEditingAddress(null);
    } else {
      const res = await userService.addSavedAddress(newAddr);
      if (res.success && res.data) {
        setSavedAddresses(res.data);
        if (res.data.length > 0) {
          const newest = res.data[res.data.length - 1];
          onSelectAddress(newest.fullAddress);
        }
      }
    }
  };

  const handleDeleteAddress = async (e: React.MouseEvent, addrId: string) => {
    e.stopPropagation();
    const res = await userService.deleteSavedAddress(addrId);
    if (res.success && res.data) {
      setSavedAddresses(res.data);
    }
  };

  const filteredAddresses = savedAddresses.filter((a) =>
    a.fullAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div
        className="animate-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          className="animate-slide-up"
          style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            padding: '20px 20px 32px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Select Service Location
            </h2>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '11px 14px',
              backgroundColor: '#FFFFFF',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <Search size={18} color="#64748B" />
            <input
              type="text"
              placeholder="Search locality, sector, area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#0F172A',
              }}
            />
          </div>

          {/* Action Buttons: Add Address & Use Current Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleUseLocationGPS}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#F0FDF4',
                border: '1px solid var(--sahyog-sage, #D9E9C8)',
                borderRadius: '12px',
                color: 'var(--sahyog-green, #1DAA5C)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Navigation size={18} />
              <div style={{ flex: 1 }}>
                <div>Use current GPS location</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--sahyog-green-dark, #0F7A3E)', fontWeight: 500 }}>
                  Auto-detect current neighborhood
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onAddNewAddress) {
                  onClose();
                  onAddNewAddress();
                } else {
                  setEditingAddress(null);
                  setShowAddModal(true);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                color: 'var(--sahyog-ink, #0B0B0B)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Plus size={18} color="var(--sahyog-green, #1DAA5C)" />
              <span>Add new address</span>
            </button>
          </div>

          {/* Saved Addresses Section */}
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
              }}
            >
              SAVED ADDRESSES ({filteredAddresses.length})
            </div>

            {filteredAddresses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredAddresses.map((addr) => {
                  const labelText = addr.label || 'Address';
                  const isSelected = selectedAddress.includes(addr.locality) || activeAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelect(addr)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: `1.5px solid ${isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                        backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: isSelected ? '0 2px 10px rgba(29, 170, 92, 0.1)' : 'none',
                        transition: 'all 150ms ease',
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? '#DCFCE7' : '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#475569',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          {labelText === 'Home' ? <Home size={16} /> : labelText === 'Work' ? <Building size={16} /> : <MapPin size={16} />}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                              {labelText}
                            </span>
                            {addr.isDefault && (
                              <span
                                style={{
                                  fontSize: '0.5625rem',
                                  fontWeight: 800,
                                  backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                                  color: '#FFFFFF',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.35, marginBottom: '4px' }}>
                            {addr.fullAddress}
                          </div>

                          {addr.phone && (
                            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 }}>
                              Phone: {addr.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setShowAddModal(true);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Edit address"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddress(e, addr.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Delete address"
                        >
                          <Trash2 size={15} />
                        </button>

                        {isSelected ? (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                            }}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sahyog-green, #1DAA5C)' }}>
                            Select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px dashed #CBD5E1',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin size={24} color="#94A3B8" />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                  No saved addresses yet
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '240px' }}>
                  Add your home or office address for 1-click booking dispatch.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddModal(true);
                  }}
                  style={{
                    marginTop: '4px',
                    padding: '8px 16px',
                    backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  + Add Primary Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddAddressModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveNewAddress}
          initialData={editingAddress}
          currentPhone={user?.phone || ''}
        />
      )}
    </>
  );
};
