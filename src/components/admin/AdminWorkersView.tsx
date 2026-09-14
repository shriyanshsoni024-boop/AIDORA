import React, { useState, useEffect } from 'react';
import { Worker, KycItem } from '../../types';
import { workerService } from '../../services/workerService';
import { adminService } from '../../services/adminService';
import { WorkerDetailModal } from './WorkerDetailModal';
import { Users, Search, ShieldCheck, Check, X, Star, MapPin, Power } from 'lucide-react';

export const AdminWorkersView: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [kycQueue, setKycQueue] = useState<KycItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'verified' | 'online' | 'offline'>('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [processingKycId, setProcessingKycId] = useState<string | null>(null);

  const loadWorkersData = async () => {
    const [wRes, kRes] = await Promise.all([
      workerService.getWorkers(),
      adminService.getKycQueue(),
    ]);

    if (wRes.success && wRes.data) {
      setWorkers(wRes.data);
    }
    if (kRes.success && kRes.data) {
      setKycQueue(kRes.data);
    }
  };

  useEffect(() => {
    loadWorkersData();
  }, []);

  const handleKycAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    if (processingKycId) return;
    setProcessingKycId(id);
    try {
      const res = await adminService.processKyc(id, action);
      if (res.success && res.data) {
        setKycQueue(res.data);
        await loadWorkersData();
      }
    } finally {
      setProcessingKycId(null);
    }
  };

  const handleUpdateWorkerStatus = async (workerId: string, updates: Partial<Worker>) => {
    const res = await workerService.updateWorker(workerId, updates);
    if (res.success && res.data) {
      setSelectedWorker(res.data);
      await loadWorkersData();
    }
  };

  // Filter workers based on search and filter type
  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.professions.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.zone.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'pending') return w.verificationStatus === 'PENDING' || w.verificationStatus === 'UNDER_REVIEW';
    if (filterType === 'verified') return w.verificationStatus === 'VERIFIED';
    if (filterType === 'online') return w.availability === 'AVAILABLE';
    if (filterType === 'offline') return w.availability === 'NOT_AVAILABLE';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* 1. KYC Verification Action Queue (if any pending) */}
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
            <ShieldCheck size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Artisan KYC Verification Queue ({kycQueue.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            Cooperative Node Approval
          </span>
        </div>

        {kycQueue.length === 0 ? (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)' }}>
            ✓ All artisan KYC documents and certificates are verified.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {kycQueue.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FFFBEB',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#92400E', fontWeight: 600 }}>
                    {item.profession} • {item.cooperative}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Docs: <strong>{item.documents}</strong> • {item.submittedAt || 'Today'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={processingKycId === item.id}
                    onClick={() => handleKycAction(item.id, 'APPROVED')}
                    className="sahyog-btn"
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--success)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: processingKycId === item.id ? 'not-allowed' : 'pointer',
                      opacity: processingKycId === item.id ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                    }}
                  >
                    <Check size={12} />
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={processingKycId === item.id}
                    onClick={() => handleKycAction(item.id, 'REJECTED')}
                    className="sahyog-btn"
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--danger)',
                      border: '1px solid var(--border-default)',
                      cursor: processingKycId === item.id ? 'not-allowed' : 'pointer',
                      opacity: processingKycId === item.id ? 0.6 : 1,
                      fontSize: '0.6875rem',
                      transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Worker Directory Search & Filters */}
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
            <Users size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Registered Cooperative Artisans ({workers.length})
            </h3>
          </div>
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-xs)',
            padding: '6px 10px',
            border: '1px solid var(--border-default)',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by worker name, trade, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.75rem',
              outline: 'none',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
          {(['all', 'verified', 'online', 'offline', 'pending'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterType(key)}
              className="sahyog-btn"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: filterType === key ? 'var(--primary)' : 'var(--bg-muted)',
                color: filterType === key ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
              }}
            >
              {key === 'all' && `All (${workers.length})`}
              {key === 'verified' && 'Verified'}
              {key === 'online' && 'Online Now'}
              {key === 'offline' && 'Offline'}
              {key === 'pending' && `Pending KYC (${kycQueue.length})`}
            </button>
          ))}
        </div>

        {/* Workers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredWorkers.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              No workers match the selected criteria.
            </div>
          ) : (
            filteredWorkers.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWorker(w)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={w.avatar}
                    alt={w.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-xs)',
                      objectFit: 'cover',
                      border: '1px solid var(--border-default)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {w.name}
                      </span>
                      {w.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck size={12} color="var(--success)" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      {w.professions.join(' • ')}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={10} /> {w.zone} • {w.completedJobs} Jobs
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 800, color: '#92400E', justifyContent: 'flex-end' }}>
                    <Star size={10} fill="#D97706" color="#D97706" />
                    <span>{w.rating}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: w.availability === 'AVAILABLE' ? 'var(--success-light)' : 'var(--bg-muted)',
                      color: w.availability === 'AVAILABLE' ? 'var(--success-dark)' : 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      marginTop: '2px',
                    }}
                  >
                    <Power size={8} />
                    {w.availability === 'AVAILABLE' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Worker Detail Modal */}
      <WorkerDetailModal
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onUpdateStatus={handleUpdateWorkerStatus}
      />
    </div>
  );
};

