import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const getEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  const proc = (globalThis as any).process;
  if (typeof proc !== 'undefined' && proc.env) {
    return proc.env[key];
  }
  return undefined;
};

const isDevEnv = (): boolean => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return Boolean((import.meta as any).env.DEV);
  }
  const proc = (globalThis as any).process;
  if (typeof proc !== 'undefined' && proc.env) {
    return proc.env.NODE_ENV !== 'production';
  }
  return true;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const DEFAULT_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const DEFAULT_LOCAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDkyOTk4MDAsImV4cCI6MjAwNDg3NTgwMH0.xxx';

/**
 * Checks if real Supabase credentials have been configured
 */
export const isSupabaseConfigured = (): boolean => {
  if (isDevEnv()) {
    const devUrl = supabaseUrl || DEFAULT_LOCAL_SUPABASE_URL;
    return Boolean(devUrl && isValidUrl(devUrl));
  }
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    isValidUrl(supabaseUrl) &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
};

export type AuthMode = 'SUPABASE_LIVE' | 'DEV_SANDBOX' | 'UNCONFIGURED_PROD';

export interface AuthConfigStatus {
  isConfigured: boolean;
  isProduction: boolean;
  mode: AuthMode;
  providerDetails: string;
}

export const getAuthConfigStatus = (): AuthConfigStatus => {
  const configured = isSupabaseConfigured();
  const isProd = !isDevEnv();

  if (configured) {
    const activeUrl = supabaseUrl || (isDevEnv() ? DEFAULT_LOCAL_SUPABASE_URL : '');
    const isLocal = Boolean(
      activeUrl &&
      (activeUrl.includes('localhost') || activeUrl.includes('127.0.0.1'))
    );
    return {
      isConfigured: true,
      isProduction: isProd,
      mode: 'SUPABASE_LIVE',
      providerDetails: isLocal
        ? 'Connected to Local Supabase Auth (Local Dev Test Phone OTP & Local DB)'
        : 'Connected to Supabase Auth (Live SMS OTP & Cloud DB)',
    };
  }

  if (isProd) {
    return {
      isConfigured: false,
      isProduction: true,
      mode: 'UNCONFIGURED_PROD',
      providerDetails: 'Production Error: Supabase credentials not configured in environment.',
    };
  }

  return {
    isConfigured: false,
    isProduction: false,
    mode: 'DEV_SANDBOX',
    providerDetails: 'Dev Sandbox Mode (Set VITE_SUPABASE_URL for real SMS OTP)',
  };
};

/**
 * Normalizes Indian mobile number to E.164 format (+91XXXXXXXXXX)
 */
export const formatIndianPhoneToE164 = (rawPhone: string): string => {
  if (!rawPhone) return '';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (rawPhone.startsWith('+')) {
    return rawPhone;
  }
  return `+${digits}`;
};

/**
 * Validates if the phone number is a valid 10-digit Indian mobile number
 */
export const isValidIndianMobile = (phone: string): boolean => {
  if (!phone) return false;
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return true;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]\d{9}$/.test(digits)) {
    return true;
  }
  return false;
};

// Effective client credentials (uses local defaults in dev mode, strict config in prod)
const effectiveUrl = isValidUrl(supabaseUrl)
  ? (supabaseUrl as string)
  : (isDevEnv() ? DEFAULT_LOCAL_SUPABASE_URL : 'https://placeholder.supabase.co');

const effectiveKey = (supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here')
  ? supabaseAnonKey
  : (isDevEnv() ? DEFAULT_LOCAL_ANON_KEY : 'placeholder-anon-key');

/**
 * Typed Supabase Client instance with session persistence
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
