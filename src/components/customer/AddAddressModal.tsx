import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Building, Navigation, Check } from 'lucide-react';
import { SavedAddress } from '../../types';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, 'id'>) => Promise<void> | void;
  initialData?: SavedAddress | null;
  currentPhone?: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentPhone = '',
}) => {
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [flat, setFlat] = useState<string>('');
  const [building, setBuilding] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [locality, setLocality] = useState<string>('Indiranagar');
  const [city, setCity] = useState<string>('Bangalore');
  const [state, setState] = useState<string>('Karnataka');
  const [pincode, setPincode] = useState<string>('560038');
  const [phone, setPhone] = useState<string>(currentPhone);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.label === 'Home' || initialData.label === 'Work' || initialData.label === 'Other') {
        setLabel(initialData.label as 'Home' | 'Work' | 'Other');
      } else {
        setLabel('Other');
        setCustomLabel(initialData.label || '');
      }
      setFlat(initialData.flat || '');
      setBuilding(initialData.building || '');
      setFullAddress(initialData.fullAddress || '');
      setLocality(initialData.locality || 'Indiranagar');
      setCity(initialData.city || 'Bangalore');
      setState(initialData.state || 'Karnataka');
      setPincode(initialData.pincode || '560038');
      setPhone(initialData.phone || currentPhone);
      setIsDefault(initialData.isDefault || false);
    } else {
      setLabel('Home');
      setCustomLabel('');
      setFlat('');
      setBuilding('');
      setFullAddress('');
      setLocality('Indiranagar');
      setCity('Bangalore');
      setState('Karnataka');
      setPincode('560038');
      setPhone(currentPhone);
      setIsDefault(false);
    }
    setErrorMsg('');
  }, [initialData, currentPhone, isOpen]);

  if (!isOpen) return null;

  const handleUseGps = () => {
    setIsLocating(true);
    setErrorMsg('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLocality('Indiranagar Sector 2');
          setCity('Bangalore');
          setState('Karnataka');
          if (!fullAddress) {
            setFullAddress(`Near GPS coordinates (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}), Indiranagar, Bangalore`);
          }
        },
        () => {
          setIsLocating(false);
          setLocality('Indiranagar');
          setCity('Bangalore');
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullAddress.trim()) {
      setErrorMsg('Please enter a complete street address.');
      return;
    }
    if (!locality.trim()) {
      setErrorMsg('Please enter a locality/area name.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit PIN code.');
      return;
    }

    const finalLabel = label === 'Other' && customLabel.trim() ? customLabel.trim() : label;

    setIsSubmitting(true);
    try {
      await onSave({
        label: finalLabel,
        name: finalLabel,
        flat: flat.trim() || undefined,
        building: building.trim() || undefined,
        fullAddress: fullAddress.trim(),
        locality: locality.trim(),
        city: city.trim() || 'Bangalore',
        state: state.trim() || 'Karnataka',
        pincode: pincode.trim(),
        phone: phone.trim() || currentPhone,
        isDefault,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
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
          overflowY: 'auto',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {initialData ? 'Edit Address' : 'Add New Address'}
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

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              color: '#B91C1C',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Label selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
              SAVE AS
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['Home', 'Work', 'Other'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLabel(l)}
                  style={{
                    padding: '9px',
                    borderRadius: '10px',
                    border: `1.5px solid ${label === l ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                    backgroundColor: label === l ? '#F0FDF4' : '#FFFFFF',
                    color: label === l ? 'var(--sahyog-green-dark, #0F7A3E)' : '#334155',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {l === 'Home' ? <Home size={15} /> : l === 'Work' ? <Building size={15} /> : <MapPin size={15} />}
                  <span>{l}</span>
                </button>
              ))}
            </div>
            {label === 'Other' && (
              <input
                type="text"
                placeholder="e.g. Parents' House, Studio"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            )}
          </div>

          {/* GPS Auto-detect Button */}
          <button
            type="button"
            onClick={handleUseGps}
            disabled={isLocating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#F0FDF4',
              border: '1px solid var(--sahyog-sage, #D9E9C8)',
              borderRadius: '10px',
              color: 'var(--sahyog-green, #1DAA5C)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Navigation size={15} />
            <span>{isLocating ? 'Detecting location via GPS...' : 'Use current GPS location'}</span>
          </button>

          {/* Complete Street Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
              COMPLETE ADDRESS *
            </label>
            <textarea
              required
              rows={2}
              placeholder="House/Flat No., Floor, Building name, Street name"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Locality & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                LOCALITY / AREA *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                CITY *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          {/* State & Pincode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                STATE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                PINCODE *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. 560038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--sahyog-green, #1DAA5C)' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              Set as primary / default service address
            </span>
          </label>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '10px',
              padding: '13px',
              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(29, 170, 92, 0.25)',
            }}
            className="sahyog-btn"
          >
            <Check size={18} />
            <span>{isSubmitting ? 'Saving Address...' : 'Save Address'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
