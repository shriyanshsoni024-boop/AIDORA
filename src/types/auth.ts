import { Role, VerificationStatus, SavedAddress } from './index';

/**
 * AIDORA Authentication User Model
 */
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  profileImage?: string;
  dob?: string;
  gender?: string;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferredLanguage?: 'en' | 'hi' | string;
  emergencyContact?: string;
  savedAddresses?: SavedAddress[];
  isProfileCompleted?: boolean;
  zone?: string;
  profession?: string;
  professions?: string[];
  skills?: string[];
  cooperativeBranch?: string;
  experienceYears?: number;
  serviceRadiusKm?: number;
  languages?: string[];
  bio?: string;
  workExperience?: string;
}

/**
 * SAHYOG Active Authentication Session
 */
export interface AuthSession {
  isAuthenticated: boolean;
  role: Role;
  user: AuthUser | null;
  token?: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp in milliseconds
}

/**
 * Stored Secure User Record (Vault)
 */
export interface SecureUserRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  passwordHash: string;
  passwordSalt: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  zone?: string;
  profession?: string;
  cooperativeBranch?: string;
  experienceYears?: number;
}

// Request DTOs
export interface PhoneOtpSendDto {
  phone: string;
}

export interface PhoneOtpVerifyDto {
  phone: string;
  token: string;
  role: Role;
  name?: string;
  email?: string;
  profession?: string;
  skills?: string[];
  cooperativeBranch?: string;
  experienceYears?: number;
  locality?: string;
  availability?: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
}

export interface CustomerLoginDto {
  identifier: string; // phone or email
  password?: string;
}

export interface CustomerRegisterDto {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  locality?: string;
}

export interface WorkerLoginDto {
  identifier: string; // phone or artisan ID
  password?: string; // PIN or password
}

export interface WorkerRegisterDto {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  profession: string;
  cooperativeBranch?: string;
  experienceYears?: number;
}

export interface AdminLoginDto {
  identifier: string; // email or officer ID
  password: string; // security key
}

export interface AuthResponse {
  success: boolean;
  session?: AuthSession;
  user?: AuthUser | null;
  error?: string;
  message?: string;
}
