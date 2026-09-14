import {
  Worker,
  WorkerAvailability,
  WorkerEarningsRecord,
  TrainingModule,
  SkillItem,
  WorkerCertificate,
  ApiResponse,
} from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_WORKERS } from '../data/workers';
import { TRAINING_MODULES, INITIAL_SKILLS_MATRIX, MOCK_EARNINGS_HISTORY } from '../data/workerTrainingData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database';

type WorkerRow = Database['public']['Tables']['workers']['Row'];
type WorkerEarningsRow = Database['public']['Tables']['worker_earnings']['Row'];

export const mapRowToWorker = (row: WorkerRow): Worker => {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi || row.name,
    phone: row.phone,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    professions: row.professions && row.professions.length > 0 ? row.professions : [row.trade || 'Electrician'],
    skills: row.skills || [],
    experienceYears: row.experience_years || 1,
    experienceLevel: row.experience_level || 'Intermediate',
    rating: Number(row.rating) || 5.0,
    reviewCount: row.review_count || 0,
    completedJobs: row.completed_jobs || 0,
    distanceKm: Number(row.distance_km) || 1.0,
    availability: row.availability || 'AVAILABLE',
    emergencyAvailable: row.emergency_ready ?? false,
    verificationStatus: row.verification_status || 'PENDING',
    cooperativeName: row.cooperative_branch || 'AIDORA Central Federation',
    zone: row.zone || 'Zone 1 - Central',
    aadhaarNumber: row.aadhaar_masked || undefined,
    certificates: (Array.isArray(row.certificates_data) ? row.certificates_data : []) as Worker['certificates'],
    trainingCompleted: row.training_completed || [],
  };
};

class WorkerService {
  /**
   * Fetch all registered workers from Supabase (with fallback to local storage)
   */
  public async getWorkers(): Promise<ApiResponse<Worker[]>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .order('rating', { ascending: false });

        if (!error && data && data.length > 0) {
          const workers = (data as unknown as WorkerRow[]).map(mapRowToWorker);
          storageService.setItem(STORAGE_KEYS.WORKERS, workers);
          return { success: true, data: workers };
        }
      } catch (err: unknown) {
        console.warn('Supabase getWorkers failed, using cached workers:', err);
      }
    }

    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      return { success: true, data: workers };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve workers' };
    }
  }

  /**
   * Fetch single worker profile by ID or Profile ID
   */
  public async getWorkerById(workerId: string): Promise<ApiResponse<Worker>> {
    if (isSupabaseConfigured() && workerId) {
      try {
        // Try match by id or profile_id
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .or(`id.eq.${workerId},profile_id.eq.${workerId}`)
          .maybeSingle();

        if (!error && data) {
          const worker = mapRowToWorker(data as unknown as WorkerRow);
          return { success: true, data: worker };
        }
      } catch (err: unknown) {
        console.warn('Supabase getWorkerById error:', err);
      }
    }

    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const worker = workers.find((w) => w.id === workerId) || workers[0];
      if (!worker) {
        return { success: false, error: `Worker ${workerId} not found` };
      }
      return { success: true, data: worker };
    } catch (err) {
      return { success: false, error: 'Failed to fetch worker profile' };
    }
  }

  /**
   * Fetch worker profile linked to a specific user auth profile ID
   */
  public async getWorkerByProfileId(profileId: string): Promise<ApiResponse<Worker | null>> {
    if (isSupabaseConfigured() && profileId) {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle();

        if (!error && data) {
          const worker = mapRowToWorker(data as unknown as WorkerRow);
          return { success: true, data: worker };
        }
      } catch (err: unknown) {
        console.warn('Supabase getWorkerByProfileId error:', err);
      }
    }

    const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
    const worker = workers.find((w) => w.id === profileId) || null;
    return { success: true, data: worker };
  }

  /**
   * Update worker profile data in Supabase & local cache
   */
  public async updateWorker(workerId: string, updates: Partial<Worker>): Promise<ApiResponse<Worker>> {
    if (isSupabaseConfigured() && workerId) {
      try {
        const dbUpdates: Partial<Database['public']['Tables']['workers']['Update']> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.nameHi !== undefined) dbUpdates.name_hi = updates.nameHi;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
        if (updates.professions !== undefined) {
          dbUpdates.professions = updates.professions;
          if (updates.professions.length > 0) dbUpdates.trade = updates.professions[0];
        }
        if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
        if (updates.experienceYears !== undefined) dbUpdates.experience_years = updates.experienceYears;
        if (updates.experienceLevel !== undefined) dbUpdates.experience_level = updates.experienceLevel;
        if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
        if (updates.emergencyAvailable !== undefined) dbUpdates.emergency_ready = updates.emergencyAvailable;
        if (updates.verificationStatus !== undefined) dbUpdates.verification_status = updates.verificationStatus;
        if (updates.cooperativeName !== undefined) dbUpdates.cooperative_branch = updates.cooperativeName;
        if (updates.zone !== undefined) dbUpdates.zone = updates.zone;
        if (updates.aadhaarNumber !== undefined) dbUpdates.aadhaar_masked = updates.aadhaarNumber;
        if (updates.certificates !== undefined) dbUpdates.certificates_data = updates.certificates as any;
        if (updates.trainingCompleted !== undefined) dbUpdates.training_completed = updates.trainingCompleted;
        if (updates.completedJobs !== undefined) dbUpdates.completed_jobs = updates.completedJobs;
        if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
        if (updates.reviewCount !== undefined) dbUpdates.review_count = updates.reviewCount;

        const { data, error } = await supabase
          .from('workers')
          .update(dbUpdates)
          .or(`id.eq.${workerId},profile_id.eq.${workerId}`)
          .select()
          .maybeSingle();

        if (!error && data) {
          const updated = mapRowToWorker(data as unknown as WorkerRow);
          this.syncLocalWorker(updated);
          return { success: true, data: updated, message: 'Worker profile updated successfully.' };
        }
      } catch (err: unknown) {
        console.warn('Supabase updateWorker failed, falling back to local cache:', err);
      }
    }

    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const index = workers.findIndex((w) => w.id === workerId);
      if (index === -1) {
        return { success: false, error: `Worker ${workerId} not found` };
      }

      const updated = { ...workers[index], ...updates };
      workers[index] = updated;
      storageService.setItem(STORAGE_KEYS.WORKERS, workers);

      return { success: true, data: updated, message: 'Worker profile updated successfully.' };
    } catch (err) {
      return { success: false, error: 'Failed to update worker' };
    }
  }

  /**
   * Update availability & emergency duty toggle in Supabase
   */
  public async updateWorkerAvailability(
    workerId: string,
    availability: WorkerAvailability,
    emergencyAvailable?: boolean
  ): Promise<ApiResponse<Worker>> {
    const updates: Partial<Worker> = { availability };
    if (emergencyAvailable !== undefined) {
      updates.emergencyAvailable = emergencyAvailable;
    }
    return this.updateWorker(workerId, updates);
  }

  /**
   * Fetch worker earnings ledger from Supabase
   */
  public async getWorkerEarnings(workerId?: string): Promise<ApiResponse<WorkerEarningsRecord[]>> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('worker_earnings')
          .select('*')
          .order('created_at', { ascending: false });

        if (workerId) {
          query = query.or(`worker_id.eq.${workerId}`);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          const rows = data as unknown as WorkerEarningsRow[];
          const earnings: WorkerEarningsRecord[] = rows.map((row) => ({
            id: row.id,
            bookingToken: row.booking_token,
            serviceName: row.service_name,
            customerName: row.customer_name,
            date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            amount: row.amount,
            platformFee: row.platform_fee,
            netPayout: row.net_payout,
            status: row.status,
          }));
          storageService.setItem(STORAGE_KEYS.EARNINGS, earnings);
          return { success: true, data: earnings };
        }
      } catch (err: unknown) {
        console.warn('Supabase getWorkerEarnings failed, falling back to local:', err);
      }
    }

    try {
      const earnings = storageService.getItem<WorkerEarningsRecord[]>(
        STORAGE_KEYS.EARNINGS,
        MOCK_EARNINGS_HISTORY
      );
      return { success: true, data: earnings };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve earnings' };
    }
  }

  /**
   * Add a new completed job record to the earnings ledger in Supabase
   */
  public async addEarningsRecord(
    record: Omit<WorkerEarningsRecord, 'id'>,
    workerId: string = 'w-1'
  ): Promise<ApiResponse<WorkerEarningsRecord>> {
    if (isSupabaseConfigured()) {
      try {
        // Resolve valid worker UUID if needed
        let resolvedWorkerId = workerId;
        const { data: wRecord } = await supabase
          .from('workers')
          .select('id, completed_jobs')
          .or(`id.eq.${workerId},profile_id.eq.${workerId}`)
          .maybeSingle();

        if (wRecord) {
          resolvedWorkerId = wRecord.id;
          // Increment completed jobs on worker
          await supabase
            .from('workers')
            .update({ completed_jobs: (wRecord.completed_jobs || 0) + 1 })
            .eq('id', resolvedWorkerId);
        }

        const insertPayload = {
          worker_id: resolvedWorkerId,
          booking_token: record.bookingToken,
          service_name: record.serviceName,
          customer_name: record.customerName,
          amount: record.amount,
          platform_fee: record.platformFee,
          net_payout: record.netPayout,
          status: record.status || 'PAID',
        };

        const { data, error } = await supabase
          .from('worker_earnings')
          .insert(insertPayload as any)
          .select()
          .single();

        if (!error && data) {
          const row = data as unknown as WorkerEarningsRow;
          const newRecord: WorkerEarningsRecord = {
            id: row.id,
            bookingToken: row.booking_token,
            serviceName: row.service_name,
            customerName: row.customer_name,
            date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            amount: row.amount,
            platformFee: row.platform_fee,
            netPayout: row.net_payout,
            status: row.status,
          };
          this.syncLocalEarnings(newRecord, workerId);
          return { success: true, data: newRecord, message: 'Earnings ledger updated.' };
        }
      } catch (err: unknown) {
        console.warn('Supabase addEarningsRecord failed, falling back to local:', err);
      }
    }

    try {
      const newRecord: WorkerEarningsRecord = {
        id: `ern-${Date.now()}`,
        ...record,
      };

      this.syncLocalEarnings(newRecord, workerId);
      return { success: true, data: newRecord, message: 'Earnings ledger updated.' };
    } catch (err) {
      return { success: false, error: 'Failed to add earnings record' };
    }
  }

  private syncLocalEarnings(newRecord: WorkerEarningsRecord, workerId: string): void {
    const earnings = storageService.getItem<WorkerEarningsRecord[]>(
      STORAGE_KEYS.EARNINGS,
      MOCK_EARNINGS_HISTORY
    );
    const updatedEarnings = [newRecord, ...earnings];
    storageService.setItem(STORAGE_KEYS.EARNINGS, updatedEarnings);

    const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
    const wIdx = workers.findIndex((w) => w.id === workerId);
    if (wIdx !== -1) {
      workers[wIdx] = {
        ...workers[wIdx],
        completedJobs: workers[wIdx].completedJobs + 1,
      };
      storageService.setItem(STORAGE_KEYS.WORKERS, workers);
    }
  }

  private syncLocalWorker(worker: Worker): void {
    const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
    const idx = workers.findIndex((w) => w.id === worker.id);
    if (idx !== -1) {
      workers[idx] = worker;
    } else {
      workers.unshift(worker);
    }
    storageService.setItem(STORAGE_KEYS.WORKERS, workers);
  }

  /**
   * Fetch training modules
   */
  public async getTrainingModules(): Promise<ApiResponse<TrainingModule[]>> {
    try {
      const modules = storageService.getItem<TrainingModule[]>(
        STORAGE_KEYS.TRAINING_MODULES,
        TRAINING_MODULES
      );
      return { success: true, data: modules };
    } catch (err) {
      return { success: false, error: 'Failed to fetch training modules' };
    }
  }

  /**
   * Fetch skills matrix
   */
  public async getSkillsMatrix(): Promise<ApiResponse<SkillItem[]>> {
    try {
      const skills = storageService.getItem<SkillItem[]>(
        STORAGE_KEYS.SKILLS_MATRIX,
        INITIAL_SKILLS_MATRIX
      );
      return { success: true, data: skills };
    } catch (err) {
      return { success: false, error: 'Failed to fetch skills matrix' };
    }
  }

  /**
   * Fetch certificates
   */
  public async getCertificates(): Promise<ApiResponse<WorkerCertificate[]>> {
    try {
      const certs = storageService.getItem<WorkerCertificate[]>(STORAGE_KEYS.CERTIFICATES, []);
      return { success: true, data: certs };
    } catch (err) {
      return { success: false, error: 'Failed to fetch certificates' };
    }
  }

  /**
   * Submit quiz results, update skill level, and generate verifiable certificate
   */
  public async submitQuizAndGenerateCert(
    moduleId: string,
    score: number,
    workerId: string = 'w-1'
  ): Promise<ApiResponse<WorkerCertificate>> {
    try {
      const modules = storageService.getItem<TrainingModule[]>(
        STORAGE_KEYS.TRAINING_MODULES,
        TRAINING_MODULES
      );
      const targetModule = modules.find((m) => m.id === moduleId);
      const profession = targetModule?.profession || 'General Technician';
      const certNum = `SYH-NSDC-2026-${profession.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const currentWorker = workers.find((w) => w.id === workerId) || workers[0];

      const newCert: WorkerCertificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: certNum,
        workerName: currentWorker.name,
        profession,
        skills: targetModule ? [targetModule.title] : ['Certified Vocational Skill'],
        score,
        issueDate: 'Today (Verified)',
        expiryDate: '3 Years Validity',
        issuer: 'National Worker Cooperative Federation & NSDC Skills Council',
        isDemo: true,
      };

      // 1. Mark training module as completed
      const updatedModules = modules.map((m) =>
        m.id === moduleId ? { ...m, completed: true, score } : m
      );
      storageService.setItem(STORAGE_KEYS.TRAINING_MODULES, updatedModules);

      // 2. Add certificate to list
      const certs = storageService.getItem<WorkerCertificate[]>(STORAGE_KEYS.CERTIFICATES, []);
      storageService.setItem(STORAGE_KEYS.CERTIFICATES, [newCert, ...certs]);

      // 3. Update skills matrix
      const skills = storageService.getItem<SkillItem[]>(
        STORAGE_KEYS.SKILLS_MATRIX,
        INITIAL_SKILLS_MATRIX
      );
      const updatedSkills = skills.map((s) => {
        if (s.profession.toLowerCase() === profession.toLowerCase()) {
          return {
            ...s,
            verified: true,
            trainingRequired: false,
            level: 'Certified Master' as const,
            certificateNumber: certNum,
          };
        }
        return s;
      });
      storageService.setItem(STORAGE_KEYS.SKILLS_MATRIX, updatedSkills);

      // 4. Update worker profile certifications & training
      const updatedCertList = [
        ...currentWorker.certificates,
        {
          title: targetModule?.title || `${profession} Certified`,
          issuer: 'AIDORA Cooperative Federation',
          issuedYear: 2026,
          certificateNumber: certNum,
        },
      ];
      const updatedTrainingCompleted = Array.from(
        new Set([...currentWorker.trainingCompleted, targetModule?.title || ''])
      );

      const wIdx = workers.findIndex((w) => w.id === workerId);
      if (wIdx !== -1) {
        workers[wIdx] = {
          ...workers[wIdx],
          trainingCompleted: updatedTrainingCompleted,
          certificates: updatedCertList,
        };
        storageService.setItem(STORAGE_KEYS.WORKERS, workers);
      }

      // 5. Persist to Supabase if configured
      if (isSupabaseConfigured() && workerId) {
        supabase
          .from('workers')
          .update({
            certificates_data: updatedCertList as any,
            training_completed: updatedTrainingCompleted,
          })
          .or(`id.eq.${workerId},profile_id.eq.${workerId}`)
          .then(({ error }) => {
            if (error) console.warn('Failed to persist certificate to Supabase:', error.message);
          });
      }

      return {
        success: true,
        data: newCert,
        message: `Certificate ${certNum} generated and verified.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to complete quiz and generate certificate',
      };
    }
  }
}

export const workerService = new WorkerService();
