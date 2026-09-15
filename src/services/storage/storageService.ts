import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from './storageKeys';
import { INITIAL_BOOKINGS, MOCK_REVIEWS } from '../../data/mockData';
import { MOCK_WORKERS } from '../../data/workers';
import { TRAINING_MODULES, INITIAL_SKILLS_MATRIX, MOCK_EARNINGS_HISTORY } from '../../data/workerTrainingData';
import { WorkerCertificate, KycItem } from '../../types';

const DEFAULT_CERTIFICATES: WorkerCertificate[] = [
  {
    id: 'cert-initial-1',
    certificateNumber: 'SYH-NSDC-2026-EL409',
    workerName: 'Rahul Kumar',
    profession: 'Electrician',
    skills: ['MCB Diagnostics', 'Inverter Setup', 'Fan Rewinding'],
    score: 9,
    issueDate: '15 Jan 2026',
    expiryDate: '14 Jan 2029',
    issuer: 'National Skill Development Corp (NSDC) & AIDORA Federation',
    isDemo: true,
  },
  {
    id: 'cert-initial-2',
    certificateNumber: 'SYH-COOP-2026-PL102',
    workerName: 'Rahul Kumar',
    profession: 'Plumber',
    skills: ['P-Trap & Drainage', 'Geyser Inlet Lines'],
    score: 8,
    issueDate: '20 Feb 2026',
    expiryDate: '19 Feb 2029',
    issuer: 'Karnataka State Worker Cooperative Federation',
    isDemo: true,
  },
];

const DEFAULT_KYC_QUEUE: KycItem[] = [
  { id: 'v-1', name: 'Manish Verma', profession: 'Electrician', cooperative: 'East Zone Cooperative', documents: 'Aadhaar + ITI Diploma', status: 'PENDING', submittedAt: 'Today, 09:30 AM' },
  { id: 'v-2', name: 'Kavita Rao', profession: 'Appliance Repair', cooperative: 'City Women Artisan Union', documents: 'Aadhaar + NSDC Level 2', status: 'PENDING', submittedAt: 'Yesterday, 04:15 PM' },
];

/**
 * Storage Service
 * Encapsulates client-side persistence and data seeding with safe fallbacks.
 */
class StorageService {
  private isBrowser: boolean;
  private memoryStore: Map<string, string> = new Map();

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    this.initialize();
  }

  /**
   * Initializes storage with baseline seed data if first time load or schema upgrade
   */
  public initialize(): void {
    if (!this.isBrowser) return;

    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      if (storedVersion !== CURRENT_SCHEMA_VERSION) {
        // First run or version bump: seed if missing
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
          this.setItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
          this.setItem(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.EARNINGS)) {
          this.setItem(STORAGE_KEYS.EARNINGS, MOCK_EARNINGS_HISTORY);
        }
        if (!localStorage.getItem(STORAGE_KEYS.TRAINING_MODULES)) {
          this.setItem(STORAGE_KEYS.TRAINING_MODULES, TRAINING_MODULES);
        }
        if (!localStorage.getItem(STORAGE_KEYS.SKILLS_MATRIX)) {
          this.setItem(STORAGE_KEYS.SKILLS_MATRIX, INITIAL_SKILLS_MATRIX);
        }
        if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
          this.setItem(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
        }
        if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
          this.setItem(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
        }
        if (!localStorage.getItem(STORAGE_KEYS.KYC_QUEUE)) {
          this.setItem(STORAGE_KEYS.KYC_QUEUE, DEFAULT_KYC_QUEUE);
        }

        // Clean up any legacy shared current user key to prevent cross-profile bleeding
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
      }
    } catch (e) {
      console.warn('StorageService: Failed to initialize localStorage:', e);
    }
  }

  public getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser) {
      const mem = this.memoryStore.get(key);
      if (mem === undefined) return fallback;
      try {
        return JSON.parse(mem) as T;
      } catch {
        return fallback;
      }
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.error(`StorageService: Failed to read key "${key}":`, e);
      return fallback;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (!this.isBrowser) {
      this.memoryStore.set(key, JSON.stringify(value));
      return true;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`StorageService: Failed to write key "${key}":`, e);
      return false;
    }
  }

  public removeItem(key: string): void {
    if (!this.isBrowser) {
      this.memoryStore.delete(key);
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`StorageService: Failed to remove key "${key}":`, e);
    }
  }

  public resetAllToDefaults(): void {
    if (!this.isBrowser) return;
    try {
      this.setItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      this.setItem(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      this.setItem(STORAGE_KEYS.EARNINGS, MOCK_EARNINGS_HISTORY);
      this.setItem(STORAGE_KEYS.TRAINING_MODULES, TRAINING_MODULES);
      this.setItem(STORAGE_KEYS.SKILLS_MATRIX, INITIAL_SKILLS_MATRIX);
      this.setItem(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
      this.setItem(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
      this.setItem(STORAGE_KEYS.KYC_QUEUE, DEFAULT_KYC_QUEUE);
      this.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    } catch (e) {
      console.error('StorageService: Reset failed:', e);
    }
  }
}

export const storageService = new StorageService();

