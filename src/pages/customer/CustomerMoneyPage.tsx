import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, ShieldCheck, CheckCircle2, History } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { storageService } from '../../services/storage/storageService';

const STORAGE_WALLET_BALANCE = 'sahyog_customer_wallet_balance';
const STORAGE_WALLET_TXS = 'sahyog_customer_wallet_txs';

interface WalletTx {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  amount: string;
  isCredit: boolean;
  tag: string;
}

export const CustomerMoneyPage: React.FC = () => {
  const { bookings } = useBooking();
  const [balance, setBalance] = useState<number>(() => {
    return storageService.getItem<number>(STORAGE_WALLET_BALANCE, 0);
  });
  const [customTransactions, setCustomTransactions] = useState<WalletTx[]>(() => {
    return storageService.getItem<WalletTx[]>(STORAGE_WALLET_TXS, []);
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showPassModal, setShowPassModal] = useState<boolean>(false);
  const [addAmount, setAddAmount] = useState<string>('500');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Derive booking payments into transaction records
  const bookingTransactions: WalletTx[] = bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .map((b) => ({
      id: `tx-b-${b.id}`,
      title: `Service Payment: ${b.serviceName}`,
      subtitle: `Booking #${b.token || b.id.slice(-6)} • ${b.worker?.name || 'Assigned Artisan'}`,
      date: new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount: `-₹${b.totalPrice}`,
      isCredit: false,
      tag: 'BOOKING',
    }));

  const allTransactions = [...customTransactions, ...bookingTransactions];

  const handleAddCredits = () => {
    const val = parseInt(addAmount, 10);
    if (val > 0) {
      const newBal = balance + val;
      setBalance(newBal);
      storageService.setItem(STORAGE_WALLET_BALANCE, newBal);

      const newTx: WalletTx = {
        id: `tx-add-${Date.now()}`,
        title: 'Wallet Top-up (UPI / NetBanking)',
        subtitle: 'Instant Credit Added',
        date: 'Today, Just now',
        amount: `+₹${val}`,
        isCredit: true,
        tag: 'TOPUP',
      };

      const updated = [newTx, ...customTransactions];
      setCustomTransactions(updated);
      storageService.setItem(STORAGE_WALLET_TXS, updated);
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

      {/* 4. Recent Activity & Transactions */}
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
            Recent Transactions ({allTransactions.length})
          </span>
        </div>

        {allTransactions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allTransactions.map((tx) => (
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
        ) : (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#64748B',
            }}
          >
            <History size={28} color="#94A3B8" />
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
              No transactions yet
            </div>
            <div style={{ fontSize: '0.75rem', maxWidth: '240px' }}>
              Your booking payment receipts, refunds, and cooperative pass savings will appear here.
            </div>
          </div>
        )}
      </div>

      {/* 5. Add Money Modal */}
      {showAddModal && (
        <div
          className="animate-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="animate-scale-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
              Add Money to AIDORA Wallet
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              {['200', '500', '1000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddAmount(amt)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    border: `1.5px solid ${addAmount === amt ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                    backgroundColor: addAmount === amt ? '#F0FDF4' : '#FFFFFF',
                    color: addAmount === amt ? 'var(--sahyog-green-dark, #0F7A3E)' : '#334155',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Enter custom amount"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCredits}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Add ₹{addAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Redeem Pass Modal */}
      {showPassModal && (
        <div
          className="animate-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowPassModal(false)}
        >
          <div
            className="animate-scale-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCircle2 size={40} color="var(--sahyog-green, #1DAA5C)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
              AIDORA Pass Active
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px' }}>
              Your account has complimentary zero-brokerage platform access activated. You enjoy ₹0 platform fees on all verified cooperative technician requests.
            </p>
            <button
              type="button"
              onClick={() => setShowPassModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--sahyog-green, #1DAA5C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Great, got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
