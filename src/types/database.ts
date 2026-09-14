export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'worker' | 'admin' | 'cooperative';
export type BookingStatusEnum =
  | 'REQUESTED'
  | 'MATCHED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
export type VerificationStatusEnum = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
export type WorkerAvailabilityEnum = 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
export type ServiceTierEnum = 'SMALL' | 'MEDIUM' | 'LARGE';
export type UrgencyLevelEnum = 'NORMAL' | 'EMERGENCY';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          name: string;
          phone: string;
          email: string | null;
          avatar_url: string | null;
          address: string;
          city: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          name: string;
          phone: string;
          email?: string | null;
          avatar_url?: string | null;
          address?: string;
          city?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          name?: string;
          phone?: string;
          email?: string | null;
          avatar_url?: string | null;
          address?: string;
          city?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workers: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          name_hi: string | null;
          phone: string;
          avatar: string | null;
          trade: string;
          professions: string[];
          skills: string[];
          experience_years: number;
          experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
          rating: number;
          review_count: number;
          completed_jobs: number;
          distance_km: number;
          availability: WorkerAvailabilityEnum;
          emergency_ready: boolean;
          verification_status: VerificationStatusEnum;
          cooperative_branch: string;
          zone: string;
          aadhaar_masked: string | null;
          pan_masked: string | null;
          certificates_data: Json;
          training_completed: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          name: string;
          name_hi?: string | null;
          phone: string;
          avatar?: string | null;
          trade: string;
          professions: string[];
          skills?: string[];
          experience_years?: number;
          experience_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          rating?: number;
          review_count?: number;
          completed_jobs?: number;
          distance_km?: number;
          availability?: WorkerAvailabilityEnum;
          emergency_ready?: boolean;
          verification_status?: VerificationStatusEnum;
          cooperative_branch: string;
          zone: string;
          aadhaar_masked?: string | null;
          pan_masked?: string | null;
          certificates_data?: Json;
          training_completed?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          name?: string;
          name_hi?: string | null;
          phone?: string;
          avatar?: string | null;
          trade?: string;
          professions?: string[];
          skills?: string[];
          experience_years?: number;
          experience_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          rating?: number;
          review_count?: number;
          completed_jobs?: number;
          distance_km?: number;
          availability?: WorkerAvailabilityEnum;
          emergency_ready?: boolean;
          verification_status?: VerificationStatusEnum;
          cooperative_branch?: string;
          zone?: string;
          aadhaar_masked?: string | null;
          pan_masked?: string | null;
          certificates_data?: Json;
          training_completed?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          name: string;
          name_hi: string;
          category: string;
          category_id: string;
          base_price: number;
          original_price: number;
          emergency_available: boolean;
          duration: string;
          duration_hi: string;
          description: string;
          description_hi: string;
          icon: string;
          image_url: string | null;
          skills: string[];
          popular: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          name_hi: string;
          category: string;
          category_id: string;
          base_price: number;
          original_price?: number;
          emergency_available?: boolean;
          duration?: string;
          duration_hi?: string;
          description?: string;
          description_hi?: string;
          icon?: string;
          image_url?: string | null;
          skills?: string[];
          popular?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_hi?: string;
          category?: string;
          category_id?: string;
          base_price?: number;
          original_price?: number;
          emergency_available?: boolean;
          duration?: string;
          duration_hi?: string;
          description?: string;
          description_hi?: string;
          icon?: string;
          image_url?: string | null;
          skills?: string[];
          popular?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          token: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          worker_id: string | null;
          service_id: string | null;
          service_name: string;
          service_category: string;
          description: string | null;
          image_url: string | null;
          address: string;
          city: string;
          lat: number | null;
          lng: number | null;
          scheduled_date: string;
          scheduled_time: string;
          urgency: UrgencyLevelEnum;
          tier: ServiceTierEnum;
          estimated_price: number;
          connection_fee: number;
          total_price: number;
          worker_payout: number;
          status: BookingStatusEnum;
          otp: string;
          payment_status: 'PENDING' | 'PAID';
          customer_rating: number | null;
          customer_review: string | null;
          worker_rating: number | null;
          worker_review: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          token: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          worker_id?: string | null;
          service_id?: string | null;
          service_name: string;
          service_category: string;
          description?: string | null;
          image_url?: string | null;
          address: string;
          city: string;
          lat?: number | null;
          lng?: number | null;
          scheduled_date?: string;
          scheduled_time?: string;
          urgency?: UrgencyLevelEnum;
          tier?: ServiceTierEnum;
          estimated_price: number;
          connection_fee?: number;
          total_price: number;
          worker_payout: number;
          status?: BookingStatusEnum;
          otp?: string;
          payment_status?: 'PENDING' | 'PAID';
          customer_rating?: number | null;
          customer_review?: string | null;
          worker_rating?: number | null;
          worker_review?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          token?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          worker_id?: string | null;
          service_id?: string | null;
          service_name?: string;
          service_category?: string;
          description?: string | null;
          image_url?: string | null;
          address?: string;
          city?: string;
          lat?: number | null;
          lng?: number | null;
          scheduled_date?: string;
          scheduled_time?: string;
          urgency?: UrgencyLevelEnum;
          tier?: ServiceTierEnum;
          estimated_price?: number;
          connection_fee?: number;
          total_price?: number;
          worker_payout?: number;
          status?: BookingStatusEnum;
          otp?: string;
          payment_status?: 'PENDING' | 'PAID';
          customer_rating?: number | null;
          customer_review?: string | null;
          worker_rating?: number | null;
          worker_review?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      booking_status_history: {
        Row: {
          id: string;
          booking_id: string;
          status: BookingStatusEnum;
          note: string | null;
          changed_by: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          status: BookingStatusEnum;
          note?: string | null;
          changed_by?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          status?: BookingStatusEnum;
          note?: string | null;
          changed_by?: string | null;
          timestamp?: string;
        };
        Relationships: [];
      };
      worker_earnings: {
        Row: {
          id: string;
          worker_id: string;
          booking_id: string | null;
          booking_token: string;
          service_name: string;
          customer_name: string;
          amount: number;
          platform_fee: number;
          net_payout: number;
          status: 'PAID' | 'PENDING';
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          booking_id?: string | null;
          booking_token: string;
          service_name: string;
          customer_name: string;
          amount: number;
          platform_fee?: number;
          net_payout: number;
          status?: 'PAID' | 'PENDING';
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          booking_id?: string | null;
          booking_token?: string;
          service_name?: string;
          customer_name?: string;
          amount?: number;
          platform_fee?: number;
          net_payout?: number;
          status?: 'PAID' | 'PENDING';
          created_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string | null;
          booking_token: string;
          customer_id: string | null;
          customer_name: string;
          worker_id: string | null;
          amount: number;
          currency: string;
          payment_method: string;
          payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
          razorpay_payment_id: string | null;
          razorpay_order_id: string | null;
          razorpay_signature: string | null;
          notes: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          booking_token: string;
          customer_name?: string;
          customer_id?: string | null;
          worker_id?: string | null;
          amount: number;
          currency?: string;
          payment_method?: string;
          payment_status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
          razorpay_payment_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_signature?: string | null;
          notes?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string | null;
          booking_token?: string;
          customer_id?: string | null;
          customer_name?: string;
          worker_id?: string | null;
          amount?: number;
          currency?: string;
          payment_method?: string;
          payment_status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
          razorpay_payment_id?: string | null;
          razorpay_order_id?: string | null;
          razorpay_signature?: string | null;
          notes?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string | null;
          customer_id: string | null;
          worker_id: string | null;
          author_name: string;
          rating: number;
          comment: string;
          service_name: string;
          chips: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          customer_id?: string | null;
          worker_id?: string | null;
          author_name: string;
          rating: number;
          comment?: string;
          service_name: string;
          chips?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string | null;
          customer_id?: string | null;
          worker_id?: string | null;
          author_name?: string;
          rating?: number;
          comment?: string;
          service_name?: string;
          chips?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      kyc_records: {
        Row: {
          id: string;
          worker_id: string | null;
          worker_name: string;
          profession: string;
          cooperative: string;
          documents: string;
          status: VerificationStatusEnum;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          rejection_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id?: string | null;
          worker_name: string;
          profession: string;
          cooperative: string;
          documents: string;
          status?: VerificationStatusEnum;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string | null;
          worker_name?: string;
          profession?: string;
          cooperative?: string;
          documents?: string;
          status?: VerificationStatusEnum;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatusEnum;
      verification_status: VerificationStatusEnum;
      worker_availability: WorkerAvailabilityEnum;
      service_tier: ServiceTierEnum;
      urgency_level: UrgencyLevelEnum;
    };
  };
}
