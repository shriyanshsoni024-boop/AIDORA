import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { User, Role, ApiResponse } from '../../types';
import { STORAGE_KEYS, getUserProfileStorageKey } from '../storage/storageKeys';
import { storageService } from '../storage/storageService';
import { Database } from '../../types/database';
import { AuthSession } from '../../types/auth';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export class SupabaseAuthService {
  /**
   * Get the currently logged-in user profile from Supabase (or user-scoped storage fallback)
   */
  public async getCurrentUser(): Promise<ApiResponse<User | null>> {
    let userId: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!sessionError && session?.user?.id) {
          userId = session.user.id;
        }
      } catch (err) {
        console.warn('SupabaseAuthService getSession exception:', err);
      }
    }

    if (!userId) {
      const cached = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
      if (cached?.isAuthenticated && cached.user?.id) {
        userId = cached.user.id;
      }
    }

    if (!userId) {
      return { success: true, data: null };
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data && !profileError) {
          const profile = data as unknown as ProfileRow;
          const user: User = {
            id: profile.id,
            name: profile.name,
            phone: profile.phone,
            email: profile.email || undefined,
            role: profile.role as Role,
            address: profile.address,
            city: profile.city,
            profileImage: profile.avatar_url || undefined,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
          };
          storageService.setItem(getUserProfileStorageKey(userId), user);
          return { success: true, data: user };
        }
      } catch (err: unknown) {
        console.warn('Supabase profile fetch error:', err);
      }
    }

    const cachedUser = storageService.getItem<User | null>(getUserProfileStorageKey(userId), null);
    return { success: true, data: cachedUser };
  }

  /**
   * Sign out the current session
   */
  public async signOut(): Promise<ApiResponse<void>> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err: unknown) {
        console.warn('Supabase signOut error:', err);
      }
    }

    storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
    return { success: true };
  }
}

export const supabaseAuthService = new SupabaseAuthService();

