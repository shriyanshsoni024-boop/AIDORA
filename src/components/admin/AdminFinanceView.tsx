import React, { useState, useEffect } from 'react';
import { adminService, FinanceOverview } from '../../services/adminService';
import { welfareService, WelfareFundOverview } from '../../services/welfareService';
import { IndianRupee, CheckCircle2, Clock, HeartHandshake, Check, X } from 'lucide-react';

export const AdminFinanceView: React.FC = () => {
  const [finance, setFinance] = useState<FinanceOverview>({
    todayGrossValue: 0,
    workerPayoutsTotal: 0,
    cooperativeRevenue: 0,
    settledCount: 0,
    pendingCount: 0,
    transactions: [],
  });

  const [welfareOverview, setWelfareOverview] = useState<WelfareFundOverview>({
    totalFundBalance: 250000,
    totalClaimsSettled: 0,
    totalDisbursedAmount: 0,
    activeClaimsCount: 0,
    claims: [],
  });
  const [processingClaimId, setProcessingClaimId] = useState<string | null>(null);

  const loadData = async () => {
    const [finRes, welfRes] = await Promise.all([
      adminService.getFinancialOverview(),
      welfareService.getFundOverview(),
    ]);
    if (finRes.success && finRes.data) setFinance(finRes.data);
    if (welfRes.success && welfRes.data) setWelfareOverview(welfRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimAction = async (claimId: string, action: 'DISBURSE' | 'REJECT') => {
    if (processingClaimId) return;
    setProcessingClaimId(claimId);
    try {
      await welfareService.processClaim(claimId, action);
      await loadData();
    } finally {
      setProcessingClaimId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* 1. Cooperative Payout Balance Banner (Clean Light Surface) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--sahyog-green, #1DAA5C)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Cooperative Settlement & Clearing Ledger
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-dark)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--success-border)',
            }}
          >
            0% COMMISSION • 100% ARTISAN
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              ₹{finance.workerPayoutsTotal.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Direct Artisan Labor Disbursals
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await adminService.processClearingBatch();
              await loadData();
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Process Clearing Batch
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Gross Customer Value:</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1px' }}>
              ₹{finance.todayGrossValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Coop Platform Fee (₹25/order):</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success-dark)', marginTop: '1px' }}>
              ₹{finance.cooperativeRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Settlement Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Settled to Bank / UPI
            </span>
            <CheckCircle2 size={14} color="var(--success-dark)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--success-dark)', marginTop: '4px' }}>
            {finance.settledCount} Payments
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cooperative Direct Clearing
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Pending Job Completion
            </span>
            <Clock size={14} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--warning)', marginTop: '4px' }}>
            {finance.pendingCount} In Escrow
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Released upon OTP + Completion
          </div>
        </div>
      </div>

      {/* 3. Cooperative Safety Net & Mutual Aid Relief Fund */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1.5px solid #BBF7D0',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartHandshake size={16} color="var(--sahyog-green, #1DAA5C)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Cooperative Welfare & Safety Net Fund
            </h3>
          </div>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#065F46', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
            Fund Pool: ₹{welfareOverview.totalFundBalance.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.6875rem' }}>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Claims Settled:</div>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '1px' }}>{welfareOverview.totalClaimsSettled}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Total Disbursed:</div>
            <div style={{ fontWeight: 800, color: 'var(--success-dark)', marginTop: '1px' }}>₹{welfareOverview.totalDisbursedAmount.toLocaleString()}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Pending Claims:</div>
            <div style={{ fontWeight: 800, color: welfareOverview.activeClaimsCount > 0 ? '#B45309' : 'var(--text-primary)', marginTop: '1px' }}>
              {welfareOverview.activeClaimsCount}
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {welfareOverview.claims.map((claim) => (
            <div
              key={claim.id}
              style={{
                padding: '8px 10px',
                backgroundColor: claim.status === 'PENDING' ? '#FFFBEB' : 'var(--bg-app)',
                borderRadius: 'var(--radius-xs)',
                border: claim.status === 'PENDING' ? '1px solid #FDE68A' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {claim.workerName} ({claim.trade})
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {claim.title} • <strong>₹{claim.requestedAmount}</strong>
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  Incident: {claim.incidentDate} • {claim.description}
                </div>
              </div>

              {claim.status === 'PENDING' || claim.status === 'UNDER_REVIEW' ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={processingClaimId === claim.id}
                    onClick={() => handleClaimAction(claim.id, 'DISBURSE')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--success)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <Check size={11} /> Disburse
                  </button>
                  <button
                    type="button"
                    disabled={processingClaimId === claim.id}
                    onClick={() => handleClaimAction(claim.id, 'REJECT')}
                    style={{
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--danger)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: claim.status === 'DISBURSED' ? 'var(--success-light)' : '#F1F5F9',
                    color: claim.status === 'DISBURSED' ? 'var(--success-dark)' : 'var(--text-muted)',
                  }}
                >
                  {claim.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* 3. Transaction Breakdown Ledger */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IndianRupee size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Daily Order Settlement Ledger ({finance.transactions.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            Live Sync
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {finance.transactions.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {t.bookingToken} • {t.serviceName}
                </span>
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: t.status === 'PAID' ? 'var(--success-light)' : 'var(--accent-warm-light, #FEF9C3)',
                    color: t.status === 'PAID' ? 'var(--success-dark)' : 'var(--accent-warm-dark, #854D0E)',
                  }}
                >
                  {t.status === 'PAID' ? 'Settled' : 'In Progress'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                <span>Artisan: <strong>{t.workerName}</strong></span>
                <span>Customer: <strong>{t.customerName}</strong></span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '6px',
                  borderTop: '1px dashed var(--border-default)',
                  fontSize: '0.6875rem',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Gross: ₹{t.grossAmount} | Coop: ₹{t.coopAmount}</span>
                <span style={{ fontWeight: 800, color: 'var(--success-dark)' }}>
                  Net Artisan Payout: ₹{t.workerPayout}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
