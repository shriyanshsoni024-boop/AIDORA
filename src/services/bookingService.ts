import { Booking, BookingStatus, CreateBookingDto, ApiResponse, Review, Worker } from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database';
import { mapRowToWorker } from './workerService';

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingStatusHistoryRow = Database['public']['Tables']['booking_status_history']['Row'];
type WorkerRow = Database['public']['Tables']['workers']['Row'];

// Allowed state transitions according to SAHYOG System Architecture (docs/ARCHITECTURE.md Section 14)
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ['MATCHED', 'ACCEPTED', 'CANCELLED'],
  MATCHED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['ON_THE_WAY', 'CANCELLED'],
  ON_THE_WAY: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const mapRowToBooking = (
  row: BookingRow,
  historyRows: BookingStatusHistoryRow[] = [],
  workerData?: Worker
): Booking => {
  const statusHistory =
    historyRows.length > 0
      ? historyRows.map((h) => ({
          status: h.status,
          timestamp: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: h.note || undefined,
        }))
      : [
          {
            status: row.status,
            timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: `Booking ${row.status.toLowerCase()}`,
          },
        ];

  return {
    id: row.id,
    token: row.token,
    customerId: row.customer_id || 'cust-1',
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    serviceId: row.service_id || 'electrician',
    serviceName: row.service_name,
    serviceCategory: row.service_category,
    description: row.description || '',
    imageUrl: row.image_url || undefined,
    address: row.address,
    city: row.city,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    urgency: row.urgency,
    tier: row.tier,
    estimatedPrice: row.estimated_price,
    connectionFee: row.connection_fee,
    totalPrice: row.total_price,
    worker: workerData,
    status: row.status,
    statusHistory,
    customerRating: row.customer_rating ? Number(row.customer_rating) : undefined,
    customerReview: row.customer_review || undefined,
    workerRating: row.worker_rating ? Number(row.worker_rating) : undefined,
    workerReview: row.worker_review || undefined,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
    otp: row.otp,
  };
};

class BookingService {
  /**
   * Fetch all bookings from Supabase (with fallback to local storage)
   */
  public async getBookings(): Promise<ApiResponse<Booking[]>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const bookingRows = data as unknown as BookingRow[];
          const bookingIds = bookingRows.map((b) => b.id);
          const workerIds = Array.from(new Set(bookingRows.map((b) => b.worker_id).filter(Boolean))) as string[];

          // Fetch status history and worker records concurrently
          const [historyRes, workersRes] = await Promise.all([
            supabase
              .from('booking_status_history')
              .select('*')
              .in('booking_id', bookingIds)
              .order('timestamp', { ascending: true }),
            workerIds.length > 0
              ? supabase.from('workers').select('*').in('id', workerIds)
              : Promise.resolve({ data: [] }),
          ]);

          const historyByBooking: Record<string, BookingStatusHistoryRow[]> = {};
          if (historyRes.data) {
            (historyRes.data as unknown as BookingStatusHistoryRow[]).forEach((h) => {
              if (!historyByBooking[h.booking_id]) historyByBooking[h.booking_id] = [];
              historyByBooking[h.booking_id].push(h);
            });
          }

          const workerById: Record<string, Worker> = {};
          if (workersRes.data) {
            (workersRes.data as unknown as WorkerRow[]).forEach((w) => {
              workerById[w.id] = mapRowToWorker(w);
            });
          }

          const localCached = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

          const bookings: Booking[] = bookingRows.map((row) => {
            const hist = historyByBooking[row.id] || [];
            let w = row.worker_id ? workerById[row.worker_id] : undefined;
            if (!w) {
              const matchedLocal = localCached.find((b) => b.id === row.id || b.token === row.token);
              if (matchedLocal?.worker) w = matchedLocal.worker;
            }
            return mapRowToBooking(row, hist, w);
          });

          storageService.setItem(STORAGE_KEYS.BOOKINGS, bookings);
          return {
            success: true,
            data: bookings,
            message: `Retrieved ${bookings.length} bookings from Supabase.`,
          };
        }
      } catch (err: unknown) {
        console.warn('Supabase getBookings failed, falling back to local cache:', err);
      }
    }

    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      return {
        success: true,
        data: bookings,
        message: `Retrieved ${bookings.length} bookings successfully.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve bookings',
      };
    }
  }

  /**
   * Fetch single booking by ID or Token from Supabase
   */
  public async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    if (!bookingId) {
      return { success: false, error: 'Booking ID is required' };
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: bookingData, error: bErr } = await supabase
          .from('bookings')
          .select('*')
          .or(`id.eq.${bookingId},token.eq.${bookingId}`)
          .maybeSingle();

        if (!bErr && bookingData) {
          const row = bookingData as unknown as BookingRow;

          const [histRes, workerRes] = await Promise.all([
            supabase
              .from('booking_status_history')
              .select('*')
              .eq('booking_id', row.id)
              .order('timestamp', { ascending: true }),
            row.worker_id
              ? supabase.from('workers').select('*').eq('id', row.worker_id).maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          const histRows = (histRes.data || []) as unknown as BookingStatusHistoryRow[];
          let worker: Worker | undefined;
          if (workerRes.data) {
            worker = mapRowToWorker(workerRes.data as unknown as WorkerRow);
          } else {
            const cached = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
            const match = cached.find((b) => b.id === row.id || b.token === row.token);
            if (match?.worker) worker = match.worker;
          }

          const booking = mapRowToBooking(row, histRows, worker);
          return { success: true, data: booking };
        }
      } catch (err: unknown) {
        console.warn('Supabase getBookingById error, falling back to local:', err);
      }
    }

    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const booking = bookings.find((b) => b.id === bookingId || b.token === bookingId);
      if (!booking) {
        return {
          success: false,
          error: `Booking with ID ${bookingId} not found.`,
        };
      }
      return { success: true, data: booking };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error fetching booking',
      };
    }
  }

  /**
   * Fetch bookings for a specific customer
   */
  public async getCustomerBookings(customerId: string): Promise<ApiResponse<Booking[]>> {
    const res = await this.getBookings();
    if (!res.success || !res.data) return res;
    const customerBookings = res.data.filter((b) => b.customerId === customerId || !b.customerId);
    return { success: true, data: customerBookings };
  }

  /**
   * Fetch bookings for a specific worker
   */
  public async getWorkerBookings(workerId: string): Promise<ApiResponse<Booking[]>> {
    const res = await this.getBookings();
    if (!res.success || !res.data) return res;
    const workerBookings = res.data.filter((b) => b.worker?.id === workerId);
    return { success: true, data: workerBookings };
  }

  /**
   * Create a new booking and persist it in Supabase
   */
  public async createBooking(dto: CreateBookingDto): Promise<ApiResponse<Booking>> {
    if (!dto.worker) {
      return { success: false, error: 'Worker must be selected for booking creation.' };
    }
    if (!dto.serviceCategory) {
      return { success: false, error: 'Service category is required.' };
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const token = `SYH-${randomNum}`;
    const bookingOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const base = dto.serviceCategory.basePrice || 299;
    const tierMultiplier = dto.tier === 'SMALL' ? 1 : dto.tier === 'MEDIUM' ? 1.8 : 2.8;
    const estimatedPrice = Math.round(base * tierMultiplier);
    const connectionFee = 25;
    const totalPrice = estimatedPrice + connectionFee;
    const workerPayout = estimatedPrice;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isSupabaseConfigured()) {
      try {
        // Resolve authenticated customer user ID if available
        let authCustomerId = dto.customerId;
        if (!authCustomerId || authCustomerId.startsWith('cust-demo')) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            authCustomerId = session.user.id;
          }
        }

        // Resolve worker UUID
        let targetWorkerId: string | null = dto.worker.id;
        if (targetWorkerId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWorkerId)) {
          // If worker ID is string like w-101, check if matching worker exists in DB
          const { data: dbWorker } = await supabase
            .from('workers')
            .select('id')
            .or(`name.eq.${dto.worker.name},phone.eq.${dto.worker.phone}`)
            .maybeSingle();

          targetWorkerId = dbWorker?.id || null;
        }

        const insertPayload: Database['public']['Tables']['bookings']['Insert'] = {
          token,
          customer_id: authCustomerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(authCustomerId) ? authCustomerId : null,
          customer_name: dto.customerName || 'Customer',
          customer_phone: dto.customerPhone || '',
          worker_id: targetWorkerId,
          service_id: dto.serviceCategory.id || 'electrician',
          service_name: dto.serviceCategory.name || 'Electrician',
          service_category: dto.serviceCategory.category || 'General',
          description: dto.problemDescription || `Requested ${dto.serviceCategory.name} (${dto.tier} Tier)`,
          image_url: dto.imageUrl || null,
          address: dto.address || 'Service Location',
          city: dto.city || 'Bangalore',
          scheduled_date: now.toISOString().split('T')[0],
          scheduled_time: dto.urgency === 'EMERGENCY' ? 'Immediate Priority (15-20 min)' : 'Today (Next Available)',
          urgency: dto.urgency,
          tier: dto.tier,
          estimated_price: estimatedPrice,
          connection_fee: connectionFee,
          total_price: totalPrice,
          worker_payout: workerPayout,
          status: 'REQUESTED',
          otp: bookingOtp,
          payment_status: dto.paymentStatus || 'PAID',
        };

        const { data, error } = await supabase
          .from('bookings')
          .insert(insertPayload)
          .select()
          .single();

        if (!error && data) {
          const row = data as unknown as BookingRow;
          const newBooking = mapRowToBooking(row, [], dto.worker);
          this.syncLocalBooking(newBooking);
          return {
            success: true,
            data: newBooking,
            message: `Booking ${token} created and persisted in Supabase.`,
          };
        } else if (error) {
          console.warn('Supabase booking insert error:', error.message);
        }
      } catch (err: unknown) {
        console.warn('Supabase createBooking failed, falling back to local:', err);
      }
    }

    try {
      const newBooking: Booking = {
        id: `b-${Date.now()}`,
        token,
        customerId: dto.customerId || 'cust-1',
        customerName: dto.customerName || 'Customer',
        customerPhone: dto.customerPhone || '',
        serviceId: dto.serviceCategory.id || 'electrician',
        serviceName: dto.serviceCategory.name || 'Electrician',
        serviceCategory: dto.serviceCategory.category || 'General',
        description: dto.problemDescription || `Requested ${dto.serviceCategory.name} (${dto.tier} Tier)`,
        imageUrl: dto.imageUrl,
        address: dto.address || 'Service Location',
        city: dto.city || 'Bangalore',
        scheduledDate: now.toISOString().split('T')[0],
        scheduledTime: dto.urgency === 'EMERGENCY' ? 'Immediate Priority (15-20 min)' : 'Today (Next Available)',
        urgency: dto.urgency,
        tier: dto.tier,
        estimatedPrice,
        connectionFee,
        totalPrice,
        worker: dto.worker,
        status: 'REQUESTED',
        otp: bookingOtp,
        statusHistory: [
          {
            status: 'REQUESTED',
            timestamp: timeString,
            note: `Booking request sent to ${dto.worker.name}`,
          },
        ],
        paymentStatus: dto.paymentStatus || 'PAID',
        createdAt: now.toISOString(),
      };

      this.syncLocalBooking(newBooking);

      return {
        success: true,
        data: newBooking,
        message: `Booking ${token} created successfully.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create booking',
      };
    }
  }

  private syncLocalBooking(booking: Booking): void {
    const existing = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const filtered = existing.filter((b) => b.id !== booking.id && b.token !== booking.token);
    storageService.setItem(STORAGE_KEYS.BOOKINGS, [booking, ...filtered]);
  }

  /**
   * Update booking status with state transition validation & persistence in Supabase
   */
  public async updateBookingStatus(
    bookingId: string,
    nextStatus: BookingStatus,
    note?: string
  ): Promise<ApiResponse<Booking>> {
    const currentRes = await this.getBookingById(bookingId);
    if (!currentRes.success || !currentRes.data) {
      return { success: false, error: `Booking ${bookingId} not found.` };
    }

    const current = currentRes.data;

    // Validate state transition if not idempotent
    if (current.status !== nextStatus) {
      const allowed = ALLOWED_TRANSITIONS[current.status] || [];
      if (!allowed.includes(nextStatus)) {
        return {
          success: false,
          error: `Invalid status transition from ${current.status} to ${nextStatus}. Allowed: ${allowed.join(', ') || 'None'}`,
        };
      }
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultNote =
      nextStatus === 'ACCEPTED' ? `${current.worker?.name || 'Worker'} accepted dispatch request` :
      nextStatus === 'ON_THE_WAY' ? `${current.worker?.name || 'Worker'} is on the way` :
      nextStatus === 'IN_PROGRESS' ? 'OTP verified. Service in progress' :
      nextStatus === 'COMPLETED' ? 'Service completed and verified' :
      nextStatus === 'CANCELLED' ? 'Booking declined/cancelled' :
      `Status updated to ${nextStatus}`;

    const updatedHistory = [
      ...current.statusHistory,
      {
        status: nextStatus,
        timestamp,
        note: note || defaultNote,
      },
    ];

    const updatedBooking: Booking = {
      ...current,
      status: nextStatus,
      statusHistory: updatedHistory,
      completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : current.completedAt,
    };

    if (isSupabaseConfigured()) {
      try {
        const updates: Partial<BookingRow> = {
          status: nextStatus,
          completed_at: nextStatus === 'COMPLETED' ? new Date().toISOString() : current.completedAt || null,
        };

        const { data, error } = await supabase
          .from('bookings')
          .update(updates as any)
          .or(`id.eq.${bookingId},token.eq.${bookingId}`)
          .select()
          .maybeSingle();

        if (!error && data) {
          this.syncLocalBooking(updatedBooking);
          return {
            success: true,
            data: updatedBooking,
            message: `Booking ${current.token} status updated to ${nextStatus} in Supabase.`,
          };
        }
      } catch (err: unknown) {
        console.warn('Supabase updateBookingStatus failed, updating local state:', err);
      }
    }

    this.syncLocalBooking(updatedBooking);
    return {
      success: true,
      data: updatedBooking,
      message: `Booking ${current.token} status updated to ${nextStatus}.`,
    };
  }

  /**
   * Advance booking status to the next logical stage
   */
  public async advanceBookingStatus(bookingId: string): Promise<ApiResponse<Booking>> {
    const res = await this.getBookingById(bookingId);
    if (!res.success || !res.data) {
      return { success: false, error: `Booking ${bookingId} not found` };
    }

    const target = res.data;
    let nextStatus: BookingStatus = target.status;
    if (target.status === 'REQUESTED' || target.status === 'MATCHED') nextStatus = 'ACCEPTED';
    else if (target.status === 'ACCEPTED') nextStatus = 'ON_THE_WAY';
    else if (target.status === 'ON_THE_WAY') nextStatus = 'IN_PROGRESS';
    else if (target.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';

    return this.updateBookingStatus(bookingId, nextStatus, `Status advanced to ${nextStatus}`);
  }

  /**
   * Submit customer review and rating for completed booking
   * Enforces:
   * 1. Booking must be COMPLETED
   * 2. Rating must be 1 to 5
   * 3. Duplicate review prevention on the same booking
   * 4. Accurate mathematical average rating recalculation
   */
  public async submitCustomerReview(
    bookingId: string,
    rating: number,
    reviewText: string
  ): Promise<ApiResponse<Booking>> {
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    }

    const res = await this.getBookingById(bookingId);
    if (!res.success || !res.data) {
      return { success: false, error: `Booking ${bookingId} not found.` };
    }

    const current = res.data;

    // Enforce booking status: Must be COMPLETED
    if (current.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'Reviews can only be submitted after the service has been completed.',
      };
    }

    const updatedBooking: Booking = {
      ...current,
      customerRating: rating,
      customerReview: reviewText,
    };

    if (isSupabaseConfigured()) {
      try {
        // 1. Update rating on booking row
        await supabase
          .from('bookings')
          .update({
            customer_rating: rating,
            customer_review: reviewText,
          })
          .or(`id.eq.${bookingId},token.eq.${bookingId}`);

        // 2. Resolve target worker ID
        let targetWorkerId = current.worker?.id;
        if (targetWorkerId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWorkerId)) {
          const { data: dbW } = await supabase
            .from('workers')
            .select('id')
            .or(`name.eq.${current.worker?.name}`)
            .maybeSingle();
          targetWorkerId = dbW?.id;
        }

        const validBookingUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(current.id)
          ? current.id
          : null;

        // Check for existing review to prevent duplicates
        let isFirstReview = true;
        if (validBookingUuid) {
          const { data: existingRev } = await supabase
            .from('reviews')
            .select('id')
            .eq('booking_id', validBookingUuid)
            .maybeSingle();

          if (existingRev) {
            isFirstReview = false;
            await supabase
              .from('reviews')
              .update({
                rating,
                comment: reviewText,
              })
              .eq('id', existingRev.id);
          } else {
            await supabase.from('reviews').insert({
              booking_id: validBookingUuid,
              worker_id: targetWorkerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWorkerId) ? targetWorkerId : null,
              author_name: current.customerName || 'Customer',
              rating,
              comment: reviewText,
              service_name: current.serviceName,
              chips: [],
            });
          }
        }

        // 3. Update worker average rating if worker exists (only increment review count on first review)
        if (targetWorkerId && isFirstReview) {
          const { data: workerData } = await supabase
            .from('workers')
            .select('rating, review_count')
            .eq('id', targetWorkerId)
            .maybeSingle();

          if (workerData) {
            const prevCount = workerData.review_count || 0;
            const prevRating = Number(workerData.rating) || 5.0;
            const newCount = prevCount + 1;
            const newAvg = Number(((prevRating * prevCount + rating) / newCount).toFixed(2));

            await supabase
              .from('workers')
              .update({
                rating: newAvg,
                review_count: newCount,
              })
              .eq('id', targetWorkerId);
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase submitCustomerReview error:', err);
      }
    }

    this.syncLocalBooking(updatedBooking);

    // Also update global reviews collection (prevent duplicate in local cache)
    const reviews = storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
    const existingIndex = reviews.findIndex((r) => r.serviceName === current.serviceName && r.authorName === current.customerName);
    const newReview: Review = {
      id: existingIndex >= 0 ? reviews[existingIndex].id : `rev-${Date.now()}`,
      authorName: current.customerName || 'Customer',
      rating,
      comment: reviewText,
      date: 'Just now',
      serviceName: current.serviceName,
    };

    if (existingIndex >= 0) {
      reviews[existingIndex] = newReview;
      storageService.setItem(STORAGE_KEYS.REVIEWS, reviews);
    } else {
      storageService.setItem(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);
    }

    return {
      success: true,
      data: updatedBooking,
      message: 'Review and rating submitted successfully.',
    };
  }
}

export const bookingService = new BookingService();
