import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus, ServiceCategory, ServiceTier, UrgencyLevel, Worker } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { SERVICE_CATEGORIES } from '../data/services';
import { bookingService } from '../services/bookingService';
import { storageService } from '../services/storage/storageService';
import { STORAGE_KEYS } from '../services/storage/storageKeys';
import { LOCATIONS, DEFAULT_LOCATION, ServiceLocation } from '../data/locations';
import { authService } from '../services/auth/authService';
import { realtimeService } from '../lib/realtime';
import { userService } from '../services/userService';

export type CustomerView =
  | 'home'
  | 'service-detail'
  | 'worker-matching'
  | 'tracking'
  | 'history'
  | 'profile'
  | 'money';

interface BookingContextType {
  activeView: CustomerView;
  setActiveView: (view: CustomerView) => void;
  selectedCategory: ServiceCategory | null;
  setSelectedCategory: (cat: ServiceCategory | null) => void;
  selectedTier: ServiceTier;
  setSelectedTier: (tier: ServiceTier) => void;
  urgency: UrgencyLevel;
  setUrgency: (urgency: UrgencyLevel) => void;
  problemDescription: string;
  setProblemDescription: (desc: string) => void;
  photoEstimate: { detected: boolean; tier: ServiceTier; confidence: number; label: string } | null;
  setPhotoEstimate: (est: { detected: boolean; tier: ServiceTier; confidence: number; label: string } | null) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  locations: ServiceLocation[];
  bookings: Booking[];
  currentBookingId: string | null;
  setCurrentBookingId: (id: string | null) => void;
  currentBooking: Booking | null;
  createBooking: (worker: Worker, paymentStatus?: 'PAID' | 'PENDING') => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => void;
  advanceBookingStatus: (bookingId: string) => void;
  submitCustomerReview: (bookingId: string, rating: number, review: string) => void;
  startServiceBooking: (category: ServiceCategory, isEmergency?: boolean) => void;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<CustomerView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(SERVICE_CATEGORIES[0]);
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('MEDIUM');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [photoEstimate, setPhotoEstimate] = useState<{ detected: boolean; tier: ServiceTier; confidence: number; label: string } | null>(null);

  // Initialize selectedLocation synchronously from storageService for seamless persistence
  const [selectedLocation, setSelectedLocationState] = useState<string>(() => {
    return storageService.getItem<string>(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  });
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  const setSelectedLocation = (location: string) => {
    setSelectedLocationState(location);
    storageService.setItem(STORAGE_KEYS.SELECTED_LOCATION, location);
    const locObj = LOCATIONS.find((l) => l.area === location);
    const city = locObj ? locObj.city : location;
    userService.updateUserProfile({ city, address: location }).catch(() => {});
  };
  
  // Initialize state synchronously from storageService to eliminate layout shift/flicker
  const [bookings, setBookings] = useState<Booking[]>(() => {
    return storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  });
  
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(() => {
    const initial = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return initial.length > 0 ? initial[0].id : null;
  });

  const currentBooking = bookings.find(b => b.id === currentBookingId) || bookings[0] || null;

  // Hydrate from bookingService asynchronously
  const refreshBookings = async () => {
    const response = await bookingService.getBookings();
    if (response.success && response.data) {
      setBookings(response.data);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  // Supabase Realtime synchronization for active booking tracking
  useEffect(() => {
    if (!currentBookingId) return;

    const unsubscribe = realtimeService.subscribeToBooking(currentBookingId, (updatedPartial) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== currentBookingId && b.token !== currentBookingId) return b;
          const statusChanged = updatedPartial.status && updatedPartial.status !== b.status;
          return {
            ...b,
            ...updatedPartial,
            statusHistory: statusChanged
              ? [
                  ...b.statusHistory,
                  {
                    status: updatedPartial.status!,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    note: `Status updated to ${updatedPartial.status}`,
                  },
                ]
              : b.statusHistory,
          };
        })
      );
    });

    return () => unsubscribe();
  }, [currentBookingId]);

  const startServiceBooking = (category: ServiceCategory, isEmergency: boolean = false) => {
    setSelectedCategory(category);
    setUrgency(isEmergency ? 'EMERGENCY' : 'NORMAL');
    setProblemDescription('');
    setPhotoEstimate(null);
    setSelectedTier(isEmergency ? 'LARGE' : 'MEDIUM');
    setActiveView('service-detail');
  };

  const createBooking = (worker: Worker, paymentStatus: 'PAID' | 'PENDING' = 'PAID'): Booking => {
    const targetCategory = selectedCategory || SERVICE_CATEGORIES[0];
    const currentSession = authService.getCurrentSession();
    const activeUser = currentSession?.user;
    
    // Call booking service
    const tempRandom = Math.floor(10000 + Math.random() * 90000);
    const token = `SYH-${tempRandom}`;
    const base = targetCategory?.basePrice || 299;
    const tierMultiplier = selectedTier === 'SMALL' ? 1 : selectedTier === 'MEDIUM' ? 1.8 : 2.8;
    const estimatedPrice = Math.round(base * tierMultiplier);
    const connectionFee = 25;
    const now = new Date();

    const locObj = LOCATIONS.find(l => l.area === selectedLocation);
    const bookingAddress = locObj 
      ? `${locObj.area}, ${locObj.city}`
      : (selectedLocation || 'Service Address');
    const bookingCity = locObj ? locObj.city : (selectedLocation.includes(',') ? selectedLocation.split(',').pop()?.trim() || 'Bangalore' : 'Bangalore');

    const customerId = activeUser?.id || '';
    const customerName = activeUser?.name || 'Customer';
    const customerPhone = activeUser?.phone || '';
    const bookingOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      token,
      customerId,
      customerName,
      customerPhone,
      serviceId: targetCategory.id,
      serviceName: targetCategory.name,
      serviceCategory: targetCategory.category || 'General',
      description: problemDescription || `Requested ${targetCategory.name} (${selectedTier} Tier)`,
      address: bookingAddress,
      city: bookingCity,
      scheduledDate: now.toISOString().split('T')[0],
      scheduledTime: urgency === 'EMERGENCY' ? 'Immediate Priority (15-20 min)' : 'Today (Next Available)',
      urgency,
      tier: selectedTier,
      estimatedPrice,
      connectionFee,
      totalPrice: estimatedPrice + connectionFee,
      worker,
      status: 'REQUESTED',
      otp: bookingOtp,
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Booking request sent to ${worker.name}`,
        },
      ],
      paymentStatus,
      createdAt: now.toISOString(),
    };

    // Synchronously persist via storage & async service execution
    bookingService.createBooking({
      customerId: newBooking.customerId,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      serviceCategory: targetCategory,
      tier: selectedTier,
      urgency,
      problemDescription: newBooking.description,
      address: newBooking.address,
      city: newBooking.city,
      worker,
      paymentStatus,
    }).then(res => {
      if (res.success && res.data) {
        setBookings(prev => {
          const filtered = prev.filter(b => b.id !== newBooking.id && b.id !== res.data!.id);
          return [res.data!, ...filtered];
        });
        setCurrentBookingId(res.data.id);
      }
    });

    // Update local state immediately for seamless responsive UI
    setBookings(prev => [newBooking, ...prev]);
    setCurrentBookingId(newBooking.id);
    setActiveView('tracking');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, nextStatus: BookingStatus, note?: string) => {
    // 1. Optimistic UI update
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const defaultNote =
          nextStatus === 'ACCEPTED' ? `${b.worker?.name || 'Worker'} accepted dispatch request` :
          nextStatus === 'ON_THE_WAY' ? `${b.worker?.name || 'Worker'} is on the way` :
          nextStatus === 'IN_PROGRESS' ? 'OTP verified. Service in progress' :
          nextStatus === 'COMPLETED' ? 'Service completed and verified' :
          nextStatus === 'CANCELLED' ? 'Booking declined/cancelled' :
          `Status updated to ${nextStatus}`;

        const updatedHistory = [
          ...b.statusHistory,
          {
            status: nextStatus,
            timestamp,
            note: note || defaultNote,
          },
        ];

        return {
          ...b,
          status: nextStatus,
          statusHistory: updatedHistory,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt,
        };
      })
    );

    // 2. Persist to Service Layer
    bookingService.updateBookingStatus(bookingId, nextStatus, note).then(res => {
      if (!res.success) {
        console.warn(`Booking update warning: ${res.error}`);
      }
    });
  };

  const advanceBookingStatus = (bookingId: string) => {
    bookingService.advanceBookingStatus(bookingId).then(res => {
      if (res.success && res.data) {
        setBookings(prev => prev.map(b => (b.id === bookingId ? res.data! : b)));
      }
    });

    // Local optimistic update
    setBookings(prev => {
      const target = prev.find(b => b.id === bookingId);
      if (!target) return prev;
      let nextStatus: BookingStatus = target.status;
      if (target.status === 'REQUESTED' || target.status === 'MATCHED') nextStatus = 'ACCEPTED';
      else if (target.status === 'ACCEPTED') nextStatus = 'ON_THE_WAY';
      else if (target.status === 'ON_THE_WAY') nextStatus = 'IN_PROGRESS';
      else if (target.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedHistory = [
        ...target.statusHistory,
        {
          status: nextStatus,
          timestamp,
          note: `Status advanced to ${nextStatus}`,
        },
      ];

      return prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: nextStatus,
              statusHistory: updatedHistory,
              completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt,
            }
          : b
      );
    });
  };

  const submitCustomerReview = (bookingId: string, rating: number, review: string) => {
    bookingService.submitCustomerReview(bookingId, rating, review).then(res => {
      if (res.success && res.data) {
        setBookings(prev => prev.map(b => (b.id === bookingId ? res.data! : b)));
      }
    });

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          customerRating: rating,
          customerReview: review,
        };
      })
    );
  };

  return (
    <BookingContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedTier,
        setSelectedTier,
        urgency,
        setUrgency,
        problemDescription,
        setProblemDescription,
        photoEstimate,
        setPhotoEstimate,
        selectedLocation,
        setSelectedLocation,
        showLocationModal,
        setShowLocationModal,
        locations: LOCATIONS,
        bookings,
        currentBookingId,
        setCurrentBookingId,
        currentBooking,
        createBooking,
        updateBookingStatus,
        advanceBookingStatus,
        submitCustomerReview,
        startServiceBooking,
        refreshBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
