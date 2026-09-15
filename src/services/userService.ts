import { User, Review, ApiResponse, SavedAddress } from '../types';
import { STORAGE_KEYS, getUserProfileStorageKey } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_REVIEWS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database';
import { AuthSession } from '../types/auth';

type ProfileRow = Database['public']['Tables']['profiles']['Row'] & {
  dob?: string | null;
  gender?: string | null;
  locality?: string | null;
  state?: string | null;
  pincode?: string | null;
  preferred_language?: string | null;
  emergency_contact?: string | null;
  saved_addresses?: SavedAddress[] | null;
  is_profile_completed?: boolean | null;
};
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

const createEmptyUserForId = (userId: string, phone: string = ''): User => ({
  id: userId,
  name: '',
  phone: phone,
  email: '',
  role: 'customer',
  address: '',
  locality: '',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '',
  preferredLanguage: 'en',
  savedAddresses: [],
  isProfileCompleted: false,
  profileImage: '',
  createdAt: new Date().toISOString(),
});

const mapProfileToUser = (row: ProfileRow): User => {
  const roleVal = row.role === 'cooperative' ? 'admin' : (row.role as User['role']);
  return {
    id: row.id,
    name: row.name || '',
    phone: row.phone || '',
    email: row.email || undefined,
    role: roleVal,
    address: row.address || '',
    locality: row.locality || undefined,
    city: row.city || 'Bangalore',
    state: row.state || 'Karnataka',
    pincode: row.pincode || undefined,
    dob: row.dob || undefined,
    gender: row.gender || undefined,
    preferredLanguage: row.preferred_language || 'en',
    emergencyContact: row.emergency_contact || undefined,
    savedAddresses: Array.isArray(row.saved_addresses) ? row.saved_addresses : [],
    isProfileCompleted: row.is_profile_completed ?? false,
    profileImage: row.avatar_url || undefined,
    avatar: row.avatar_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class UserService {
  /**
   * Resolve currently active user ID from Supabase session or cached auth session
   */
  private async resolveActiveUserId(explicitId?: string): Promise<{ userId: string | null; phone: string }> {
    if (explicitId) return { userId: explicitId, phone: '' };

    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          return { userId: session.user.id, phone: session.user.phone || '' };
        }
      } catch (err) {
        console.warn('UserService: Failed to get active session from Supabase:', err);
      }
    }

    const cachedSession = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (cachedSession?.isAuthenticated && cachedSession?.user?.id) {
      return { userId: cachedSession.user.id, phone: cachedSession.user.phone || '' };
    }

    return { userId: null, phone: '' };
  }

  /**
   * Get authenticated user profile from Supabase (or user-scoped cached local storage)
   */
  public async getCurrentUser(targetUserId?: string): Promise<ApiResponse<User>> {
    const { userId, phone } = await this.resolveActiveUserId(targetUserId);

    if (!userId) {
      return { success: false, error: 'No authenticated user session found.' };
    }

    const userStorageKey = getUserProfileStorageKey(userId);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data && !error) {
          const user = mapProfileToUser(data as unknown as ProfileRow);
          storageService.setItem(userStorageKey, user);
          return { success: true, data: user };
        }
      } catch (err: unknown) {
        console.warn(`UserService: Supabase getCurrentUser failed for ${userId}:`, err);
      }
    }

    try {
      const cached = storageService.getItem<User | null>(userStorageKey, null);
      if (cached && cached.id === userId) {
        return { success: true, data: cached };
      }

      // Return a clean, isolated profile for this specific user ID
      const newUser = createEmptyUserForId(userId, phone);
      storageService.setItem(userStorageKey, newUser);
      return { success: true, data: newUser };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve current user' };
    }
  }

  /**
   * Update user profile data in Supabase & user-scoped local cache
   */
  public async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const { userId, phone } = await this.resolveActiveUserId(updates.id);

    if (!userId) {
      return { success: false, error: 'Cannot update profile without an active user ID.' };
    }

    const userStorageKey = getUserProfileStorageKey(userId);

    if (isSupabaseConfigured()) {
      try {
        const dbUpdates: Record<string, any> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.locality !== undefined) dbUpdates.locality = updates.locality;
        if (updates.city !== undefined) dbUpdates.city = updates.city;
        if (updates.state !== undefined) dbUpdates.state = updates.state;
        if (updates.pincode !== undefined) dbUpdates.pincode = updates.pincode;
        if (updates.dob !== undefined) dbUpdates.dob = updates.dob;
        if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
        if (updates.preferredLanguage !== undefined) dbUpdates.preferred_language = updates.preferredLanguage;
        if (updates.emergencyContact !== undefined) dbUpdates.emergency_contact = updates.emergencyContact;
        if (updates.savedAddresses !== undefined) dbUpdates.saved_addresses = updates.savedAddresses;
        if (updates.isProfileCompleted !== undefined) dbUpdates.is_profile_completed = updates.isProfileCompleted;
        if (updates.profileImage !== undefined) dbUpdates.avatar_url = updates.profileImage;
        if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

        const { data, error } = await supabase
          .from('profiles')
          .update(dbUpdates as any)
          .eq('id', userId)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('Supabase updateUserProfile error:', error.message);
        } else if (data) {
          const updated = mapProfileToUser(data as unknown as ProfileRow);
          storageService.setItem(userStorageKey, updated);
          this.syncAuthSessionUser(updated);
          return { success: true, data: updated, message: 'User profile updated successfully.' };
        }
      } catch (err: unknown) {
        console.warn('Supabase updateUserProfile exception:', err);
      }
    }

    try {
      const current = storageService.getItem<User>(userStorageKey, createEmptyUserForId(userId, phone));
      const updated: User = {
        ...current,
        ...updates,
        id: userId,
        updatedAt: new Date().toISOString(),
      };
      storageService.setItem(userStorageKey, updated);
      this.syncAuthSessionUser(updated);
      return { success: true, data: updated, message: 'User profile updated successfully.' };
    } catch (err) {
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  /**
   * Helper: Synchronize user updates into active AuthSession in local storage
   */
  private syncAuthSessionUser(updatedUser: User): void {
    const session = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (session?.user && session.user.id === updatedUser.id) {
      const authUser = {
        ...session.user,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        address: updatedUser.address,
        locality: updatedUser.locality,
        city: updatedUser.city,
        state: updatedUser.state,
        pincode: updatedUser.pincode,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        preferredLanguage: updatedUser.preferredLanguage,
        emergencyContact: updatedUser.emergencyContact,
        savedAddresses: updatedUser.savedAddresses,
        isProfileCompleted: updatedUser.isProfileCompleted,
        avatar: updatedUser.profileImage || updatedUser.avatar,
        profileImage: updatedUser.profileImage || updatedUser.avatar,
      };
      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, { ...session, user: authUser });
    }
  }

  /**
   * Save a new address to the user's profile
   */
  public async addSavedAddress(newAddr: Omit<SavedAddress, 'id'>, userId?: string): Promise<ApiResponse<SavedAddress[]>> {
    const userRes = await this.getCurrentUser(userId);
    if (!userRes.success || !userRes.data) {
      return { success: false, error: 'User not found' };
    }

    const currentUser = userRes.data;
    const targetId = currentUser.id;

    const addressItem: SavedAddress = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: newAddr.isDefault ?? ((currentUser.savedAddresses?.length || 0) === 0),
    };

    let updatedAddresses = [...(currentUser.savedAddresses || [])];
    if (addressItem.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(addressItem);

    const updateRes = await this.updateUserProfile({
      id: targetId,
      savedAddresses: updatedAddresses,
      address: addressItem.isDefault ? addressItem.fullAddress : currentUser.address,
      locality: addressItem.isDefault ? addressItem.locality : currentUser.locality,
      city: addressItem.isDefault ? addressItem.city : currentUser.city,
      state: addressItem.isDefault ? addressItem.state : currentUser.state,
      pincode: addressItem.isDefault ? addressItem.pincode : currentUser.pincode,
    });

    if (updateRes.success) {
      return { success: true, data: updatedAddresses, message: 'Address saved successfully.' };
    }
    return { success: false, error: 'Failed to save address' };
  }

  /**
   * Update an existing saved address
   */
  public async updateSavedAddress(updatedAddr: SavedAddress, userId?: string): Promise<ApiResponse<SavedAddress[]>> {
    const userRes = await this.getCurrentUser(userId);
    if (!userRes.success || !userRes.data) {
      return { success: false, error: 'User not found' };
    }

    const currentUser = userRes.data;
    const targetId = currentUser.id;

    let updatedList = (currentUser.savedAddresses || []).map((addr) => {
      if (addr.id === updatedAddr.id) {
        return updatedAddr;
      }
      if (updatedAddr.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    const updateRes = await this.updateUserProfile({
      id: targetId,
      savedAddresses: updatedList,
      address: updatedAddr.isDefault ? updatedAddr.fullAddress : currentUser.address,
      locality: updatedAddr.isDefault ? updatedAddr.locality : currentUser.locality,
    });

    if (updateRes.success) {
      return { success: true, data: updatedList, message: 'Address updated.' };
    }
    return { success: false, error: 'Failed to update address' };
  }

  /**
   * Delete a saved address
   */
  public async deleteSavedAddress(addressId: string, userId?: string): Promise<ApiResponse<SavedAddress[]>> {
    const userRes = await this.getCurrentUser(userId);
    if (!userRes.success || !userRes.data) {
      return { success: false, error: 'User not found' };
    }

    const currentUser = userRes.data;
    const targetId = currentUser.id;

    const filtered = (currentUser.savedAddresses || []).filter((addr) => addr.id !== addressId);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }

    const updateRes = await this.updateUserProfile({
      id: targetId,
      savedAddresses: filtered,
    });

    if (updateRes.success) {
      return { success: true, data: filtered, message: 'Address deleted.' };
    }
    return { success: false, error: 'Failed to delete address' };
  }

  /**
   * Set an address as default
   */
  public async setDefaultSavedAddress(addressId: string, userId?: string): Promise<ApiResponse<SavedAddress[]>> {
    const userRes = await this.getCurrentUser(userId);
    if (!userRes.success || !userRes.data) {
      return { success: false, error: 'User not found' };
    }

    const currentUser = userRes.data;
    const targetId = currentUser.id;

    let selectedAddr: SavedAddress | undefined;
    const updatedList = (currentUser.savedAddresses || []).map((addr) => {
      const isMatch = addr.id === addressId;
      if (isMatch) selectedAddr = addr;
      return { ...addr, isDefault: isMatch };
    });

    const updateRes = await this.updateUserProfile({
      id: targetId,
      savedAddresses: updatedList,
      address: selectedAddr?.fullAddress || currentUser.address,
      locality: selectedAddr?.locality || currentUser.locality,
      city: selectedAddr?.city || currentUser.city,
      state: selectedAddr?.state || currentUser.state,
      pincode: selectedAddr?.pincode || currentUser.pincode,
    });

    if (updateRes.success) {
      return { success: true, data: updatedList, message: 'Default address updated.' };
    }
    return { success: false, error: 'Failed to set default address' };
  }

  /**
   * Get marketplace reviews from Supabase
   */
  public async getReviews(): Promise<ApiResponse<Review[]>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const reviews: Review[] = (data as unknown as ReviewRow[]).map((row) => ({
            id: row.id,
            authorName: row.author_name,
            rating: Number(row.rating),
            comment: row.comment,
            serviceName: row.service_name,
            date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          }));
          storageService.setItem(STORAGE_KEYS.REVIEWS, reviews);
          return { success: true, data: reviews };
        }
      } catch (err: unknown) {
        console.warn('Supabase getReviews failed, using local cache:', err);
      }
    }

    try {
      const reviews = storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
      return { success: true, data: reviews };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve reviews' };
    }
  }
}

export const userService = new UserService();

