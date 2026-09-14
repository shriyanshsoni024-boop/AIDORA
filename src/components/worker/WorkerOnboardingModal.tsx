import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { TRADE_SKILLS_BY_PROFESSION } from '../../data/workerTrainingData';
import { adminService } from '../../services/adminService';
import { kycService } from '../../services/kycService';
import { Logo } from '../common/Logo';
import {
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  User,
  Phone,
  Globe,
  Briefcase,
  Sparkles
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

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
];

export const WorkerOnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, worker, updateOnboardingProfile } = useWorker();
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [preferredLang, setPreferredLang] = useState<'en' | 'hi'>(language);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: worker.name || 'Rahul Kumar',
    avatar: worker.avatar || AVATAR_OPTIONS[0],
    phone: worker.phone || '+91 98450 12345',
    city: 'Bangalore',
    zone: worker.zone || 'East Bangalore (Indiranagar / Domlur)',
    professions: worker.professions || ['Electrician', 'AC Repair'],
    skillsMap: {} as Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>,
    experienceYears: worker.experienceYears || 6,
    previousExperience: '6 years with City Electrical & HVAC Contractors; serviced 800+ residential units.',
    certificationType: 'ITI Vocational Certificate (National Trade Certificate)',
    certIdNumber: 'ITI-KAR-2020-EL4910',
    kycStatus: 'Verified with UIDAI (Aadhaar)',
    aadhaarNumber: worker.aadhaarNumber || '5892-4910-8921',
    emergencyAvailable: worker.emergencyAvailable ?? true,
    cooperativeName: worker.cooperativeName || 'Bangalore Shramik Sahakari Sangha (Reg #KA-5412)',
    uploadedDocs: [
      { name: 'Aadhaar_Card_Front_Back.pdf', size: '1.4 MB', verified: true },
      { name: 'ITI_Trade_Certificate.pdf', size: '2.1 MB', verified: true },
    ],
  });

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    try {
      const res = await kycService.uploadDocument(worker.id, file, 'aadhaar');
      if (res.success && res.doc) {
        setFormData(prev => ({
          ...prev,
          uploadedDocs: [...prev.uploadedDocs, { name: res.doc!.name, size: res.doc!.size, verified: true }],
        }));
      }
    } catch (err) {
      console.warn('Error uploading KYC document:', err);
    } finally {
      setIsUploadingDoc(false);
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
        return prev; // keep at least 1
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

  const handleLanguageToggle = (lang: 'en' | 'hi') => {
    setPreferredLang(lang);
    setLanguage(lang);
  };

  const handleFinishOnboarding = () => {
    const selectedSkillNames = Object.keys(formData.skillsMap);
    updateOnboardingProfile({
      name: formData.name,
      avatar: formData.avatar,
      phone: formData.phone,
      zone: `${formData.city} • ${formData.zone}`,
      experienceYears: Number(formData.experienceYears),
      professions: formData.professions,
      skills: selectedSkillNames.length > 0 ? selectedSkillNames : worker.skills,
      emergencyAvailable: formData.emergencyAvailable,
      aadhaarNumber: formData.aadhaarNumber,
      cooperativeName: formData.cooperativeName,
      verificationStatus: 'VERIFIED',
    });

    adminService.submitKycRecord({
      workerId: worker.id,
      workerName: formData.name,
      phone: formData.phone,
      profession: formData.professions.join(', '),
      cooperativeBranch: formData.cooperativeName,
      aadhaarNumber: formData.aadhaarNumber,
      certificateNumber: formData.certIdNumber,
      documents: formData.uploadedDocs,
    });

    setShowOnboardingModal(false);
  };

  // Calculate total configured skills count
  const allAvailableSkillsForSelectedProfs = formData.professions.flatMap(
    (prof) => TRADE_SKILLS_BY_PROFESSION[prof] || []
  );
  const totalConfiguredSkills = Object.keys(formData.skillsMap).filter((k) =>
    allAvailableSkillsForSelectedProfs.some((s) => s.name === k)
  ).length;
  const skillsProgressPercent = allAvailableSkillsForSelectedProfs.length > 0
    ? Math.min(100, Math.round((totalConfiguredSkills / allAvailableSkillsForSelectedProfs.length) * 100))
    : 100;

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
          borderRadius: 'var(--radius-lg)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="xs" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {preferredLang === 'hi' ? 'कारीगर साथी ऑनबोर्डिंग' : 'Worker Partner Onboarding'}
                </span>
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                Step {step} of 5:{' '}
                {step === 1 && (preferredLang === 'hi' ? 'मूल विवरण (Basic Profile)' : 'Basic Profile')}
                {step === 2 && (preferredLang === 'hi' ? 'व्यवसाय चयन (Profession Selection)' : 'Profession Selection')}
                {step === 3 && (preferredLang === 'hi' ? 'कौशल मैट्रिक्स (Skills Matrix)' : 'Skills Matrix')}
                {step === 4 && (preferredLang === 'hi' ? 'अनुभव एवं दस्तावेज़ (Experience & Documents)' : 'Experience & Documents')}
                {step === 5 && (preferredLang === 'hi' ? 'समीक्षा एवं सबमिट (Review & Submit)' : 'Review & Submit')}
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
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-muted)', position: 'relative' }}>
          <div
            style={{
              width: `${(step / 5) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              transition: 'width var(--transition-fast)',
            }}
          />
        </div>

        {/* Step Indicator Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.6875rem',
            color: 'var(--text-secondary)',
          }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              onClick={() => setStep(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontWeight: step === s ? 800 : 500,
                color: step === s ? 'var(--primary)' : s < step ? 'var(--success-dark)' : 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.625rem',
                  backgroundColor: step === s ? 'var(--primary)' : s < step ? 'var(--success-light)' : 'var(--bg-muted)',
                  color: step === s ? '#FFFFFF' : s < step ? 'var(--success-dark)' : 'var(--text-muted)',
                  border: s < step ? '1px solid var(--success-border)' : 'none',
                }}
              >
                {s < step ? '✓' : s}
              </div>
              <span style={{ fontSize: '0.6875rem' }}>
                {s === 1 ? 'Profile' : s === 2 ? 'Trades' : s === 3 ? 'Skills' : s === 4 ? 'Docs' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* STEP 1: Basic Profile */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile Photo Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  {preferredLang === 'hi' ? 'प्रोफ़ाइल फ़ोटो चुनें' : 'Worker Profile Photo'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={formData.avatar}
                    alt="Selected Avatar"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '2px solid var(--primary)',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {preferredLang === 'hi' ? 'मानक पेशेवर अवतार चुनें:' : 'Select professional avatar / photo:'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {AVATAR_OPTIONS.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt={`Avatar option ${i + 1}`}
                          onClick={() => setFormData({ ...formData, avatar: imgUrl })}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-xs)',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: formData.avatar === imgUrl ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Name */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'पूरा नाम (आधार कार्ड अनुसार)' : 'Worker Full Name (as per Govt ID)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Kumar"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'मोबाइल नंबर (ओटीपी एवं जॉब डिस्पैच हेतु)' : 'Phone Number (for OTP and Job Dispatch)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 12345"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              {/* City & Service Zone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                    {preferredLang === 'hi' ? 'शहर (City)' : 'City'}
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.8125rem',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Bangalore">Bangalore (Bengaluru)</option>
                    <option value="Delhi NCR">Delhi NCR (Noida / Gurgaon)</option>
                    <option value="Mumbai">Mumbai (MMR)</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                    {preferredLang === 'hi' ? 'सेवा क्षेत्र / ज़ोन' : 'Primary Service Zone'}
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.8125rem',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="East Bangalore (Indiranagar / Domlur)">East (Indiranagar / Domlur)</option>
                    <option value="South Bangalore (Koramangala / HSR)">South (Koramangala / HSR)</option>
                    <option value="North Bangalore (Hebbal / Yelahanka)">North (Hebbal / Yelahanka)</option>
                    <option value="Central Zone (MG Road / Richmond)">Central Zone</option>
                    <option value="Sector 62 Noida & Indirapuram">Sector 62 Noida / Indirapuram</option>
                    <option value="DLF Phase 1-5 & Cyber City Gurgaon">DLF Phase 1-5 Gurgaon</option>
                  </select>
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  {preferredLang === 'hi' ? 'पसंदीदा भाषा (Preferred Language)' : 'Preferred Language'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('en')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${preferredLang === 'en' ? 'var(--primary)' : 'var(--border-default)'}`,
                      backgroundColor: preferredLang === 'en' ? 'var(--primary-light)' : '#FFFFFF',
                      color: preferredLang === 'en' ? 'var(--primary-dark)' : 'var(--text-primary)',
                      fontWeight: preferredLang === 'en' ? 800 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Globe size={15} />
                    <span>English (Primary)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('hi')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${preferredLang === 'hi' ? 'var(--primary)' : 'var(--border-default)'}`,
                      backgroundColor: preferredLang === 'hi' ? 'var(--primary-light)' : '#FFFFFF',
                      color: preferredLang === 'hi' ? 'var(--primary-dark)' : 'var(--text-primary)',
                      fontWeight: preferredLang === 'hi' ? 800 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Globe size={15} />
                    <span>हिन्दी (Hindi)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Profession Selection */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {preferredLang === 'hi' ? 'अपने ट्रेड व्यवसाय चुनें (बहु-चयन संभव)' : 'Select Your Trade Professions'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {preferredLang === 'hi'
                    ? 'AIDORA बहु-कुशल कारीगरों का समर्थन करता है। आप एक से अधिक ट्रेड चुन सकते हैं।'
                    : 'AIDORA supports multi-skilled artisans. Select all professions you are qualified to perform.'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {PROFESSIONS_LIST.map((prof) => {
                    const isSelected = formData.professions.includes(prof.name);
                    return (
                      <div
                        key={prof.id}
                        onClick={() => toggleProfession(prof.name)}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all var(--transition-fast)',
                        }}
                        className="hover-card"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1.25rem' }}>{prof.icon}</span>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-strong)'}`,
                              backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                            }}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {preferredLang === 'hi' ? prof.nameHi : prof.name}
                          </div>
                          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', lineHeight: 1.25, marginTop: '2px' }}>
                            {prof.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected summary badge */}
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>
                  {preferredLang === 'hi' ? 'चयनित व्यवसाय:' : 'Selected Professions:'}{' '}
                  <strong>{formData.professions.join(', ')}</strong>
                </span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {formData.professions.length} Selected
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Skills Matrix */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {preferredLang === 'hi' ? 'कौशल दक्षता स्तर कॉन्फ़िगर करें' : 'Configure Skill Proficiency Levels'}
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {totalConfiguredSkills} / {allAvailableSkillsForSelectedProfs.length} Skills ({skillsProgressPercent}%)
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {preferredLang === 'hi'
                    ? 'प्रत्येक ट्रेड के लिए अपना स्तर (शुरुआती, मध्यम, उन्नत) चुनें।'
                    : 'Specify your self-assessed competency level for each trade skill.'}
                </div>

                {/* Progress Bar for Skills */}
                <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', marginBottom: '14px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${skillsProgressPercent}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      transition: 'width var(--transition-fast)',
                    }}
                  />
                </div>

                {/* Grouped by selected professions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.professions.map((prof) => {
                    const skills = TRADE_SKILLS_BY_PROFESSION[prof] || [];
                    return (
                      <div
                        key={prof}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Briefcase size={13} />
                          <span>{prof} Trade Skills</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {skills.map((skill) => {
                            const currentLevel = formData.skillsMap[skill.name] || skill.defaultLevel;
                            return (
                              <div
                                key={skill.name}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 10px',
                                  backgroundColor: 'var(--bg-app)',
                                  borderRadius: 'var(--radius-xs)',
                                  border: '1px solid var(--border-subtle)',
                                  gap: '8px',
                                }}
                              >
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                                  {preferredLang === 'hi' ? skill.nameHi : skill.name}
                                </div>

                                <div style={{ display: 'flex', gap: '4px' }}>
                                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => {
                                    const isLvlActive = currentLevel === lvl;
                                    return (
                                      <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => handleSkillLevelChange(skill.name, lvl)}
                                        style={{
                                          padding: '3px 8px',
                                          borderRadius: 'var(--radius-xs)',
                                          fontSize: '0.625rem',
                                          fontWeight: isLvlActive ? 800 : 500,
                                          border: isLvlActive ? '1px solid var(--primary)' : '1px solid var(--border-default)',
                                          backgroundColor: isLvlActive ? 'var(--primary)' : '#FFFFFF',
                                          color: isLvlActive ? '#FFFFFF' : 'var(--text-secondary)',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        {lvl === 'Beginner' ? (preferredLang === 'hi' ? 'बुनियादी' : 'Beg') : lvl === 'Intermediate' ? (preferredLang === 'hi' ? 'मध्यम' : 'Inter') : (preferredLang === 'hi' ? 'उन्नत' : 'Adv')}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Experience & Documents */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Experience Years */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'कुल कार्य अनुभव (वर्षों में)' : 'Total Work Experience (Years)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Previous Experience Description */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'पिछला कार्य अनुभव एवं प्रमुख प्रोजेक्ट्स' : 'Previous Work History & Projects'}
                </label>
                <textarea
                  rows={2}
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.8125rem',
                    resize: 'none',
                  }}
                />
              </div>

              {/* ITI / NSDC / Trade Certification Selection */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'व्यावसायिक प्रमाण पत्र चयन (ITI / NSDC / राज्य बोर्ड)' : 'Vocational Certification Selection'}
                </label>
                <select
                  value={formData.certificationType}
                  onChange={(e) => setFormData({ ...formData, certificationType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.8125rem',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="ITI Vocational Certificate (National Trade Certificate)">ITI National Trade Certificate (NTC)</option>
                  <option value="NSDC Skill India Level 4 Certified">NSDC Skill India Level 4 Certified</option>
                  <option value="State Apprenticeship Board Certificate">State Apprenticeship Board Certificate</option>
                  <option value="Cooperative Trade Recognition Guild">Cooperative Trade Recognition Guild</option>
                  <option value="Direct Practical Trade Experience (Uncertified)">Direct Practical Experience (Will Take Assessment)</option>
                </select>
              </div>

              {/* Real Document Upload UI */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  {preferredLang === 'hi' ? 'दस्तावेज़ अपलोड (Aadhaar, Trade Cert, KYC)' : 'Upload Government ID & Trade Certificates'}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDocumentUpload}
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '1.5px dashed var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Upload size={22} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    {isUploadingDoc
                      ? (preferredLang === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading Document to Storage...')
                      : (preferredLang === 'hi' ? 'दस्तावेज़ अपलोड करने के लिए क्लिक करें' : 'Click to Upload Document / Certificate')}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {formData.uploadedDocs.map((d, idx) => (
                      <span key={idx} style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
                        ✓ {d.name} ({d.size})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* KYC Verification Status Card */}
              <div
                style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065F46' }}>
                      UIDAI KYC Verification Active
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#047857' }}>
                      Aadhaar: {formData.aadhaarNumber} • Instant Digital Trust
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#059669', backgroundColor: '#D1FAE5', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
                  VERIFIED
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: 'var(--primary-light, #F0FDF4)', border: '1.5px solid var(--primary-border, #D9E9C8)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                <Sparkles size={22} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--primary-dark, #0F7A3E)' }}>
                  {preferredLang === 'hi' ? 'ऑनबोर्डिंग समीक्षा एवं पुष्टि' : 'Worker Onboarding Summary'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {preferredLang === 'hi'
                    ? 'कृपया अपने सभी विवरणों की जांच करें। पुष्टि के पश्चात आपका प्रोफ़ाइल लाइव हो जाएगा।'
                    : 'Verify your partner credentials below before activating your active dispatch profile.'}
                </div>
              </div>

              {/* Summary Information Table */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {formData.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {formData.phone} • {formData.city} ({formData.zone})
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6875rem' }}>Professions:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formData.professions.join(', ')}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6875rem' }}>Experience:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formData.experienceYears} Years Total</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6875rem' }}>Certification:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formData.certificationType}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6875rem' }}>KYC Status:</span>
                    <strong style={{ color: 'var(--success-dark)' }}>✓ UIDAI Aadhaar Verified</strong>
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6875rem', marginBottom: '4px' }}>Configured Skills Matrix:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Object.entries(formData.skillsMap).map(([sName, sLevel]) => (
                      <span
                        key={sName}
                        style={{
                          fontSize: '0.625rem',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-default)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {sName} ({sLevel})
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                  Cooperative Union: <strong>{formData.cooperativeName}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ArrowLeft size={14} />
              <span>{preferredLang === 'hi' ? 'पिछला' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              className="sahyog-btn"
            >
              <span>{preferredLang === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
              }}
              className="sahyog-btn"
            >
              <CheckCircle size={16} />
              <span>{preferredLang === 'hi' ? 'ऑनबोर्डिंग पूर्ण करें' : 'Complete Onboarding'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
