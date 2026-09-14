import React, { useState, useEffect } from 'react';
import { adminService, OperationalReports } from '../../services/adminService';
import { aiService, ComprehensiveDemandForecast, WorkforceRecommendation } from '../../services/aiService';
import { TrendingUp, CheckCircle, Percent, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const [reports, setReports] = useState<OperationalReports>({
    todayBookings: 0,
    completedJobs: 0,
    cancellationRate: 0,
    activeWorkersCount: 0,
    topServices: [],
    zoneWorkload: [],
  });
  const [forecast, setForecast] = useState<ComprehensiveDemandForecast | null>(null);
  const [recommendations, setRecommendations] = useState<WorkforceRecommendation[]>([]);

  useEffect(() => {
    Promise.all([
      adminService.getOperationalReports(),
      aiService.getComprehensiveForecast(),
    ]).then(([repRes, foreRes]) => {
      if (repRes.success && repRes.data) {
        setReports(repRes.data);
      }
      if (foreRes) {
        setForecast(foreRes);
        setRecommendations(foreRes.workforceRecommendations);
      }
    });
  }, []);

  const handleApplyRecommendation = async (id: string) => {
    await aiService.applyWorkforceRecommendation(id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPLIED' } : r))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* Forecasting Methodology Transparency Notice */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          border: '1px solid var(--border-default)',
          fontSize: '0.6875rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Forecasting Engine:</strong> Statistical weighted moving-average & zone workload density model derived from live booking logs and active cooperative artisan capacity.
        </span>
      </div>

      {/* 1. Core KPIs Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
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
              Job Completion Rate
            </span>
            <CheckCircle size={14} color="var(--success-dark)" />
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--success-dark)', marginTop: '4px' }}>
            {Math.round((reports.completedJobs / (reports.todayBookings || 1)) * 100)}%
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {reports.completedJobs} of {reports.todayBookings} orders fulfilled
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
              Cancellation SLA
            </span>
            <Percent size={14} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>
            {reports.cancellationRate}%
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Well below 5% federation threshold
          </div>
        </div>
      </div>

      {/* 2. Top Demand Trades Breakdown */}
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
            <TrendingUp size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Top Service Trades (Demand & Revenue)
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reports.topServices.map((svc, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 10px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {svc.name}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                  {svc.count} Jobs Dispatched Today
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{svc.revenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.5625rem', color: 'var(--success-dark)', fontWeight: 700 }}>
                  Active Trade
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Zone Workload & AI Allocation Heatmap */}
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
            <MapPin size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              District Zone Workload Balance
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reports.zoneWorkload.map((z, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 10px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {z.zone}
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: z.demandIndex > 80 ? 'var(--danger)' : 'var(--success-dark)' }}>
                  {z.demandIndex}% Demand
                </span>
              </div>

              {/* Workload Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: 'var(--border-default)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${z.demandIndex}%`,
                      backgroundColor: z.demandIndex > 80 ? 'var(--danger)' : 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {z.activeWorkers} Artisans Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Actionable AI Workforce Allocation Recommendations */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1.5px solid var(--primary-border, #D9E9C8)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              AI Workforce Allocation Recommendations
            </h3>
          </div>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
            Peak Hours: {forecast?.peakHours || '09:30 AM - 12:30 PM'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                padding: '10px 12px',
                backgroundColor: rec.status === 'APPLIED' ? 'var(--success-light)' : '#F8FAFC',
                borderRadius: 'var(--radius-xs)',
                border: rec.status === 'APPLIED' ? '1px solid var(--success-border)' : '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ maxWidth: '75%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {rec.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor: rec.urgency === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                      color: rec.urgency === 'HIGH' ? '#DC2626' : '#92400E',
                    }}
                  >
                    {rec.urgency}
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
                  {rec.reasoning}
                </div>
              </div>

              {rec.status === 'APPLIED' ? (
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    color: 'var(--success-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <CheckCircle2 size={13} /> Applied
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyRecommendation(rec.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

