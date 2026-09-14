import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, ShieldCheck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

export const CustomerMoneyPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(450);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPassModal, setShowPassModal] = useState<boolean>(false);
  const [addAmount, setAddAmount] = useState<string>('500');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const transactions = [
    {
      id: 'tx-1',
      title: 'Cooperative Cashback Bonus',
      subtitle: 'Electrical Wiring Booking #SYH-48291',
      date: 'Today, 2:45 PM',
      amount: '+₹50',
      isCredit: true,
      tag: 'CASHBACK',
    },
    {
      id: 'tx-2',
      title: 'Paid for Bathroom Cleaning',
      subtitle: 'Booking #SYH-39104 (Ramesh Kumar)',
      date: 'Yesterday, 11:20 AM',
      amount: '-₹399',
      isCredit: false,
      tag: 'BOOKING',
    },
    {
      id: 'tx-3',
      title: 'Welcome Referral Credit',
      subtitle: 'Joined via AIDORA Member invite',
      date: '05 Sep 2026',
      amount: '+₹100',
      isCredit: true,
      tag: 'REFERRAL',
    },
  ];

  const handleAddCredits = () => {
    const val = parseInt(addAmount, 10);
    if (val > 0) {
      setBalance((prev) => prev + val);
      setShowAddModal(false);
    }
  };

  const handleCopyReferral = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px 16px 80px',
        backgroundColor: 'var(--sahyog-cream, #FCFBF4)',
        minHeight: '100vh',
      }}
    >
      {/* 1. Header & Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--sahyog-ink, #0B0B0B)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
            AIDORA Money & Credits
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Zero-brokerage credits, instant refunds & cooperative benefits
          </p>
        </div>

        <div
          style={{
            padding: '4px 8px',
            backgroundColor: '#F0FDF4',
            border: '1px solid var(--sahyog-sage, #D9E9C8)',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: 'var(--sahyog-green, #1DAA5C)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={13} />
          <span>100% Protected</span>
        </div>
      </div>

      {/* 2. Main Balance Card */}
      <div
        style={{
          background: 'linear-gradient(145deg, var(--sahyog-green, #1DAA5C) 0%, var(--sahyog-green-dark, #0F7A3E) 100%)',
          borderRadius: '20px',
          padding: '22px 20px',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(29, 170, 92, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={18} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)' }}>
              AIDORA Wallet Balance
            </span>
          </div>

          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: '#FFFFFF',
              color: 'var(--sahyog-green-dark, #0F7A3E)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            ACTIVE
          </span>
        </div>

        <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '18px' }}>
          ₹{balance}
        </div>

        {/* Action Buttons: Add Money & Redeem */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{
              flex: 1,
              padding: '10px 14px',
              backgroundColor: '#FFFFFF',
              color: 'var(--sahyog-green-dark, #0F7A3E)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
            className="sahyog-btn"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Money</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPassModal(true)}
            style={{
              flex: 1,
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Gift size={16} />
            <span>Redeem Pass</span>
          </button>
        </div>
      </div>

      {/* 3. Referral Bonus Banner */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          borderRadius: '16px',
          border: '1px solid #FDE68A',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
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
              color: '#D97706',
              flexShrink: 0,
            }}
          >
            <Gift size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#92400E' }}>
              Refer a neighbor & earn ₹100
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#B45309' }}>
              Your referral code: <strong>AIDORA100</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyReferral}
          style={{
            padding: '6px 12px',
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {copiedCode ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* 4. Recent Transactions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid var(--sahyog-sage, #D9E9C8)',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)' }}>
            Recent Activity & Pass
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--sahyog-green, #1DAA5C)' }}>
            View All
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: tx.isCredit ? '#F0FDF4' : '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tx.isCredit ? 'var(--sahyog-green, #1DAA5C)' : 'var(--sahyog-red, #E0472C)',
                  }}
                >
                  {tx.isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>

                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                    {tx.title}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                    {tx.subtitle} • {tx.date}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: tx.isCredit ? 'var(--sahyog-green, #1DAA5C)' : 'var(--sahyog-ink, #0B0B0B)',
                }}
              >
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Saved Payment Methods */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid var(--sahyog-sage, #D9E9C8)',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', marginBottom: '12px' }}>
          Linked Payment Options
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '1.25rem' }}>📱</div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                  UPI / GPay / PhonePe
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                  Primary instant payment mode
                </div>
              </div>
            </div>
            <CheckCircle2 size={16} color="var(--sahyog-green, #1DAA5C)" />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={18} color="#64748B" />
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                  Debit / Credit Card
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                  Visa / Mastercard / RuPay
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div
          className="animate-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="animate-slide-up"
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '24px 20px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', margin: 0 }}>
              Add AIDORA Wallet Balance
            </h3>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['200', '500', '1000', '2000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddAmount(amt)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1.5px solid ${addAmount === amt ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                    backgroundColor: addAmount === amt ? '#F0FDF4' : '#FFFFFF',
                    color: addAmount === amt ? 'var(--sahyog-green, #1DAA5C)' : '#0F172A',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddCredits}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '8px',
              }}
              className="sahyog-btn"
            >
              Add ₹{addAmount} via UPI
            </button>
          </div>
        </div>
      )}

      {/* Redeem Pass / Voucher Modal */}
      {showPassModal && (
        <div
          className="animate-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowPassModal(false)}
        >
          <div
            className="animate-modal-enter"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift size={22} color="var(--sahyog-green, #1DAA5C)" />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Cooperative Voucher & Member Pass
              </h3>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              AIDORA Cooperative member vouchers and referral discounts are auto-applied at checkout for zero corporate surcharge services.
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                  ACTIVE PASS: COOP2026
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#1DAA5C', fontWeight: 700 }}>
                  ₹50 Off Next Service Booking
                </div>
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px' }}>
                READY
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPassModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
