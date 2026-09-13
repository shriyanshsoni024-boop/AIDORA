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
} from '../../types/auth';
import { Role } from '../../types';
import { supabase, isSupabaseConfigured, formatIndianPhoneToE164, isValidIndianMobile } from '../../lib/supabase';
import { storageService } from '../storage/storageService';
import { STORAGE_KEYS } from '../storage/storageKeys';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days default fallback expiry

export const FIXED_DEMO_OTP = '123456';

class AuthApiClient {
  /**
   * Send Phone OTP (Demo Fake OTP Mode)
   */
  public async sendPhoneOtp(dto: PhoneOtpSendDto): Promise<{ success: boolean; message?: string; error?: string }> {
    const cleanPhone = dto.phone.trim().replace(/\D/g, '');

    if (!isValidIndianMobile(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    // Demo Mode: Do not send real SMS, return fixed demo OTP message
    return {
      success: true,
      message: `Demo OTP: ${FIXED_DEMO_OTP}`,
    };
  }

  /**
   * Verify Phone OTP (Demo Fake OTP Mode)
   */
  public async verifyPhoneOtp(dto: PhoneOtpVerifyDto): Promise<AuthResponse> {
    const cleanPhone = dto.phone.trim().replace(/\D/g, '');
    const otpToken = dto.token.trim();

    if (!cleanPhone || !isValidIndianMobile(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    if (!otpToken) {
      return { success: false, error: 'Please enter the verification OTP.' };
    }

    // Exact check for Demo OTP
    if (otpToken !== FIXED_DEMO_OTP) {
      return { success: false, error: 'Invalid OTP' };
    }

    try {
      const userRole: Role = (dto.role === 'worker' ? 'worker' : 'customer') as Role;
      const authUserId = `usr_demo_${cleanPhone.slice(-6)}`;
      const formattedPhone = formatIndianPhoneToE164(cleanPhone);

      const authUser: AuthUser = {
        id: authUserId,
        name: dto.name?.trim() || (userRole === 'worker' ? 'Artisan Partner' : 'SAHYOG Customer'),
        phone: cleanPhone,
        email: dto.email?.trim() || undefined,
        role: userRole,
        verificationStatus: 'VERIFIED',
        createdAt: new Date().toISOString(),
        city: dto.locality?.trim() || 'Noida',
        zone: dto.locality?.trim() || 'Noida Sector 62',
        profession: dto.profession || (userRole === 'worker' ? 'Electrician' : undefined),
        cooperativeBranch: dto.cooperativeBranch || (userRole === 'worker' ? 'Noida District Artisan Federation' : undefined),
        experienceYears: dto.experienceYears || (userRole === 'worker' ? 5 : undefined),
      };

      const session: AuthSession = {
        isAuthenticated: true,
        role: userRole,
        user: authUser,
        token: `sahyog_demo_token_${cleanPhone}`,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };

      // Persist auth session & current user
      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
      storageService.setItem(STORAGE_KEYS.CURRENT_USER, {
        id: authUser.id,
        name: authUser.name,
        phone: authUser.phone,
        email: authUser.email,
        role: authUser.role,
        address: authUser.address || '',
        city: authUser.city || 'Noida',
        profileImage: authUser.avatar,
        createdAt: authUser.createdAt,
      });

      // Best effort profile creation if Supabase DB is active
      if (isSupabaseConfigured()) {
        try {
          await this.fetchOrCreateProfile(authUserId, {
            role: userRole,
            name: authUser.name,
            phone: formattedPhone,
            email: authUser.email,
            city: authUser.city,
          });

          if (userRole === 'worker') {
            await this.ensureWorkerProfile(authUserId, {
              name: authUser.name,
              phone: formattedPhone,
              professions: dto.profession ? [dto.profession] : ['Electrician'],
              skills: dto.skills || (dto.profession ? [dto.profession] : ['General Repairs']),
              experienceYears: dto.experienceYears || 5,
              cooperativeName: dto.cooperativeBranch || 'Noida District Artisan Federation',
              zone: dto.locality || 'Noida Sector 62',
              availability: dto.availability || 'AVAILABLE',
            });
          }
        } catch (dbErr) {
          console.warn('Demo profile DB sync note:', dbErr);
        }
      }

      return { success: true, session, user: authUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'OTP verification failed.' };
    }
  }

  /**
   * Admin Email/Password Login via Supabase Auth
   */
  public async loginAdmin(dto: AdminLoginDto): Promise<AuthResponse> {
    const email = dto.identifier.trim().toLowerCase();
    const password = dto.password;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication Error: Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid administrator credentials.' };
      }

      // Verify role in public.profiles
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (pError || !profile || (profile.role !== 'admin' && profile.role !== 'cooperative')) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: User account is not authorized as a Cooperative Federation Admin.',
        };
      }

      const authUser: AuthUser = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || undefined,
        role: 'admin',
        verificationStatus: 'VERIFIED',
        createdAt: profile.created_at,
        zone: profile.city || 'Central Hub',
      };

      const session: AuthSession = {
        isAuthenticated: true,
        role: 'admin',
        user: authUser,
        token: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at ? data.session.expires_at * 1000 : Date.now() + SESSION_DURATION_MS,
      };

      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
      return { success: true, session, user: authUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Admin authentication failed.' };
    }
  }

  /**
   * Helper: Fetch or create profile in Supabase public.profiles
   */
  public async fetchOrCreateProfile(
    userId: string,
    initial: { role: Role; name: string; phone: string; email?: string; city?: string; address?: string }
  ): Promise<any> {
    if (!isSupabaseConfigured()) return initial;

    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    const newProfile = {
      id: userId,
      role: initial.role,
      name: initial.name,
      phone: initial.phone,
      email: initial.email || null,
      city: initial.city || 'Noida',
      address: initial.address || '',
    };

    const { data: created, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.warn('Profile insert note:', error.message);
      return newProfile;
    }

    return created || newProfile;
  }

  /**
   * Helper: Ensure worker record exists in public.workers
   */
  public async ensureWorkerProfile(
    userId: string,
    workerData: {
      name: string;
      phone: string;
      professions: string[];
      skills?: string[];
      experienceYears: number;
      cooperativeName: string;
      zone?: string;
      availability?: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
    }
  ): Promise<any> {
    if (!isSupabaseConfigured()) return null;

    const { data: existing } = await supabase
      .from('workers')
      .select('*')
      .or(`profile_id.eq.${userId},phone.eq.${workerData.phone}`)
      .maybeSingle();

    if (existing) {
      const updates: any = {};
      if (!existing.profile_id) updates.profile_id = userId;
      if (workerData.professions && workerData.professions.length > 0) {
        updates.trade = workerData.professions[0];
        updates.professions = workerData.professions;
      }
      if (workerData.skills && workerData.skills.length > 0) {
        updates.skills = workerData.skills;
      }
      if (workerData.experienceYears) updates.experience_years = workerData.experienceYears;
      if (workerData.cooperativeName) updates.cooperative_branch = workerData.cooperativeName;
      if (workerData.zone) updates.zone = workerData.zone;
      if (workerData.availability) updates.availability = workerData.availability;

      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('workers')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .maybeSingle();
        return updated || existing;
      }
      return existing;
    }

    const { data: created } = await supabase
      .from('workers')
      .insert([
        {
          profile_id: userId,
          name: workerData.name,
          phone: workerData.phone,
          trade: workerData.professions[0] || 'Electrician',
          professions: workerData.professions,
          skills: workerData.skills || workerData.professions,
          experience_years: workerData.experienceYears,
          experience_level: 'Intermediate',
          cooperative_branch: workerData.cooperativeName,
          zone: workerData.zone || 'Noida Sector 62',
          verification_status: 'VERIFIED',
          availability: workerData.availability || 'AVAILABLE',
        },
      ])
      .select()
      .maybeSingle();

    return created;
  }

  /**
   * End session
   */
  public async logout(_token?: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  /**
   * Get active session from storage or Supabase
   */
  public getCurrentSession(): AuthSession | null {
    const session = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (!session || !session.isAuthenticated) return null;

    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }

    return session;
  }

  // Backwards compatibility wrappers
  public async loginCustomer(dto: CustomerLoginDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.identifier });
  }

  public async registerCustomer(dto: CustomerRegisterDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.phone });
  }

  public async loginWorker(dto: WorkerLoginDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.identifier });
  }

  public async registerWorker(dto: WorkerRegisterDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.phone });
  }

  public async refreshSession(_refreshToken: string): Promise<AuthResponse> {
    const session = this.getCurrentSession();
    if (!session) return { success: false, error: 'No active session' };
    return { success: true, session, user: session.user };
  }
}

export const authApi = new AuthApiClient();
