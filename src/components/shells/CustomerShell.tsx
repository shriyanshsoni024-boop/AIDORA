import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from '../common/BottomNav';
import { CustomerHomePage } from '../../pages/customer/CustomerHomePage';
import { ServiceDetailPage } from '../../pages/customer/ServiceDetailPage';
import { WorkerMatchingPage } from '../../pages/customer/WorkerMatchingPage';
import { BookingTrackingPage } from '../../pages/customer/BookingTrackingPage';
import { CustomerHistoryPage } from '../../pages/customer/CustomerHistoryPage';
import { CustomerProfilePage } from '../../pages/customer/CustomerProfilePage';
import { CustomerMoneyPage } from '../../pages/customer/CustomerMoneyPage';
import { SplashScreen } from '../../pages/customer/SplashScreen';
import { CustomerLoginScreen } from '../../pages/customer/onboarding/CustomerLoginScreen';
import { CustomerOtpScreen } from '../../pages/customer/onboarding/CustomerOtpScreen';
import { PersonalDetailsScreen } from '../../pages/customer/onboarding/PersonalDetailsScreen';
import { LocationScreen } from '../../pages/customer/onboarding/LocationScreen';
import { AddAddressScreen } from '../../pages/customer/onboarding/AddAddressScreen';
import { AddressSelectorModal } from '../customer/AddressSelectorModal';
import { userService } from '../../services/userService';

export const CustomerShell: React.FC = () => {
  const { activeView, selectedLocation, setSelectedLocation } = useBooking();
  const { user, isAuthenticated, refreshSession } = useAuth();

  // Onboarding Step State (null = regular home marketplace)
  const [onboardingStep, setOnboardingStep] = useState<
    'splash' | 'login' | 'otp' | 'personal' | 'location' | 'address' | null
  >(() => {
    // If authenticated customer has not completed their profile, start onboarding
    if (isAuthenticated && user && user.isProfileCompleted === false) {
      return 'personal';
    }
    return null;
  });

  const [tempPhone, setTempPhone] = useState<string>('');
  const [tempLocation, setTempLocation] = useState<string>(selectedLocation || 'Indiranagar, Bangalore');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  // Automatically trigger onboarding if user is logged in with incomplete profile
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isProfileCompleted === false && onboardingStep === null) {
        setOnboardingStep('personal');
      }
    }
  }, [isAuthenticated, user?.id, user?.isProfileCompleted]);

  // 1. Splash Screen Flow
  if (onboardingStep === 'splash') {
    return (
      <SplashScreen
        onDismiss={() => setOnboardingStep('login')}
      />
    );
  }

  // 2. Onboarding: Customer Login Screen
  if (onboardingStep === 'login') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <CustomerLoginScreen
          onContinue={(phone) => {
            setTempPhone(phone);
            setOnboardingStep('otp');
          }}
          onSkip={() => setOnboardingStep(null)}
        />
      </div>
    );
  }

  // 3. Onboarding: OTP Verification Screen
  if (onboardingStep === 'otp') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <CustomerOtpScreen
          phone={tempPhone}
          onVerified={() => setOnboardingStep('personal')}
          onBack={() => setOnboardingStep('login')}
        />
      </div>
    );
  }

  // 4. Onboarding: Personal Details Screen
  if (onboardingStep === 'personal') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <PersonalDetailsScreen
          onConfirm={async (details) => {
            const fullName = `${details.firstName} ${details.lastName}`.trim();
            await userService.updateUserProfile({
              id: user?.id,
              name: fullName,
              email: details.email || undefined,
            });
            await refreshSession();
            setOnboardingStep('location');
          }}
          onBack={() => setOnboardingStep(null)}
        />
      </div>
    );
  }

  // 5. Onboarding: Location Screen
  if (onboardingStep === 'location') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <LocationScreen
          onLocationSelected={(loc) => {
            setTempLocation(loc);
            setSelectedLocation(loc);
            setOnboardingStep('address');
          }}
          onBack={() => setOnboardingStep('personal')}
        />
      </div>
    );
  }

  // 6. Onboarding: Add Address Details Screen
  if (onboardingStep === 'address') {
    return (
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        <AddAddressScreen
          initialLocation={tempLocation}
          onChangeLocation={() => setOnboardingStep('location')}
          onSaveAddress={async (addr) => {
            setSelectedLocation(addr.locality);
            await userService.addSavedAddress({
              label: addr.type,
              name: addr.receiverName,
              flat: addr.flatNo,
              building: addr.buildingName,
              fullAddress: addr.fullAddress,
              locality: addr.locality,
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560038',
              phone: addr.receiverPhone,
              isDefault: true,
            }, user?.id);
            await userService.updateUserProfile({
              id: user?.id,
              isProfileCompleted: true,
              address: addr.fullAddress,
              locality: addr.locality,
            });
            await refreshSession();
            setOnboardingStep(null);
          }}
          onBack={() => setOnboardingStep('location')}
        />
      </div>
    );
  }

  // Regular Customer Experience
  const renderActiveView = () => {
    switch (activeView) {
      case 'service-detail':
        return <ServiceDetailPage />;
      case 'worker-matching':
        return <WorkerMatchingPage />;
      case 'tracking':
        return <BookingTrackingPage />;
      case 'history':
        return <CustomerHistoryPage />;
      case 'profile':
        return <CustomerProfilePage />;
      case 'money':
        return <CustomerMoneyPage />;
      case 'home':
      default:
        return (
          <CustomerHomePage
            onOpenOnboarding={() => setOnboardingStep('address')}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--pronto-cream, #FCFBF4)',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.08)',
      }}
      className="animate-fade-in"
    >
      <main style={{ flex: 1, position: 'relative' }}>
        <div key={activeView} className="animate-fade-in" style={{ width: '100%' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Address Selector Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedLocation}
        onSelectAddress={(loc) => setSelectedLocation(loc)}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          setOnboardingStep('address');
        }}
      />
    </div>
  );
};
