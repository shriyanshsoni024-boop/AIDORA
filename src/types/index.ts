export type Role = 'customer' | 'worker' | 'admin';

export * from './auth';

export type AdminTab = 'operations' | 'bookings' | 'workers' | 'finance' | 'reports';


export type ServiceTier = 'SMALL' | 'MEDIUM' | 'LARGE';

export type UrgencyLevel = 'NORMAL' | 'EMERGENCY';

export type BookingStatus =
  | 'REQUESTED'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export type WorkerAvailability = 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';

export interface ServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  icon: string;
  image?: string;
  description: string;
  descriptionHi: string;
  basePrice: number;
  popular?: boolean;
  skills: string[];
}

export interface WorkerCertificate {
  id: string;
  certificateNumber: string;
  workerName: string;
  profession: string;
  skills: string[];
  score: number;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  qrCodeUrl?: string;
  isDemo?: boolean;
}

export interface Worker {
  id: string;
  name: string;
  nameHi: string;
  phone: string;
  avatar: string;
  professions: string[];
  skills: string[];
  experienceYears: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  completedJobs: number;
  distanceKm: number;
  availability: WorkerAvailability;
  emergencyAvailable?: boolean;
  verificationStatus: VerificationStatus;
  cooperativeName: string;
  zone: string;
  aadhaarNumber?: string;
  certificates: {
    title: string;
    issuer: string;
    issuedYear: number;
    certificateNumber?: string;
  }[];
  trainingCompleted: string[];
  matchScore?: number;
  matchReasons?: string[];
  matchScoreBreakdown?: {
    skillMatch: number;      // 0-30
    experience: number;      // 0-20
    distance: number;        // 0-20
    availability: number;    // 0-10
    rating: number;          // 0-10
    workload: number;        // 0-5
    fairness: number;        // 0-5
  };
}

export interface Booking {
  id: string;
  token: string; // e.g. "SYH-48291"
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  description: string;
  imageUrl?: string;
  address: string;
  city: string;
  scheduledDate: string;
  scheduledTime: string;
  urgency: UrgencyLevel;
  tier: ServiceTier;
  estimatedPrice: number;
  connectionFee: number;
  totalPrice: number;
  worker?: Worker;
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
  customerRating?: number;
  customerReview?: string;
  workerRating?: number;
  workerReview?: string;
  paymentStatus: 'PENDING' | 'PAID';
  createdAt: string;
  completedAt?: string;
  otp?: string; // 4-digit verification code
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

export interface SkillItem {
  id: string;
  name: string;
  nameHi: string;
  profession: string;
  level: 'Beginner' | 'Intermediate' | 'Expert' | 'Certified Master';
  verified: boolean;
  trainingRequired: boolean;
  certificateNumber?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationHi: string;
}

export interface TrainingModule {
  id: string;
  profession: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  youtubeId: string;
  youtubeUrl: string;
  duration: string;
  durationHi: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface WorkerEarningsRecord {
  id: string;
  bookingToken: string;
  serviceName: string;
  customerName: string;
  date: string;
  amount: number;
  platformFee: number;
  netPayout: number;
  status: 'PAID' | 'PENDING';
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  address: string;
  city: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KycItem {
  id: string;
  name: string;
  profession: string;
  cooperative: string;
  documents: string;
  status: VerificationStatus;
  submittedAt?: string;
}

export interface CreateBookingDto {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  serviceCategory: ServiceCategory;
  tier: ServiceTier;
  urgency: UrgencyLevel;
  problemDescription?: string;
  imageUrl?: string;
  address?: string;
  city?: string;
  worker: Worker;
  paymentStatus?: 'PAID' | 'PENDING';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

