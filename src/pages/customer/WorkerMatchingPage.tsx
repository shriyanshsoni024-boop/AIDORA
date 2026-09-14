import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { calculateWorkerMatches } from '../../data/workers';
import { Worker } from '../../types';
import { WorkerCard } from '../../components/customer/WorkerCard';
import { WorkerProfileModal } from '../../components/customer/WorkerProfileModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export const WorkerMatchingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    selectedCategory,
    problemDescription,
    urgency,
    selectedTier,
    selectedLocation,
    createBooking,
    setActiveView,
  } = useBooking();

  const [activeFilter, setActiveFilter] = useState<'all' | 'high_match' | 'nearby'>('all');
  const [profileWorker, setProfileWorker] = useState<Worker | null>(null);
  const [selectedWorkerForSummary, setSelectedWorkerForSummary] = useState<Worker | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'pay_on_delivery'>('razorpay');
  const [paymentError, setPaymentError] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  const matchedWorkers = useMemo(() => {
    return calculateWorkerMatches(
      selectedCategory?.id || 'electrician',
      problemDescription,
      urgency === 'EMERGENCY',
      selectedLocation || 'Indiranagar, Bangalore'
    );
  }, [selectedCategory, problemDescription, urgency, selectedLocation]);

  const filteredWorkers = useMemo(() => {
    if (activeFilter === 'high_match') {
      return matchedWorkers.filter(w => (w.matchScore || 0) >= 90);
    }
    if (activeFilter === 'nearby') {
      return matchedWorkers.filter(w => w.distanceKm <= 2.5);
    }
    return matchedWorkers;
  }, [matchedWorkers, activeFilter]);

  const handleSelectWorker = (worker: Worker) => {
    setSelectedWorkerForSummary(worker);
    setPaymentError('');
  };

  const handleFinalConfirmBooking = async () => {
    if (!selectedWorkerForSummary) return;
    setPaymentError('');
    setIsConfirming(true);

    try {
      if (paymentMethod === 'pay_on_delivery') {
        createBooking(selectedWorkerForSummary, 'PENDING');
        setSelectedWorkerForSummary(null);
        return;
      }

      const tempBookingId = `b-${Date.now()}`;
      const payResult = await paymentService.initiatePayment({
        bookingId: tempBookingId,
        amount: totalPrice,
        customerName: 'AIDORA Customer',
        serviceName: selectedCategory?.name || 'Home Repair',
        workerName: selectedWorkerForSummary.name,
      });

      if (payResult.success) {
        createBooking(selectedWorkerForSummary, 'PAID');
        setSelectedWorkerForSummary(null);
      } else {
        setPaymentError(payResult.errorMessage || 'Payment transaction could not be completed.');
      }
    } catch (err: any) {
      console.warn('Payment transaction notice:', err);
      setPaymentError(err?.message || 'Payment service error occurred.');
    } finally {
      setIsConfirming(false);
    }
  };

  const getTierPrice = () => {
    const base = selectedCategory?.basePrice || 299;
    if (selectedTier === 'SMALL') return base;
    if (selectedTier === 'MEDIUM') return Math.round(base * 1.8);
    return Math.round(base * 2.8);
  };

  const servicePrice = getTierPrice();
  const connectionFee = 25;
  const totalPrice = servicePrice + connectionFee;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={() => setActiveView('service-detail')}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-default)',
          }}
          aria-label="Back to service detail"
        >
          <ArrowLeft size={16} color="var(--text-primary)" />
        </button>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t('matching_title')}
          </h1>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {filteredWorkers.length} verified artisans available in your zone
          </span>
        </div>
      </div>

      {/* Intelligence Note Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-muted)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          Ranked by skill match, experience, proximity, and cooperative reliability.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { key: 'all', label: t('filter_all') },
          { key: 'high_match', label: t('filter_high_match') },
          { key: 'nearby', label: t('filter_nearby') },
        ].map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key as 'all' | 'high_match' | 'nearby')}
              className="sahyog-btn"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 800 : 600,
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-default)'}`,
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Workers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onSelect={handleSelectWorker}
            onViewProfile={(w) => setProfileWorker(w)}
          />
        ))}
      </div>

      {/* Worker Profile Modal */}
      <WorkerProfileModal
        worker={profileWorker}
        isOpen={!!profileWorker}
        onClose={() => setProfileWorker(null)}
        onSelect={handleSelectWorker}
      />

      {/* Booking Summary Modal */}
      <Modal
        isOpen={!!selectedWorkerForSummary}
        onClose={() => setSelectedWorkerForSummary(null)}
        title={t('booking_summary')}
        maxWidth="420px"
      >
        {selectedWorkerForSummary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Worker Summary Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <img
                src={selectedWorkerForSummary.avatar}
                alt={selectedWorkerForSummary.name}
                style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                    {language === 'hi' ? selectedWorkerForSummary.nameHi : selectedWorkerForSummary.name}
                  </span>
                  <Badge variant="verified" size="sm">KYC</Badge>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {selectedWorkerForSummary.cooperativeName}
                </div>
              </div>
            </div>

            {/* Service Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Service:</span>
                <strong>{selectedCategory?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tier / Scope:</span>
                <strong>{selectedTier} Tier</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Priority:</span>
                <span style={{ fontWeight: 700, color: urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {urgency === 'EMERGENCY' ? 'Emergency Dispatch' : 'Standard'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Address:</span>
                <span style={{ textAlign: 'right', maxWidth: '200px' }}>{selectedLocation || 'Indiranagar 4th Block, Bangalore'}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)' }} />

            {/* Itemized Bill Sheet */}
            <div
              style={{
                backgroundColor: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Base Labor ({selectedTier} Tier):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{servicePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>AIDORA Platform & Cooperative Fee:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{connectionFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Artisan Safety & Insurance Cover:</span>
                <span style={{ fontWeight: 700, color: 'var(--success-dark)' }}>FREE (Cooperative Shield)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                <span>Total Payable:</span>
                <span style={{ color: 'var(--primary)' }}>₹{totalPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Payment Option</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('razorpay'); setPaymentError(''); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                    backgroundColor: paymentMethod === 'razorpay' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    color: paymentMethod === 'razorpay' ? 'var(--primary-dark)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>⚡ Razorpay</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--text-muted)' }}>UPI / Cards / NetBanking</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('pay_on_delivery'); setPaymentError(''); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'pay_on_delivery' ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                    backgroundColor: paymentMethod === 'pay_on_delivery' ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    color: paymentMethod === 'pay_on_delivery' ? 'var(--primary-dark)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>🤝 Cash on Service</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--text-muted)' }}>Pay After Completion</span>
                </button>
              </div>
            </div>

            {/* Error Message Display if Payment Failed */}
            {paymentError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '0.6875rem',
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Transparent Note */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: '0.6875rem',
                color: '#92400E',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{t('final_price_note')}</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isConfirming}
              leftIcon={<CheckCircle2 size={16} />}
              onClick={handleFinalConfirmBooking}
            >
              {paymentMethod === 'razorpay' ? `Pay & Confirm • ₹${totalPrice}` : `Confirm Booking • ₹${totalPrice}`}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
