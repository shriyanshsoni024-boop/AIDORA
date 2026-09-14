export const en = {
  app_name: 'AIDORA',
  app_tagline: 'Cooperative Skilled Workforce Platform',
  cooperative_backed: 'Cooperative Verified & Backed',
  
  // Navigation
  nav_home: 'Home',
  nav_services: 'Services',
  nav_bookings: 'My Bookings',
  nav_profile: 'Profile',
  
  // Home Screen
  welcome_title: 'Need a trusted skilled worker?',
  welcome_subtitle: 'Connect with verified cooperative professionals in minutes',
  search_placeholder: 'Search for Electrician, AC repair, Plumber...',
  emergency_banner_title: 'Emergency Service Needed?',
  emergency_banner_desc: 'Priority dispatch for electrical sparks, major leaks & urgent repairs',
  emergency_cta: 'Request Emergency Help',
  
  // Categories
  all_services: 'All Services',
  popular_services: 'Popular Categories',
  cooperative_trust_title: 'Why Choose AIDORA?',
  trust_kyc_title: '100% KYC Verified',
  trust_kyc_desc: 'Every worker is verified by regional worker cooperatives',
  trust_skills_title: 'Certified & Multi-Skilled',
  trust_skills_desc: 'Trained through vocational modules with proven test scores',
  trust_fair_title: 'Fair & Transparent',
  trust_fair_desc: 'Transparent standard rates with a nominal ₹25 connection fee',
  trust_support_title: 'Cooperative Accountability',
  trust_support_desc: 'Direct cooperative backing for disputes and resolution',

  // Service Booking Flow
  book_service: 'Book Service',
  select_service_tier: 'Select Service Tier',
  tier_small: 'Small / Minor Fix',
  tier_small_desc: 'Quick repair, single switch/tap replacement, inspection',
  tier_medium: 'Medium / Standard Job',
  tier_medium_desc: 'AC gas refill, complete wiring circuit, pipe repair',
  tier_large: 'Large / Major Work',
  tier_large_desc: 'Full installation, multi-point replacement, overhaul',
  
  problem_details: 'Problem Details',
  describe_problem_placeholder: 'Please describe the issue (e.g., AC is running but cooling is weak, switch box sparking...)',
  upload_photo_label: 'Upload Photo (Optional)',
  upload_photo_hint: 'AI estimation will assess work complexity from your photo',
  ai_estimate_tag: 'AI Complexity Estimate',

  service_urgency: 'Service Urgency',
  urgency_normal: 'Normal Service',
  urgency_emergency: 'Emergency (High Priority)',
  
  service_location: 'Service Location',
  current_location: 'Indiranagar 4th Block, Bangalore',
  change_location: 'Change',
  
  schedule_slot: 'Schedule Date & Time',
  today: 'Today (Next Available)',
  tomorrow: 'Tomorrow',
  morning_slot: 'Morning (9 AM - 12 PM)',
  afternoon_slot: 'Afternoon (12 PM - 4 PM)',
  evening_slot: 'Evening (4 PM - 8 PM)',
  
  find_workers_cta: 'Find Verified Workers',

  // Worker Matching
  matching_title: 'Recommended Cooperative Workers',
  matching_subtitle: 'Intelligently ranked by skill, distance, experience, and fairness',
  filter_all: 'All',
  filter_high_match: 'Top Match (90%+)',
  filter_nearby: 'Within 3 km',
  match_score: 'Match Score',
  why_recommended: 'Why Recommended?',
  years_exp: 'yrs exp',
  reviews: 'reviews',
  completed_jobs: 'jobs done',
  view_profile: 'View Profile',
  select_worker: 'Select Worker',
  kyc_verified: 'KYC Verified',
  available_now: 'Available Now',
  
  // Profile Modal
  worker_details: 'Worker Profile & Credentials',
  professions_skills: 'Professions & Skills',
  certifications: 'Cooperative Certifications',
  recent_reviews: 'Customer Reviews',
  cooperative_affiliation: 'Affiliated Cooperative',

  // Booking Summary & Payment
  booking_summary: 'Booking Summary',
  service_estimate: 'Estimated Service Cost',
  connection_fee: 'AIDORA Connection Fee',
  total_estimate: 'Total Starting Estimate',
  final_price_note: 'Note: Connection fee confirms your booking. Final labor/material cost is settled upon service completion.',
  confirm_booking: 'Confirm Booking',
  booking_success: 'Booking Confirmed!',
  service_token: 'Service Token',
  
  // Tracking
  tracking_title: 'Live Service Tracking',
  status_requested: 'Service Requested',
  status_matched: 'Worker Matched',
  status_accepted: 'Worker Accepted',
  status_on_the_way: 'Worker On The Way',
  status_in_progress: 'Work In Progress',
  status_completed: 'Service Completed',
  call_worker: 'Call Worker',
  worker_arriving_in: 'Estimated arrival in 12 minutes',
  advance_step: 'Update Service Progress Stage',
  
  // Completion & Feedback
  service_completed_title: 'Service Completed Successfully',
  rate_worker: 'Rate your experience with',
  write_review_placeholder: 'Write a review about the service quality, punctuality, and behavior...',
  submit_feedback: 'Submit Feedback & Complete',
  super_coins_earned: 'You earned 25 AIDORA Super Coins!',
  
  // History & Details
  active_services: 'Active Services',
  past_services: 'Past Service History',
  no_bookings_title: 'No active bookings yet',
  no_bookings_desc: 'Discover skilled cooperative professionals for your home and office needs.',
};

export type TranslationKey = keyof typeof en;
