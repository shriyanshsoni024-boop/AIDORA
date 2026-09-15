import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthResponse,
  AuthSession,
  AuthUser,
  PhoneOtpSendDto,
  PhoneOtpVerifyDto,
  CustomerLoginDto,
  CustomerRegisterDto,
  WorkerLoginDto,
  WorkerRegisterDto,
  AdminLoginDto,
} from '../types/auth';
import { Role } from '../types';
import { authService } from '../services/auth/authService';
import { supabase, isSupabaseConfigured, getAuthConfigStatus, AuthConfigStatus, AuthMode } from '../lib/supabase';
import { storageService } from '../services/storage/storageService';
import { STORAGE_KEYS } from '../services/storage/storageKeys';

export interface AuthContextType {
  session: AuthSession;
  user: AuthUser | null;
  isAuthenticated: boolean;
  currentRole: Role;
  currentPath: string;
  isLoading: boolean;
  authMode: AuthMode;
  authConfig: AuthConfigStatus;
  navigate: (path: string) => void;
  // Supabase Phone OTP Authentication
  sendPhoneOtp: (dto: PhoneOtpSendDto) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyPhoneOtp: (dto: PhoneOtpVerifyDto) => Promise<AuthResponse>;
  // Role-Specific Real Auth API Methods
  loginCustomer: (dto: CustomerLoginDto) => Promise<AuthResponse>;
  registerCustomer: (dto: CustomerRegisterDto) => Promise<AuthResponse>;
  loginWorker: (dto: WorkerLoginDto) => Promise<AuthResponse>;
  registerWorker: (dto: WorkerRegisterDto) => Promise<AuthResponse>;
  loginAdmin: (dto: AdminLoginDto) => Promise<AuthResponse>;
  // Unified / Generic Wrappers for UI backwards compatibility
  login: (role: Role, credentials: { identifier: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (
    role: Role,
    userData: {
      name: string;
      phone: string;
      email?: string;
      password?: string;
      profession?: string;
      locality?: string;
      cooperativeBranch?: string;
      experienceYears?: number;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  canAccessRole: (targetRole: Role) => boolean;
  refreshSession: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Normalize initial path from window.location
const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');

  if (hash && hash.startsWith('/')) {
    return hash;
  }
  if (path) {
    return path;
  }
  return '/';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial session starts from cached storage or unauthenticated
  const [session, setSession] = useState<AuthSession>(() => {
    const cached = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (cached && cached.isAuthenticated && cached.user) {
      if (!cached.expiresAt || Date.now() < cached.expiresAt) {
        return cached;
      }
    }
    return {
      isAuthenticated: false,
      role: 'customer',
      user: null,
    };
  });

  // Navigate helper with history pushState and hash synchronization
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.location.hash = path;
    }
  }, []);

  // Listen for browser back/forward buttons and hash navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const authConfig = getAuthConfigStatus();
  const authMode = authConfig.mode;

  // Hydrate session on mount and synchronize
  useEffect(() => {
    const cached = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);

    if (!isSupabaseConfigured()) {
      if (cached && cached.isAuthenticated && cached.user) {
        setSession(cached);
      }
      setIsLoading(false);
      return;
    }

    const loadProfileFromSupabase = async (userId: string, sbToken?: string, refreshTok?: string, expiresAtSec?: number) => {
      try {
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // If profile row doesn't exist yet, insert a clean baseline record for this auth user
        if (!profile) {
          const { data: created } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              role: 'customer',
              name: '',
              phone: '',
              city: 'Bangalore',
              state: 'Karnataka',
              address: '',
              saved_addresses: [],
              is_profile_completed: false,
            }])
            .select()
            .maybeSingle();
          profile = created;
        }

        if (profile) {
          const userRole: Role = (profile.role === 'cooperative' ? 'admin' : profile.role) as Role;
          let workerData: any = null;
          if (userRole === 'worker') {
            const { data: w } = await supabase
              .from('workers')
              .select('*')
              .eq('profile_id', profile.id)
              .maybeSingle();
            workerData = w;
          }

          const p = profile as any;
          const isProfileCompleted = p.is_profile_completed ?? (
            userRole === 'worker'
              ? (workerData?.is_profile_completed ?? false)
              : Boolean(profile.name && profile.name.trim().length > 0 && profile.address)
          );

          const authUser: AuthUser = {
            id: profile.id,
            name: profile.name || '',
            phone: profile.phone || '',
            email: profile.email || undefined,
            role: userRole,
            verificationStatus: (workerData?.verification_status || (userRole === 'worker' ? 'PENDING' : 'VERIFIED')) as any,
            createdAt: profile.created_at || new Date().toISOString(),
            dob: p.dob || undefined,
            gender: p.gender || undefined,
            address: profile.address || '',
            locality: p.locality || undefined,
            city: profile.city || 'Bangalore',
            state: p.state || 'Karnataka',
            pincode: p.pincode || undefined,
            preferredLanguage: p.preferred_language || 'en',
            emergencyContact: p.emergency_contact || undefined,
            savedAddresses: Array.isArray(p.saved_addresses) ? p.saved_addresses : [],
            isProfileCompleted,
            zone: workerData?.zone || p.locality || profile.city,
            profession: workerData?.trade || workerData?.professions?.[0],
            professions: workerData?.professions || (workerData?.trade ? [workerData.trade] : undefined),
            skills: workerData?.skills || [],
            cooperativeBranch: workerData?.cooperative_branch,
            experienceYears: workerData?.experience_years,
            serviceRadiusKm: workerData?.service_radius_km || 10,
            languages: workerData?.languages || ['English', 'Hindi'],
            bio: workerData?.bio || '',
            workExperience: workerData?.work_experience || '',
            avatar: workerData?.avatar || profile.avatar_url || undefined,
            profileImage: profile.avatar_url || workerData?.avatar || undefined,
          };

          const newSession: AuthSession = {
            isAuthenticated: true,
            role: userRole,
            user: authUser,
            token: sbToken,
            refreshToken: refreshTok,
            expiresAt: expiresAtSec ? expiresAtSec * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
          };

          setSession(newSession);
          storageService.setItem(STORAGE_KEYS.AUTH_SESSION, newSession);
          return newSession;
        }
      } catch (err) {
        console.warn('Failed to load profile from Supabase:', err);
      }
      return null;
    };

    // 1. Initial Session Check
    supabase.auth.getSession().then(async ({ data: { session: sbSession } }) => {
      if (sbSession?.user) {
        await loadProfileFromSupabase(
          sbSession.user.id,
          sbSession.access_token,
          sbSession.refresh_token,
          sbSession.expires_at
        );
      } else {
        // If there is an existing valid local demo session, keep it
        if (cached && cached.isAuthenticated && cached.user?.id) {
          setSession(cached);
        } else {
          setSession({
            isAuthenticated: false,
            role: 'customer',
            user: null,
          });
          storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
        }
      }
      setIsLoading(false);
    }).catch(() => {
      if (cached && cached.isAuthenticated && cached.user?.id) {
        setSession(cached);
      }
      setIsLoading(false);
    });

    // 2. Realtime Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
      if (event === 'SIGNED_OUT') {
        setSession({
          isAuthenticated: false,
          role: 'customer',
          user: null,
        });
        storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (sbSession?.user) {
          await loadProfileFromSupabase(
            sbSession.user.id,
            sbSession.access_token,
            sbSession.refresh_token,
            sbSession.expires_at
          );
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================================================================
  // REAL SUPABASE PHONE OTP & AUTH METHODS
  // =========================================================================

  const sendPhoneOtp = async (dto: PhoneOtpSendDto): Promise<{ success: boolean; message?: string; error?: string }> => {
    return await authService.sendPhoneOtp(dto);
  };

  const verifyPhoneOtp = async (dto: PhoneOtpVerifyDto): Promise<AuthResponse> => {
    const res = await authService.verifyPhoneOtp(dto);
    if (res.success && res.session) {
      setSession(res.session);
      if (dto.role === 'worker') {
        navigate('/worker/home');
      } else if (dto.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/home');
      }
    }
    return res;
  };

  const loginCustomer = async (dto: CustomerLoginDto): Promise<AuthResponse> => {
    const res = await authService.loginCustomer(dto);
    if (res.success && res.session) {
      setSession(res.session);
      navigate('/customer/home');
    }
    return res;
  };

  const registerCustomer = async (dto: CustomerRegisterDto): Promise<AuthResponse> => {
    const res = await authService.registerCustomer(dto);
    if (res.success && res.session) {
      setSession(res.session);
      navigate('/customer/home');
    }
    return res;
  };

  const loginWorker = async (dto: WorkerLoginDto): Promise<AuthResponse> => {
    const res = await authService.loginWorker(dto);
    if (res.success && res.session) {
      setSession(res.session);
      navigate('/worker/home');
    }
    return res;
  };

  const registerWorker = async (dto: WorkerRegisterDto): Promise<AuthResponse> => {
    const res = await authService.registerWorker(dto);
    if (res.success && res.session) {
      setSession(res.session);
      navigate('/worker/home');
    }
    return res;
  };

  const loginAdmin = async (dto: AdminLoginDto): Promise<AuthResponse> => {
    const res = await authService.loginAdmin(dto);
    if (res.success && res.session) {
      setSession(res.session);
      navigate('/admin/dashboard');
    }
    return res;
  };

  // Unified login helper
  const login = async (
    role: Role,
    credentials: { identifier: string; password?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const pwd = credentials.password || '';
    if (role === 'worker') {
      const res = await loginWorker({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    } else if (role === 'admin') {
      const res = await loginAdmin({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    } else {
      const res = await loginCustomer({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    }
  };

  // Unified signup helper
  const signup = async (
    role: Role,
    userData: {
      name: string;
      phone: string;
      email?: string;
      password?: string;
      profession?: string;
      locality?: string;
      cooperativeBranch?: string;
      experienceYears?: number;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    const pwd = userData.password || '';
    if (role === 'worker') {
      const res = await registerWorker({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: pwd,
        profession: userData.profession || 'Electrician',
        cooperativeBranch: userData.cooperativeBranch,
        experienceYears: userData.experienceYears,
      });
      return { success: res.success, error: res.error };
    } else {
      const res = await registerCustomer({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: pwd,
        locality: userData.locality,
      });
      return { success: res.success, error: res.error };
    }
  };

  const logout = async (): Promise<void> => {
    const previousRole = session.role;
    await authService.logout();
    setSession({
      isAuthenticated: false,
      role: previousRole,
      user: null,
      token: undefined,
      refreshToken: undefined,
    });

    // Redirect to dedicated role login page
    switch (previousRole) {
      case 'worker':
        navigate('/worker/login');
        break;
      case 'admin':
        navigate('/admin/login');
        break;
      case 'customer':
      default:
        navigate('/customer/login');
        break;
    }
  };

  const refreshSession = async (): Promise<AuthResponse> => {
    const res = await authService.refreshSession();
    if (res.success && res.session) {
      setSession(res.session);
    }
    return res;
  };

  /**
   * Safe role switcher: Only allows navigation to a role if user is legitimately authenticated for it
   */
  const switchRole = (newRole: Role) => {
    if (session.isAuthenticated && session.role === newRole) {
      switch (newRole) {
        case 'worker':
          navigate('/worker/home');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'customer':
        default:
          navigate('/customer/home');
          break;
      }
    } else {
      switch (newRole) {
        case 'worker':
          navigate('/worker/login');
          break;
        case 'admin':
          navigate('/admin/login');
        break;
        case 'customer':
        default:
          navigate('/customer/login');
          break;
      }
    }
  };

  const canAccessRole = (targetRole: Role): boolean => {
    return session.isAuthenticated && session.role === targetRole;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session.user,
        isAuthenticated: session.isAuthenticated,
        currentRole: session.role,
        currentPath,
        isLoading,
        authMode,
        authConfig,
        navigate,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginCustomer,
        registerCustomer,
        loginWorker,
        registerWorker,
        loginAdmin,
        login,
        signup,
        logout,
        switchRole,
        canAccessRole,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
