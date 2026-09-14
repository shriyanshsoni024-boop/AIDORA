import React, { useState, useEffect } from 'react';
import { adminService, OperationalReports } from '../../services/adminService';
import { TrendingUp, CheckCircle, Percent, MapPin } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const [reports, setReports] = useState<OperationalReports>({
    todayBookings: 0,
    completedJobs: 0,
    cancellationRate: 0,
    activeWorkersCount: 0,
    topServices: [],
    zoneWorkload: [],
  });

  useEffect(() => {
    adminService.getOperationalReports().then((res) => {
      if (res.success && res.data) {
        setReports(res.data);
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
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
    </div>
  );
};
