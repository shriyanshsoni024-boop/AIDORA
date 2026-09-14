import React, { createContext, useContext, useState, useEffect } from 'react';
import { Worker, SkillItem, TrainingModule, WorkerCertificate, WorkerEarningsRecord } from '../types';
import { MOCK_WORKERS } from '../data/workers';
import { TRAINING_MODULES, INITIAL_SKILLS_MATRIX, MOCK_EARNINGS_HISTORY } from '../data/workerTrainingData';
import { useBooking } from './BookingContext';
import { workerService } from '../services/workerService';
import { storageService } from '../services/storage/storageService';
import { STORAGE_KEYS } from '../services/storage/storageKeys';

import { authService } from '../services/auth/authService';
import { realtimeService } from '../lib/realtime';

export type WorkerTab = 'home' | 'jobs' | 'skills' | 'training' | 'earnings' | 'profile';

interface WorkerContextType {
  activeTab: WorkerTab;
  setActiveTab: (tab: WorkerTab) => void;
  worker: Worker;
  setWorker: React.Dispatch<React.SetStateAction<Worker>>;
  isAvailable: boolean;
  setIsAvailable: (val: boolean) => void;
  isEmergencyAvailable: boolean;
  setIsEmergencyAvailable: (val: boolean) => void;
  skillsMatrix: SkillItem[];
  setSkillsMatrix: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  trainingModules: TrainingModule[];
  setTrainingModules: React.Dispatch<React.SetStateAction<TrainingModule[]>>;
  certificates: WorkerCertificate[];
  earningsHistory: WorkerEarningsRecord[];
  todayEarnings: number;
  weeklyEarnings: number;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (val: boolean) => void;
  showQuizModal: boolean;
  setShowQuizModal: (val: boolean) => void;
  activeQuizModule: TrainingModule | null;
  setActiveQuizModule: (mod: TrainingModule | null) => void;
  showCertificateModal: boolean;
  setShowCertificateModal: (val: boolean) => void;
  activeCertificate: WorkerCertificate | null;
  setActiveCertificate: (cert: WorkerCertificate | null) => void;
  // Workflow actions
  acceptBooking: (bookingId: string) => void;
  startTravel: (bookingId: string) => void;
  startWorkWithOtp: (bookingId: string, otp: string) => { success: boolean; message?: string };
  completeWork: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  completeQuizAndGenerateCert: (moduleId: string, score: number) => WorkerCertificate;
  updateOnboardingProfile: (data: Partial<Worker>) => void;
  refreshWorkerData: () => Promise<void>;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const WorkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bookings, updateBookingStatus } = useBooking();
  const [activeTab, setActiveTab] = useState<WorkerTab>('home');

  // Synchronous initialization from storageService for zero-flicker UI
  const [worker, setWorker] = useState<Worker>(() => {
    const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
    return (
      workers[0] || {
        ...MOCK_WORKERS[0],
        emergencyAvailable: true,
        aadhaarNumber: 'XXXX-XXXX-8921',
      }
    );
  });

  const [isAvailable, setIsAvailableState] = useState<boolean>(
    () => worker.availability === 'AVAILABLE'
  );
  const [isEmergencyAvailable, setIsEmergencyAvailableState] = useState<boolean>(
    () => worker.emergencyAvailable !== false
  );

  const [skillsMatrix, setSkillsMatrix] = useState<SkillItem[]>(() => {
    return storageService.getItem<SkillItem[]>(STORAGE_KEYS.SKILLS_MATRIX, INITIAL_SKILLS_MATRIX);
  });

  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(() => {
    return storageService.getItem<TrainingModule[]>(STORAGE_KEYS.TRAINING_MODULES, TRAINING_MODULES);
  });

  const [certificates, setCertificates] = useState<WorkerCertificate[]>(() => {
    return storageService.getItem<WorkerCertificate[]>(STORAGE_KEYS.CERTIFICATES, []);
  });

  const [earningsHistory, setEarningsHistory] = useState<WorkerEarningsRecord[]>(() => {
    return storageService.getItem<WorkerEarningsRecord[]>(STORAGE_KEYS.EARNINGS, MOCK_EARNINGS_HISTORY);
  });

  // Modals
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [activeQuizModule, setActiveQuizModule] = useState<TrainingModule | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<WorkerCertificate | null>(null);

  // Hydrate data from workerService
  const refreshWorkerData = async () => {
    const session = authService.getCurrentSession();
    let currentWorkerId = worker.id;

    if (session?.user && session.role === 'worker') {
      const profileRes = await workerService.getWorkerByProfileId(session.user.id);
      if (profileRes.success && profileRes.data) {
        currentWorkerId = profileRes.data.id;
      }
    }

    const [workersRes, earningsRes, modulesRes, certsRes, skillsRes] = await Promise.all([
      workerService.getWorkers(),
      workerService.getWorkerEarnings(currentWorkerId),
      workerService.getTrainingModules(),
      workerService.getCertificates(),
      workerService.getSkillsMatrix(),
    ]);

    if (workersRes.success && workersRes.data && workersRes.data.length > 0) {
      const current = workersRes.data.find(w => w.id === currentWorkerId) || workersRes.data[0];
      setWorker(current);
      setIsAvailableState(current.availability === 'AVAILABLE');
      setIsEmergencyAvailableState(current.emergencyAvailable !== false);
    }
    if (earningsRes.success && earningsRes.data) {
      setEarningsHistory(earningsRes.data);
    }
    if (modulesRes.success && modulesRes.data) {
      setTrainingModules(modulesRes.data);
    }
    if (certsRes.success && certsRes.data) {
      setCertificates(certsRes.data);
    }
    if (skillsRes.success && skillsRes.data) {
      setSkillsMatrix(skillsRes.data);
    }
  };

  useEffect(() => {
    refreshWorkerData();
  }, []);

  // Realtime subscription for incoming worker bookings/dispatches
  useEffect(() => {
    if (!worker?.id) return;
    const unsubscribe = realtimeService.subscribeToWorkerDispatches(worker.id, () => {
      refreshWorkerData();
    });
    return () => {
      unsubscribe();
    };
  }, [worker?.id]);

  // Earnings calculations from real completed jobs ledger
  const todayEarnings =
    earningsHistory
      .filter(e => e.date.includes('Today') || e.date.includes('Just now') || e.status === 'PAID')
      .reduce((sum, item) => sum + item.netPayout, 0);

  const weeklyEarnings = earningsHistory.reduce((sum, item) => sum + item.netPayout, 0);

  const setIsAvailable = (val: boolean) => {
    setIsAvailableState(val);
    setWorker(prev => ({ ...prev, availability: val ? 'AVAILABLE' : 'NOT_AVAILABLE' }));
    workerService.updateWorkerAvailability(worker.id, val ? 'AVAILABLE' : 'NOT_AVAILABLE', isEmergencyAvailable);
  };

  const setIsEmergencyAvailable = (val: boolean) => {
    setIsEmergencyAvailableState(val);
    setWorker(prev => ({ ...prev, emergencyAvailable: val }));
    workerService.updateWorkerAvailability(worker.id, worker.availability, val);
  };

  // Workflow Handlers connecting directly to BookingContext & WorkerService
  const acceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'ACCEPTED', `${worker.name} accepted the dispatch request`);
  };

  const startTravel = (bookingId: string) => {
    updateBookingStatus(bookingId, 'ON_THE_WAY', `${worker.name} is on the way (ETA ~12 mins)`);
  };

  const startWorkWithOtp = (bookingId: string, inputOtp: string) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    const expectedOtp = targetBooking?.otp || (targetBooking as any)?.startOtp;
    const cleanedInput = inputOtp.trim();

    if (expectedOtp && cleanedInput === expectedOtp) {
      updateBookingStatus(bookingId, 'IN_PROGRESS', `Customer OTP verified. Service started by ${worker.name}`);
      return { success: true };
    }
    return { success: false, message: `Invalid OTP. Please enter the 4-digit code shown on the customer app.` };
  };

  const completeWork = (bookingId: string) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    updateBookingStatus(bookingId, 'COMPLETED', `Job completed and verified by ${worker.name}`);

    // Calculate payout
    const gross = targetBooking?.totalPrice || 474;
    const fee = targetBooking?.connectionFee || 25;
    const net = gross - fee;

    const newEarning: WorkerEarningsRecord = {
      id: `ern-${Date.now()}`,
      bookingToken: targetBooking?.token || 'SYH-48291',
      serviceName: targetBooking?.serviceName || 'Service Completed',
      customerName: targetBooking?.customerName || 'Customer',
      date: 'Today, Just now',
      amount: gross,
      platformFee: fee,
      netPayout: net,
      status: 'PAID',
    };

    setEarningsHistory(prev => [newEarning, ...prev]);
    setWorker(prev => ({
      ...prev,
      completedJobs: prev.completedJobs + 1,
    }));

    workerService.addEarningsRecord(newEarning, worker.id);
  };

  const declineBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'CANCELLED', `Declined by ${worker.name}`);
  };

  const completeQuizAndGenerateCert = (moduleId: string, score: number): WorkerCertificate => {
    const targetModule = trainingModules.find(m => m.id === moduleId);
    const profession = targetModule?.profession || 'General Technician';
    const certNum = `SYH-NSDC-2026-${profession.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    const newCert: WorkerCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      workerName: worker.name,
      profession,
      skills: targetModule ? [targetModule.title] : ['Certified Vocational Skill'],
      score,
      issueDate: 'Today (Verified)',
      expiryDate: '3 Years Validity',
      issuer: 'National Worker Cooperative Federation & NSDC Skills Council',
      isDemo: true,
    };

    // Mark module completed in local state
    setTrainingModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, completed: true, score } : m))
    );

    // Add certificate to local state
    setCertificates(prev => [newCert, ...prev]);

    // Update Skills Matrix in local state
    setSkillsMatrix(prev =>
      prev.map(s => {
        if (s.profession.toLowerCase() === profession.toLowerCase()) {
          return { ...s, verified: true, trainingRequired: false, level: 'Certified Master', certificateNumber: certNum };
        }
        return s;
      })
    );

    // Update Worker Profile in local state
    setWorker(prev => ({
      ...prev,
      trainingCompleted: [...prev.trainingCompleted, targetModule?.title || ''],
      certificates: [
        ...prev.certificates,
        {
          title: targetModule?.title || `${profession} Certified`,
          issuer: 'AIDORA Cooperative Federation',
          issuedYear: 2026,
          certificateNumber: certNum,
        },
      ],
    }));

    // Async service execution for persistent storage
    workerService.submitQuizAndGenerateCert(moduleId, score, worker.id);

    setActiveCertificate(newCert);
    setShowCertificateModal(true);
    return newCert;
  };

  const updateOnboardingProfile = (data: Partial<Worker>) => {
    const updated = {
      ...worker,
      ...data,
      verificationStatus: 'VERIFIED' as const,
    };
    setWorker(updated);
    workerService.updateWorker(worker.id, updated);
  };

  return (
    <WorkerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        worker,
        setWorker,
        isAvailable,
        setIsAvailable,
        isEmergencyAvailable,
        setIsEmergencyAvailable,
        skillsMatrix,
        setSkillsMatrix,
        trainingModules,
        setTrainingModules,
        certificates,
        earningsHistory,
        todayEarnings,
        weeklyEarnings,
        showOnboardingModal,
        setShowOnboardingModal,
        showQuizModal,
        setShowQuizModal,
        activeQuizModule,
        setActiveQuizModule,
        showCertificateModal,
        setShowCertificateModal,
        activeCertificate,
        setActiveCertificate,
        acceptBooking,
        startTravel,
        startWorkWithOtp,
        completeWork,
        declineBooking,
        completeQuizAndGenerateCert,
        updateOnboardingProfile,
        refreshWorkerData,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};
