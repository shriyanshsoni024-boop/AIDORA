import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Building,
  Clock,
} from 'lucide-react';

export const WorkerEarningsView: React.FC = () => {
  const { worker, earningsHistory, todayEarnings, weeklyEarnings } = useWorker();
  const { language } = useLanguage();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px 16px 90px',
      }}
    >
      {/* 1. Large Premium Earnings Balance Hero Card */}
      <div
        style={{
          background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '26px',
          padding: '22px 20px',
          color: '#FFFFFF',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Glow Element */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={16} color="#34D399" />
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#94A3B8',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Cooperative Payout Balance
            </span>
          </div>

          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 900,
              backgroundColor: 'rgba(16, 185, 129, 0.25)',
              color: '#34D399',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              letterSpacing: '0.04em',
            }}
          >
            0% COMMISSION
          </span>
        </div>

        {/* Main Payout Amount */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0 16px' }}>
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            ₹{todayEarnings}
          </span>
          <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 600 }}>
            {language === 'hi' ? 'आज की कुल शुद्ध कमाई' : "Today's Net Take-Home"}
          </span>
        </div>

        {/* Secondary Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>This Week's Net:</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--pronto-accent, #F4C430)', marginTop: '2px' }}>
              ₹{weeklyEarnings}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>Completed Jobs:</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
              {worker.completedJobs} Jobs
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cooperative 0% Commission Value Banner */}
      <div
        style={{
          backgroundColor: '#ECFDF5',
          borderRadius: '18px',
          padding: '14px 16px',
          border: '1.5px solid #A7F3D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#1DAA5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#065F46' }}>
              Your Labor. Your Earnings.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#166534' }}>
              AIDORA operates at 0% corporate cut. 100% of service value stays with you.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bank Auto-Settlement Account Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
            }}
          >
            <Building size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
              HDFC Bank Auto-Settlement
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
              •••• 4019 (UPI Verified) • Daily 09:00 PM auto-deposit
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#1DAA5C',
            backgroundColor: '#F0FDF4',
            padding: '3px 8px',
            borderRadius: '9999px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <CheckCircle2 size={12} /> Active
        </span>
      </div>

      {/* 4. Transaction History Activity Ledger */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            paddingLeft: '4px',
          }}
        >
          Recent Job Payouts ({earningsHistory.length})
        </div>

        {earningsHistory.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '24px 16px',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              color: '#64748B',
            }}
          >
            <Clock size={28} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
              No completed payouts yet today
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
              Accept a dispatch request and complete the job to see your payout record here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {earningsHistory.map((item) => {
              const gross = item.amount || 474;
              const fee = item.platformFee || 0;
              const net = item.netPayout || gross - fee;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: '#F0FDF4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1DAA5C',
                      }}
                    >
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                        {item.serviceName}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                        Token: {item.bookingToken} • {item.customerName}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: '#94A3B8', marginTop: '1px' }}>
                        {item.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1DAA5C' }}>
                      +₹{net}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#64748B', marginTop: '2px' }}>
                      Gross: ₹{gross} • Fee: ₹{fee}
                    </div>
                    <span
                      style={{
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        color: '#1DAA5C',
                        backgroundColor: '#ECFDF5',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '2px',
                      }}
                    >
                      CREDITED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
