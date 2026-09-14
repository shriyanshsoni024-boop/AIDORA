import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Building2, Users, ShieldCheck, Zap, Activity, AlertTriangle, Sparkles, CalendarCheck, IndianRupee, BarChart3, ChevronRight, CheckCircle2, MapPin } from 'lucide-react';
import { adminService, FederationStats } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import { storageService } from '../../services/storage/storageService';
import { STORAGE_KEYS } from '../../services/storage/storageKeys';
import { KycItem, Booking, AdminTab } from '../../types';
import { DEFAULT_LOCATION } from '../../data/locations';
import { AdminBookingsView } from '../../components/admin/AdminBookingsView';
import { AdminWorkersView } from '../../components/admin/AdminWorkersView';
import { AdminFinanceView } from '../../components/admin/AdminFinanceView';
import { AdminReportsView } from '../../components/admin/AdminReportsView';
import { BookingDetailModal } from '../../components/admin/BookingDetailModal';
import { AdminNav } from '../../components/admin/AdminNav';
import { aiService, DemandForecastResult } from '../../services/aiService';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('operations');
  const [kycQueue, setKycQueue] = useState<KycItem[]>([]);
  const [activeServices, setActiveServices] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reallocationApplied, setReallocationApplied] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return storageService.getItem<string>(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  });
  const [forecast, setForecast] = useState<DemandForecastResult | null>(null);
  const [stats, setStats] = useState<FederationStats>({
    totalWorkers: 0,
    kycVerified: 0,
    availableNow: 0,
    activeDispatches: 0,
    cooperativeNodes: 0,
    emergencyWorkersReady: 0,
    todayRevenue: 0,
    totalBookingsToday: 0,
  });

  const loadData = async () => {
    const savedLoc = storageService.getItem<string>(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
    if (savedLoc) {
      setCurrentLocation(savedLoc);
    }

    const [kycRes, bookRes, statsRes, forecastRes] = await Promise.all([
      adminService.getKycQueue(),
      bookingService.getBookings(),
      adminService.getFederationStats(),
      aiService.getDemandForecast(savedLoc || DEFAULT_LOCATION),
    ]);

    if (kycRes.success && kycRes.data) {
      setKycQueue(kycRes.data);
    }
    if (bookRes.success && bookRes.data) {
      setActiveServices(bookRes.data);
    }
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }
    if (forecastRes) {
      setForecast(forecastRes);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <AdminBookingsView />;
      case 'workers':
        return <AdminWorkersView />;
      case 'finance':
        return <AdminFinanceView />;
      case 'reports':
        return <AdminReportsView />;
      case 'operations':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
            {/* 1. Cooperative Federation Header Banner (Clean Light Surface) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={18} color="var(--sahyog-green, #1DAA5C)" />
                  <h1 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Cooperative Federation Operations Hub
                  </h1>
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} color="var(--sahyog-green, #1DAA5C)" />
                  <strong>{currentLocation}</strong> • Node #KA-BLR-04 • {stats.totalWorkers} Artisans
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success-dark)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--success-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }} />
                Live Node
              </span>
            </div>

            {/* 2. KPI Stats Grid (4 Comprehensive Operational Cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {/* Total Artisans */}
              <div
                onClick={() => setActiveTab('workers')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Total Artisans</span>
                  <Users size={16} color="var(--primary-dark)" />
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {stats.totalWorkers}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--success-dark)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={11} /> {stats.kycVerified} KYC Verified
                </div>
              </div>

              {/* Pending KYC Review */}
              <div
                onClick={() => setActiveTab('workers')}
                style={{
                  backgroundColor: kycQueue.length > 0 ? '#FFFBEB' : '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: kycQueue.length > 0 ? '1px solid #FDE68A' : '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: kycQueue.length > 0 ? '#92400E' : 'var(--text-secondary)' }}>
                    Pending KYC
                  </span>
                  <ShieldCheck size={16} color={kycQueue.length > 0 ? '#D97706' : 'var(--text-muted)'} />
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: kycQueue.length > 0 ? '#B45309' : 'var(--text-primary)', marginTop: '4px' }}>
                  {kycQueue.length}
                </div>
                <div style={{ fontSize: '0.625rem', color: kycQueue.length > 0 ? '#92400E' : 'var(--success-dark)', fontWeight: 700, marginTop: '2px' }}>
                  {kycQueue.length > 0 ? 'Action Required' : '✓ All Reviewed'}
                </div>
              </div>

              {/* Active Dispatches */}
              <div
                onClick={() => setActiveTab('bookings')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Active Dispatches</span>
                  <Activity size={16} color="var(--primary-dark)" />
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {stats.activeDispatches}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--danger)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={11} /> {stats.emergencyWorkersReady} Emergency Squad
                </div>
              </div>

              {/* Completed Today */}
              <div
                onClick={() => setActiveTab('finance')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Completed Today</span>
                  <CheckCircle2 size={16} color="var(--success)" />
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--success-dark)', marginTop: '4px' }}>
                  {stats.totalBookingsToday}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '2px' }}>
                  ₹{stats.todayRevenue} Platform Fees
                </div>
              </div>
            </div>

            {/* 3. AI Demand Forecasting & Predictive Reallocation */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="var(--sahyog-green, #1DAA5C)" />
                  <h3 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    AI Demand Forecasting & Predictive Allocation
                  </h3>
                </div>
                <Badge variant="match" size="sm">
                  AI v1.0
                </Badge>
              </div>

              <div
                style={{
                  backgroundColor: reallocationApplied ? 'var(--success-light)' : '#F8FAFC',
                  border: reallocationApplied ? '1px solid var(--success-border)' : '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {reallocationApplied ? (
                    <CheckCircle2 size={16} color="var(--success-dark)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  ) : (
                    <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: reallocationApplied ? 'var(--success-dark)' : 'var(--text-primary)' }}>
                      {reallocationApplied
                        ? `✓ Workload Balanced: ${forecast?.recommendedArtisans || 4} Artisans Dispatched to ${currentLocation.split(',')[0]}`
                        : `Surge Alert: ${forecast?.category || 'Electrical & AC'} +${forecast ? Math.round((forecast.surgeMultiplier - 1) * 100) : 35}% in ${currentLocation.split(',')[0]} Zone`}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                      {reallocationApplied
                        ? 'Sub-15 min arrival SLA protected across all active emergency requests.'
                        : (forecast?.recommendationNote || `Recommendation: Reallocate ${forecast?.recommendedArtisans || 4} standby certified artisans to maintain sub-15 min SLA.`)}
                    </div>
                    {forecast && (
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Peak Hours: {forecast.peakHours} • 7-Day Projected Jobs: {forecast.projectedBookingsNext7Days}
                      </div>
                    )}
                  </div>
                </div>

                {!reallocationApplied && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setReallocationApplied(true)}
                  >
                    Apply Reallocation ({forecast?.recommendedArtisans || 4} Workers)
                  </Button>
                )}
              </div>
            </div>

            {/* 4. Quick Action Operational Hub */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div
                onClick={() => setActiveTab('bookings')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <CalendarCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Dispatch Stream
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {activeServices.length} live bookings
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('workers')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    KYC Approvals
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {kycQueue.length} pending review
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('finance')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-dark)' }}>
                  <IndianRupee size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Finance Ledger
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    0% comm disbursals
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('reports')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <BarChart3 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Reports & Heatmap
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    6 zone metrics
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Live Service Stream (Compact Operational Feed) */}
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
                  <Activity size={16} color="var(--primary)" />
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Live Service Monitor Stream ({activeServices.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>View All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeServices.slice(0, 3).map((svc) => (
                  <div
                    key={svc.token || svc.id}
                    onClick={() => setSelectedBooking(svc)}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                    className="hover-card"
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{svc.token}</span>
                        <Badge variant={svc.urgency === 'EMERGENCY' ? 'emergency' : 'neutral'} size="sm">
                          {svc.urgency}
                        </Badge>
                      </div>
                      <div style={{ color: 'var(--text-primary)', marginTop: '2px', fontSize: '0.6875rem' }}>
                        {svc.customerName} ↔ <strong>{svc.worker?.name || 'Assigned Worker'}</strong> ({svc.serviceName})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={svc.status === 'COMPLETED' ? 'success' : svc.status === 'CANCELLED' ? 'emergency' : 'warning'} size="sm">
                        {svc.status.replace(/_/g, ' ')}
                      </Badge>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {svc.scheduledTime || 'Today'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '16px' }}>
      <div key={activeTab} className="animate-fade-in" style={{ width: '100%' }}>
        {renderContent()}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />

      {/* Cooperative Bottom Navigation */}
      <AdminNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingKycCount={kycQueue.length}
        activeDispatchesCount={activeServices.filter((b) => ['REQUESTED', 'MATCHED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)).length}
      />
    </div>
  );
};
