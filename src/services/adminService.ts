import { KycItem, ApiResponse, Booking, Worker } from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_WORKERS } from '../data/workers';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database';

type KycRow = Database['public']['Tables']['kyc_records']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

const DEFAULT_KYC_QUEUE: KycItem[] = [
  { id: 'v-1', name: 'Manish Verma', profession: 'Electrician', cooperative: 'East Zone Cooperative', documents: 'Aadhaar + ITI Diploma', status: 'PENDING', submittedAt: 'Today, 09:30 AM' },
  { id: 'v-2', name: 'Kavita Rao', profession: 'Appliance Repair', cooperative: 'City Women Artisan Union', documents: 'Aadhaar + NSDC Level 2', status: 'PENDING', submittedAt: 'Yesterday, 04:15 PM' },
];

export interface FederationStats {
  totalWorkers: number;
  kycVerified: number;
  availableNow: number;
  activeDispatches: number;
  cooperativeNodes: number;
  emergencyWorkersReady: number;
  todayRevenue: number;
  totalBookingsToday: number;
}

export interface FinanceOverview {
  todayGrossValue: number;
  workerPayoutsTotal: number;
  cooperativeRevenue: number;
  settledCount: number;
  pendingCount: number;
  transactions: {
    id: string;
    bookingToken: string;
    workerName: string;
    customerName: string;
    serviceName: string;
    grossAmount: number;
    workerPayout: number;
    coopAmount: number;
    status: 'PAID' | 'PENDING';
    date: string;
  }[];
}

export interface OperationalReports {
  todayBookings: number;
  completedJobs: number;
  cancellationRate: number;
  activeWorkersCount: number;
  topServices: { name: string; count: number; revenue: number }[];
  zoneWorkload: { zone: string; activeWorkers: number; demandIndex: number }[];
}

class AdminService {
  /**
   * Fetch KYC pending items from Supabase
   */
  public async getKycQueue(): Promise<ApiResponse<KycItem[]>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('kyc_records')
          .select('*')
          .in('status', ['PENDING', 'UNDER_REVIEW'])
          .order('submitted_at', { ascending: false });

        if (!error && data) {
          const rows = data as unknown as KycRow[];
          const queue: KycItem[] = rows.map((row) => ({
            id: row.id,
            name: row.worker_name,
            profession: row.profession,
            cooperative: row.cooperative,
            documents: row.documents,
            status: row.status,
            submittedAt: new Date(row.submitted_at).toLocaleDateString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            }),
          }));
          storageService.setItem(STORAGE_KEYS.KYC_QUEUE, queue);
          return { success: true, data: queue };
        }
      } catch (err: unknown) {
        console.warn('Supabase getKycQueue failed, using local cache:', err);
      }
    }

    try {
      const queue = storageService.getItem<KycItem[]>(STORAGE_KEYS.KYC_QUEUE, DEFAULT_KYC_QUEUE);
      return { success: true, data: queue };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve KYC queue' };
    }
  }

  /**
   * Submit a new worker KYC verification application to Supabase
   */
  public async submitKycRecord(dto: {
    workerId?: string;
    workerName: string;
    profession: string;
    cooperative?: string;
    cooperativeBranch?: string;
    phone?: string;
    aadhaarNumber?: string;
    certificateNumber?: string;
    documents: string | { name: string; size?: string; verified?: boolean }[];
  }): Promise<ApiResponse<KycItem>> {
    const docString = typeof dto.documents === 'string'
      ? dto.documents
      : Array.isArray(dto.documents)
        ? dto.documents.map((d) => (typeof d === 'string' ? d : d.name)).join(', ')
        : 'Aadhaar, Trade Certificate';
    const coopName = dto.cooperative || dto.cooperativeBranch || 'AIDORA Cooperative Federation';

    const newKycItem: KycItem = {
      id: `v-${Date.now()}`,
      name: dto.workerName,
      profession: dto.profession,
      cooperative: coopName,
      documents: docString,
      status: 'PENDING',
      submittedAt: 'Just now',
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('kyc_records')
          .insert({
            worker_id: dto.workerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.workerId) ? dto.workerId : null,
            worker_name: dto.workerName,
            profession: dto.profession,
            cooperative: coopName,
            documents: docString,
            status: 'PENDING',
          })
          .select()
          .single();

        if (!error && data) {
          const row = data as unknown as KycRow;
          const created: KycItem = {
            id: row.id,
            name: row.worker_name,
            profession: row.profession,
            cooperative: row.cooperative,
            documents: row.documents,
            status: row.status,
            submittedAt: 'Just now',
          };
          this.syncLocalKyc(created);
          return { success: true, data: created, message: 'KYC submitted successfully.' };
        }
      } catch (err: unknown) {
        console.warn('Supabase submitKycRecord error:', err);
      }
    }

    this.syncLocalKyc(newKycItem);
    return { success: true, data: newKycItem, message: 'KYC submitted successfully.' };
  }

  private syncLocalKyc(item: KycItem): void {
    const queue = storageService.getItem<KycItem[]>(STORAGE_KEYS.KYC_QUEUE, DEFAULT_KYC_QUEUE);
    storageService.setItem(STORAGE_KEYS.KYC_QUEUE, [item, ...queue]);
  }

  /**
   * Approve or reject a KYC verification request in Supabase
   */
  public async processKyc(id: string, action: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<KycItem[]>> {
    const newStatus = action === 'APPROVED' ? 'VERIFIED' : 'REJECTED';

    if (isSupabaseConfigured()) {
      try {
        // 1. Fetch the target KYC record
        const { data: kycRecord } = await supabase
          .from('kyc_records')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        // 2. Update KYC status
        await supabase
          .from('kyc_records')
          .update({
            status: newStatus,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', id);

        // 3. Update corresponding worker status
        if (kycRecord) {
          if (kycRecord.worker_id) {
            await supabase
              .from('workers')
              .update({ verification_status: newStatus })
              .eq('id', kycRecord.worker_id);
          } else if (kycRecord.worker_name) {
            await supabase
              .from('workers')
              .update({ verification_status: newStatus })
              .ilike('name', `%${kycRecord.worker_name}%`);
          }
        }

        // Return updated queue
        return this.getKycQueue();
      } catch (err: unknown) {
        console.warn('Supabase processKyc failed, updating local state:', err);
      }
    }

    try {
      const queue = storageService.getItem<KycItem[]>(STORAGE_KEYS.KYC_QUEUE, DEFAULT_KYC_QUEUE);
      const target = queue.find((k) => k.id === id);
      if (!target) {
        return { success: false, error: `KYC item ${id} not found` };
      }

      // If approved, update worker verification status if exists
      if (action === 'APPROVED') {
        const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
        const wIdx = workers.findIndex((w) => w.name.toLowerCase() === target.name.toLowerCase());
        if (wIdx !== -1) {
          workers[wIdx] = { ...workers[wIdx], verificationStatus: 'VERIFIED' };
          storageService.setItem(STORAGE_KEYS.WORKERS, workers);
        }
      }

      const updatedQueue = queue.filter((k) => k.id !== id);
      storageService.setItem(STORAGE_KEYS.KYC_QUEUE, updatedQueue);

      return {
        success: true,
        data: updatedQueue,
        message: `KYC request for ${target.name} ${action.toLowerCase()}.`,
      };
    } catch (err) {
      return { success: false, error: 'Failed to process KYC verification' };
    }
  }

  /**
   * Aggregate live federation statistics across all system collections from Supabase
   */
  public async getFederationStats(): Promise<ApiResponse<FederationStats>> {
    if (isSupabaseConfigured()) {
      try {
        const [workersCountRes, verifiedCountRes, availableCountRes, emergencyCountRes, bookingsRes] = await Promise.all([
          supabase.from('workers').select('*', { count: 'exact', head: true }),
          supabase.from('workers').select('*', { count: 'exact', head: true }).eq('verification_status', 'VERIFIED'),
          supabase.from('workers').select('*', { count: 'exact', head: true }).eq('availability', 'AVAILABLE'),
          supabase.from('workers').select('*', { count: 'exact', head: true }).eq('emergency_ready', true),
          supabase.from('bookings').select('id, status, total_price, connection_fee'),
        ]);

        const totalWorkers = workersCountRes.count || 0;
        const kycVerified = verifiedCountRes.count || 0;
        const availableNow = availableCountRes.count || 0;
        const emergencyWorkersReady = emergencyCountRes.count || 0;

        const bookings = (bookingsRes.data || []) as unknown as Pick<BookingRow, 'id' | 'status' | 'total_price' | 'connection_fee'>[];
        const activeDispatches = bookings.filter((b) =>
          ['REQUESTED', 'MATCHED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
        ).length;

        const todayRevenue = bookings
          .filter((b) => b.status !== 'CANCELLED')
          .reduce((sum, b) => sum + (b.connection_fee || 25), 0);

        const stats: FederationStats = {
          totalWorkers,
          kycVerified,
          availableNow,
          activeDispatches,
          cooperativeNodes: totalWorkers > 0 ? Math.max(1, Math.ceil(totalWorkers / 20)) : 0,
          emergencyWorkersReady,
          todayRevenue,
          totalBookingsToday: bookings.length,
        };

        return { success: true, data: stats };
      } catch (err: unknown) {
        console.warn('Supabase getFederationStats error, falling back to local:', err);
      }
    }

    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, []);
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);

      const activeDispatches = bookings.filter((b) =>
        ['REQUESTED', 'MATCHED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
      ).length;

      const kycVerified = workers.filter((w) => w.verificationStatus === 'VERIFIED').length;
      const availableNow = workers.filter((w) => w.availability === 'AVAILABLE').length;
      const emergencyWorkersReady = workers.filter((w) => w.emergencyAvailable).length;
      const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

      const stats: FederationStats = {
        totalWorkers: workers.length,
        kycVerified,
        availableNow,
        activeDispatches,
        cooperativeNodes: workers.length > 0 ? Math.max(1, Math.ceil(workers.length / 20)) : 0,
        emergencyWorkersReady,
        todayRevenue: (completedCount + activeDispatches) * 25,
        totalBookingsToday: bookings.length,
      };

      return { success: true, data: stats };
    } catch (err) {
      return { success: false, error: 'Failed to compute federation stats' };
    }
  }

  /**
   * Fetch cooperative finance metrics and transaction history from Supabase
   */
  public async getFinancialOverview(): Promise<ApiResponse<FinanceOverview>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, token, total_price, worker_payout, connection_fee, status, created_at, customer_name, service_name, worker_id')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const validBookings = data as unknown as (Pick<
            BookingRow,
            'id' | 'token' | 'total_price' | 'worker_payout' | 'connection_fee' | 'status' | 'created_at' | 'customer_name' | 'service_name' | 'worker_id'
          >)[];

          const completedList = validBookings.filter((b) => b.status === 'COMPLETED');
          const todayGrossValue = completedList.reduce((acc, b) => acc + (b.total_price || 0), 0);
          const workerPayoutsTotal = completedList.reduce((acc, b) => acc + (b.worker_payout || 0), 0);
          const cooperativeRevenue = completedList.reduce((acc, b) => acc + (b.connection_fee || 25), 0);
          const settledCount = completedList.length;
          const pendingCount = validBookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

          const transactions = validBookings.map((b) => ({
            id: b.id,
            bookingToken: b.token,
            workerName: 'Assigned Artisan',
            customerName: b.customer_name || 'Customer',
            serviceName: b.service_name || 'Service',
            grossAmount: b.total_price || 0,
            workerPayout: b.worker_payout || 0,
            coopAmount: b.connection_fee || 25,
            status: (b.status === 'COMPLETED' ? 'PAID' : 'PENDING') as 'PAID' | 'PENDING',
            date: new Date(b.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          }));

          return {
            success: true,
            data: {
              todayGrossValue,
              workerPayoutsTotal,
              cooperativeRevenue,
              settledCount,
              pendingCount,
              transactions,
            },
          };
        }
      } catch (err: unknown) {
        console.warn('Supabase getFinancialOverview error, falling back to local:', err);
      }
    }

    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);

      const transactions = bookings.map((b) => {
        const gross = b.totalPrice || 0;
        const fee = b.connectionFee || 25;
        const payout = Math.max(0, gross - fee);
        return {
          id: b.id,
          bookingToken: b.token,
          workerName: b.worker?.name || 'Assigned Artisan',
          customerName: b.customerName || 'Customer',
          serviceName: b.serviceName || 'Service',
          grossAmount: gross,
          workerPayout: payout,
          coopAmount: fee,
          status: (b.status === 'COMPLETED' ? 'PAID' : 'PENDING') as 'PAID' | 'PENDING',
          date: b.scheduledTime || 'Today',
        };
      });

      const completedT = transactions.filter((t) => t.status === 'PAID');
      const todayGrossValue = completedT.reduce((sum, t) => sum + t.grossAmount, 0);
      const workerPayoutsTotal = completedT.reduce((sum, t) => sum + t.workerPayout, 0);
      const cooperativeRevenue = completedT.reduce((sum, t) => sum + t.coopAmount, 0);
      const settledCount = completedT.length;
      const pendingCount = transactions.filter((t) => t.status === 'PENDING').length;

      return {
        success: true,
        data: {
          todayGrossValue,
          workerPayoutsTotal,
          cooperativeRevenue,
          settledCount,
          pendingCount,
          transactions,
        },
      };
    } catch (err) {
      return { success: false, error: 'Failed to compute financial overview' };
    }
  }

  /**
   * Fetch operational report metrics calculated directly from records
   */
  public async getOperationalReports(): Promise<ApiResponse<OperationalReports>> {
    try {
      let bookings: Booking[] = [];
      let workers: Worker[] = [];

      if (isSupabaseConfigured()) {
        const [bRes, wRes] = await Promise.all([
          supabase.from('bookings').select('*'),
          supabase.from('workers').select('*'),
        ]);
        if (bRes.data) {
          bookings = (bRes.data as any[]).map((row) => ({
            id: row.id,
            token: row.token,
            serviceName: row.service_name,
            serviceCategory: row.service_category,
            totalPrice: row.total_price,
            status: row.status,
            city: row.city,
            address: row.address,
          } as Booking));
        }
        if (wRes.data) {
          workers = (wRes.data as any[]).map((row) => ({
            id: row.id,
            name: row.name,
            availability: row.availability,
            zone: row.zone,
          } as Worker));
        }
      } else {
        bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
        workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, []);
      }

      const completedJobs = bookings.filter((b) => b.status === 'COMPLETED').length;
      const totalBookings = bookings.length;
      const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;
      const cancellationRate = totalBookings > 0
        ? Number(((cancelledCount / totalBookings) * 100).toFixed(1))
        : 0;

      // Group top services
      const serviceMap: Record<string, { count: number; revenue: number }> = {};
      bookings.forEach((b) => {
        const sName = b.serviceName || 'General Service';
        if (!serviceMap[sName]) serviceMap[sName] = { count: 0, revenue: 0 };
        serviceMap[sName].count += 1;
        serviceMap[sName].revenue += (b.totalPrice || 0);
      });

      const topServices = Object.entries(serviceMap)
        .map(([name, stat]) => ({ name, count: stat.count, revenue: stat.revenue }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Group zone workload
      const zoneMap: Record<string, { activeWorkers: number; bookingCount: number }> = {};
      workers.forEach((w) => {
        const z = w.zone || 'Central Hub';
        if (!zoneMap[z]) zoneMap[z] = { activeWorkers: 0, bookingCount: 0 };
        if (w.availability === 'AVAILABLE') zoneMap[z].activeWorkers += 1;
      });
      bookings.forEach((b) => {
        const z = b.city || 'Central Hub';
        if (!zoneMap[z]) zoneMap[z] = { activeWorkers: 0, bookingCount: 0 };
        zoneMap[z].bookingCount += 1;
      });

      const zoneWorkload = Object.entries(zoneMap)
        .map(([zone, data]) => {
          const demandIndex = data.activeWorkers > 0
            ? Math.min(100, Math.round((data.bookingCount / data.activeWorkers) * 50))
            : (data.bookingCount > 0 ? 95 : 10);
          return { zone, activeWorkers: data.activeWorkers, demandIndex };
        })
        .slice(0, 5);

      return {
        success: true,
        data: {
          todayBookings: totalBookings,
          completedJobs,
          cancellationRate,
          activeWorkersCount: workers.filter((w) => w.availability === 'AVAILABLE').length,
          topServices,
          zoneWorkload,
        },
      };
    } catch (err) {
      return { success: false, error: 'Failed to compile operational reports' };
    }
  }
}

export const adminService = new AdminService();
