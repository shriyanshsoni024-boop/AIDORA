# AIDORA — Product Requirements Document

**Version:** 1.0  
**Status:** Production Readiness  
**Project:** AIDORA Cooperative Platform  
**Primary Goal:** Build a scalable, production-grade cooperative service platform for skilled artisans and household consumers.

---

# 1. Product Overview

## 1.1 Product Name

**AIDORA**

## 1.2 One-Line Idea

**AIDORA is a cooperative-powered digital service platform that connects customers with verified skilled workers through intelligent matching, while helping cooperatives manage, utilize and plan their workforce.**

## 1.3 Simple Explanation

AIDORA creates a three-sided digital ecosystem:

- **Customers** get access to trusted and suitable skilled workers.
- **Workers** get relevant work opportunities, skill visibility, training, certification and control over their availability.
- **Cooperatives** get a digital system to verify, manage, monitor and intelligently allocate their workforce.

## 1.4 Core Product Concept

SAHYOG combines:

1. **Customer Service Marketplace**
2. **Cooperative Workforce Management**
3. **AI-Assisted Workforce Intelligence**

SAHYOG is **not simply another home-service marketplace or Urban Company clone**.

---

# 2. Problem Statement

The existing skilled-service ecosystem has problems on three sides.

## 2.1 Customer Problems

Customers often struggle to find:

- Trusted workers
- Correctly skilled workers
- Nearby workers
- Available workers
- Reliable service
- Transparent service processes
- Accountability when something goes wrong

## 2.2 Worker Problems

Workers need:

- More relevant work opportunities
- Better visibility of their skills
- Recognition of experience
- Training
- Certification
- Availability control
- Ability to accept or reject work
- Better workforce utilization
- Fairer distribution of opportunities
- Cooperative support

## 2.3 Cooperative Problems

Cooperatives need:

- Worker registration
- Worker verification
- Skill management
- Certification tracking
- Availability tracking
- Job allocation
- Workload monitoring
- Service monitoring
- Earnings visibility
- Demand understanding
- Workforce planning

## 2.4 Core Problem Statement

> **How can we digitally connect existing skilled cooperative workers with organized customer demand while improving trust, fair allocation and workforce utilization?**

---

# 3. Product Goals

The MVP should achieve six primary goals.

### Goal 1 — Customer Trust

Help customers identify and connect with verified skilled workers.

### Goal 2 — Worker Empowerment

Give workers control over their professional profile, skills, availability and job acceptance.

### Goal 3 — Cooperative Workforce Management

Give cooperatives visibility into their workforce and active services.

### Goal 4 — Intelligent Matching

Recommend suitable workers using multiple factors instead of only distance.

### Goal 5 — Workforce Planning

Use historical service data to identify demand and provide workforce recommendations.

### Goal 6 — Clear Demonstration

The prototype should be easy to understand during a 2–3 minute demonstration.

---

# 4. Target Users

SAHYOG has three primary user types.

## 4.1 Customer

A person who needs a skilled service at their home or workplace.

Examples:

- AC repair
- Electrical work
- Plumbing
- Carpentry
- Painting
- Cleaning

## 4.2 Worker

A skilled worker associated with or managed through a cooperative.

A worker can have **multiple professions**.

Example:

```text
Rahul Kumar

Profession:
- Electrician
- AC Repair Technician
```

## 4.3 Cooperative/Admin

An authorized administrator responsible for managing workers and monitoring the service ecosystem.

The admin manages:

- Worker verification
- Worker information
- Service monitoring
- Disputes
- Workforce utilization
- Analytics
- Demand forecasting
- Workforce allocation

---

# 5. Product Structure

SAHYOG consists of three user-facing applications and shared backend services.

```text
                         SAHYOG
                            |
          ┌─────────────────┼─────────────────┐
          |                 |                 |
          ▼                 ▼                 ▼
    CUSTOMER APP       WORKER APP        ADMIN PANEL
          |                 |                 |
          └─────────────────┼─────────────────┘
                            |
                            ▼
                       BACKEND API
                            |
                ┌───────────┼───────────┐
                ▼           ▼           ▼
             DATABASE    MATCHING       AI
                         ENGINE       SERVICE
```

## 5.1 Customer App

Separate mobile application for customers.

## 5.2 Worker App

Separate mobile application for workers.

## 5.3 Admin Panel

Separate web application for cooperative/admin operations.

## 5.4 Shared Backend

All applications communicate through the same backend API.

## 5.5 Shared Database

Customer, worker, service and administrative data is stored in a shared database.

## 5.6 AI Service

A separate AI service provides matching, forecasting and optional prototype intelligence.

---

# 6. Customer App Requirements

The customer application allows users to discover services, create service requests, find suitable workers and complete the service lifecycle.

## 6.1 Customer Features

The customer app should support:

- Signup
- Login
- Language selection
- How SAHYOG Works
- Service browsing
- Profession selection
- Problem description
- Image upload
- Location selection
- Date/time selection
- Normal/Emergency service
- AI-assisted estimation
- Tier selection
- Worker recommendations
- Worker profile
- Worker selection
- Connection
- Service token
- Service tracking
- Payment
- Invoice
- Dispute
- Feedback
- Service history

---

# 7. Customer Signup and Login

## Signup

The prototype will use:

```text
Email
Password

[Create Account]
```

## Login

```text
Email
Password

[Login]

Forgot Password
Create Account
```

For the 7-day prototype, email/password authentication is sufficient.

---

# 8. Multilingual Support

Hindi and English are P0 requirements.

Users should be able to select:

```text
Choose Language

English
हिंदी
```

The language should also be changeable later through settings.

Important customer-facing content should support both languages:

- Buttons
- Forms
- Navigation
- Help
- Notifications
- Error messages
- Service flow

---

# 9. How SAHYOG Works

The customer app should provide a short tutorial/help experience explaining the service process.

The flow should be:

```text
Choose Service
      ↓
Describe Problem
      ↓
Select Location
      ↓
Find Verified Worker
      ↓
Connect
      ↓
Worker Accepts
      ↓
Service
      ↓
Payment
      ↓
Feedback
```

This helps users understand the cooperative-powered service model.

---

# 10. Customer Home

The home screen should be simple and familiar.

Possible services:

```text
Electrical
AC Repair
Plumbing
Carpentry
Painting
Cleaning
```

An emergency service option should also be visible.

The home screen may also show:

- Recent bookings
- Active service
- Service categories

---

# 11. Service Categories

Initial service/profession categories may include:

- Electrician
- AC Repair
- Plumber
- Carpenter
- Painter
- Mason/Civil
- Cleaner
- Maintenance

A worker may select multiple professions.

---

# 12. Service Request

The customer should be able to create a service request.

Example:

```text
Service:
AC Repair

Problem:
"My AC is running but not cooling."
```

The customer can optionally upload an image.

Then:

```text
Location
Current Location / Enter Address

Date / Time

Normal Service
OR
Emergency Service
```

---

# 13. Emergency Service

The customer can select:

```text
Normal Service
Emergency Service
```

Emergency requests receive higher priority.

However:

> Emergency priority must never override required worker skills or qualifications.

For example, an emergency AC request must still be matched to an AC-capable worker.

---

# 14. AI-Assisted Image Estimation

The customer can optionally upload an image related to the service/problem.

Example:

```text
Customer Image
      ↓
AI Analysis
      ↓
Estimated Size / Complexity
      ↓
Small / Medium / Large
```

Example output:

```text
AI Estimate

Work Size:
MEDIUM
```

This is an **AI-assisted estimate**, not a guaranteed exact measurement or final price.

The prototype may use a demo-level implementation.

---

# 15. Tier-Based Pricing

SAHYOG uses three service tiers:

```text
SMALL
MEDIUM
LARGE
```

| Tier | Meaning |
|---|---|
| Small | Simple/smaller job |
| Medium | Moderate job |
| Large | Bigger/more complex job |

The displayed price should be treated as an **estimated/starting price**.

Final work cost can depend on:

- Job complexity
- Materials
- Time
- Effort
- Actual work required
- Customer-worker agreement

SAHYOG should not claim that AI can perfectly determine the final service price.

---

# 16. Worker Matching

Worker matching is a core intelligence feature.

When a customer creates a request, the system should consider:

```text
Required Profession
        ↓
Required Skills
        ↓
KYC / Verification
        ↓
Availability
        ↓
Distance
        ↓
Experience
        ↓
Rating
        ↓
Current Workload
        ↓
Urgency
        ↓
Fairness
        ↓
MATCH SCORE
```

Workers are then ranked based on their suitability.

The key principle is:

> **SAHYOG finds the best qualified available worker, not simply the nearest worker.**

---

# 17. Match Score

For the MVP, use an explainable weighted scoring system rather than building a complicated ML model.

Initial model:

```text
Skill Match       30%
Experience        20%
Distance          20%
Availability      10%
Rating            10%
Workload           5%
Fairness           5%
```

The weights may be tuned during implementation.

The matching result should be explainable.

Example:

```text
Rahul Kumar
Match Score: 91%

✓ Required skill
✓ Verified
✓ Available
✓ Nearby
✓ Good experience
✓ Good rating
✓ Balanced workload
```

---

# 18. Worker Recommendation

The customer should see worker recommendation cards containing relevant information.

Example:

```text
Rahul Kumar

Electrician
6 Years Experience
Rating: 4.8
Distance: 2.4 km
Available

Match Score: 91%

Why recommended?
✓ Skill match
✓ Verified
✓ Available
✓ Nearby
✓ Good rating

[View Profile]
```

The recommendation should answer:

> **Why was this worker recommended?**

---

# 19. Worker Profile

The customer should be able to view:

- Worker name
- Profile photo
- Profession
- Skills
- Experience
- Experience level
- Training completed
- Certificates
- KYC verification
- Rating
- Reviews
- Availability

The primary trust question should be:

> **Why should I trust this worker?**

---

# 20. Worker App Requirements

The worker application is focused on professional operations.

It should support:

- Signup/login
- Language selection
- Intro/help
- Profession selection
- Multiple professions
- Skills
- Training
- YouTube learning links
- MCQ test
- Certificate
- KYC
- Personal details
- Experience
- Availability
- Job requests
- Accept/reject
- Navigation
- Start service
- Complete service
- Payment/service record
- Ratings
- Feedback
- Service history
- Rewards/Super Coins
- Welfare information

---

# 21. Worker Onboarding

After worker signup:

```text
Worker Signup
      ↓
Profession
      ↓
Skills
      ↓
Training
      ↓
MCQ
      ↓
Certificate
      ↓
KYC
      ↓
Personal Details
      ↓
Experience
      ↓
Profile
      ↓
Availability
```

---

# 22. Multiple Professions

Workers can select multiple professions.

Example:

```text
Selected:

✓ Electrician
✓ AC Repair
```

The system should allow one worker to maintain multiple professional skill sets.

---

# 23. Worker Skills

Skills should be associated with professions.

Example — Electrician:

- Electrical Wiring
- Fan Installation
- Switch Installation
- Light Installation
- Fault Repair
- Safety Inspection

Example — AC Repair:

- AC Installation
- AC Servicing
- Gas Refill
- Cooling Problem
- Compressor Issue

These skills contribute to matching.

---

# 24. Worker Training

Training is profession-specific.

Flow:

```text
Select Profession
      ↓
Recommended Training
      ↓
YouTube Video
      ↓
Complete Training
      ↓
MCQ Test
```

The prototype will use YouTube training links rather than building a complete custom LMS.

---

# 25. MCQ Test

After training, the worker can take a 10-mark MCQ test.

Passing requirement:

```text
Minimum 50%
```

Therefore:

```text
5/10 → Pass
6/10 → Pass
7/10 → Pass
...
```

If the worker fails:

```text
Retake Test
```

---

# 26. Certificate

After successfully passing the training test:

```text
Training Completed
      ↓
MCQ Passed
      ↓
Certificate Generated
```

The certificate should appear on the worker profile.

For the prototype, the certificate is a **demo/generated certificate** and should not be represented as government accreditation.

---

# 27. KYC

Worker KYC should support the prototype direction of:

- Aadhaar
- DigiLocker/API direction
- Identity information

For the 7-day prototype, use a **mock/demo KYC verification flow** unless an actual official integration is available and approved.

Example:

```text
KYC

Aadhaar
[Upload / Verify]

DigiLocker
[Connect]

Status:
Pending
```

Admin can:

```text
Approve
Reject
```

After approval:

```text
KYC Verified
```

---

# 28. Worker Experience

Experience levels:

```text
Beginner
1–3 years

Intermediate
4–6 years

Advanced
7+ years
```

Example:

```text
Experience: 6 Years
Level: Intermediate
```

Experience contributes to credibility and matching.

---

# 29. Worker Availability

Workers control their availability.

Statuses:

```text
Available
Busy
Not Available
```

Only available workers should normally be recommended.

Workers can turn their availability on/off.

---

# 30. Job Requests

A worker receives a service request containing:

```text
NEW SERVICE REQUEST

Service:
AC Repair

Problem:
AC not cooling

Distance:
2.4 km

Urgency:
Emergency

Customer Location:
Map

[ACCEPT]
[REJECT]
```

Workers are not forced to accept every job.

---

# 31. Accept / Reject

Worker flow:

```text
New Job
   ↓
Check Details
   ↓
Accept OR Reject
```

If accepted:

```text
Accepted
```

The customer is updated through the backend.

---

# 32. Service Lifecycle

Every service follows:

```text
REQUESTED
    ↓
ACCEPTED
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Both customer and worker should see the relevant service status.

This is the **golden transaction flow** of the MVP.

---

# 33. Service Token

After booking/connection, the platform generates a unique service token.

Example:

```text
SAHYOG SERVICE TOKEN

SYH-48291
```

The token identifies the service and can be used for:

- Tracking
- Service history
- Disputes
- Admin monitoring
- Reference

---

# 34. Navigation

After accepting a job:

```text
Customer Location
      ↓
Map
      ↓
Route
      ↓
Navigation
```

Google Maps/location services should be used for routing.

For the prototype, AI-generated voice navigation may be demonstrated.

---

# 35. Payment

After service completion:

```text
Service Completed
      ↓
Amount
      ↓
Payment
      ↓
Invoice
```

For the MVP, a mock/sandbox payment flow is sufficient.

Complex payment infrastructure is out of scope.

---

# 36. Connection Fee

The platform may demonstrate a separate connection/platform fee.

Example:

```text
SAHYOG Connection Fee
₹25

Actual Work Cost
Mutually decided by customer & worker
```

SAHYOG should not imply that it controls the complete amount charged by the worker.

---

# 37. Two-Way Feedback

After service completion:

### Customer → Worker

```text
Worker Rating

★★★★★

Comment
```

### Worker → Customer

```text
Customer Rating

★★★★★

Comment
```

This creates accountability on both sides.

---

# 38. Service History

## Customer

```text
My Services

AC Repair
Worker: Rahul
Token: SYH-48291
Date
Status
Rating
```

## Worker

```text
My Jobs

Customer
Service
Token
Date
Status
Rating
```

Every completed service should create a digital service record.

---

# 39. Dispute System

Customers can raise a dispute related to a service.

Flow:

```text
Service
   ↓
Raise Dispute
   ↓
Select Reason
   ↓
Upload Image
   ↓
Submit
   ↓
Admin / Support Review
```

Example reason:

```text
Work not completed properly
```

For the prototype:

```text
Your complaint has been received.

You will receive a call within 15 minutes.
```

This is a prototype workflow unless actual support operations exist.

---

# 40. Admin Panel

The Admin Panel is a separate web dashboard.

Its purpose is:

> **Cooperative management + monitoring + workforce intelligence.**

Admin capabilities:

- Dashboard
- Worker management
- Worker verification
- Availability monitoring
- Service monitoring
- Emergency monitoring
- Dispute management
- Ratings
- Worker utilization
- Service analytics
- Demand forecasting
- Workforce allocation

---

# 41. Admin Dashboard

Important KPIs:

- Total Workers
- Verified Workers
- Available Workers
- Active Bookings
- Completed Services
- Emergency Requests
- Worker Utilization
- Ratings
- Earnings / Platform Fees

Example:

```text
Workers             128
Verified             96
Available             41
Active Services       24
Emergency              6
Completed              91
```

---

# 42. Worker Management

Admin can view:

- Worker
- Profession
- Skills
- Experience
- KYC
- Certificate
- Availability
- Rating
- Jobs
- Status

Admin can open individual worker profiles.

---

# 43. KYC Verification

Admin sees pending verification requests:

```text
Pending Verification

Worker A
Worker B
Worker C
```

Available actions:

```text
[View]
[Approve]
[Reject]
```

Approved workers receive:

```text
VERIFIED
```

---

# 44. Service Monitoring

Admin should be able to see:

- Service Token
- Customer
- Worker
- Profession
- Location
- Status
- Urgency
- Time

Example:

```text
SYH-48291
Rahul
AC Repair
Emergency
In Progress
```

---

# 45. Dispute Management

Disputes move through:

```text
Open Disputes
      ↓
Under Review
      ↓
Resolved
```

Each dispute contains:

- Customer
- Worker
- Service Token
- Reason
- Uploaded image
- Date
- Status

Admin actions:

```text
Review
Resolve
Contact
```

---

# 46. Worker Utilization

The cooperative dashboard should show workforce utilization.

Example:

```text
Electricians

Available: 20
Busy: 12
Inactive: 5
```

This helps the cooperative identify under-utilized and over-utilized workforce.

---

# 47. AI Demand Forecast

The system should use historical service requests to estimate future demand.

Example:

```text
Electrical Demand

Month 1 → 120
Month 2 → 135
Month 3 → 160
```

AI identifies:

```text
Demand increasing
```

Admin may see:

```text
DEMAND FORECAST

Electrical → HIGH
AC Repair → HIGH
Cleaning → MEDIUM
Carpentry → LOW
```

---

# 48. Workforce Allocation

The important part of forecasting is turning prediction into an operational recommendation.

Example:

```text
AI Forecast
      ↓
High demand in Zone A
      ↓
Only 2 workers available
      ↓
Recommend additional workers
      ↓
Cooperative reallocates workers
```

The system should answer:

> **"What should the cooperative do?"**

rather than only showing a graph.

---

# 49. Welfare / Worker Support

Long-term SAHYOG can include:

- Welfare
- Insurance
- Government schemes
- Worker benefits
- Training
- Certification

For the prototype, welfare information can use mock/demo data.

Complete insurance or government integrations are out of scope for the MVP.

---

# 50. Super Coins / Rewards

A simple reward mechanism may be included.

Example:

```text
Service Completed
→ +25 Coins

Feedback Submitted
→ +10 Coins
```

Worker/customer can see:

```text
Super Coins
350
```

This is a secondary feature and should not consume significant development time.

---

# 51. Complete Customer Flow

```text
OPEN APP
    ↓
LANGUAGE
    ↓
LOGIN / SIGNUP
    ↓
HOW IT WORKS
    ↓
HOME
    ↓
SELECT SERVICE
    ↓
DESCRIBE PROBLEM
    ↓
UPLOAD IMAGE (OPTIONAL)
    ↓
LOCATION
    ↓
DATE/TIME
    ↓
NORMAL / EMERGENCY
    ↓
AI ESTIMATION
    ↓
SMALL / MEDIUM / LARGE
    ↓
PRICE ESTIMATE
    ↓
MATCHING
    ↓
VERIFIED WORKERS
    ↓
MATCH SCORES
    ↓
VIEW PROFILE
    ↓
SELECT WORKER
    ↓
CONNECTION FEE
    ↓
SERVICE TOKEN
    ↓
WORKER RECEIVES REQUEST
    ↓
WORKER ACCEPTS
    ↓
NAVIGATION
    ↓
IN PROGRESS
    ↓
COMPLETED
    ↓
PAYMENT
    ↓
INVOICE
    ↓
CUSTOMER FEEDBACK
    ↓
WORKER FEEDBACK
    ↓
SERVICE HISTORY
```

---

# 52. Complete Worker Flow

```text
OPEN WORKER APP
       ↓
LANGUAGE
       ↓
LOGIN / SIGNUP
       ↓
HOW IT WORKS
       ↓
PROFESSION
       ↓
SKILLS
       ↓
TRAINING
       ↓
YOUTUBE COURSE
       ↓
MCQ
       ↓
50% PASS
       ↓
CERTIFICATE
       ↓
KYC
       ↓
PERSONAL DETAILS
       ↓
EXPERIENCE
       ↓
PROFILE
       ↓
AVAILABILITY
       ↓
RECEIVE JOB
       ↓
ACCEPT / REJECT
       ↓
NAVIGATION
       ↓
START SERVICE
       ↓
COMPLETE SERVICE
       ↓
PAYMENT RECORD
       ↓
CUSTOMER FEEDBACK
       ↓
WORKER FEEDBACK
       ↓
SERVICE HISTORY
```

---

# 53. Complete Admin Flow

```text
ADMIN LOGIN
     ↓
DASHBOARD
     ↓
WORKER VERIFICATION
     ↓
WORKER MANAGEMENT
     ↓
AVAILABILITY
     ↓
SERVICE MONITORING
     ↓
EMERGENCY MONITORING
     ↓
DISPUTES
     ↓
RATINGS
     ↓
WORKER UTILIZATION
     ↓
SERVICE ANALYTICS
     ↓
AI DEMAND FORECAST
     ↓
WORKFORCE ALLOCATION
```

---

# 54. MVP Priority

## P0 — Must Work

These features are mandatory:

```text
Customer Login
Worker Login
Hindi/English
Services
Service Request
Location
Normal/Emergency
Worker Profiles
Availability
Matching
Worker Selection
Booking
Service Token
Accept/Reject
Start
Complete
Feedback
Service History
```

## P1 — Should Work

```text
Training
YouTube Links
MCQ
Certificate
KYC Demo
Admin Verification
Dispute
Payment Demo
Invoice
Super Coins
Basic Analytics
```

## P2 — Demo / Optional

```text
AI Image Estimation
Demand Forecast
Voice Navigation
Welfare Demo
Advanced Analytics
```

### Priority Rule

> **P0 first. P1 second. P2 only after the golden flow works.**

---

# 55. Golden Flow

The most important development flow is:

```text
CUSTOMER
    ↓
CREATE BOOKING
    ↓
MATCHING
    ↓
WORKER RECEIVES
    ↓
ACCEPT
    ↓
START
    ↓
COMPLETE
    ↓
CUSTOMER SEES COMPLETION
```

Once this works:

```text
PAYMENT
    ↓
RATING
    ↓
ADMIN
```

Then:

```text
AI
    ↓
FORECAST
    ↓
WORKFORCE ALLOCATION
```

The prototype must prioritize a complete working transaction over isolated feature development.

---

# 56. Out of Scope for MVP

The following should NOT be built as complex production systems during the 7-day prototype:

- Complex custom ML models
- Full payment marketplace
- Real-time chat
- Complete insurance platform
- Full Aadhaar integration without approved access
- Full DigiLocker integration without approved access
- Multi-city infrastructure
- Huge service catalog
- Complex financial management
- Advanced real-time tracking
- Excessive animations
- Complete custom LMS
- Full government-service integrations

Demo/mock implementations may be used where explicitly defined.

---

# 57. Prototype Constraints

The prototype should optimize for:

1. Functional golden flow
2. Clear UI/UX
3. Realistic demo data
4. Explainable matching
5. Working backend integration
6. Reliable state transitions
7. Hindi/English support
8. Strong cooperative/admin workflow

---

# 58. Platform Verification Criteria

A successful implementation fulfills three core requirements:

### 1. Customer

> **Customers can easily get trusted cooperative services with transparent pricing and live status tracking.**

### 2. Worker

> **Workers gain control, visibility, zero-commission earnings, skill certification, and cooperative mutual aid.**

### 3. Cooperative

> **Cooperatives can use data and AI to better utilize, dispatch, and plan their skilled workforce.**

---

# 59. Core Differentiators

AIDORA differentiates itself through:

### Cooperative Workforce

The platform is designed around cooperative workers.

### Verified Workers

KYC, training, certificates and skills contribute to trust.

### Multi-Profession Workers

One worker can have multiple professions.

### Intelligent Matching

Matching considers multiple factors rather than only distance.

### Fair Allocation

Workload and fairness are considered.

### Worker Control

Workers control:

- Availability
- Job acceptance
- Professional profile

### Two-Way Accountability

Both customer and worker provide feedback.

### Workforce Intelligence

AI helps cooperatives understand demand.

### Workforce Planning

```text
Forecast
   ↓
Recommendation
   ↓
Allocation
```

### Multilingual Access

Hindi + English.

---

# 60. Product Definition

SAHYOG has three primary layers.

## Layer 1 — Marketplace

```text
Customer ↔ Worker
```

## Layer 2 — Cooperative Operations

```text
Worker
   ↓
Verification
   ↓
Skills
   ↓
Availability
   ↓
Workload
   ↓
Allocation
```

## Layer 3 — Intelligence

```text
Historical Data
      ↓
      AI
      ↓
Demand Forecast
      ↓
Workforce Recommendation
```

Therefore:

```text
SAHYOG
   =
Marketplace
+
Cooperative Management
+
AI Workforce Intelligence
```

---

# 61. MVP Scope Lock

From this PRD onward, features should not be added randomly.

A new feature should be considered only if it directly improves one or more of:

1. Customer trust
2. Worker empowerment
3. Cooperative workforce management
4. Intelligent matching
5. Workforce planning
6. Demo clarity

The MVP should remain focused on the core SAHYOG concept.

---

# 62. Final Product Statement

> **SAHYOG is a cooperative-powered service ecosystem where customers get verified skilled workers, workers gain control and opportunities, and cooperatives use data and AI to manage and plan their workforce more intelligently.**