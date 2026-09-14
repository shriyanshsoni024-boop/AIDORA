import { TranslationKey } from './en';

export const hi: Record<TranslationKey, string> = {
  app_name: 'AIDORA',
  app_tagline: 'सहकारी कुशल कार्यबल मंच',
  cooperative_backed: 'सहकारी समिति द्वारा सत्यापित एवं समर्थित',
  
  // Navigation
  nav_home: 'होम',
  nav_services: 'सेवाएं',
  nav_bookings: 'मेरी बुकिंग्स',
  nav_profile: 'प्रोफ़ाइल',
  
  // Home Screen
  welcome_title: 'क्या आपको विश्वसनीय कारीगर की आवश्यकता है?',
  welcome_subtitle: 'सत्यापित सहकारी कारीगरों से मिनटों में जुड़ें',
  search_placeholder: 'इलेक्ट्रीशियन, एसी रिपेयर, प्लंबर खोजें...',
  emergency_banner_title: 'आपातकालीन सेवा की आवश्यकता?',
  emergency_banner_desc: 'बिजली स्पार्किंग, भारी लीकेज और तत्काल मरम्मत हेतु प्राथमिकता',
  emergency_cta: 'आपातकालीन सहायता मांगें',
  
  // Categories
  all_services: 'सभी सेवाएं',
  popular_services: 'लोकप्रिय श्रेणियां',
  cooperative_trust_title: 'AIDORA ही क्यों चुनें?',
  trust_kyc_title: '100% KYC सत्यापित',
  trust_kyc_desc: 'प्रत्येक कारीगर क्षेत्रीय सहकारी समितियों द्वारा सत्यापित है',
  trust_skills_title: 'प्रमाणित और बहु-कुशल',
  trust_skills_desc: 'व्यावसायिक परीक्षण और प्रशिक्षण से प्रमाणित',
  trust_fair_title: 'पारदर्शी और उचित दर',
  trust_fair_desc: 'उचित मानक दरें और केवल ₹25 का मामूली मंच शुल्क',
  trust_support_title: 'सहकारी जवाबदेही',
  trust_support_desc: 'विवादों के समाधान के लिए सीधा सहकारी समर्थन',

  // Service Booking Flow
  book_service: 'सेवा बुक करें',
  select_service_tier: 'सेवा का स्तर चुनें',
  tier_small: 'छोटा काम / सामान्य मरम्मत',
  tier_small_desc: 'स्विच/नल बदलना, सामान्य जांच, छोटी मरम्मत',
  tier_medium: 'मध्यम काम / मानक मरम्मत',
  tier_medium_desc: 'एसी गैस रीफिल, सर्किट वायरिंग, पाइपलाइन मरम्मत',
  tier_large: 'बड़ा काम / प्रमुख मरम्मत',
  tier_large_desc: 'पूरा इंस्टॉलेशन, मल्टी-पॉइंट वायरिंग, विस्तृत कार्य',
  
  problem_details: 'समस्या का विवरण',
  describe_problem_placeholder: 'कृपया समस्या का विवरण लिखें (उदा. एसी चल रहा है पर कूलिंग कम है, स्विच बोर्ड में स्पार्क...)',
  upload_photo_label: 'फोटो अपलोड करें (वैकल्पिक)',
  upload_photo_hint: 'AI फोटो देखकर काम की जटिलता का अनुमान लगाएगा',
  ai_estimate_tag: 'AI जटिलता अनुमान',

  service_urgency: 'सेवा की प्राथमिकता',
  urgency_normal: 'सामान्य सेवा',
  urgency_emergency: 'आपातकालीन (उच्च प्राथमिकता)',
  
  service_location: 'सेवा का पता',
  current_location: 'इंदिरानगर 4th ब्लॉक, बैंगलोर',
  change_location: 'बदलें',
  
  schedule_slot: 'दिनांक और समय चुनें',
  today: 'आज (निकटतम उपलब्ध)',
  tomorrow: 'कल',
  morning_slot: 'सुबह (9 AM - 12 PM)',
  afternoon_slot: 'दोपहर (12 PM - 4 PM)',
  evening_slot: 'शाम (4 PM - 8 PM)',
  
  find_workers_cta: 'सत्यापित कारीगर खोजें',

  // Worker Matching
  matching_title: 'सुझाए गए सहकारी कारीगर',
  matching_subtitle: 'कौशल, दूरी, अनुभव और निष्पक्षता के आधार पर क्रमबद्ध',
  filter_all: 'सभी',
  filter_high_match: 'शीर्ष मैच (90%+)',
  filter_nearby: '3 किमी के भीतर',
  match_score: 'मैच स्कोर',
  why_recommended: 'क्यों चुना गया?',
  years_exp: 'वर्ष अनुभव',
  reviews: 'समीक्षाएं',
  completed_jobs: 'सफल कार्य',
  view_profile: 'प्रोफ़ाइल देखें',
  select_worker: 'कारीगर चुनें',
  kyc_verified: 'KYC सत्यापित',
  available_now: 'अभी उपलब्ध',
  
  // Profile Modal
  worker_details: 'कारीगर प्रोफ़ाइल व प्रमाण पत्र',
  professions_skills: 'पेशा और कौशल',
  certifications: 'सहकारी प्रमाण पत्र',
  recent_reviews: 'ग्राहकों की समीक्षाएं',
  cooperative_affiliation: 'संबद्ध सहकारी समिति',

  // Booking Summary & Payment
  booking_summary: 'बुकिंग सारांश',
  service_estimate: 'अनुमानित सेवा शुल्क',
  connection_fee: 'AIDORA मंच शुल्क',
  total_estimate: 'कुल अनुमानित राशि',
  final_price_note: 'नोट: मंच शुल्क बुकिंग सुनिश्चित करता है। कार्य सामग्री व अंतिम लागत कार्य पूरा होने पर तय होती है।',
  confirm_booking: 'बुकिंग सुनिश्चित करें',
  booking_success: 'बुकिंग सफल रही!',
  service_token: 'सेवा टोकन (Token)',
  
  // Tracking
  tracking_title: 'लाइव सेवा ट्रैकिंग',
  status_requested: 'सेवा अनुरोध भेजा गया',
  status_matched: 'कारीगर मैच हुआ',
  status_accepted: 'कारीगर ने स्वीकार किया',
  status_on_the_way: 'कारीगर रास्ते में है',
  status_in_progress: 'कार्य प्रगति पर है',
  status_completed: 'सेवा सफलतापूर्वक पूर्ण',
  call_worker: 'कारीगर को कॉल करें',
  worker_arriving_in: 'अनुमानित आगमन: 12 मिनट में',
  advance_step: 'सेवा प्रगति स्थिति अपडेट करें',
  
  // Completion & Feedback
  service_completed_title: 'सेवा सफलतापूर्वक पूरी हो गई है',
  rate_worker: 'अपना अनुभव साझा करें -',
  write_review_placeholder: 'सेवा की गुणवत्ता, समय की पाबंदी और व्यवहार पर अपनी समीक्षा लिखें...',
  submit_feedback: 'समीक्षा सबमिट करें',
  super_coins_earned: 'आपको 25 AIDORA सुपर कॉइन्स मिले!',
  
  // History & Details
  active_services: 'सक्रिय सेवाएं',
  past_services: 'पिछली सेवाओं का इतिहास',
  no_bookings_title: 'अभी कोई सक्रिय बुकिंग नहीं है',
  no_bookings_desc: 'अपने घर और कार्यस्थल के लिए कुशल सहकारी कारीगर खोजें।',
};
