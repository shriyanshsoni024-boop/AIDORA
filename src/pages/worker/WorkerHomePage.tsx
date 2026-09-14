import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useBooking } from '../../context/BookingContext';
import { SkillsMatrixView } from '../../components/worker/SkillsMatrixView';
import { TrainingCourseView } from '../../components/worker/TrainingCourseView';
import { WorkerEarningsView } from '../../components/worker/WorkerEarningsView';
import { WorkerProfileView } from '../../components/worker/WorkerProfileView';
import { ActiveJobCard } from '../../components/worker/ActiveJobCard';
import { SkillQuizModal } from '../../components/worker/SkillQuizModal';
import { CertificateModal } from '../../components/worker/CertificateModal';
import { WorkerOnboardingModal } from '../../components/worker/WorkerOnboardingModal';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Power,
  Award,
  MapPin,
  BookOpen,
  IndianRupee,
  Zap,
  ArrowRight,
  Briefcase,
  Star,
} from 'lucide-react';
import { getWorkerTheme } from '../../styles/workerThemes';
import { Avatar } from '../../components/common/Avatar';

export const WorkerHomePage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    worker,
    isAvailable,
    setIsAvailable,
    todayEarnings,
    acceptBooking,
    declineBooking,
    trainingModules,
    skillsMatrix,
    certificates,
    setActiveQuizModule,
  } = useWorker();

  const { bookings } = useBooking();

  const [jobFilter, setJobFilter] = useState<'all' | 'active' | 'pending' | 'completed' | 'cancelled'>('all');

  const theme = getWorkerTheme(worker.professions);

  // Active ongoing job for this worker
  const activeBooking = bookings.find(
    (b) => b.status === 'ACCEPTED' || b.status === 'ON_THE_WAY' || b.status === 'IN_PROGRESS'
  );

  // Pending job request waiting for response
  const pendingRequest = bookings.find(
    (b) => b.status === 'REQUESTED' || b.status === 'MATCHED'
  );

  // Filtered jobs for Jobs tab
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');
  const pendingBookings = bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'MATCHED');
  const activeBookings = bookings.filter((b) =>
    ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
  );

  let displayedBookings = bookings;
  if (jobFilter === 'active') displayedBookings = activeBookings;
  if (jobFilter === 'pending') displayedBookings = pendingBookings;
  if (jobFilter === 'completed') displayedBookings = completedBookings;
  if (jobFilter === 'cancelled') displayedBookings = cancelledBookings;

  const verifiedSkillsCount = skillsMatrix.filter((s) => s.verified).length;
  const pendingRequiredModules = trainingModules.filter((m) => !m.completed);

  const handleStartTraining = () => {
    if (pendingRequiredModules.length > 0) {
      setActiveQuizModule(pendingRequiredModules[0]);
    }
    setActiveTab('training');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'skills':
        return <SkillsMatrixView />;
      case 'training':
        return <TrainingCourseView />;
      case 'earnings':
        return <WorkerEarningsView />;
      case 'profile':
        return <WorkerProfileView />;
      case 'jobs':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px 16px 90px',
            }}
          >
            {/* Filter Chips Bar */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
              className="hide-scrollbar"
            >
              {[
                { id: 'all', label: 'All Jobs', count: bookings.length },
                { id: 'active', label: 'Active', count: activeBookings.length },
                { id: 'pending', label: 'Pending', count: pendingBookings.length },
                { id: 'completed', label: 'Completed', count: completedBookings.length },
                { id: 'cancelled', label: 'Declined', count: cancelledBookings.length },
              ].map((chip) => {
                const isSelected = jobFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setJobFilter(chip.id as any)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 800 : 600,
                      backgroundColor: isSelected ? theme.primary : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      border: `1.5px solid ${isSelected ? theme.primary : '#E2E8F0'}`,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isSelected ? '0 4px 10px rgba(0, 0, 0, 0.08)' : 'none',
                    }}
                  >
                    <span>{chip.label}</span>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Job Highlight if present */}
            {activeBooking && jobFilter !== 'completed' && jobFilter !== 'cancelled' && (
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    paddingLeft: '4px',
                  }}
                >
                  Ongoing In-Progress Job
                </div>
                <ActiveJobCard booking={activeBooking} />
              </div>
            )}

            {/* Jobs Card List */}
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
                Dispatches ({displayedBookings.length})
              </div>

              {displayedBookings.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '32px 20px',
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                  }}
                >
                  <Briefcase size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A' }}>
                    No jobs found in this tab
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Keep your duty status Online to receive incoming customer dispatches.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {displayedBookings.map((b) => {
                    const gross = b.totalPrice || 474;
                    const fee = b.connectionFee || 0;
                    const net = gross - fee;
                    const isPending = b.status === 'REQUESTED' || b.status === 'MATCHED';
                    const isEmergency = b.urgency === 'EMERGENCY';

                    return (
                      <div
                        key={b.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '18px',
                          padding: '16px',
                          border: isPending ? `2px solid ${theme.primary}` : '1px solid #E2E8F0',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 800,
                                  color: b.status === 'COMPLETED' ? '#1DAA5C' : isPending ? theme.primary : '#D97706',
                                  backgroundColor: b.status === 'COMPLETED' ? '#ECFDF5' : isPending ? theme.primaryLight : '#FEF3C7',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {b.status.replace(/_/g, ' ')}
                              </span>
                              {isEmergency && (
                                <span
                                  style={{
                                    fontSize: '0.5625rem',
                                    fontWeight: 800,
                                    color: '#DC2626',
                                    backgroundColor: '#FEF2F2',
                                    padding: '2px 5px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  EMERGENCY 15M
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                              {b.serviceName || 'Home Service'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <MapPin size={12} /> {b.address || b.city || 'Noida'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.0625rem', fontWeight: 900, color: '#0F172A' }}>
                              ₹{net}
                            </div>
                            <div style={{ fontSize: '0.625rem', color: '#1DAA5C', fontWeight: 700 }}>
                              0% Commission
                            </div>
                          </div>
                        </div>

                        {b.description && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#475569',
                              backgroundColor: '#F8FAFC',
                              padding: '8px 10px',
                              borderRadius: '8px',
                            }}
                          >
                            "{b.description}"
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                          <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                            Token: <strong style={{ color: '#0F172A' }}>{b.token}</strong> • {b.scheduledTime || 'Immediate'}
                          </span>

                          {isPending && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => declineBooking(b.id)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  backgroundColor: '#F1F5F9',
                                  color: '#64748B',
                                  border: 'none',
                                  fontSize: '0.6875rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                onClick={() => acceptBooking(b.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  backgroundColor: theme.primary,
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '0.6875rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                              >
                                Accept Job
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px 16px 90px',
            }}
          >
            {/* 1. Artisan Hero Section & Online Duty Toggle */}
            <div
              style={{
                background: theme.headerBg,
                borderRadius: '26px',
                padding: '20px 18px',
                color: '#FFFFFF',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 400ms ease',
              }}
            >
              {/* Background Decorative Accent */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar
                    src={worker.avatar}
                    name={worker.name}
                    size={54}
                    shape="rounded"
                    ringColor="rgba(255, 255, 255, 0.6)"
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h1 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                        {worker.name}
                      </h1>
                      {worker.verificationStatus === 'VERIFIED' ? (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            backgroundColor: 'rgba(16, 185, 129, 0.3)',
                            color: '#A7F3D0',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(167, 243, 208, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <ShieldCheck size={10} />
                          KYC VERIFIED
                        </span>
                      ) : worker.verificationStatus === 'UNDER_REVIEW' ? (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            backgroundColor: 'rgba(245, 158, 11, 0.3)',
                            color: '#FDE68A',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(253, 230, 138, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <Clock size={10} />
                          KYC UNDER REVIEW
                        </span>
                      ) : worker.verificationStatus === 'REJECTED' ? (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                            color: '#FECACA',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(254, 202, 202, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <ShieldAlert size={10} />
                          KYC REJECTED
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            backgroundColor: 'rgba(148, 163, 184, 0.25)',
                            color: '#E2E8F0',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            border: '1px solid rgba(226, 232, 240, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <Clock size={10} />
                          KYC PENDING
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px', fontWeight: 600 }}>
                      {worker.professions.join(' • ') || 'Artisan Specialist'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '1px' }}>
                      {worker.locality || worker.city || worker.zone || 'Local Hub'} • {worker.cooperativeName || 'Cooperative Society'}
                    </div>
                  </div>
                </div>

                {/* Duty Online / Offline Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className="sahyog-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: '16px',
                    backgroundColor: isAvailable ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.2)',
                    border: `1.5px solid ${isAvailable ? '#34D399' : '#FCA5A5'}`,
                    color: isAvailable ? '#FFFFFF' : '#FECACA',
                    cursor: 'pointer',
                    minWidth: '64px',
                    backdropFilter: 'blur(8px)',
                    transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                  }}
                >
                  <Power size={18} color={isAvailable ? '#34D399' : '#FCA5A5'} className={isAvailable ? 'animate-pulse-live' : ''} />
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                    {isAvailable ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </button>
              </div>

              {/* Duty Status Sub-bar */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '8px 12px',
                  backgroundColor: isAvailable ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  color: isAvailable ? '#E2E8F0' : '#FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {isAvailable
                    ? "You're Online • Ready for Dispatches"
                    : "You're Offline • Switch online to receive jobs"}
                </span>

                {isAvailable && worker.emergencyAvailable && (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#FCA5A5',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Zap size={10} fill="#FCA5A5" /> 15m Squad
                  </span>
                )}
              </div>
            </div>

            {/* 2. Today's Earnings Wallet Card */}
            <div
              onClick={() => setActiveTab('earnings')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '22px',
                padding: '18px 18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              className="hover-card"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Today's Earnings
                  </span>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      backgroundColor: '#ECFDF5',
                      color: '#1DAA5C',
                      padding: '1px 5px',
                      borderRadius: '4px',
                    }}
                  >
                    0% CUT
                  </span>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginTop: '4px', letterSpacing: '-0.03em' }}>
                  ₹{todayEarnings}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <span>✓ <strong>{worker.completedJobs}</strong> Jobs Done</span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#92400E', fontWeight: 700 }}>
                    <Star size={12} fill="#D97706" color="#D97706" /> {worker.rating}
                  </span>
                </div>
              </div>

              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  backgroundColor: theme.primaryLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.primary,
                }}
              >
                <IndianRupee size={22} />
              </div>
            </div>

            {/* 3. NEW DISPATCH REQUEST CARD (Prominently Highlighted) */}
            {pendingRequest && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px 18px',
                  border: `2px solid ${pendingRequest.urgency === 'EMERGENCY' ? '#EF4444' : theme.primary}`,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 900,
                        backgroundColor: pendingRequest.urgency === 'EMERGENCY' ? '#FEF2F2' : theme.primaryLight,
                        color: pendingRequest.urgency === 'EMERGENCY' ? '#DC2626' : theme.primary,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        border: `1px solid ${pendingRequest.urgency === 'EMERGENCY' ? '#FECACA' : theme.primaryBorder}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Zap size={12} fill={pendingRequest.urgency === 'EMERGENCY' ? '#DC2626' : theme.primary} />
                      {pendingRequest.urgency === 'EMERGENCY' ? 'EMERGENCY PRIORITY' : 'NEW DISPATCH REQUEST'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    Token: {pendingRequest.token}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '1.1875rem', fontWeight: 900, color: '#0F172A' }}>
                    {pendingRequest.serviceName || 'Electrical / Home Repair'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={14} color={theme.primary} />
                    <strong style={{ color: '#0F172A' }}>{pendingRequest.address || pendingRequest.city || 'Sector 62, Noida'}</strong>
                  </div>
                </div>

                {pendingRequest.description && (
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: '#334155',
                      backgroundColor: '#F8FAFC',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      lineHeight: 1.4,
                    }}
                  >
                    <strong style={{ color: '#0F172A' }}>Problem:</strong> "{pendingRequest.description}"
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: theme.primaryLight,
                    borderRadius: '14px',
                    border: `1px solid ${theme.primaryBorder}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: theme.primaryDark, fontWeight: 700 }}>
                      Estimated Net Payout:
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: theme.primary }}>
                      ₹{pendingRequest.totalPrice || 449}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#1DAA5C',
                      backgroundColor: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    100% Retained
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => declineBooking(pendingRequest.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Decline
                  </button>

                  <button
                    type="button"
                    onClick={() => acceptBooking(pendingRequest.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      backgroundColor: pendingRequest.urgency === 'EMERGENCY' ? '#DC2626' : theme.primary,
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <span>ACCEPT JOB</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* 4. ACTIVE ONGOING JOB (If accepted/on way/in progress) */}
            {activeBooking && (
              <div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                    paddingLeft: '4px',
                  }}
                >
                  Active Job in Progress
                </div>
                <ActiveJobCard booking={activeBooking} />
              </div>
            )}

            {/* 5. Quick Professional Navigation Actions */}
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
                Artisan Guild & Skills
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {/* Skills Matrix */}
                <div
                  onClick={() => setActiveTab('skills')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                  className="hover-card"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      backgroundColor: theme.primaryLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.primary,
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                      Skills Matrix
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                      {verifiedSkillsCount} Verified Badges
                    </div>
                  </div>
                </div>

                {/* Video Training LMS */}
                <div
                  onClick={handleStartTraining}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                  className="hover-card"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      backgroundColor: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1DAA5C',
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                      Video Training
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                      {pendingRequiredModules.length > 0 ? `${pendingRequiredModules.length} Modules Open` : 'All Completed'}
                    </div>
                  </div>
                </div>

                {/* Cooperative Safety Net */}
                <div
                  onClick={() => setActiveTab('profile')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                  className="hover-card"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      backgroundColor: theme.primaryLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.primary,
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                      Safety Net
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                      ₹5L Insurance Active
                    </div>
                  </div>
                </div>

                {/* Partner Setup / Certificates */}
                <div
                  onClick={() => setActiveTab('profile')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                  className="hover-card"
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      backgroundColor: '#FEF3C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D97706',
                    }}
                  >
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                      Certificates
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                      {certificates.length} Digital Credentials
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Recent Dispatches & Earnings Preview */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  paddingLeft: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Recent Completed Jobs
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: theme.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  View All
                </button>
              </div>

              {completedBookings.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                  }}
                >
                  No completed jobs yet. Completed jobs will show here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {completedBookings.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                          {job.serviceName || 'Completed Service'}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                          Token: {job.token} • {job.address || job.city || 'Noida'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1DAA5C' }}>
                          +₹{(job.totalPrice || 474) - (job.connectionFee || 0)}
                        </div>
                        <div style={{ fontSize: '0.5625rem', color: '#64748B' }}>Settled</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div key={activeTab} className="animate-fade-in" style={{ width: '100%' }}>
        {renderTabContent()}
      </div>

      {/* Reusable Modals */}
      <SkillQuizModal />
      <CertificateModal />
      <WorkerOnboardingModal />
    </div>
  );
};
