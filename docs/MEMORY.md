# AIDORA — Project Memory

> **Purpose:** Maintain the current project context, implementation status, important constraints, and information that should be preserved across development sessions.

---

# 1. Project Identity

**Project Name:** AIDORA (formerly SAHYOG)

**Project Type:** Cooperative-powered service platform

**Primary Goal:** Connect customers with verified skilled workers while helping cooperatives manage and intelligently plan their workforce.

---

# 2. Product Context

AIDORA connects three major groups:

- Customers
- Skilled Workers
- Cooperatives / Administrators

The platform combines service booking with worker verification, worker development, intelligent matching, and cooperative workforce management.

---

# 3. Core Product Idea

The core concept is:

**Customer needs a service**

↓

**SAHYOG understands the requirement**

↓

**Suitable verified workers are identified**

↓

**Worker receives the request**

↓

**Worker accepts the job**

↓

**Service is completed**

↓

**Customer provides feedback**

At the same time, cooperatives can monitor workers, availability, demand, and workforce allocation.

---

# 4. Main Interfaces

## Customer App

Used by customers to:

- Discover services
- Request services
- Get worker recommendations
- Book workers
- Track services
- Make payments
- Give ratings and reviews
- View booking history

---

## Worker App

Used by workers to:

- Manage worker profile
- Select and manage skills
- Complete training
- Maintain availability
- Receive job requests
- Accept/reject jobs
- Manage active services
- View earnings
- Track completed jobs

---

## Cooperative / Admin Panel

Used to:

- Manage workers
- Verify workers
- Monitor service requests
- Manage workforce
- Allocate workers
- Monitor demand
- View workforce analytics
- Support training and development

---

# 5. Current Documentation System

The project uses eight core documents:

```text
PRD.md
AGENTS.md
DESIGN.md
ARCHITECTURE.md
RULES.md
MEMORY.md
DECISIONS.md
TESTING.md
````

Their responsibilities are:

```text
PRD
↓
What the product must do

AGENTS
↓
How the AI coding agent should work

DESIGN
↓
How the product should look and feel

ARCHITECTURE
↓
How the technical system is structured

RULES
↓
How code should be written

MEMORY
↓
Current project context and state

DECISIONS
↓
Why important decisions were made

TESTING
↓
How functionality should be verified
```

---

# 6. Current Development Stage

The project is currently in the prototype planning and documentation stage.

The documentation foundation is being prepared before major vibe-coding implementation begins.

---

# 7. MVP Golden Flow

The most important product flow is:

```text
Customer Request
        ↓
Smart Matching
        ↓
Worker Receives Request
        ↓
Worker Accepts
        ↓
Worker Starts Service
        ↓
Worker Completes Service
        ↓
Customer Sees Completion
        ↓
Customer Gives Feedback
```

This flow is the highest priority for the prototype.

---

# 8. MVP Priorities

## P0 — Core

* Customer experience
* Worker experience
* Service discovery
* Booking
* Smart matching
* Worker request
* Accept/reject
* Service start
* Service completion
* Feedback
* Service history

## P1 — Important

* Worker training
* YouTube learning links
* MCQ tests
* Certificates
* KYC demo
* Admin verification
* Disputes
* Payment demo
* Invoice
* Basic analytics

## P2 — Advanced

* AI image estimation
* Demand forecasting
* Voice navigation
* Welfare features
* Advanced analytics

---

# 9. UI/UX Reference

**Urban Company** is the primary UI/UX reference for SAHYOG.

Reference areas include:

* Service discovery
* Service categories
* Search experience
* Worker/service-provider profiles
* Ratings
* Verification presentation
* Booking flow
* Time-slot selection
* Service tracking
* Booking history
* Mobile-first usability
* Clear CTA placement
* Clean card-based layouts

SAHYOG should take inspiration from these patterns while maintaining its own:

* Branding
* Visual identity
* Content
* Worker experience
* Cooperative experience
* AI functionality

SAHYOG should not become a direct clone of Urban Company.

---

# 10. Worker Matching Context

The matching system should consider multiple factors.

Conceptual factors:

```text
Skills
+
Verification
+
Availability
+
Distance
+
Experience
+
Rating
+
Workload
+
Fairness
```

↓

```text
Match Score
```

↓

```text
Recommended Workers
```

The system should not select workers using distance alone.

---

# 11. Worker Development Context

SAHYOG includes worker training.

Training flow:

```text
Select Skill
    ↓
Training Videos
    ↓
Learning
    ↓
MCQ Test
    ↓
Result
    ↓
Skill Progress
    ↓
Certificate
```

Training resources may include YouTube learning links.

---

# 12. Cooperative Context

Cooperatives are an important part of the SAHYOG workforce ecosystem.

The cooperative should be able to understand:

* Worker availability
* Worker skills
* Worker workload
* Service demand
* Skill shortages
* Workforce utilization
* Allocation requirements

Conceptual flow:

```text
Service Demand
      ↓
Available Workers
      ↓
Skill Match
      ↓
Workload Check
      ↓
Allocation Recommendation
      ↓
Workforce Planning
```

---

# 13. Prototype Context

The prototype may use realistic demo data where real integrations are unavailable.

Possible demo functionality:

* Mock users
* Mock workers
* Mock payments
* Mock KYC
* Mock verification
* Mock AI matching
* Demo analytics
* Sample locations

Mock functionality must be clearly distinguishable from real integrations.

---

# 14. Important Prototype Principle

The prototype should demonstrate the product concept clearly.

Priority should be:

```text
Working Core Flow
        ↓
Good UI/UX
        ↓
Realistic Demo Data
        ↓
Meaningful AI
        ↓
Secondary Features
```

Advanced functionality should not break or delay the core experience.

---

# 15. Current Technical Direction

The architecture should initially favor a simple modular structure.

Preferred conceptual structure:

```text
Frontend
    ↓
Backend / API
    ↓
Database
```

The backend can initially be implemented as a modular monolith rather than multiple microservices.

Major modules include:

```text
Authentication
Users
Workers
Services
Bookings
Matching
Payments
Reviews
Training
Verification
Notifications
Workforce
Analytics
```

---

# 16. Current Core Data Entities

The system is expected to work with entities such as:

```text
User
Worker
Service
Booking
Skill
Training
Verification
Payment
Review
Notification
Workforce
Analytics
```

The exact database implementation should follow `ARCHITECTURE.md`.

---

# 17. Booking Status Context

The main booking state machine is:

```text
REQUESTED
    ↓
MATCHED
    ↓
ACCEPTED
    ↓
ON_THE_WAY
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Possible alternative states:

```text
REJECTED
CANCELLED
FAILED
```

Invalid transitions should not be allowed.

---

# 18. Important Design Context

The product should prioritize:

```text
Trust
↓
Clarity
↓
Speed
↓
Accessibility
↓
Consistency
```

Every screen should make the next action obvious.

---

# 19. Customer Experience Context

The Customer App should feel familiar and simple.

Important areas:

* Service discovery
* Search
* Service categories
* Requirement description
* Worker recommendations
* Worker profiles
* Booking
* Tracking
* Payment
* Reviews
* History

The customer should not need to understand the internal complexity of the matching or workforce system.

---

# 20. Worker Experience Context

The Worker App should prioritize practical daily usage.

Important areas:

* Job requests
* Current jobs
* Upcoming jobs
* Availability
* Earnings
* Training
* Profile
* Verification

Important actions such as **Accept**, **Reject**, **Start Service**, and **Complete Service** should be easy to find.

---

# 21. Admin / Cooperative Experience Context

The admin/cooperative interface should provide operational visibility.

Important areas:

* Worker management
* Verification
* Requests
* Jobs
* Workforce allocation
* Availability
* Demand
* Analytics

The interface should provide useful information without becoming unnecessarily complex.

---

# 22. Language Context

SAHYOG should support:

```text
English
Hindi
```

where required.

User-facing language should remain simple and understandable.

---

# 23. Security Context

The following must never be committed to Git:

* Passwords
* API keys
* Access tokens
* Private keys
* Database credentials
* Authentication secrets

Use environment variables for sensitive configuration.

---

# 24. Git Context

The project is being maintained using Git.

Repository:

```text
SAHYOG
```

The initial PRD has already been committed.

Preferred workflow:

```text
Make focused change
        ↓
Test
        ↓
Commit
        ↓
Push
```

Use meaningful commit messages.

---

# 25. Documentation Maintenance

Whenever an important project change happens, update the relevant document.

```text
Requirement Change
→ PRD.md

AI Working Rule
→ AGENTS.md

UI/UX Change
→ DESIGN.md

Technical Structure Change
→ ARCHITECTURE.md

Coding Rule Change
→ RULES.md

Project State Change
→ MEMORY.md

Important Decision
→ DECISIONS.md

Testing Change
→ TESTING.md
```

---

# 26. Current Next Steps

After completing the documentation foundation:

```text
1. Complete DECISIONS.md
        ↓
2. Complete TESTING.md
        ↓
3. Verify documentation consistency
        ↓
4. Set up prototype frontend
        ↓
5. Build Customer App foundation
        ↓
6. Build Worker App foundation
        ↓
7. Implement core booking flow
        ↓
8. Implement matching prototype
        ↓
9. Build Cooperative/Admin panel
        ↓
10. Add secondary features
```

---

# 27. Memory Update Rule

This file should represent the **current state of the project**.

Update it when:

* A major feature is completed
* Architecture changes
* Important implementation decisions are made
* MVP priorities change
* Major prototype limitations are introduced
* A significant workflow changes

Do not turn this file into a copy of the entire PRD or architecture document.

---

# 28. Current Project Principle

> **SAHYOG should demonstrate a complete and understandable ecosystem connecting customers, skilled workers, and cooperatives through service booking, intelligent matching, worker development, and workforce management.**

The prototype should focus on proving this concept clearly and reliably.

```
```
