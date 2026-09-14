import { Worker } from '../types';
import { calculateHaversineDistance, getCoordinatesForLocation } from '../services/geoService';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'w-101',
    name: 'Rahul Kumar',
    nameHi: 'राहुल कुमार',
    phone: '+91 98450 12345',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=256',
    professions: ['Electrician', 'AC Repair & Service'],
    skills: ['Electrical Wiring', 'Cooling Problem', 'AC Servicing', 'Gas Refill', 'MCB Diagnostics', 'Fan Installation'],
    experienceYears: 6,
    experienceLevel: 'Intermediate',
    rating: 4.85,
    reviewCount: 164,
    completedJobs: 218,
    distanceKm: 2.1,
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    cooperativeName: 'Bangalore Shramik Sahakari Sangha (Reg #KA-5412)',
    zone: 'East Bangalore (Indiranagar / Domlur / Koramangala)',
    certificates: [
      { title: 'Vocational HVAC & Refrigeration Level 3', issuer: 'National Skill Development Corp (NSDC)', issuedYear: 2021 },
      { title: 'Domestic Electrical Safety & Wiring Standard', issuer: 'State Cooperative Skill Cell', issuedYear: 2020 }
    ],
    trainingCompleted: ['AC Refrigerant Handling & Safety', 'Advanced Circuit Troubleshooting', 'Customer Code of Conduct'],
    matchScore: 94,
    matchReasons: [
      'High skill overlap for AC cooling diagnostics',
      '100% Cooperative KYC Verified',
      'Within 2.5 km (Fast Arrival)',
      'Top rated by 160+ local households',
      'Balanced workload availability'
    ],
    matchScoreBreakdown: {
      skillMatch: 29,     // out of 30
      experience: 18,    // out of 20
      distance: 19,      // out of 20
      availability: 10,  // out of 10
      rating: 9,         // out of 10
      workload: 5,       // out of 5
      fairness: 4        // out of 5
    }
  },
  {
    id: 'w-102',
    name: 'Suresh Patil',
    nameHi: 'सुरेश पाटिल',
    phone: '+91 97410 88219',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    professions: ['Electrician', 'Appliance Repair'],
    skills: ['Electrical Wiring', 'Switch Installation', 'Fault Repair', 'MCB Diagnostics', 'Geyser Repair'],
    experienceYears: 8,
    experienceLevel: 'Advanced',
    rating: 4.92,
    reviewCount: 240,
    completedJobs: 345,
    distanceKm: 1.8,
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    cooperativeName: 'Central District Skilled Artisans Cooperative',
    zone: 'Indiranagar Zone',
    certificates: [
      { title: 'Master Wireman License Grade A', issuer: 'State Electricity Board', issuedYear: 2018 },
      { title: 'Home Appliances Servicing Certificate', issuer: 'Cooperative Technical Institute', issuedYear: 2019 }
    ],
    trainingCompleted: ['Commercial 3-Phase Power Systems', 'Short Circuit Isolation Protocols'],
    matchScore: 91,
    matchReasons: [
      'Master Electrician with 8+ years experience',
      'Ultra-nearby (1.8 km distance)',
      'Consistently rated 4.9+ stars',
      'Cooperative Certified Specialist'
    ],
    matchScoreBreakdown: {
      skillMatch: 27,
      experience: 20,
      distance: 20,
      availability: 10,
      rating: 10,
      workload: 4,
      fairness: 4
    }
  },
  {
    id: 'w-103',
    name: 'Mohd. Imran Khan',
    nameHi: 'मोहम्मद इमरान खान',
    phone: '+91 91122 33445',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    professions: ['Plumber', 'Mason / Civil Work'],
    skills: ['Pipe Leakage', 'Tap Repair', 'Drain Blockage', 'Water Motor', 'Tile Fitting', 'Sanitary Fitting'],
    experienceYears: 5,
    experienceLevel: 'Intermediate',
    rating: 4.78,
    reviewCount: 98,
    completedJobs: 142,
    distanceKm: 3.4,
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    cooperativeName: 'Kalyan Karnataka Shramik Cooperative Union',
    zone: 'East Zone',
    certificates: [
      { title: 'Hydraulic Plumbing & Sanitary Certification', issuer: 'Govt. ITI Bangalore', issuedYear: 2021 }
    ],
    trainingCompleted: ['Modern Concealed Piping Techniques', 'Pressure Leak Detection'],
    matchScore: 88,
    matchReasons: [
      'Dual expertise in sanitary plumbing & tile repair',
      'Prompt response time history',
      'Verified Aadhaar & Cooperative endorsement'
    ],
    matchScoreBreakdown: {
      skillMatch: 28,
      experience: 16,
      distance: 16,
      availability: 10,
      rating: 9,
      workload: 5,
      fairness: 4
    }
  },
  {
    id: 'w-104',
    name: 'Rameshwar Sharma',
    nameHi: 'रामेश्वर शर्मा',
    phone: '+91 93411 99881',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    professions: ['Carpenter'],
    skills: ['Door Repair', 'Lock Fitting', 'Furniture Assembly', 'Hinge Adjustment', 'Wood Polishing'],
    experienceYears: 10,
    experienceLevel: 'Advanced',
    rating: 4.88,
    reviewCount: 310,
    completedJobs: 412,
    distanceKm: 2.8,
    availability: 'AVAILABLE',
    verificationStatus: 'VERIFIED',
    cooperativeName: 'South Zone Carpentry Guild Cooperative',
    zone: 'Central & East Zone',
    certificates: [
      { title: 'Master Woodcraft and Modular Fitting', issuer: 'National Craft Council', issuedYear: 2016 }
    ],
    trainingCompleted: ['Modern Hydraulic Fitting & Locks', 'Ergonomic Furniture Repair'],
    matchScore: 89,
    matchReasons: [
      '10 years seasoned artisan craftsmanship',
      'Precision lock fitting & hinge specialist',
      'Verified master guild artisan'
    ],
    matchScoreBreakdown: {
      skillMatch: 28,
      experience: 20,
      distance: 17,
      availability: 10,
      rating: 9,
      workload: 4,
      fairness: 4
    }
  }
];

export const calculateWorkerMatches = (
  serviceId: string,
  problemDescription: string,
  isEmergency: boolean = false,
  customerLocation: string = 'Indiranagar, Bangalore'
): Worker[] => {
  const serviceNameMap: Record<string, string> = {
    electrician: 'Electrician',
    ac_repair: 'AC Repair & Service',
    plumber: 'Plumber',
    carpenter: 'Carpenter',
    appliance: 'Appliance Repair',
    painter: 'Painter',
    cleaner: 'Deep Cleaning',
    mason: 'Mason / Civil Work',
  };

  const targetProfession = serviceNameMap[serviceId] || 'Electrician';
  const customerCoords = getCoordinatesForLocation(customerLocation);

  return MOCK_WORKERS.map(worker => {
    const isDirectProfession = worker.professions.some(p =>
      p.toLowerCase().includes(targetProfession.toLowerCase()) ||
      targetProfession.toLowerCase().includes(p.toLowerCase())
    );

    let skillScore = isDirectProfession ? 28 : 14;
    const descLower = problemDescription.toLowerCase();
    
    // Check if worker has specific matching skills in the description
    worker.skills.forEach(skill => {
      if (descLower.includes(skill.toLowerCase()) || descLower.includes('cooling') || descLower.includes('wire')) {
        skillScore = Math.min(30, skillScore + 2);
      }
    });

    // Compute dynamic Haversine distance if worker has zone coordinates
    const workerZoneCoords = getCoordinatesForLocation(worker.zone || 'Indiranagar');
    const computedDistanceKm = calculateHaversineDistance(
      customerCoords.lat,
      customerCoords.lng,
      workerZoneCoords.lat,
      workerZoneCoords.lng
    );
    const activeDistanceKm = computedDistanceKm > 0 ? computedDistanceKm : worker.distanceKm;

    // If emergency, prioritize nearer distance and instant availability weight
    const distanceMultiplier = isEmergency ? 3.5 : 2.5;
    const expScore = Math.min(20, Math.round((worker.experienceYears / 10) * 20));
    const distScore = Math.max(10, Math.min(20, Math.round(20 - activeDistanceKm * distanceMultiplier)));
    const availScore = worker.availability === 'AVAILABLE' ? 10 : 2;
    const ratingScore = Math.round((worker.rating / 5) * 10);
    const workloadScore = 5;
    const fairnessScore = 4;

    const total = skillScore + expScore + distScore + availScore + ratingScore + workloadScore + fairnessScore;

    return {
      ...worker,
      distanceKm: activeDistanceKm,
      matchScore: Math.min(98, total),
      matchScoreBreakdown: {
        skillMatch: skillScore,
        experience: expScore,
        distance: distScore,
        availability: availScore,
        rating: ratingScore,
        workload: workloadScore,
        fairness: fairnessScore,
      }
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};
