import React, { useState, useRef } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { TRADE_SKILLS_BY_PROFESSION } from '../../data/workerTrainingData';
import { adminService } from '../../services/adminService';
import { kycService } from '../../services/kycService';
import { photoStorageService } from '../../services/storage/photoStorageService';
import { workerService } from '../../services/workerService';
import { userService } from '../../services/userService';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import {
  X,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Camera,
  AlertCircle,
} from 'lucide-react';

const PROFESSIONS_LIST = [
  { id: 'electrician', name: 'Electrician', nameHi: 'इलेक्ट्रीशियन', icon: '⚡', desc: 'Wiring, MCBs, Inverters & DBs' },
  { id: 'ac-repair', name: 'AC Repair', nameHi: 'एसी रिपेयर', icon: '❄️', desc: 'Jet Service, Gas Refill & PCB' },
  { id: 'plumber', name: 'Plumber', nameHi: 'प्लंबर', icon: '🔧', desc: 'P-Traps, Geysers, Drainage & Taps' },
  { id: 'carpenter', name: 'Carpenter', nameHi: 'कारपेंटर', icon: '🪚', desc: 'Smart Locks, Hinges & Furniture' },
  { id: 'appliance-repair', name: 'Appliance Repair', nameHi: 'उपकरण रिपेयर', icon: '🔌', desc: 'Washing Machines & Microwaves' },
  { id: 'painter', name: 'Painter', nameHi: 'पेंटर', icon: '🎨', desc: 'Wall Putty, Primer & Waterproofing' },
  { id: 'cleaning', name: 'Cleaning', nameHi: 'क्लीनिंग', icon: '✨', desc: 'Deep Cleaning, Floor Buffing & Sofa' },
  { id: 'mason', name: 'Mason', nameHi: 'राजमिस्त्री / मेसन', icon: '🧱', desc: 'Tile Fitting, Grouting & Plaster' },
];

export const WorkerOnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, worker, updateOnboardingProfile } = useWorker();
  const { language } = useLanguage();
  const preferredLang = language;

  const [step, setStep] = useState<number>(1);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: worker.name && worker.name !== 'Artisan Partner' && worker.name !== 'Rahul Kumar' ? worker.name : '',
    avatar: worker.avatar || '',
    phone: worker.phone || '',
    email: worker.email || '',
    dob: worker.dob || '',
    gender: worker.gender || 'Male',
    address: worker.address || '',
    locality: worker.locality || '',
    city: worker.city || 'Bangalore',
    state: worker.state || 'Karnataka',
    pincode: worker.pincode || '',
    zone: worker.zone || 'Indiranagar & East Zone',
    professions: worker.professions && worker.professions.length > 0 ? worker.professions : ['Electrician'],
    skillsMap: {} as Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>,
    experienceYears: worker.experienceYears || 3,
    serviceRadiusKm: worker.serviceRadiusKm || 10,
    languages: worker.languages || ['English', 'Hindi'],
    bio: worker.bio || '',
    previousExperience: worker.workExperience || '',
    certificationType: 'ITI Vocational Trade Certificate',
    certIdNumber: '',
    aadhaarNumber: worker.aadhaarNumber || '',
    emergencyAvailable: worker.emergencyAvailable ?? true,
    cooperativeName: worker.cooperativeName || 'AIDORA Central Federation',
    uploadedDocs: [] as { name: string; size: string; verified: boolean }[],
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setErrorMessage('');
    try {
      const res = await photoStorageService.uploadProfilePhoto(worker.id, file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, avatar: res.url! }));
      } else {
        setErrorMessage(res.error || 'Failed to upload photo.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error uploading photo.');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    setErrorMessage('');
    try {
      const res = await kycService.uploadDocument(worker.id, file, 'aadhaar');
      if (res.success && res.doc) {
        setFormData((prev) => ({
          ...prev,
          uploadedDocs: [...prev.uploadedDocs, { name: res.doc!.name, size: res.doc!.size, verified: true }],
        }));
      }
    } catch (err) {
      console.warn('Error uploading KYC document:', err);
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Initialize skills map for current selected professions
  React.useEffect(() => {
    const newSkillsMap = { ...formData.skillsMap };
    formData.professions.forEach((prof) => {
      const skills = TRADE_SKILLS_BY_PROFESSION[prof] || [];
      skills.forEach((s) => {
        if (!newSkillsMap[s.name]) {
          newSkillsMap[s.name] = s.defaultLevel;
        }
      });
    });
    setFormData((prev) => ({ ...prev, skillsMap: newSkillsMap }));
  }, [formData.professions]);

  if (!showOnboardingModal) return null;

  const toggleProfession = (profName: string) => {
    setFormData((prev) => {
      const exists = prev.professions.includes(profName);
      if (exists && prev.professions.length === 1) {
        return prev;
      }
      const updated = exists ? prev.professions.filter((p) => p !== profName) : [...prev.professions, profName];
      return { ...prev, professions: updated };
    });
  };

  const handleSkillLevelChange = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setFormData((prev) => ({
      ...prev,
      skillsMap: {
        ...prev.skillsMap,
        [skillName]: level,
      },
    }));
  };

  const handleFinishOnboarding = async () => {
    const selectedSkillNames = Object.keys(formData.skillsMap);
    const workerUpdates = {
      name: formData.name.trim() || worker.name,
      avatar: formData.avatar || worker.avatar,
      phone: formData.phone || worker.phone,
      email: formData.email.trim() || undefined,
      dob: formData.dob.trim() || undefined,
      gender: formData.gender,
      address: formData.address.trim(),
      locality: formData.locality.trim() || undefined,
      city: formData.city.trim() || 'Bangalore',
      state: formData.state.trim() || 'Karnataka',
      pincode: formData.pincode.trim() || undefined,
      zone: `${formData.city} • ${formData.locality || formData.zone}`,
      experienceYears: Number(formData.experienceYears) || 1,
      serviceRadiusKm: Number(formData.serviceRadiusKm) || 10,
      professions: formData.professions,
      skills: selectedSkillNames.length > 0 ? selectedSkillNames : worker.skills,
      emergencyAvailable: formData.emergencyAvailable,
      languages: formData.languages,
      bio: formData.bio.trim(),
      workExperience: formData.previousExperience.trim(),
      aadhaarNumber: formData.aadhaarNumber.trim() || undefined,
      cooperativeName: formData.cooperativeName,
      verificationStatus: (worker.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING') as any,
      isProfileCompleted: true,
    };

    updateOnboardingProfile(workerUpdates);
    await workerService.updateWorker(worker.id, workerUpdates);
    await userService.updateUserProfile({
      name: workerUpdates.name,
      email: workerUpdates.email,
      address: workerUpdates.address,
      city: workerUpdates.city,
      isProfileCompleted: true,
    });

    if (formData.uploadedDocs.length > 0 || formData.aadhaarNumber) {
      adminService.submitKycRecord({
        workerId: worker.id,
        workerName: workerUpdates.name,
        phone: workerUpdates.phone,
        profession: formData.professions.join(', '),
        cooperativeBranch: formData.cooperativeName,
        aadhaarNumber: formData.aadhaarNumber,
        certificateNumber: formData.certIdNumber,
        documents: formData.uploadedDocs,
      });
    }

    setShowOnboardingModal(false);
  };

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={() => setShowOnboardingModal(false)}
    >
      <div
        className="animate-modal-enter"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="xs" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1DAA5C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {preferredLang === 'hi' ? 'कारीगर साथी ऑनबोर्डिंग' : 'Worker Partner Onboarding'}
                </span>
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>
                Step {step} of 5:{' '}
                {step === 1 && (preferredLang === 'hi' ? 'मूल विवरण (Basic Profile)' : 'Personal Details')}
                {step === 2 && (preferredLang === 'hi' ? 'व्यवसाय एवं अनुभव' : 'Trade & Experience')}
                {step === 3 && (preferredLang === 'hi' ? 'कौशल मैट्रिक्स' : 'Skills & Services')}
                {step === 4 && (preferredLang === 'hi' ? 'केवाईसी एवं पहचान दस्तावेज़' : 'KYC & Verification')}
                {step === 5 && (preferredLang === 'hi' ? 'समीक्षा एवं सबमिट' : 'Review & Submit')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnboardingModal(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {errorMessage && (
            <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', color: '#B91C1C', fontSize: '0.8125rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL DETAILS & PHOTO */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Profile Photo Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar
                    src={formData.avatar}
                    name={formData.name || 'Worker'}
                    size={64}
                    shape="rounded"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#1DAA5C',
                      color: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Upload Photo"
                  >
                    <Camera size={13} />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                    Profile Photo
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {isUploadingPhoto ? 'Uploading image...' : 'Clear photo helps customers identify you during home visits'}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full legal name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              {/* Phone (Read Only) & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    PHONE (REGISTERED)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.phone}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    EMAIL (OPTIONAL)
                  </label>
                  <input
                    type="email"
                    placeholder="worker@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* DOB & Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    GENDER
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address & Locality */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  RESIDENTIAL / BASE ADDRESS
                </label>
                <input
                  type="text"
                  placeholder="Street address / workshop location"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    LOCALITY / ZONE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indiranagar"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    CITY
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRADE & EXPERIENCE */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                  SELECT TRADES / PROFESSIONS (SELECT ALL THAT APPLY)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {PROFESSIONS_LIST.map((prof) => {
                    const isSelected = formData.professions.includes(prof.name);
                    return (
                      <div
                        key={prof.id}
                        onClick={() => toggleProfession(prof.name)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: `1.5px solid ${isSelected ? '#1DAA5C' : '#E2E8F0'}`,
                          backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{prof.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A' }}>
                            {prof.name}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                            {prof.desc}
                          </div>
                        </div>
                        {isSelected && <Check size={16} color="#1DAA5C" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Experience Years & Service Radius */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    EXPERIENCE (YEARS)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value, 10) || 1 })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    SERVICE RADIUS (KM)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.serviceRadiusKm}
                    onChange={(e) => setFormData({ ...formData, serviceRadiusKm: parseInt(e.target.value, 10) || 10 })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  SHORT PROFESSIONAL BIO
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Certified technician specializing in residential AC and electrical servicing for 6+ years."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Work Experience */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  PAST WORK EXPERIENCE / COMPANIES
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 years with City Electrical & HVAC Contractors"
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS MATRIX */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                Specify your proficiency level for each specific service task in your selected trade:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.professions.map((prof) => {
                  const skills = TRADE_SKILLS_BY_PROFESSION[prof] || [];
                  return (
                    <div key={prof} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px', backgroundColor: '#F8FAFC' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                        {prof} Skills
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {skills.map((skill) => (
                          <div key={skill.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                              {skill.name}
                            </span>
                            <select
                              value={formData.skillsMap[skill.name] || 'Intermediate'}
                              onChange={(e) => handleSkillLevelChange(skill.name, e.target.value as any)}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced / Master</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: KYC & DOCUMENTS */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #D9E9C8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={24} color="#1DAA5C" />
                <div style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>Admin Verification Guarantee:</strong> Upload your Aadhaar or trade certificate for government/cooperative compliance.
                </div>
              </div>

              {/* Aadhaar Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  AADHAAR NUMBER (UIDAI)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5892-4910-8921"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              {/* Document Upload Button */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  UPLOAD KYC DOCUMENTS (AADHAAR / ITI CERTIFICATE / LICENSE)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingDoc}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '1.5px dashed #CBD5E1',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={20} color="#64748B" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    {isUploadingDoc ? 'Uploading document to secure storage...' : 'Click to upload PDF or Image (Max 50MB)'}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={handleDocumentUpload}
                />
              </div>

              {/* Uploaded Docs List */}
              {formData.uploadedDocs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>
                    UPLOADED DOCUMENTS ({formData.uploadedDocs.length})
                  </div>
                  {formData.uploadedDocs.map((d, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#166534' }}>{d.name}</span>
                      <span style={{ fontSize: '0.6875rem', color: '#15803D' }}>{d.size} ✓</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Emergency Availability Duty Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  checked={formData.emergencyAvailable}
                  onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#1DAA5C' }}
                />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                  Available for Rapid Emergency Dispatch (15-20 min urgent repairs)
                </span>
              </label>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <Avatar src={formData.avatar} name={formData.name || 'Worker'} size={50} shape="rounded" />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                      {formData.name || 'Artisan Partner'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#1DAA5C', fontWeight: 700 }}>
                      {formData.professions.join(', ')} • {formData.experienceYears} Yrs Exp
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📍 Base Zone: {formData.city}, {formData.locality || formData.zone} (Radius: {formData.serviceRadiusKm} km)</div>
                  <div>📱 Phone: {formData.phone}</div>
                  <div>🛡️ Aadhaar: {formData.aadhaarNumber || 'Not provided'}</div>
                  <div>⚡ Emergency Ready: {formData.emergencyAvailable ? 'Yes' : 'No'}</div>
                  <div>📄 KYC Docs: {formData.uploadedDocs.length} uploaded</div>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A', fontSize: '0.75rem', color: '#92400E' }}>
                <strong>Note on Governance:</strong> Upon submission, your profile will be queued for Admin verification. You can receive marketplace bookings once approved.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.name.trim()) {
                  setErrorMessage('Please enter your full legal name.');
                  return;
                }
                setErrorMessage('');
                setStep(step + 1);
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                backgroundColor: '#1DAA5C',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Next</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                backgroundColor: '#1DAA5C',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} />
              <span>Save & Complete Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
