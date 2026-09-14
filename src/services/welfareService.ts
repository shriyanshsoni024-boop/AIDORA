/**
 * AIDORA Cooperative Platform - Worker Welfare & Incident Assistance Service
 * 
 * Manages the internal Cooperative Safety Net fund and worker assistance requests
 * (e.g., On-Duty Accidental cover, Emergency Medical support, Tool Damage relief).
 * 
 * Note: Clearly labeled as an internal cooperative mutual aid workflow.
 */

import { storageService } from './storage/storageService';
import { ApiResponse } from '../types';

export type WelfareClaimType = 'ON_DUTY_ACCIDENT' | 'MEDICAL_EMERGENCY' | 'TOOL_DAMAGE' | 'FAMILY_RELIEF';
export type WelfareClaimStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED';

export interface WelfareClaim {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  claimType: WelfareClaimType;
  title: string;
  description: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: WelfareClaimStatus;
  incidentDate: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface WelfareFundOverview {
  totalFundBalance: number;
  totalClaimsSettled: number;
  totalDisbursedAmount: number;
  activeClaimsCount: number;
  claims: WelfareClaim[];
}

const STORAGE_WELFARE_CLAIMS = 'aidora_welfare_claims';

const DEFAULT_CLAIMS: WelfareClaim[] = [
  {
    id: 'wcf-101',
    workerId: 'w-101',
    workerName: 'Rahul Kumar',
    trade: 'Electrician',
    claimType: 'TOOL_DAMAGE',
    title: 'Digital Multimeter & Drill Set Replacement',
    description: 'Equipment damaged during emergency wiring overhaul at Indiranagar commercial site.',
    requestedAmount: 4500,
    approvedAmount: 4500,
    status: 'DISBURSED',
    incidentDate: '2026-09-08',
    submittedAt: '2026-09-09T10:30:00.000Z',
    reviewedAt: '2026-09-10T14:15:00.000Z',
    reviewedBy: 'Cooperative Board Admin',
    notes: 'Approved under Cooperative Tool Protection Scheme.',
  },
];

class WelfareService {
  /**
   * Fetch all welfare claims (Admin view or Worker history)
   */
  public async getWelfareClaims(workerId?: string): Promise<ApiResponse<WelfareClaim[]>> {
    try {
      const claims = storageService.getItem<WelfareClaim[]>(STORAGE_WELFARE_CLAIMS, DEFAULT_CLAIMS);
      if (workerId) {
        const filtered = claims.filter((c) => c.workerId === workerId);
        return { success: true, data: filtered };
      }
      return { success: true, data: claims };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve welfare claims' };
    }
  }

  /**
   * Submit a new internal welfare / incident assistance claim
   * Enforces duplicate claim prevention and maintains an auditable incident log.
   */
  public async submitClaim(dto: {
    workerId: string;
    workerName: string;
    trade: string;
    claimType: WelfareClaimType;
    title: string;
    description: string;
    requestedAmount: number;
    incidentDate?: string;
  }): Promise<ApiResponse<WelfareClaim>> {
    try {
      const existing = storageService.getItem<WelfareClaim[]>(STORAGE_WELFARE_CLAIMS, DEFAULT_CLAIMS);

      // Duplicate prevention: check if this worker already has a pending claim with same title
      const isDuplicate = existing.some(
        (c) =>
          c.workerId === dto.workerId &&
          c.title.trim().toLowerCase() === dto.title.trim().toLowerCase() &&
          ['PENDING', 'UNDER_REVIEW'].includes(c.status)
      );

      if (isDuplicate) {
        return {
          success: false,
          error: 'An active assistance claim with this title is already pending review by the Cooperative Board.',
        };
      }

      const newClaim: WelfareClaim = {
        id: `wcf-${Date.now()}`,
        workerId: dto.workerId,
        workerName: dto.workerName,
        trade: dto.trade,
        claimType: dto.claimType,
        title: dto.title,
        description: dto.description,
        requestedAmount: Math.max(500, Number(dto.requestedAmount) || 2000),
        status: 'PENDING',
        incidentDate: dto.incidentDate || new Date().toISOString().split('T')[0],
        submittedAt: new Date().toISOString(),
        notes: 'Submitted for Cooperative Mutual Aid review.',
      };

      const updated = [newClaim, ...existing];
      storageService.setItem(STORAGE_WELFARE_CLAIMS, updated);

      return {
        success: true,
        data: newClaim,
        message: 'Welfare assistance request submitted for Cooperative Board review.',
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to submit assistance request' };
    }
  }

  /**
   * Review & update claim status (Admin action)
   */
  public async processClaim(
    claimId: string,
    action: 'APPROVE' | 'DISBURSE' | 'REJECT',
    approvedAmount?: number,
    notes?: string
  ): Promise<ApiResponse<WelfareClaim>> {
    try {
      const claims = storageService.getItem<WelfareClaim[]>(STORAGE_WELFARE_CLAIMS, DEFAULT_CLAIMS);
      const index = claims.findIndex((c) => c.id === claimId);

      if (index === -1) {
        return { success: false, error: `Claim ${claimId} not found` };
      }

      const target = claims[index];
      const nextStatus: WelfareClaimStatus =
        action === 'APPROVE' ? 'APPROVED' : action === 'DISBURSE' ? 'DISBURSED' : 'REJECTED';

      const updated: WelfareClaim = {
        ...target,
        status: nextStatus,
        approvedAmount: action === 'REJECT' ? 0 : approvedAmount || target.requestedAmount,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Cooperative Board Admin',
        notes: notes || (action === 'DISBURSE' ? 'Funds transferred directly to artisan registered UPI.' : `Claim ${nextStatus.toLowerCase()}`),
      };

      claims[index] = updated;
      storageService.setItem(STORAGE_WELFARE_CLAIMS, claims);

      return {
        success: true,
        data: updated,
        message: `Claim ${claimId} status updated to ${nextStatus}.`,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to process claim' };
    }
  }

  /**
   * Get Cooperative Welfare Fund Overview & Economics
   */
  public async getFundOverview(): Promise<ApiResponse<WelfareFundOverview>> {
    try {
      const claims = storageService.getItem<WelfareClaim[]>(STORAGE_WELFARE_CLAIMS, DEFAULT_CLAIMS);
      const disbursed = claims.filter((c) => c.status === 'DISBURSED');
      const activeCount = claims.filter((c) => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length;
      const totalDisbursed = disbursed.reduce((sum, c) => sum + (c.approvedAmount || c.requestedAmount), 0);

      // Cooperative fund balance = base pool + ongoing welfare reserve
      const basePool = 250000; // ₹2.5 Lakh seed mutual aid reserve
      const totalFundBalance = Math.max(0, basePool - totalDisbursed);

      return {
        success: true,
        data: {
          totalFundBalance,
          totalClaimsSettled: disbursed.length,
          totalDisbursedAmount: totalDisbursed,
          activeClaimsCount: activeCount,
          claims,
        },
      };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve welfare fund overview' };
    }
  }
}

export const welfareService = new WelfareService();
