-- ==============================================================================
-- SAHYOG Database Seed Data: Development & Production Catalog
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- ==============================================================================

-- 1. SEED SERVICES CATALOG
INSERT INTO public.services (
    id, name, name_hi, category, category_id, base_price, original_price, emergency_available,
    duration, duration_hi, description, description_hi, icon, image_url, skills, popular
) VALUES
(
    'electrician',
    'Electrician',
    'इलेक्ट्रीशियन',
    'Electrical',
    'electrician',
    199,
    299,
    TRUE,
    '30-45 mins',
    '30-45 मिनट',
    'Wiring, MCB tripping, fan, switches, inverter & short-circuit repair',
    'वायरिंग, एमसीबी, पंखा, स्विच, इन्वर्टर और शॉर्ट सर्किट मरम्मत',
    'Zap',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    ARRAY['Electrical Wiring', 'Fan Installation', 'Switch Installation', 'Fault Repair', 'Safety Inspection', 'MCB Diagnostics'],
    TRUE
),
(
    'ac_repair',
    'AC Repair & Service',
    'एसी रिपेयर एवं सर्विस',
    'Cooling & HVAC',
    'ac_repair',
    449,
    599,
    FALSE,
    '45-60 mins',
    '45-60 मिनट',
    'Cooling issues, jet foam wash, gas refill, PCB & compressor diagnostics',
    'कूलिंग समस्या, जेट वॉश, गैस रीफिल, पीसीबी और कंप्रेसर मरम्मत',
    'Snowflake',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    ARRAY['AC Installation', 'AC Servicing', 'Gas Refill', 'Cooling Problem', 'Compressor Issue', 'Jet Wash'],
    TRUE
),
(
    'plumber',
    'Plumber',
    'प्लंबर',
    'Plumbing',
    'plumber',
    199,
    299,
    TRUE,
    '30-45 mins',
    '30-45 मिनट',
    'Leakage fixes, tap replacement, pipe fittings, motor & drainage blockage',
    'लीकेज समाधान, नल बदलना, पाइप फिटिंग, मोटर और ड्रेनेज ब्लॉकेज',
    'Wrench',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
    ARRAY['Pipe Leakage', 'Tap Repair', 'Drain Blockage', 'Water Motor', 'Geyser Connection', 'Sanitary Fitting'],
    TRUE
),
(
    'carpenter',
    'Carpenter',
    'बढ़ई / कारपेंटर',
    'Woodwork & Furniture',
    'carpenter',
    249,
    349,
    FALSE,
    '45-60 mins',
    '45-60 मिनट',
    'Door lock, hinge repair, furniture assembly, cupboard & wood polishing',
    'डोर लॉक, कब्जा रिपेयर, फर्नीचर असेंबली, अलमारी एवं पॉलिश',
    'Hammer',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80',
    ARRAY['Door Repair', 'Lock Fitting', 'Furniture Assembly', 'Hinge Adjustment', 'Wood Polishing', 'Custom Shelf'],
    FALSE
),
(
    'appliance',
    'Appliance Repair',
    'उपकरण मरम्मत',
    'Home Appliances',
    'appliance',
    299,
    399,
    FALSE,
    '45-60 mins',
    '45-60 मिनट',
    'Washing machine, microwave, refrigerator, mixer & water purifier fix',
    'वॉशिंग मशीन, माइक्रोवेव, फ्रिज, मिक्सर और वाटर प्यूरीफायर रिपेयर',
    'Tv',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80',
    ARRAY['Washing Machine', 'Refrigerator Repair', 'Microwave Fix', 'RO Filter Service', 'Geyser Repair'],
    FALSE
),
(
    'cleaning',
    'Deep Cleaning',
    'सफाई सेवा',
    'Cleaning & Hygiene',
    'cleaning',
    599,
    799,
    FALSE,
    '90-120 mins',
    '90-120 मिनट',
    'Full home deep scrubbing, bathroom descaling, kitchen degreasing & sofa wash',
    'पूरे घर की डीप क्लीनिंग, बाथरूम, किचन और सोफा वॉश',
    'Sparkles',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80',
    ARRAY['Bathroom Deep Clean', 'Kitchen Degreasing', 'Sofa Shampooing', 'Full House Scrub', 'Balcony Cleaning'],
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_hi = EXCLUDED.name_hi,
    category = EXCLUDED.category,
    base_price = EXCLUDED.base_price,
    emergency_available = EXCLUDED.emergency_available,
    skills = EXCLUDED.skills;

-- 2. SEED SAMPLE VERIFIED WORKERS
INSERT INTO public.workers (
    id, name, name_hi, phone, avatar, trade, professions, skills,
    experience_years, experience_level, rating, review_count, completed_jobs,
    distance_km, availability, emergency_ready, verification_status, cooperative_branch, zone,
    aadhaar_masked, pan_masked, certificates_data, training_completed
) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'Ramesh Kumar',
    'रमेश कुमार',
    '+91 98765 43210',
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    'Master Electrician',
    ARRAY['Electrician'],
    ARRAY['Electrical Wiring', 'MCB Diagnostics', 'Safety Inspection', 'Fan Installation', 'Fault Repair', 'Inverter Setup'],
    8,
    'Advanced',
    4.88,
    142,
    142,
    1.2,
    'AVAILABLE',
    TRUE,
    'VERIFIED',
    'Bengaluru East Electrical Union',
    'Indiranagar & East Zone',
    'XXXX-XXXX-8912',
    'ABCDE****F',
    '[{"title": "NSQF Level 4 Electrical Installation", "issuer": "NSDC Karnataka", "issuedYear": 2021, "certificateNumber": "NSDC-KA-2021-8832"}, {"title": "BESCOM Certified Wireman License Grade A", "issuer": "BESCOM", "issuedYear": 2019, "certificateNumber": "BESCOM-WM-4491"}]'::jsonb,
    ARRAY['elec_safety_101', 'elec_mcb_adv']
),
(
    'e0000000-0000-0000-0000-000000000002',
    'Priya Sharma',
    'प्रिया शर्मा',
    '+91 98765 43211',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Certified HVAC & Appliance Tech',
    ARRAY['AC Repair', 'Appliance'],
    ARRAY['AC Servicing', 'Gas Refill', 'Jet Wash', 'Cooling Problem', 'Compressor Issue', 'Washing Machine', 'Refrigerator Repair'],
    6,
    'Advanced',
    4.95,
    98,
    98,
    2.1,
    'AVAILABLE',
    FALSE,
    'VERIFIED',
    'City Women Artisan Union',
    'HSR & South Hub',
    'XXXX-XXXX-3341',
    'PQRST****K',
    '[{"title": "Refrigeration & Air Conditioning Specialist", "issuer": "DGT & Skill India", "issuedYear": 2020, "certificateNumber": "SI-HVAC-2020-5512"}]'::jsonb,
    ARRAY['ac_jetwash_pro', 'hvac_eco_refrigerants']
),
(
    'e0000000-0000-0000-0000-000000000003',
    'Suresh Patil',
    'सुरेश पाटिल',
    '+91 98765 43212',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Master Plumber & Pipe Fitter',
    ARRAY['Plumber'],
    ARRAY['Pipe Leakage', 'Tap Repair', 'Drain Blockage', 'Water Motor', 'Geyser Connection', 'Sanitary Fitting'],
    9,
    'Advanced',
    4.82,
    184,
    184,
    1.8,
    'AVAILABLE',
    TRUE,
    'VERIFIED',
    'Noida Artisan Cooperative Society',
    'Sector 62 & Noida Central',
    'XXXX-XXXX-9021',
    'LMNOP****Z',
    '[{"title": "Lead Plumber Level 4", "issuer": "IPSC & NSDC", "issuedYear": 2018, "certificateNumber": "IPSC-PL-2018-1092"}]'::jsonb,
    ARRAY['plumb_leak_detection', 'plumb_pressure_testing']
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    trade = EXCLUDED.trade,
    rating = EXCLUDED.rating,
    availability = EXCLUDED.availability,
    verification_status = EXCLUDED.verification_status;

-- 3. SEED KYC QUEUE
INSERT INTO public.kyc_records (
    id, worker_id, worker_name, profession, cooperative, documents, status, submitted_at
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'Manish Verma',
    'Electrician',
    'East Zone Cooperative',
    'Aadhaar + ITI Diploma in Electrical Engineering',
    'PENDING',
    NOW() - INTERVAL '3 hours'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000002',
    'Kavita Rao',
    'Appliance Repair',
    'City Women Artisan Union',
    'Aadhaar + NSDC Level 2 Certificate',
    'PENDING',
    NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SAMPLE REVIEWS
INSERT INTO public.reviews (
    id, author_name, rating, comment, service_name, chips, created_at
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'Deepak Sharma',
    5.0,
    'Arrived within 14 minutes for the short circuit issue. Clean work and fixed rate.',
    'Electrician',
    ARRAY['Punctual', 'Clean Work', 'Cooperative Rates'],
    NOW() - INTERVAL '2 days'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'Meera Iyer',
    5.0,
    'Very professional AC jet servicing. No hidden costs or extra gas charges.',
    'AC Repair & Service',
    ARRAY['Polite', 'High Quality', 'Verified Artisan'],
    NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;
