import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Rating } from '../../components/ui/Rating';
import { StateProgress } from '../../components/ui/StateProgress';
import { Phone, CheckCircle, Award, Coins, MessageSquare, ArrowLeft, KeyRound, MapPin, Copy, Check, Download } from 'lucide-react';
import { generateTaxInvoicePdf } from '../../services/invoiceService';

export const BookingTrackingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentBooking, submitCustomerReview, setActiveView } = useBooking();

  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittedReview, setIsSubmittedReview] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [selectedReviewChips, setSelectedReviewChips] = useState<string[]>([]);

  if (!currentBooking) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>No active booking found.</p>
        <Button onClick={() => setActiveView('home')} style={{ marginTop: '12px' }}>
          Back to Home
        </Button>
      </div>
    );
  }

  const worker = currentBooking.worker;
  const isCompleted = currentBooking.status === 'COMPLETED';
  const workerName = worker ? (language === 'hi' ? worker.nameHi : worker.name) : 'Assigned Specialist';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(currentBooking.token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const toggleReviewChip = (chip: string) => {
    if (selectedReviewChips.includes(chip)) {
      setSelectedReviewChips(selectedReviewChips.filter(c => c !== chip));
    } else {
      setSelectedReviewChips([...selectedReviewChips, chip]);
    }
  };

  const handleReviewSubmit = () => {
    const finalComment = selectedReviewChips.length > 0 
      ? `[${selectedReviewChips.join(', ')}] ${reviewComment}`
      : reviewComment;
    submitCustomerReview(currentBooking.id, ratingVal, finalComment);
    setIsSubmittedReview(true);
  };

  const getStatusSubtitle = () => {
    switch (currentBooking.status) {
      case 'REQUESTED': return `Request dispatched to ${workerName}. Waiting for artisan to accept...`;
      case 'MATCHED': return `AI matched ${workerName}. Dispatching job request...`;
      case 'ACCEPTED': return `${workerName} has accepted your service order and is gearing up.`;
      case 'ON_THE_WAY': return `${workerName} is en route to ${currentBooking.city || 'your area'} (ETA ~12 mins).`;
      case 'IN_PROGRESS': return `Artisan is currently performing ${currentBooking.serviceName} at your premises.`;
      case 'COMPLETED': return 'Work completed and verified. 30-Day AIDORA warranty is active.';
      case 'CANCELLED': return 'Booking was declined or cancelled.';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
            }}
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t('tracking_title')}
            </h1>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Live cooperative dispatch & updates
            </span>
          </div>
        </div>

        {/* Token Badge with Copy */}
        <div
          onClick={handleCopyToken}
          className="sahyog-btn"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 8px',
            textAlign: 'right',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast) var(--ease-out-smooth)',
          }}
          title="Click to copy Service Token"
        >
          <span style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
            {t('service_token')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)' }}>
              {currentBooking.token}
            </span>
            {copiedToken ? <Check size={12} color="var(--success)" /> : <Copy size={12} color="var(--text-muted)" />}
          </div>
        </div>
      </div>

      {/* Progress Stepper Card */}
      <Card padding="sm">
        <StateProgress currentStatus={currentBooking.status} />
        
        {/* Dynamic Status Update Box */}
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: isCompleted ? 'var(--success-light)' : 'var(--bg-muted)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 800, color: isCompleted ? 'var(--success-dark)' : 'var(--text-primary)' }}>
              {currentBooking.status.replace(/_/g, ' ')}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {currentBooking.scheduledTime}
            </span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: isCompleted ? 'var(--success-dark)' : 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
            {getStatusSubtitle()}
          </p>
        </div>
      </Card>

      {/* Safety Start OTP (Indian marketplace security pattern) */}
      {!isCompleted && (
        <div
          style={{
            backgroundColor: 'var(--primary-light, #F0FDF4)',
            border: '1.5px solid var(--primary-border, #D9E9C8)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Service Start Verification OTP
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Share with artisan only after arrival at your premises
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.1em',
            }}
          >
            {currentBooking.otp || '4829'}
          </div>
        </div>
      )}

      {/* Assigned Specialist Card */}
      {worker && (
        <Card variant="default">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={worker.avatar}
                alt={worker.name}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-default)',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {workerName}
                  </h3>
                  <Badge variant="verified" size="sm">KYC</Badge>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {worker.professions.join(', ')}
                </div>
                <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Rating value={worker.rating} count={worker.reviewCount} size={11} />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>• {worker.experienceYears} yrs</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${worker.phone}`}
              className="sahyog-btn"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
              }}
              title="Call Specialist"
            >
              <Phone size={18} />
            </a>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-xs)',
              padding: '6px 10px',
              fontSize: '0.6875rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Award size={13} color="var(--primary)" />
            <span>Member of: <strong style={{ color: 'var(--text-primary)' }}>{worker.cooperativeName}</strong></span>
          </div>
        </Card>
      )}

      {/* Service Order Overview */}
      <Card>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Booking Details & Address
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Service Category:</span>
            <strong>{currentBooking.serviceName} ({currentBooking.tier} Tier)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Priority:</span>
            <Badge variant={currentBooking.urgency === 'EMERGENCY' ? 'emergency' : 'neutral'} size="sm">
              {currentBooking.urgency === 'EMERGENCY' ? '⚡ Emergency' : 'Standard'}
            </Badge>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
            <strong style={{ color: 'var(--primary)' }}>₹{currentBooking.totalPrice} (Platform Confirmed)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={12} /> Service Address:
            </span>
            <span style={{ textAlign: 'right', maxWidth: '200px', fontWeight: 600 }}>
              {currentBooking.address || (currentBooking.city ? `Flat 402, Green Vista, ${currentBooking.city}` : 'Indiranagar 4th Block, Bangalore')}
            </span>
          </div>
        </div>
      </Card>



      {/* Completion & Feedback Section */}
      {isCompleted && (
        <Card
          variant="default"
          style={{
            border: '1.5px solid var(--success-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={24} color="var(--success)" />
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--success-dark)' }}>
                {t('service_completed_title')}
              </h3>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Token {currentBooking.token} successfully completed
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#92400E',
            }}
          >
            <Coins size={16} color="#D97706" />
            <span>{t('super_coins_earned')}</span>
          </div>

          {isSubmittedReview || currentBooking.customerRating ? (
            <div style={{ backgroundColor: 'var(--bg-muted)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success-dark)' }}>
                ✓ Verified Rating & Feedback Recorded
              </div>
              <div style={{ marginTop: '4px' }}>
                <Rating value={currentBooking.customerRating || ratingVal} size={13} />
              </div>
              {currentBooking.customerReview && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  "{currentBooking.customerReview}"
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t('rate_worker')} {workerName}:
              </label>
              
              <Rating value={ratingVal} interactive onChange={(val) => setRatingVal(val)} size={22} />

              {/* Quick Feedback Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                {['Punctual & On Time', 'Clean Work', 'Polite Behavior', 'Fair Pricing', 'Expert Skills'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleReviewChip(tag)}
                    className="sahyog-btn"
                    style={{
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${selectedReviewChips.includes(tag) ? 'var(--primary)' : 'var(--border-default)'}`,
                      backgroundColor: selectedReviewChips.includes(tag) ? 'var(--primary-light)' : 'var(--bg-surface)',
                      color: selectedReviewChips.includes(tag) ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: selectedReviewChips.includes(tag) ? 700 : 500,
                      transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                placeholder={t('write_review_placeholder')}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-sans)',
                  resize: 'none',
                  outline: 'none',
                }}
              />

              <Button
                type="button"
                variant="success"
                size="sm"
                leftIcon={<MessageSquare size={14} />}
                onClick={handleReviewSubmit}
              >
                {t('submit_feedback')}
              </Button>
            </div>
          )}

          {/* Download Receipt CTA */}
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Includes GST & 30-Day Guarantee</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Download size={13} />}
              onClick={() => generateTaxInvoicePdf({ booking: currentBooking })}
            >
              Tax Invoice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
