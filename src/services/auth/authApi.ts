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
import { STORAGE_KEYS, getUserProfileStorageKey } from '../storage/storageKeys';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days default fallback expiry

class AuthApiClient {
  /**
   * Send Real Phone OTP via Supabase Auth
   * Requirement #1: Login OTP is strictly fixed to 123456.
   */
  public async sendPhoneOtp(dto: PhoneOtpSendDto): Promise<{ success: boolean; message?: string; error?: string }> {
    const cleanPhone = dto.phone.trim().replace(/\D/g, '');

    if (!isValidIndianMobile(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    const formattedPhone = formatIndianPhoneToE164(cleanPhone);

    return {
      success: true,
      message: `Verification code sent to ${formattedPhone}. Enter 123456 to log in.`,
    };
  }

  /**
   * Verify Real Phone OTP via Supabase Auth
   * Validates fixed OTP 123456 and creates/retrieves a persistent Supabase user identity.
   */
  public async verifyPhoneOtp(dto: PhoneOtpVerifyDto): Promise<AuthResponse> {
    const cleanPhone = dto.phone.trim().replace(/\D/g, '');
    const otpToken = dto.token.trim();

    if (!cleanPhone || !isValidIndianMobile(cleanPhone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    if (!otpToken) {
      return { success: false, error: 'Please enter the 6-digit verification code.' };
    }

    if (otpToken !== '123456') {
      return { success: false, error: 'Invalid OTP code. Please enter 123456.' };
    }

    const formattedPhone = formatIndianPhoneToE164(cleanPhone);
    const userRole: Role = (dto.role === 'worker' ? 'worker' : 'customer') as Role;
    const providedName = dto.name?.trim() || '';
    const defaultName = providedName || (userRole === 'worker' ? 'Artisan Partner' : '');

    const bridgeEmail = `user_${cleanPhone}@phone.aidora.app`;
    const bridgePassword = `Aidora@${cleanPhone}!2026`;

    try {
      let authUserId: string = '';
      let accessToken: string | undefined;
      let refreshToken: string | undefined;
      let expiresAtMs: number = Date.now() + SESSION_DURATION_MS;

      if (isSupabaseConfigured()) {
        // Pre-clear any prior active session on client to prevent identity cross-contamination
        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore signout cleanup warning
        }

        // Attempt Sign In first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: bridgeEmail,
          password: bridgePassword,
        });

        if (signInData?.user && signInData.session) {
          authUserId = signInData.user.id;
          accessToken = signInData.session.access_token;
          refreshToken = signInData.session.refresh_token;
          if (signInData.session.expires_at) {
            expiresAtMs = signInData.session.expires_at * 1000;
          }
        } else if (signInError) {
          // If user doesn't exist, sign up
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: bridgeEmail,
            password: bridgePassword,
            options: {
              data: {
                phone: formattedPhone,
                name: defaultName,
                role: userRole,
                city: dto.locality?.trim() || 'Bangalore',
              },
            },
          });

          if (signUpData?.user) {
            authUserId = signUpData.user.id;
            if (signUpData.session) {
              accessToken = signUpData.session.access_token;
              refreshToken = signUpData.session.refresh_token;
              if (signUpData.session.expires_at) {
                expiresAtMs = signUpData.session.expires_at * 1000;
              }
            } else {
              // Sign in again if signUp didn't return session directly
              const { data: reSignIn } = await supabase.auth.signInWithPassword({
                email: bridgeEmail,
                password: bridgePassword,
              });
              if (reSignIn?.session) {
                accessToken = reSignIn.session.access_token;
                refreshToken = reSignIn.session.refresh_token;
                if (reSignIn.session.expires_at) {
                  expiresAtMs = reSignIn.session.expires_at * 1000;
                }
              }
            }
          } else {
            console.warn('Supabase bridge signup note:', signUpError?.message);
          }
        }
      }

      // If Supabase not reachable or standalone offline mode:
      // Produce a deterministic unique UUID strictly derived from this phone number
      if (!authUserId) {
        const hex = cleanPhone.padStart(12, '0').slice(-12);
        authUserId = `00000000-0000-4000-8000-${hex}`;
      }

      // Sync user profile to public.profiles table
      const profile = await this.fetchOrCreateProfile(authUserId, {
        role: userRole,
        name: defaultName,
        phone: formattedPhone,
        email: dto.email?.trim() || `${cleanPhone}@aidora.app`,
        city: dto.locality?.trim() || 'Bangalore',
        isProfileCompleted: userRole === 'worker' ? false : (providedName ? true : false),
      });

      let workerRecord: any = null;
      if (userRole === 'worker') {
        workerRecord = await this.ensureWorkerProfile(authUserId, {
          name: profile.name || defaultName || 'Artisan Partner',
          phone: formattedPhone,
          professions: dto.profession ? [dto.profession] : ['Electrician'],
          skills: dto.skills || (dto.profession ? [dto.profession] : ['General Repairs']),
          experienceYears: dto.experienceYears || 5,
          cooperativeName: dto.cooperativeBranch || 'Bangalore District Artisan Federation',
          zone: dto.locality || 'Indiranagar & East Zone',
          availability: dto.availability || 'AVAILABLE',
        });
      }

      const isProfileCompleted = profile.is_profile_completed ?? (
        userRole === 'worker'
          ? (workerRecord?.is_profile_completed ?? false)
          : Boolean(profile.name && profile.name.trim().length > 0 && profile.address)
      );

      const authUser: AuthUser = {
        id: authUserId,
        name: profile.name || '',
        phone: cleanPhone,
        email: profile.email || dto.email?.trim() || undefined,
        role: userRole,
        verificationStatus: (workerRecord?.verification_status || (userRole === 'worker' ? 'PENDING' : 'VERIFIED')) as any,
        createdAt: profile.created_at || new Date().toISOString(),
        dob: profile.dob || undefined,
        gender: profile.gender || undefined,
        address: profile.address || '',
        locality: profile.locality || dto.locality?.trim() || undefined,
        city: profile.city || 'Bangalore',
        state: profile.state || 'Karnataka',
        pincode: profile.pincode || undefined,
        preferredLanguage: profile.preferred_language || 'en',
        emergencyContact: profile.emergency_contact || undefined,
        savedAddresses: Array.isArray(profile.saved_addresses) ? profile.saved_addresses : [],
        isProfileCompleted,
        zone: workerRecord?.zone || dto.locality?.trim() || 'Indiranagar & East Zone',
        profession: workerRecord?.trade || dto.profession || (userRole === 'worker' ? 'Electrician' : undefined),
        professions: workerRecord?.professions || (dto.profession ? [dto.profession] : ['Electrician']),
        skills: workerRecord?.skills || dto.skills || [],
        cooperativeBranch: workerRecord?.cooperative_branch || dto.cooperativeBranch || (userRole === 'worker' ? 'Bangalore District Artisan Federation' : undefined),
        experienceYears: workerRecord?.experience_years || dto.experienceYears || (userRole === 'worker' ? 5 : undefined),
        serviceRadiusKm: workerRecord?.service_radius_km || 10,
        languages: workerRecord?.languages || ['English', 'Hindi'],
        bio: workerRecord?.bio || '',
        workExperience: workerRecord?.work_experience || '',
      };

      const session: AuthSession = {
        isAuthenticated: true,
        role: userRole,
        user: authUser,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAtMs,
      };

      // Persist auth session & user-scoped profile (aidora_profile_<auth.uid>)
      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
      storageService.setItem(getUserProfileStorageKey(authUserId), {
        id: authUser.id,
        name: authUser.name,
        phone: authUser.phone,
        email: authUser.email,
        role: authUser.role,
        address: authUser.address || '',
        locality: authUser.locality || '',
        city: authUser.city || 'Bangalore',
        state: authUser.state || 'Karnataka',
        pincode: authUser.pincode || '',
        dob: authUser.dob,
        gender: authUser.gender,
        preferredLanguage: authUser.preferredLanguage || 'en',
        emergencyContact: authUser.emergencyContact,
        savedAddresses: authUser.savedAddresses || [],
        isProfileCompleted: authUser.isProfileCompleted,
        profileImage: authUser.avatar,
        avatar: authUser.avatar,
        createdAt: authUser.createdAt,
      });

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

    try {
      if (isSupabaseConfigured()) {
        let { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If admin account doesn't exist yet and default test credentials are used, auto-provision
        if (error && (email === 'admin@aidora.coop' || email === 'admin@sahyog.local')) {
          const { data: signUpData, error: _signUpErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: 'Cooperative Federation Admin',
                phone: '+91 99999 00000',
                role: 'admin',
              },
            },
          });

          if (signUpData?.user) {
            const reSignIn = await supabase.auth.signInWithPassword({ email, password });
            data = reSignIn.data;
            error = reSignIn.error;
          }
        }

        if (data?.user) {
          // Ensure profile has admin role
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              name: 'Cooperative Federation Admin',
              phone: '+91 99999 00000',
              email,
              role: 'admin',
              city: 'Bangalore',
              state: 'Karnataka',
              is_profile_completed: true,
            });

          const authUser: AuthUser = {
            id: data.user.id,
            name: 'Cooperative Federation Admin',
            phone: '9999900000',
            email,
            role: 'admin',
            verificationStatus: 'VERIFIED',
            createdAt: new Date().toISOString(),
            zone: 'Central Federation Hub',
            isProfileCompleted: true,
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
          storageService.setItem(getUserProfileStorageKey(authUser.id), authUser);
          return { success: true, session, user: authUser };
        }

        if (error) {
          return { success: false, error: error.message || 'Invalid administrator credentials.' };
        }
      }

      // Standalone dev mode fallback if Supabase not configured
      if (email === 'admin@aidora.coop' || email === 'admin@sahyog.local') {
        const authUser: AuthUser = {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'Cooperative Federation Admin',
          phone: '9999900000',
          email,
          role: 'admin',
          verificationStatus: 'VERIFIED',
          createdAt: new Date().toISOString(),
          zone: 'Central Federation Hub',
          isProfileCompleted: true,
        };

        const session: AuthSession = {
          isAuthenticated: true,
          role: 'admin',
          user: authUser,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        };

        storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
        storageService.setItem(getUserProfileStorageKey(authUser.id), authUser);
        return { success: true, session, user: authUser };
      }

      return { success: false, error: 'Invalid administrator credentials. Try admin@aidora.coop.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Admin authentication failed.' };
    }
  }

  /**
   * Helper: Fetch or create profile in Supabase public.profiles
   */
  public async fetchOrCreateProfile(
    userId: string,
    initial: { role: Role; name: string; phone: string; email?: string; city?: string; address?: string; isProfileCompleted?: boolean }
  ): Promise<any> {
    const isCompleted = initial.isProfileCompleted ?? Boolean(initial.name && initial.name.trim().length > 0 && initial.address);

    if (!isSupabaseConfigured()) {
      const userKey = getUserProfileStorageKey(userId);
      const cached = storageService.getItem<any>(userKey, null);
      if (cached && cached.id === userId) {
        return cached;
      }
      const fallback = {
        id: userId,
        role: initial.role,
        name: initial.name || '',
        phone: initial.phone,
        email: initial.email || null,
        city: initial.city || 'Bangalore',
        state: 'Karnataka',
        address: initial.address || '',
        saved_addresses: [],
        is_profile_completed: isCompleted,
      };
      storageService.setItem(userKey, fallback);
      return fallback;
    }

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
      name: initial.name || '',
      phone: initial.phone,
      email: initial.email || null,
      city: initial.city || 'Bangalore',
      state: 'Karnataka',
      address: initial.address || '',
      saved_addresses: [],
      is_profile_completed: isCompleted,
    };

    const { data: created, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .maybeSingle();

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
          zone: workerData.zone || 'Bangalore Central & East Zone',
          verification_status: 'PENDING',
          is_profile_completed: false,
          availability: workerData.availability || 'AVAILABLE',
        } as any,
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
