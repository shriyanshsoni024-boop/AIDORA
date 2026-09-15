import React, { useState, useEffect } from 'react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import './DocumentationPage.css';

export const DocumentationPage: React.FC = () => {
  const { navigate } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('part-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth',
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'tech-stack',
        'architecture',
        'customer-flow',
        'worker-flow',
        'admin-flow',
        'state-machine',
        'database-schema',
        'security-rls',
        'identity-session',
        'payments-clearing',
        'ai-analytics',
        'location-geo',
        'kyc-verification',
        'welfare-fund',
        'i18n-localization',
        'current-limitations',
        'prod-goal',
        'prod-auth',
        'prod-payments',
        'prod-maps',
        'prod-notifications',
        'prod-ai',
        'prod-backend',
        'prod-observability',
        'prod-mobile',
        'prod-storage',
        'prod-scalability',
        'prod-datamodel',
        'prod-compliance',
        'prod-cost',
        'prod-comparison',
        'prod-roadmap',
      ];

      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="doc-page-root">
      {/* Top Navigation Bar */}
      <header className="doc-topbar">
        <div className="doc-topbar-left">
          <a
            className="doc-brand"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            aria-label="AIDORA Home"
          >
            <Logo size="xs" />
            <span>AIDORA</span>
          </a>
          <span className="doc-topbar-divider">/</span>
          <span className="doc-topbar-title">Project Documentation</span>
          <span className="doc-version-pill">v1.1.0 MVP</span>
        </div>

        <div className="doc-topbar-right">
          <button
            type="button"
            className="doc-nav-btn secondary"
            onClick={() => navigate('/resources')}
            aria-label="Back to Project Resources"
          >
            <span>← Resources</span>
          </button>
          <button
            type="button"
            className="doc-nav-btn primary"
            onClick={() => navigate('/')}
            aria-label="Open Application"
          >
            <span>Go to App</span>
            <b>→</b>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="doc-layout">
        {/* Sticky Desktop Navigation Sidebar */}
        <aside className="doc-sidebar">
          <div className="doc-sidebar-inner">
            <div className="doc-sidebar-search">
              <input
                type="text"
                placeholder="Filter topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="doc-search-input"
              />
            </div>

            <nav className="doc-toc" aria-label="Documentation Table of Contents">
              <div className="doc-toc-group">
                <div className="doc-toc-heading">
                  <span className="doc-toc-num">01</span> Current Application (MVP)
                </div>
                <ul className="doc-toc-list">
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'overview' ? 'active' : ''}`}
                      onClick={() => scrollToSection('overview')}
                    >
                      1.1 Product Overview
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'tech-stack' ? 'active' : ''}`}
                      onClick={() => scrollToSection('tech-stack')}
                    >
                      1.2 Implemented Tech Stack
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'architecture' ? 'active' : ''}`}
                      onClick={() => scrollToSection('architecture')}
                    >
                      1.3 High-Level Architecture
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'customer-flow' ? 'active' : ''}`}
                      onClick={() => scrollToSection('customer-flow')}
                    >
                      1.4 Customer Workflow
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'worker-flow' ? 'active' : ''}`}
                      onClick={() => scrollToSection('worker-flow')}
                    >
                      1.5 Worker Workflow
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'admin-flow' ? 'active' : ''}`}
                      onClick={() => scrollToSection('admin-flow')}
                    >
                      1.6 Admin & Operations Flow
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'state-machine' ? 'active' : ''}`}
                      onClick={() => scrollToSection('state-machine')}
                    >
                      1.7 Booking State Machine
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'database-schema' ? 'active' : ''}`}
                      onClick={() => scrollToSection('database-schema')}
                    >
                      1.8 Database Architecture (9 Tables)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'security-rls' ? 'active' : ''}`}
                      onClick={() => scrollToSection('security-rls')}
                    >
                      1.9 Security & Row Level Security
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'identity-session' ? 'active' : ''}`}
                      onClick={() => scrollToSection('identity-session')}
                    >
                      1.10 Identity & Session Model
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'payments-clearing' ? 'active' : ''}`}
                      onClick={() => scrollToSection('payments-clearing')}
                    >
                      1.11 Payments & Clearing Ledger
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'ai-analytics' ? 'active' : ''}`}
                      onClick={() => scrollToSection('ai-analytics')}
                    >
                      1.12 AI & Demand Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'location-geo' ? 'active' : ''}`}
                      onClick={() => scrollToSection('location-geo')}
                    >
                      1.13 Geolocation & Proximity
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'kyc-verification' ? 'active' : ''}`}
                      onClick={() => scrollToSection('kyc-verification')}
                    >
                      1.14 KYC Verification Pipeline
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'welfare-fund' ? 'active' : ''}`}
                      onClick={() => scrollToSection('welfare-fund')}
                    >
                      1.15 Cooperative Mutual Aid Fund
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'i18n-localization' ? 'active' : ''}`}
                      onClick={() => scrollToSection('i18n-localization')}
                    >
                      1.16 Internationalization (EN / HI)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item highlight ${activeSection === 'current-limitations' ? 'active' : ''}`}
                      onClick={() => scrollToSection('current-limitations')}
                    >
                      1.17 Current Limitations (10 Boundaries)
                    </button>
                  </li>
                </ul>
              </div>

              <div className="doc-toc-group">
                <div className="doc-toc-heading future">
                  <span className="doc-toc-num">02</span> Full Production Architecture
                </div>
                <ul className="doc-toc-list">
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-goal' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-goal')}
                    >
                      2.1 Production Goal
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-auth' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-auth')}
                    >
                      2.2 Real Phone Authentication
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-payments' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-payments')}
                    >
                      2.3 Production Payments & Payouts
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-maps' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-maps')}
                    >
                      2.4 Production Maps & Telemetry
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-notifications' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-notifications')}
                    >
                      2.5 Multi-Channel Notifications
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-ai' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-ai')}
                    >
                      2.6 Production AI & ML Pipelines
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-backend' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-backend')}
                    >
                      2.7 Scalable Backend Evolution
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-observability' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-observability')}
                    >
                      2.8 Observability & Hardening
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-mobile' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-mobile')}
                    >
                      2.9 Native Mobile Apps
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-storage' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-storage')}
                    >
                      2.10 Enterprise Object Storage
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-scalability' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-scalability')}
                    >
                      2.11 4-Stage Scalability Path
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-datamodel' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-datamodel')}
                    >
                      2.12 Proposed Future Data Model
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-compliance' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-compliance')}
                    >
                      2.13 Governance & Compliance
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-cost' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-cost')}
                    >
                      2.14 Production Cost Areas
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-comparison' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-comparison')}
                    >
                      2.15 MVP vs Production Matrix
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`doc-toc-item ${activeSection === 'prod-roadmap' ? 'active' : ''}`}
                      onClick={() => scrollToSection('prod-roadmap')}
                    >
                      2.16 5-Phase Roadmap
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="doc-content">
          {/* Header Banner */}
          <section className="doc-hero">
            <div className="doc-eyebrow">AIDORA TECHNICAL SPECIFICATION</div>
            <h1 className="doc-main-title">Project Documentation</h1>
            <p className="doc-subtitle">
              Architecture, implementation, technology stack, current capabilities and production roadmap.
            </p>
            <div className="doc-badges-row">
              <span className="doc-badge success">Live Prototype MVP</span>
              <span className="doc-badge info">PostgreSQL + Supabase</span>
              <span className="doc-badge neutral">React 18 + TypeScript</span>
              <span className="doc-badge warning">Honest Engineering Disclosure</span>
            </div>
          </section>

          {/* ============================================================ */}
          {/* PART 1: CURRENT AIDORA APPLICATION                          */}
          {/* ============================================================ */}
          <article className="doc-part-block" id="part-1">
            <div className="doc-part-header">
              <div className="doc-part-number">01</div>
              <div className="doc-part-titles">
                <h2>Current Application</h2>
                <p className="doc-part-intro">
                  This section documents the application that is currently implemented and deployed.
                </p>
              </div>
            </div>

            {/* 1.1 PRODUCT OVERVIEW */}
            <section className="doc-section" id="overview">
              <div className="doc-section-header">
                <h3>1.1 Product Overview</h3>
                <span className="doc-tag current">IMPLEMENTED</span>
              </div>
              <p>
                <strong>AIDORA</strong> is a modern, cooperative services marketplace designed to empower informal skilled workers (artisans) across Indian urban localities while providing households with verified, reliable, and transparently priced on-demand trade services.
              </p>
              <p>
                Unlike commercial aggregator platforms that charge extractive commissions (often 20% to 35%), AIDORA operates on an equitable cooperative model. Customers pay standard transparent rates for service jobs, from which only a modest <strong>₹25 connection fee</strong> is retained by the cooperative federation to sustain platform operations, welfare funds, and training programs. The remaining value is disbursed directly to the artisan.
              </p>

              <div className="doc-cards-grid three-col">
                <div className="doc-info-card">
                  <div className="doc-card-badge customer">CUSTOMER EXPERIENCE</div>
                  <h4>Consumer Service Portal</h4>
                  <ul>
                    <li>Seamless phone number authentication with profile onboarding.</li>
                    <li>Service discovery across 5 primary trades with real-time base pricing.</li>
                    <li>Multimodal Gemini repair photo estimation for automated complexity scoring.</li>
                    <li>Transparent booking dispatch with dynamic 4-digit start-job verification OTP.</li>
                    <li>Razorpay digital checkout / Cash on Service with automated GST receipt generation.</li>
                  </ul>
                </div>

                <div className="doc-info-card">
                  <div className="doc-card-badge worker">WORKER EXPERIENCE</div>
                  <h4>Artisan Dispatch Portal</h4>
                  <ul>
                    <li>Structured trade onboarding (skills, years of experience, operating radius).</li>
                    <li>Digital KYC document upload with administrative review gate.</li>
                    <li>Real-time availability toggle (`AVAILABLE`, `BUSY`, `NOT_AVAILABLE`).</li>
                    <li>Job dispatch notifications with locality details and customer address.</li>
                    <li>Start OTP validation and instant post-job clearing ledger tracking.</li>
                  </ul>
                </div>

                <div className="doc-info-card">
                  <div className="doc-card-badge admin">COOPERATIVE ADMIN</div>
                  <h4>Operations Oversight</h4>
                  <ul>
                    <li>Federation dashboard tracking live dispatches and platform turnover.</li>
                    <li>Artisan KYC approval and rejection queue with audit reason logging.</li>
                    <li>Financial clearing ledger managing worker payouts and platform fees.</li>
                    <li>Cooperative Mutual Aid welfare fund claim processing.</li>
                    <li>Density-based demand forecasting and workforce capacity recommendations.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.2 CURRENT TECHNOLOGY STACK */}
            <section className="doc-section" id="tech-stack">
              <div className="doc-section-header">
                <h3>1.2 Current Technology Stack</h3>
                <span className="doc-tag current">REPOSITORY VERIFIED</span>
              </div>
              <p>
                The current implementation is built using a clean, modern TypeScript architecture verified directly from the source repository. Every dependency and integration listed below is actively utilized in the application codebase.
              </p>

              <div className="doc-table-wrapper">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Technologies Implemented</th>
                      <th>Repository Role & Source Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Frontend Core</strong></td>
                      <td>
                        <span className="doc-pill">React 18.3</span>
                        <span className="doc-pill">TypeScript 5.7</span>
                        <span className="doc-pill">Vite 6.0</span>
                      </td>
                      <td>Single-page application (SPA) with typed interfaces, modular UI components, and fast Hot Module Replacement.</td>
                    </tr>
                    <tr>
                      <td><strong>Styling & Design</strong></td>
                      <td>
                        <span className="doc-pill">Custom Vanilla CSS</span>
                        <span className="doc-pill">Lucide React</span>
                      </td>
                      <td>Curated green-spectrum design tokens, mobile-first responsive grid, and custom SVG iconography without heavyweight CSS frameworks.</td>
                    </tr>
                    <tr>
                      <td><strong>Client PDF Engine</strong></td>
                      <td>
                        <span className="doc-pill">jsPDF 4.2</span>
                      </td>
                      <td>Client-side rendering and instant download of cooperative tax receipts with 30-day service warranty seals.</td>
                    </tr>
                    <tr>
                      <td><strong>Backend & Database</strong></td>
                      <td>
                        <span className="doc-pill">Supabase BaaS</span>
                        <span className="doc-pill">PostgreSQL 15</span>
                      </td>
                      <td>Primary relational database hosting 9 production tables, automated triggers, foreign key constraints, and audit logs.</td>
                    </tr>
                    <tr>
                      <td><strong>Security & Auth</strong></td>
                      <td>
                        <span className="doc-pill">Supabase Auth</span>
                        <span className="doc-pill">Row Level Security (RLS)</span>
                      </td>
                      <td>Phone-to-UUID auth bridging, user-scoped RLS policies on all tables, and security-definer admin permission helpers.</td>
                    </tr>
                    <tr>
                      <td><strong>Cloud Storage</strong></td>
                      <td>
                        <span className="doc-pill">Supabase Storage</span>
                      </td>
                      <td>User-isolated buckets for `profile-photos` and private `kyc-documents` with strict folder-ownership policies.</td>
                    </tr>
                    <tr>
                      <td><strong>Payments</strong></td>
                      <td>
                        <span className="doc-pill">Razorpay Checkout SDK</span>
                        <span className="doc-pill">Clearing Ledger</span>
                      </td>
                      <td>Dynamic script injection supporting UPI, Cards, NetBanking (test sandbox mode), plus cash on service tracking and internal payout clearing.</td>
                    </tr>
                    <tr>
                      <td><strong>AI & Analytics</strong></td>
                      <td>
                        <span className="doc-pill">Gemini 1.5 Flash</span>
                        <span className="doc-pill">Heuristic Fallback</span>
                      </td>
                      <td>Multimodal vision API for repair photo complexity estimation; domain heuristic fallback when offline; statistical density-based demand forecasting.</td>
                    </tr>
                    <tr>
                      <td><strong>Geolocation</strong></td>
                      <td>
                        <span className="doc-pill">HTML5 Geolocation</span>
                        <span className="doc-pill">Haversine Distance</span>
                      </td>
                      <td>Browser coordinates lookup (`navigator.geolocation`), mathematical Haversine spherical distance calculation, and locality coordinate fallbacks.</td>
                    </tr>
                    <tr>
                      <td><strong>Deployment & CI</strong></td>
                      <td>
                        <span className="doc-pill">Vercel Edge</span>
                        <span className="doc-pill">GitHub</span>
                      </td>
                      <td>Continuous production deployment on Vercel with direct Node-invoked TypeScript builds and SPA rewrite routing.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 1.3 HIGH-LEVEL ARCHITECTURE */}
            <section className="doc-section" id="architecture">
              <div className="doc-section-header">
                <h3>1.3 High-Level System Architecture</h3>
                <span className="doc-tag current">ARCHITECTURE DIAGRAM</span>
              </div>
              <p>
                AIDORA follows a decoupled client-server architecture where the React frontend communicates through a centralized typed Service Layer to Supabase (PostgreSQL, Auth, Storage) and external APIs.
              </p>

              <div className="doc-arch-diagram">
                <div className="doc-arch-layer">
                  <div className="doc-arch-layer-label">CLIENT LAYER</div>
                  <div className="doc-arch-nodes">
                    <div className="doc-arch-node client">Customer Portal (Web)</div>
                    <div className="doc-arch-node client">Worker Portal (Web)</div>
                    <div className="doc-arch-node client">Admin Federation Dashboard</div>
                  </div>
                </div>

                <div className="doc-arch-connector">↓ React Context & State Management (`AuthContext`, `BookingContext`, `WorkerContext`, `LanguageContext`)</div>

                <div className="doc-arch-layer">
                  <div className="doc-arch-layer-label">TYPED SERVICE LAYER (FRONTEND CONTROLLERS)</div>
                  <div className="doc-arch-nodes grid-4">
                    <div className="doc-arch-node service">`authService`<br/><small>Session & Bridge</small></div>
                    <div className="doc-arch-node service">`bookingService`<br/><small>Dispatch & Lifecycle</small></div>
                    <div className="doc-arch-node service">`workerService`<br/><small>Profile & KYC</small></div>
                    <div className="doc-arch-node service">`paymentService`<br/><small>Razorpay & Cash</small></div>
                    <div className="doc-arch-node service">`aiService`<br/><small>Gemini & Density</small></div>
                    <div className="doc-arch-node service">`geoService`<br/><small>Haversine Distance</small></div>
                    <div className="doc-arch-node service">`welfareService`<br/><small>Mutual Aid Fund</small></div>
                    <div className="doc-arch-node service">`adminService`<br/><small>Clearing & Ops</small></div>
                  </div>
                </div>

                <div className="doc-arch-connector">↓ Supabase Client (`@supabase/supabase-js`) & External Integrations</div>

                <div className="doc-arch-layer backend">
                  <div className="doc-arch-layer-label">MANAGED BACKEND & DATA LAYER (SUPABASE)</div>
                  <div className="doc-arch-nodes three-col">
                    <div className="doc-arch-node db">
                      <strong>Supabase Auth</strong>
                      <p>Phone OTP bridge, JWT sessions, `auth.uid()`</p>
                    </div>
                    <div className="doc-arch-node db highlight">
                      <strong>PostgreSQL 15 + RLS</strong>
                      <p>9 Core Tables, Relational integrity, Database triggers & status audit</p>
                    </div>
                    <div className="doc-arch-node db">
                      <strong>Supabase Storage</strong>
                      <p>Buckets: `profile-photos`, `kyc-documents` with folder security</p>
                    </div>
                  </div>
                </div>

                <div className="doc-arch-connector">↔ External Cloud Services</div>

                <div className="doc-arch-layer external">
                  <div className="doc-arch-layer-label">EXTERNAL INTEGRATIONS</div>
                  <div className="doc-arch-nodes four-col">
                    <div className="doc-arch-node ext">
                      <strong>Razorpay</strong>
                      <small>Checkout SDK Modal (Test Key)</small>
                    </div>
                    <div className="doc-arch-node ext">
                      <strong>Google Gemini</strong>
                      <small>Gemini 1.5 Flash Multimodal Vision</small>
                    </div>
                    <div className="doc-arch-node ext">
                      <strong>Vercel Edge</strong>
                      <small>Production CDN & Hosting</small>
                    </div>
                    <div className="doc-arch-node ext">
                      <strong>GitHub</strong>
                      <small>Source Control & CI Pipeline</small>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.4 CUSTOMER WORKFLOW */}
            <section className="doc-section" id="customer-flow">
              <div className="doc-section-header">
                <h3>1.4 Customer Experience & Booking Flow</h3>
                <span className="doc-tag current">END-TO-END VERIFIED</span>
              </div>
              <p>
                The customer journey is structured to ensure effortless service discovery, transparent pricing, verified dispatch, and secure on-site execution.
              </p>

              <div className="doc-flow-steps">
                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">1</div>
                  <div className="doc-flow-step-body">
                    <strong>Authentication & Verification</strong>
                    <p>
                      Customer inputs a 10-digit Indian mobile number. The system verifies identity using the login OTP mechanism (<strong>fixed OTP `123456` in prototype mode</strong>) and initializes an isolated session mapped to a dedicated Supabase profile.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">2</div>
                  <div className="doc-flow-step-body">
                    <strong>Profile & Address Setup</strong>
                    <p>
                      On initial login, the customer completes their personal profile (Name, locality, city, state, pincode, preferred language, emergency contact). Multiple saved delivery addresses are stored in a structured JSONB array.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">3</div>
                  <div className="doc-flow-step-body">
                    <strong>Service Discovery & AI Photo Diagnosis</strong>
                    <p>
                      Customer browses categories (Electrical, Plumbing, AC & Appliance, Carpentry, Deep Cleaning). Optionally, the customer can upload an image of the breakdown; Gemini 1.5 Flash analyzes complexity and recommends the appropriate service tier (`SMALL`, `MEDIUM`, `LARGE`).
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">4</div>
                  <div className="doc-flow-step-body">
                    <strong>Dispatch & Cooperative Artisan Matching</strong>
                    <p>
                      Customer confirms booking parameters (Immediate Dispatch vs. Scheduled Date, Normal vs. Emergency urgency). The system calculates spherical Haversine distances to locate available, verified cooperative artisans within the service radius.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">5</div>
                  <div className="doc-flow-step-body">
                    <strong>Live Tracking & Start-Job OTP Verification</strong>
                    <p>
                      Customer monitors the booking status in real-time (`REQUESTED` → `MATCHED` → `ACCEPTED` → `ON_THE_WAY`). Upon arrival, the customer provides a <strong>unique dynamically generated 4-digit Service Start OTP</strong> (e.g., `4829`) to the worker to initiate the job.
                    </p>
                    <div className="doc-callout info">
                      <strong>Important Architectural Distinction:</strong> The <em>Login OTP</em> (`123456`) is a fixed prototype authentication code, whereas the <em>Service Start OTP</em> (`4-digit token`) is a dynamic, cryptographically generated verification code stored per booking record to guarantee artisan physical presence before work begins.
                    </div>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">6</div>
                  <div className="doc-flow-step-body">
                    <strong>Payment, Invoice & 30-Day Warranty</strong>
                    <p>
                      Following job completion, the customer settles the transparent bill (Base Price + ₹25 Connection Fee) via Razorpay or Cash on Service. An automated PDF invoice with a 30-day cooperative warranty seal is rendered via jsPDF. Customer provides a 1-5 star rating and review.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.5 WORKER WORKFLOW */}
            <section className="doc-section" id="worker-flow">
              <div className="doc-section-header">
                <h3>1.5 Worker (Artisan) Experience & Execution Flow</h3>
                <span className="doc-tag current">END-TO-END VERIFIED</span>
              </div>
              <p>
                The worker experience empowers artisans with flexible scheduling, fair earnings transparency, and instant settlement tracking without intermediary middleman deductions.
              </p>

              <div className="doc-flow-steps">
                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">1</div>
                  <div className="doc-flow-step-body">
                    <strong>Worker Onboarding & Skill Definition</strong>
                    <p>
                      Artisan logs in via mobile number and registers their core trade (Electrician, Plumber, AC Technician, Carpenter, Mason), skills array, experience level (Beginner, Intermediate, Advanced), service radius (e.g., 10 km), and language capabilities.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">2</div>
                  <div className="doc-flow-step-body">
                    <strong>Digital KYC Submission</strong>
                    <p>
                      Artisan uploads government identification (masked Aadhaar / PAN) and trade certificates. The record enters `PENDING` status in `kyc_records` awaiting cooperative federation review. Artisans cannot self-verify.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">3</div>
                  <div className="doc-flow-step-body">
                    <strong>Cooperative Board Verification</strong>
                    <p>
                      Once verified by an admin, the worker's `verification_status` transitions to `VERIFIED`, unlocking access to live job dispatches.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">4</div>
                  <div className="doc-flow-step-body">
                    <strong>Job Acceptance & Travel</strong>
                    <p>
                      Worker toggles availability to `AVAILABLE`. When a matching job is assigned in their zone, the worker reviews job details and accepts (`ACCEPTED`). They update status to `ON_THE_WAY` as they travel to the site.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">5</div>
                  <div className="doc-flow-step-body">
                    <strong>On-Site OTP Validation & Execution</strong>
                    <p>
                      Worker arrives at the customer premises, inspects the repair, and requests the customer's 4-digit start OTP. Worker enters the OTP in their terminal; upon match, status transitions to `IN_PROGRESS`.
                    </p>
                  </div>
                </div>

                <div className="doc-flow-step">
                  <div className="doc-flow-step-num">6</div>
                  <div className="doc-flow-step-body">
                    <strong>Job Completion & Clearing Ledger Credit</strong>
                    <p>
                      Worker marks the job `COMPLETED`. An automated database trigger records the transaction in `worker_earnings` (Gross Amount − ₹25 Platform Fee = Net Artisan Payout). Worker monitors cumulative settled earnings and submits welfare relief claims if necessary.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.6 ADMIN & OPERATIONS FLOW */}
            <section className="doc-section" id="admin-flow">
              <div className="doc-section-header">
                <h3>1.6 Admin & Cooperative Operations Flow</h3>
                <span className="doc-tag current">END-TO-END VERIFIED</span>
              </div>
              <p>
                Cooperative federation officials access a unified operations suite providing real-time governance, quality control, financial clearing, and workforce balancing.
              </p>

              <div className="doc-cards-grid two-col">
                <div className="doc-info-card">
                  <h4>Artisan KYC Verification Queue</h4>
                  <p>
                    Admin reviews pending artisan applications, inspects submitted identification and trade certifications, and issues approval or rejection with mandatory audit feedback notes.
                  </p>
                </div>
                <div className="doc-info-card">
                  <h4>Live Booking & Dispatch Oversight</h4>
                  <p>
                    Real-time monitoring of all active bookings across Bangalore zones, tracking worker assignment, customer coordinates, and emergency escalation dispatches.
                  </p>
                </div>
                <div className="doc-info-card">
                  <h4>Financial Clearing & Payout Management</h4>
                  <p>
                    Oversight of gross platform turnover, cumulative ₹25 connection fees, and processing artisan payout settlements with unique clearing references (`COOP-CLR-2026-XXXX`).
                  </p>
                </div>
                <div className="doc-info-card">
                  <h4>Demand Forecasting & Workforce Reallocation</h4>
                  <p>
                    Statistical analysis of active booking density across geographic zones. The engine computes surge multipliers and recommends standby artisan reallocations to meet sub-15 min SLAs.
                  </p>
                </div>
              </div>
            </section>

            {/* 1.7 BOOKING STATE MACHINE */}
            <section className="doc-section" id="state-machine">
              <div className="doc-section-header">
                <h3>1.7 Booking State Machine</h3>
                <span className="doc-tag current">DATABASE ENFORCED</span>
              </div>
              <p>
                Every booking progresses through a deterministic PostgreSQL enum state machine (`booking_status`). Every transition automatically generates an immutable audit record in `booking_status_history`.
              </p>

              <div className="doc-state-machine">
                <div className="doc-state-node">
                  <div className="doc-state-badge">1. REQUESTED</div>
                  <p>Booking placed by customer with selected service tier and address.</p>
                </div>
                <div className="doc-state-arrow">→</div>
                <div className="doc-state-node">
                  <div className="doc-state-badge">2. MATCHED</div>
                  <p>Cooperative dispatch assigns an eligible artisan within service radius.</p>
                </div>
                <div className="doc-state-arrow">→</div>
                <div className="doc-state-node">
                  <div className="doc-state-badge">3. ACCEPTED</div>
                  <p>Artisan reviews job scope and formally accepts the dispatch request.</p>
                </div>
                <div className="doc-state-arrow">→</div>
                <div className="doc-state-node">
                  <div className="doc-state-badge">4. ON_THE_WAY</div>
                  <p>Artisan is in transit to the customer location.</p>
                </div>
                <div className="doc-state-arrow">→</div>
                <div className="doc-state-node">
                  <div className="doc-state-badge active">5. IN_PROGRESS</div>
                  <p>4-digit start OTP verified on-site. Active repair work underway.</p>
                </div>
                <div className="doc-state-arrow">→</div>
                <div className="doc-state-node">
                  <div className="doc-state-badge success">6. COMPLETED</div>
                  <p>Work finished, payment settled, warranty active, earnings credited.</p>
                </div>
              </div>
              <p className="doc-caption">
                <em>Alternate Path:</em> Bookings in pre-execution states can transition to <code>CANCELLED</code> if cancelled by the customer or cooperative dispatch, releasing the assigned worker.
              </p>
            </section>

            {/* 1.8 DATABASE ARCHITECTURE */}
            <section className="doc-section" id="database-schema">
              <div className="doc-section-header">
                <h3>1.8 Database Architecture & Master Schema</h3>
                <span className="doc-tag current">9 PRODUCTION TABLES</span>
              </div>
              <p>
                The production PostgreSQL database runs on Supabase and consists of 9 core tables enforcing strict relational constraints, referential cascades, and automated timestamps.
              </p>

              <div className="doc-schema-grid">
                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>1. profiles</h4>
                    <span className="doc-table-type">User Core</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK, FK auth.users)</code>
                    <code><strong>role</strong>: user_role ('customer'|'worker'|'admin')</code>
                    <code><strong>name</strong>: TEXT</code>
                    <code><strong>phone</strong>: TEXT</code>
                    <code><strong>email</strong>: TEXT (optional)</code>
                    <code><strong>avatar_url</strong>: TEXT</code>
                    <code><strong>address</strong>: TEXT, <strong>locality</strong>: TEXT</code>
                    <code><strong>city</strong>: TEXT, <strong>state</strong>: TEXT, <strong>pincode</strong>: TEXT</code>
                    <code><strong>preferred_language</strong>: TEXT ('en'|'hi')</code>
                    <code><strong>saved_addresses</strong>: JSONB</code>
                    <code><strong>is_profile_completed</strong>: BOOLEAN</code>
                    <code><strong>created_at</strong>, <strong>updated_at</strong>: TIMESTAMPTZ</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>2. workers</h4>
                    <span className="doc-table-type">Artisan Profile</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>profile_id</strong>: UUID (FK profiles.id, UNIQUE)</code>
                    <code><strong>name</strong>: TEXT, <strong>phone</strong>: TEXT</code>
                    <code><strong>trade</strong>: TEXT (e.g., 'Electrician')</code>
                    <code><strong>skills</strong>: TEXT[]</code>
                    <code><strong>experience_years</strong>: INT, <strong>experience_level</strong>: TEXT</code>
                    <code><strong>rating</strong>: NUMERIC(3,2), <strong>review_count</strong>: INT</code>
                    <code><strong>completed_jobs</strong>: INT</code>
                    <code><strong>service_radius_km</strong>: INT (default 10)</code>
                    <code><strong>availability</strong>: worker_availability ('AVAILABLE'|'BUSY'|'NOT_AVAILABLE')</code>
                    <code><strong>verification_status</strong>: verification_status ('PENDING'|'VERIFIED'|'REJECTED')</code>
                    <code><strong>languages</strong>: TEXT[], <strong>bio</strong>: TEXT</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>3. services</h4>
                    <span className="doc-table-type">Catalog</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: TEXT (PK, e.g., 'el-01')</code>
                    <code><strong>name</strong>: TEXT, <strong>name_hi</strong>: TEXT</code>
                    <code><strong>category</strong>: TEXT, <strong>category_id</strong>: TEXT</code>
                    <code><strong>base_price</strong>: INT</code>
                    <code><strong>emergency_available</strong>: BOOLEAN</code>
                    <code><strong>duration</strong>: TEXT, <strong>duration_hi</strong>: TEXT</code>
                    <code><strong>description</strong>: TEXT, <strong>skills</strong>: TEXT[]</code>
                    <code><strong>popular</strong>: BOOLEAN, <strong>created_at</strong>: TIMESTAMPTZ</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>4. bookings</h4>
                    <span className="doc-table-type">Transaction Core</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>token</strong>: TEXT (UNIQUE, e.g., 'SYH-48291')</code>
                    <code><strong>customer_id</strong>: UUID (FK profiles.id)</code>
                    <code><strong>worker_id</strong>: UUID (FK workers.id)</code>
                    <code><strong>service_id</strong>: TEXT (FK services.id)</code>
                    <code><strong>service_name</strong>: TEXT, <strong>address</strong>: TEXT</code>
                    <code><strong>urgency</strong>: urgency_level ('NORMAL'|'EMERGENCY')</code>
                    <code><strong>tier</strong>: service_tier ('SMALL'|'MEDIUM'|'LARGE')</code>
                    <code><strong>estimated_price</strong>: INT, <strong>connection_fee</strong>: INT (25)</code>
                    <code><strong>total_price</strong>: INT, <strong>worker_payout</strong>: INT</code>
                    <code><strong>status</strong>: booking_status ('REQUESTED'..'COMPLETED')</code>
                    <code><strong>otp</strong>: TEXT (4-digit start OTP)</code>
                    <code><strong>payment_status</strong>: TEXT ('PENDING'|'PAID')</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>5. booking_status_history</h4>
                    <span className="doc-table-type">Audit Log</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>booking_id</strong>: UUID (FK bookings.id CASCADE)</code>
                    <code><strong>status</strong>: booking_status</code>
                    <code><strong>note</strong>: TEXT (Automated transition explanation)</code>
                    <code><strong>changed_by</strong>: UUID (FK profiles.id)</code>
                    <code><strong>timestamp</strong>: TIMESTAMPTZ (Auto log trigger)</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>6. payments</h4>
                    <span className="doc-table-type">Financials</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>booking_id</strong>: UUID (FK bookings.id)</code>
                    <code><strong>customer_id</strong>: UUID (FK profiles.id)</code>
                    <code><strong>amount</strong>: INT, <strong>currency</strong>: TEXT ('INR')</code>
                    <code><strong>payment_method</strong>: TEXT ('Razorpay / UPI Escrow'|'Cash')</code>
                    <code><strong>payment_status</strong>: TEXT ('PENDING'|'PAID'|'REFUNDED')</code>
                    <code><strong>razorpay_payment_id</strong>: TEXT, <strong>razorpay_order_id</strong>: TEXT</code>
                    <code><strong>razorpay_signature</strong>: TEXT</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>7. worker_earnings</h4>
                    <span className="doc-table-type">Clearing Ledger</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>worker_id</strong>: UUID (FK workers.id CASCADE)</code>
                    <code><strong>booking_id</strong>: UUID (FK bookings.id)</code>
                    <code><strong>amount</strong>: INT (Total booking amount)</code>
                    <code><strong>platform_fee</strong>: INT (Cooperative fee ₹25)</code>
                    <code><strong>net_payout</strong>: INT (Artisan share)</code>
                    <code><strong>status</strong>: TEXT ('PAID'|'PENDING')</code>
                    <code><strong>created_at</strong>: TIMESTAMPTZ (Auto-created on completion)</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>8. reviews</h4>
                    <span className="doc-table-type">Reputation</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>booking_id</strong>: UUID (FK bookings.id)</code>
                    <code><strong>customer_id</strong>: UUID (FK profiles.id)</code>
                    <code><strong>worker_id</strong>: UUID (FK workers.id CASCADE)</code>
                    <code><strong>author_name</strong>: TEXT</code>
                    <code><strong>rating</strong>: NUMERIC(2,1) (1.0 to 5.0)</code>
                    <code><strong>comment</strong>: TEXT, <strong>chips</strong>: TEXT[]</code>
                  </div>
                </div>

                <div className="doc-table-card">
                  <div className="doc-table-card-header">
                    <h4>9. kyc_records</h4>
                    <span className="doc-table-type">Compliance</span>
                  </div>
                  <div className="doc-table-fields">
                    <code><strong>id</strong>: UUID (PK)</code>
                    <code><strong>worker_id</strong>: UUID (FK workers.id CASCADE)</code>
                    <code><strong>worker_name</strong>: TEXT, <strong>profession</strong>: TEXT</code>
                    <code><strong>cooperative</strong>: TEXT, <strong>documents</strong>: TEXT</code>
                    <code><strong>status</strong>: verification_status ('PENDING'|'VERIFIED'|'REJECTED')</code>
                    <code><strong>rejection_reason</strong>: TEXT (Audit note)</code>
                    <code><strong>submitted_at</strong>, <strong>reviewed_at</strong>: TIMESTAMPTZ</code>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.9 SECURITY & ROW LEVEL SECURITY */}
            <section className="doc-section" id="security-rls">
              <div className="doc-section-header">
                <h3>1.9 Security & Row Level Security (RLS) Model</h3>
                <span className="doc-tag current">POSTGRESQL LEVEL</span>
              </div>
              <p>
                AIDORA enforces security directly at the PostgreSQL database engine and object storage policy layers, guaranteeing that security does not rely solely on frontend logic.
              </p>

              <div className="doc-security-grid">
                <div className="doc-sec-card">
                  <h4>PostgreSQL Row Level Security</h4>
                  <p>
                    All 9 production tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Users can only query and mutate records matching their authenticated identifier (`auth.uid() = id` or `auth.uid() = customer_id`).
                  </p>
                </div>
                <div className="doc-sec-card">
                  <h4>Cooperative Admin Authorization</h4>
                  <p>
                    Administrative operations are guarded by the secure PostgreSQL function <code>public.is_admin_or_cooperative()</code>, which verifies caller identity in <code>profiles</code> without recursion.
                  </p>
                </div>
                <div className="doc-sec-card">
                  <h4>User-Scoped Storage Isolation</h4>
                  <p>
                    Supabase Storage buckets (<code>profile-photos</code>, <code>kyc-documents</code>) enforce folder-path ownership policies: <code>(storage.foldername(name))[1] = auth.uid()::text</code>. Authenticated users cannot overwrite, read, or delete photos outside their folder.
                  </p>
                </div>
                <div className="doc-sec-card">
                  <h4>Cross-Account Protection</h4>
                  <p>
                    Workers cannot view other workers' earnings or KYC documents. Customers cannot inspect unrelated bookings or payments. Admin operations are strictly auditable.
                  </p>
                </div>
              </div>
            </section>

            {/* 1.10 IDENTITY & SESSION MODEL */}
            <section className="doc-section" id="identity-session">
              <div className="doc-section-header">
                <h3>1.10 Identity & Session Model</h3>
                <span className="doc-tag current">VERIFIED ISOLATION</span>
              </div>
              <p>
                The application maps phone numbers into authentic Supabase Auth users via a deterministic bridge. Every phone number generates an independent <code>auth.uid()</code> and user-scoped database profile.
              </p>
              <div className="doc-code-block">
                <code>
                  Phone (+91XXXXXXXXXX) → Supabase Auth User → auth.uid() → public.profiles (Scoped Profile) → User Application State
                </code>
              </div>
              <p>
                Rigorous testing (100 independent verification rounds) confirmed that logging in with distinct phone numbers maintains absolute profile separation with zero cross-session data leakage.
              </p>
            </section>

            {/* 1.11 PAYMENTS & CLEARING */}
            <section className="doc-section" id="payments-clearing">
              <div className="doc-section-header">
                <h3>1.11 Payments & Clearing Ledger</h3>
                <span className="doc-tag current">HYBRID INTEGRATION</span>
              </div>
              <p>
                The current payment architecture implements two primary paths:
              </p>
              <ul>
                <li>
                  <strong>Razorpay Sandbox/Test Integration:</strong> Dynamically loads the official Razorpay Checkout modal with test keys, processing mock UPI, Card, and NetBanking transactions with real event handlers.
                </li>
                <li>
                  <strong>Cash on Service / Cooperative Escrow:</strong> Allows on-site cash payment upon completion, recorded transparently in the database.
                </li>
                <li>
                  <strong>Internal Cooperative Clearing Ledger:</strong> Worker payouts are tracked through an internal accounting clearing ledger. When an admin clears a payout, the system generates a clearing reference code (<code>COOP-CLR-2026-XXXX</code>) and marks the record paid.
                </li>
              </ul>
              <div className="doc-callout warning">
                <strong>Honest Architecture Note:</strong> The current cooperative clearing ledger is an internal database/accounting workflow. It does <em>not</em> execute automated commercial bank payout APIs (e.g. RazorpayX / Direct IMPS) in the prototype phase.
              </div>
            </section>

            {/* 1.12 AI & DEMAND ANALYTICS */}
            <section className="doc-section" id="ai-analytics">
              <div className="doc-section-header">
                <h3>1.12 AI Diagnostics & Demand Analytics</h3>
                <span className="doc-tag current">MULTIMODAL + HEURISTIC</span>
              </div>
              <p>
                AIDORA incorporates artificial intelligence across three specific operational areas:
              </p>

              <div className="doc-cards-grid three-col">
                <div className="doc-info-card">
                  <h4>A. Service Photo Analysis</h4>
                  <p>
                    Integrates with <strong>Google Gemini 1.5 Flash</strong> via multimodal REST API. The model analyzes breakdown photos and returns structured technical diagnoses and service tiers.
                  </p>
                  <p className="doc-card-subtext">
                    <em>Offline Fallback:</em> When the Gemini API key is unconfigured or offline, a domain-specific rule-based heuristic analyzer provides instant zero-downtime estimates. (The fallback is a heuristic, not a generative model).
                  </p>
                </div>

                <div className="doc-info-card">
                  <h4>B. Demand Forecasting</h4>
                  <p>
                    Aggregates live booking data across Bangalore zones (Indiranagar, Koramangala, Whitefield, HSR Layout) to calculate active dispatch density and project 7-day volume.
                  </p>
                  <p className="doc-card-subtext">
                    <em>Methodology:</em> Currently computed via statistical booking density formulas rather than a trained ML time-series model.
                  </p>
                </div>

                <div className="doc-info-card">
                  <h4>C. Workforce Allocation</h4>
                  <p>
                    Computes real-time capacity ratios per trade and zone. Recommends standby artisan reallocations when active dispatches exceed threshold limits to guarantee service SLAs.
                  </p>
                </div>
              </div>
            </section>

            {/* 1.13 LOCATION & GEOLOCATION */}
            <section className="doc-section" id="location-geo">
              <div className="doc-section-header">
                <h3>1.13 Geolocation & Proximity Calculation</h3>
                <span className="doc-tag current">BROWSER GPS + HAVERSINE</span>
              </div>
              <p>
                Proximity calculations between customer booking addresses and artisan coverage zones utilize the standard spherical <strong>Haversine Distance Formula</strong> calculated client-side in Kilometers:
              </p>
              <div className="doc-code-block">
                <code>
                  d = 2R × asin(sqrt(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)))
                </code>
              </div>
              <p>
                Location data is sourced via standard browser geolocation permissions (<code>navigator.geolocation.getCurrentPosition</code>) with a graceful fallback to verified Bangalore locality coordinates (Indiranagar, Koramangala, HSR Layout, Whitefield, Jayanagar).
              </p>
              <div className="doc-callout warning">
                <strong>Honest Architecture Note:</strong> The current prototype does not feature background continuous mobile GPS telemetry or live turn-by-turn map navigation.
              </div>
            </section>

            {/* 1.14 KYC VERIFICATION */}
            <section className="doc-section" id="kyc-verification">
              <div className="doc-section-header">
                <h3>1.14 KYC Verification Pipeline</h3>
                <span className="doc-tag current">ADMIN GATED</span>
              </div>
              <p>
                Worker onboarding incorporates a mandatory two-step KYC gate:
              </p>
              <ol className="doc-ordered-list">
                <li>
                  <strong>Submission:</strong> Worker uploads masked identity documents and trade credentials to the private <code>kyc-documents</code> storage bucket, creating a record in <code>kyc_records</code> with status <code>PENDING</code>.
                </li>
                <li>
                  <strong>Federation Review:</strong> Cooperative Admin reviews documents in the operations portal. Admin either approves (worker status becomes <code>VERIFIED</code>, enabling dispatch matching) or rejects with a documented reason.
                </li>
                <li>
                  <strong>Security Guarantee:</strong> Artisans cannot self-approve, and documents are protected by strict RLS storage policies.
                </li>
              </ol>
            </section>

            {/* 1.15 WELFARE MUTUAL AID FUND */}
            <section className="doc-section" id="welfare-fund">
              <div className="doc-section-header">
                <h3>1.15 Cooperative Mutual Aid & Welfare Fund</h3>
                <span className="doc-tag current">INTERNAL SAFETY NET</span>
              </div>
              <p>
                AIDORA includes an internal <strong>Cooperative Safety Net & Mutual Aid Fund</strong> (backed by a ₹2.5 Lakh seed pool). Artisans can submit assistance requests for On-Duty Accidents, Emergency Medical support, Tool Damage, or Family Relief. Cooperative admins review and disburse assistance through the internal ledger.
              </p>
              <div className="doc-callout warning">
                <strong>Honest Architecture Note:</strong> This is currently an internal cooperative mutual aid ledger and not an automated third-party commercial insurance claims settlement API.
              </div>
            </section>

            {/* 1.16 INTERNATIONALIZATION */}
            <section className="doc-section" id="i18n-localization">
              <div className="doc-section-header">
                <h3>1.16 Internationalization (i18n)</h3>
                <span className="doc-tag current">DUAL LANGUAGE SUPPORT</span>
              </div>
              <p>
                The application provides seamless bilingual support for <strong>English</strong> and <strong>Hindi (हिंदी)</strong> through a lightweight React <code>LanguageContext</code> utilizing typed dictionary translation keys (<code>en.ts</code>, <code>hi.ts</code>).
              </p>
              <p>
                Translations cover customer service discovery, booking tracking, worker onboarding, and job dispatches. Deep administrative management tables are currently maintained primarily in English.
              </p>
            </section>

            {/* 1.17 CURRENT LIMITATIONS */}
            <section className="doc-section highlight-box" id="current-limitations">
              <div className="doc-section-header">
                <h3>1.17 Current Limitations (The 10 Engineering Boundaries)</h3>
                <span className="doc-tag limitation">HONEST DISCLOSURE</span>
              </div>
              <p>
                To maintain complete technical transparency, the table below outlines the 10 engineering boundaries between the current functional MVP prototype and a fully funded commercial deployment.
              </p>

              <div className="doc-limitations-table-wrapper">
                <table className="doc-table limitations">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Capability / Area</th>
                      <th style={{ width: '26%' }}>Current State (MVP)</th>
                      <th style={{ width: '26%' }}>Why It Exists in Prototype</th>
                      <th style={{ width: '26%' }}>Full Production Upgrade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>1. Phone Login OTP</strong></td>
                      <td>Uses fixed demo OTP <code>123456</code> for customer and worker phone logins.</td>
                      <td>Allows instantaneous zero-cost testing without paid Indian SMS gateway DLT compliance overhead.</td>
                      <td>Integration with Indian telecom SMS gateway (MSG91 / Twilio Verify) with dynamic cryptographic OTPs and rate limiting.</td>
                    </tr>
                    <tr>
                      <td><strong>2. Notifications & Dispatch</strong></td>
                      <td>In-app reactive state changes; no outbound SMS/Push messages.</td>
                      <td>Avoids reliance on paid external push/SMS gateways during prototype development.</td>
                      <td>Multi-channel event-driven pipeline via Firebase Cloud Messaging (FCM), MSG91 SMS, and Resend email.</td>
                    </tr>
                    <tr>
                      <td><strong>3. Worker Payouts</strong></td>
                      <td>Internal cooperative clearing ledger with reference codes (<code>COOP-CLR-2026-XXXX</code>).</td>
                      <td>Proves the complete accounting and platform fee deduction lifecycle without banking API underwriting.</td>
                      <td>Regulated banking payout integration (RazorpayX / Direct IMPS) for instant automated bank transfers.</td>
                    </tr>
                    <tr>
                      <td><strong>4. Payment Gateway</strong></td>
                      <td>Razorpay Checkout SDK in test/sandbox mode with mock UPI/Cards.</td>
                      <td>Enables full interactive checkout UX verification without requiring live merchant account credentials.</td>
                      <td>Production Razorpay merchant credentials with server-side webhook signature verification.</td>
                    </tr>
                    <tr>
                      <td><strong>5. AI Photo Estimator</strong></td>
                      <td>Gemini 1.5 Flash multimodal API with domain-specific heuristic fallback.</td>
                      <td>Ensures flawless zero-error demo reliability even when API keys are unconfigured or rate-limited.</td>
                      <td>Managed Gemini 1.5 Pro pipeline with image preprocessing and automated spare-parts catalog matching.</td>
                    </tr>
                    <tr>
                      <td><strong>6. Demand Forecasting</strong></td>
                      <td>Statistical density aggregation based on active booking counts.</td>
                      <td>Provides meaningful operational insights prior to accumulating years of longitudinal training data.</td>
                      <td>Trained machine learning time-series forecasting model (XGBoost / LightGBM) on historical demand.</td>
                    </tr>
                    <tr>
                      <td><strong>7. Geolocation & Maps</strong></td>
                      <td>HTML5 browser geolocation + mathematical Haversine distance formula.</td>
                      <td>Zero-cost proximity matching without expensive Google Maps API credit consumption.</td>
                      <td>Google Maps Platform / Mapbox SDK with live GPS telemetry, traffic-aware routing, and dynamic ETA.</td>
                    </tr>
                    <tr>
                      <td><strong>8. Worker Welfare Fund</strong></td>
                      <td>Internal Cooperative Mutual Aid workflow and seed reserve ledger.</td>
                      <td>Demonstrates cooperative safety net economics without commercial insurance policy underwriting.</td>
                      <td>Formal integration with licensed group insurance providers for automated cashless claim settlement.</td>
                    </tr>
                    <tr>
                      <td><strong>9. Mobile Application</strong></td>
                      <td>Responsive Web Application / Progressive Web App (PWA) layout.</td>
                      <td>Enables universal cross-platform access across all mobile and desktop browsers with zero install friction.</td>
                      <td>Native iOS and Android builds (React Native / Flutter) for background GPS, push notifications, and camera capture.</td>
                    </tr>
                    <tr>
                      <td><strong>10. Multilingual Scope</strong></td>
                      <td>Bilingual English and Hindi for customer and worker portals.</td>
                      <td>Covers primary pilot regional languages with dictionary-based React context keys.</td>
                      <td>Full regional language expansion (Kannada, Tamil, Telugu, Marathi, Bengali) across all admin and operational screens.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </article>

          {/* ============================================================ */}
          {/* PART 2: FULL PRODUCTION / FUNDED AIDORA                     */}
          {/* ============================================================ */}
          <article className="doc-part-block" id="part-2">
            <div className="doc-part-header future">
              <div className="doc-part-number future">02</div>
              <div className="doc-part-titles">
                <h2>Full Production Architecture</h2>
                <p className="doc-part-intro">
                  What we would deploy with production infrastructure, real operational integrations and sufficient funding.
                </p>
              </div>
            </div>

            <div className="doc-banner proposed">
              <strong>PROPOSED PRODUCTION UPGRADE:</strong> The technologies, services, and architectures detailed below represent the forward-looking engineering roadmap for commercial deployment with dedicated funding.
            </div>

            {/* 2.1 PRODUCTION GOAL */}
            <section className="doc-section" id="prod-goal">
              <div className="doc-section-header">
                <h3>2.1 Production Goal</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                The current AIDORA implementation successfully proves the complete product lifecycle—from customer discovery and AI photo diagnosis to artisan dispatch, OTP execution, clearing ledgers, and welfare relief.
              </p>
              <p>
                The funded production release replaces prototype and development boundaries with enterprise-grade identity providers, regulated banking payout rails, continuous GPS telemetry, multi-channel dispatch notifications, trained ML forecasting models, and native mobile applications.
              </p>
            </section>

            {/* 2.2 REAL PHONE AUTHENTICATION */}
            <section className="doc-section" id="prod-auth">
              <div className="doc-section-header">
                <h3>2.2 Real Phone Authentication & Telecom Gateway</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                <strong>Recommended Provider:</strong> <code>MSG91</code> (Primary Indian enterprise recommendation due to native TRAI DLT compliance, high delivery rates, and low latency), with <code>Twilio Verify</code> as a secondary fallback.
              </p>

              <div className="doc-cards-grid two-col">
                <div className="doc-info-card">
                  <h4>SMS OTP Security Controls</h4>
                  <ul>
                    <li>Dynamic 6-digit cryptographically random OTP generated server-side.</li>
                    <li>Strict 5-minute time-to-live (TTL) expiration window.</li>
                    <li>60-second rate-limiting cooldown per mobile number.</li>
                    <li>Maximum 3 verification attempts before automated 15-minute lockout.</li>
                  </ul>
                </div>
                <div className="doc-info-card">
                  <h4>Device & Session Management</h4>
                  <ul>
                    <li>Device fingerprinting to detect suspicious multi-device churn.</li>
                    <li>JWT token rotation with secure HTTP-only refresh tokens.</li>
                    <li>Automated session invalidation on password/credential reset.</li>
                    <li>TRAI DLT-registered message templates for 100% regulatory compliance.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2.3 PRODUCTION PAYMENTS & PAYOUTS */}
            <section className="doc-section" id="prod-payments">
              <div className="doc-section-header">
                <h3>2.3 Production Payments, Webhooks & Banking Payout Rails</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                The commercial release separates customer payment capture, platform revenue settlement, cooperative fee retention, and artisan payout disbursement into discrete, auditable financial flows.
              </p>

              <div className="doc-payment-flow">
                <div className="doc-pay-step">
                  <strong>1. Customer Checkout</strong>
                  <p>Customer pays via Razorpay / UPI / Cards. Gateway emits authenticated webhook to backend API.</p>
                </div>
                <div className="doc-pay-arrow">→</div>
                <div className="doc-pay-step">
                  <strong>2. Webhook & Idempotency</strong>
                  <p>Backend verifies HMAC-SHA256 signature and records payment idempotently.</p>
                </div>
                <div className="doc-pay-arrow">→</div>
                <div className="doc-pay-step">
                  <strong>3. Cooperative Split</strong>
                  <p>System retains ₹25 platform connection fee to fund federation operations.</p>
                </div>
                <div className="doc-pay-arrow">→</div>
                <div className="doc-pay-step highlight">
                  <strong>4. Direct Bank Payout</strong>
                  <p>Automated IMPS/UPI transfer to artisan bank account via <strong>RazorpayX Payouts API</strong>.</p>
                </div>
              </div>
            </section>

            {/* 2.4 PRODUCTION MAPS & TELEMETRY */}
            <section className="doc-section" id="prod-maps">
              <div className="doc-section-header">
                <h3>2.4 Production Maps, Routing & Live GPS Telemetry</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                <strong>Recommended Stack:</strong> <code>Google Maps Platform</code> (Places API, Distance Matrix API, Directions API, Routes API) or <code>Mapbox SDK</code>.
              </p>
              <div className="doc-cards-grid two-col">
                <div className="doc-info-card">
                  <h4>Real-Time Telemetry & Routing</h4>
                  <ul>
                    <li>Continuous high-precision GPS tracking of active en-route artisans.</li>
                    <li>Dynamic traffic-aware route optimization and real-time arrival ETAs.</li>
                    <li>Interactive map interface rendering live artisan markers and polyline paths.</li>
                    <li>Automated geofencing to alert customers when an artisan is within 500m.</li>
                  </ul>
                </div>
                <div className="doc-info-card">
                  <h4>Safety & Privacy Boundaries</h4>
                  <ul>
                    <li>Location sharing active strictly during the <code>ON_THE_WAY</code> state.</li>
                    <li>Background telemetry immediately disabled upon job completion.</li>
                    <li>Emergency SOS coordinate broadcast to cooperative dispatch in incident events.</li>
                    <li>Privacy-preserving address masking until artisan confirms dispatch acceptance.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2.5 MULTI-CHANNEL NOTIFICATIONS */}
            <section className="doc-section" id="prod-notifications">
              <div className="doc-section-header">
                <h3>2.5 Multi-Channel Event-Driven Notification Engine</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                An asynchronous event pipeline triggers context-aware notifications across multiple channels based on booking state machine transitions:
              </p>

              <div className="doc-table-wrapper">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Lifecycle Event</th>
                      <th>Push Notification (FCM)</th>
                      <th>SMS Gateway (MSG91)</th>
                      <th>Email (Resend)</th>
                      <th>Automated Voice (Exotel)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Booking Created</strong></td>
                      <td>Customer confirmation</td>
                      <td>—</td>
                      <td>Booking Summary</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td><strong>Worker Matched & Alerted</strong></td>
                      <td>High-priority worker dispatch sound</td>
                      <td>SMS dispatch alert</td>
                      <td>—</td>
                      <td>Emergency bookings IVR call</td>
                    </tr>
                    <tr>
                      <td><strong>Worker En Route</strong></td>
                      <td>Customer: "Artisan is 10 mins away"</td>
                      <td>—</td>
                      <td>—</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td><strong>Service Started</strong></td>
                      <td>"Job in progress with 4-digit OTP"</td>
                      <td>—</td>
                      <td>—</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td><strong>Job Completed & Paid</strong></td>
                      <td>Rating & review prompt</td>
                      <td>Payment receipt confirmation</td>
                      <td>PDF Tax Invoice & Warranty</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td><strong>KYC Approved / Rejected</strong></td>
                      <td>Artisan eligibility notification</td>
                      <td>Status update with reason</td>
                      <td>Cooperative Certificate</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2.6 PRODUCTION AI & ML PIPELINES */}
            <section className="doc-section" id="prod-ai">
              <div className="doc-section-header">
                <h3>2.6 Production AI & Machine Learning Infrastructure</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                The production architecture upgrades rule-based heuristics into specialized machine learning microservices:
              </p>

              <div className="doc-cards-grid three-col">
                <div className="doc-info-card">
                  <h4>A. Vision Complexity Estimator</h4>
                  <p>
                    Managed <strong>Gemini 1.5 Pro</strong> pipeline with server-side image preprocessing (noise reduction, contrast enhancement) and automated spare-parts catalog matching for granular bill-of-materials estimations.
                  </p>
                </div>
                <div className="doc-info-card">
                  <h4>B. Time-Series Demand Model</h4>
                  <p>
                    Dedicated Python microservice (FastAPI, <strong>XGBoost / LightGBM / Prophet</strong>) trained on multi-year longitudinal booking history, meteorological weather data, and Indian festival calendars to forecast hyperlocal demand spikes.
                  </p>
                </div>
                <div className="doc-info-card">
                  <h4>C. Constraint Dispatch Engine</h4>
                  <p>
                    Operations Research optimization solver (Google OR-Tools) balancing artisan travel distance, historical rating, trade certifications, cooperative equity, and customer SLA urgency.
                  </p>
                </div>
              </div>
            </section>

            {/* 2.7 SCALABLE BACKEND EVOLUTION */}
            <section className="doc-section" id="prod-backend">
              <div className="doc-section-header">
                <h3>2.7 Scalable Backend Evolution</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                As platform transaction volume scales, the architecture evolves smoothly from the current Supabase-centric foundation to a decoupled microservice ecosystem:
              </p>
              <ul>
                <li>
                  <strong>Primary Database:</strong> Managed PostgreSQL with read replicas and PgBouncer connection pooling.
                </li>
                <li>
                  <strong>In-Memory Cache & Queues:</strong> <code>Redis</code> for active session caching, geolocation lookups, and <code>BullMQ</code> background task processing (invoice generation, webhook delivery, SMS dispatch).
                </li>
                <li>
                  <strong>Cloud Infrastructure:</strong> Containerized microservices deployed on AWS (ECS / EKS) or GCP (Cloud Run / GKE) with automated autoscaling.
                </li>
              </ul>
            </section>

            {/* 2.8 OBSERVABILITY & SECURITY HARDENING */}
            <section className="doc-section" id="prod-observability">
              <div className="doc-section-header">
                <h3>2.8 Observability, Telemetry & Security Hardening</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <div className="doc-cards-grid two-col">
                <div className="doc-info-card">
                  <h4>Observability & APM</h4>
                  <ul>
                    <li><strong>Sentry:</strong> Real-time frontend and backend exception tracking and crash telemetry.</li>
                    <li><strong>OpenTelemetry / Datadog:</strong> Distributed tracing across microservices and API gateways.</li>
                    <li><strong>Structured JSON Logging:</strong> Centralized log aggregation in Grafana Loki or AWS CloudWatch.</li>
                    <li><strong>Synthetic Uptime Monitoring:</strong> 99.95% availability SLA tracking.</li>
                  </ul>
                </div>
                <div className="doc-info-card">
                  <h4>Enterprise Security Controls</h4>
                  <ul>
                    <li><strong>Cloudflare WAF:</strong> Layer 7 DDoS mitigation and bot protection.</li>
                    <li><strong>AWS KMS / Vault:</strong> Cryptographic secrets and API key rotation.</li>
                    <li><strong>Automated Backups:</strong> Daily automated database snapshots with Point-In-Time Recovery (PITR).</li>
                    <li><strong>Continuous SAST/DAST:</strong> Automated vulnerability scanning in GitHub Actions CI/CD.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2.9 NATIVE MOBILE APPLICATIONS */}
            <section className="doc-section" id="prod-mobile">
              <div className="doc-section-header">
                <h3>2.9 Native Mobile Applications (iOS & Android)</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                <strong>Recommended Technology:</strong> <code>React Native (Expo)</code> or <code>Flutter</code>.
              </p>
              <p>
                While the current web app serves as the reference implementation, native mobile applications unlock critical operational hardware capabilities:
              </p>
              <ul>
                <li><strong>Background Telemetry:</strong> Reliable GPS coordinate transmission for en-route artisans even when the screen is locked.</li>
                <li><strong>Hardware Camera Capture:</strong> Native document scanning with on-device edge detection for KYC and repair photo uploads.</li>
                <li><strong>Push Reliability:</strong> High-priority FCM/APNs wake-up alerts that penetrate battery optimization modes.</li>
                <li><strong>Offline SQLite Cache:</strong> Enables artisans in poor connectivity zones to inspect job addresses and log completions offline.</li>
              </ul>
            </section>

            {/* 2.10 ENTERPRISE OBJECT STORAGE */}
            <section className="doc-section" id="prod-storage">
              <div className="doc-section-header">
                <h3>2.10 Enterprise Object Storage & Media Processing</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                Production media storage expands with:
              </p>
              <ul>
                <li><strong>Private Object Storage:</strong> AWS S3 / Cloudflare R2 with encrypted server-side storage (AES-256).</li>
                <li><strong>Short-Lived Signed URLs:</strong> KYC documents accessible strictly via temporary time-limited signed tokens (15-min TTL).</li>
                <li><strong>Automated Image Optimization:</strong> Edge CDN compression converting uploaded images into WebP/AVIF formats to minimize bandwidth.</li>
                <li><strong>Server-Side Antivirus Scanning:</strong> ClamAV virus scanning pipeline on all uploaded customer and artisan attachments.</li>
              </ul>
            </section>

            {/* 2.11 4-STAGE SCALABILITY PATH */}
            <section className="doc-section" id="prod-scalability">
              <div className="doc-section-header">
                <h3>2.11 4-Stage Scalability Path</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                A phased scaling trajectory prevents premature optimization while ensuring architectural resilience:
              </p>

              <div className="doc-stages-grid">
                <div className="doc-stage-card">
                  <div className="doc-stage-pill">STAGE 1</div>
                  <h4>Supabase + Vercel (Current MVP)</h4>
                  <p>Handles up to 5,000 active users with serverless database scaling and direct RLS enforcement.</p>
                </div>
                <div className="doc-stage-arrow">→</div>
                <div className="doc-stage-card">
                  <div className="doc-stage-pill">STAGE 2</div>
                  <h4>Redis + Async Task Queues</h4>
                  <p>Handles 5,000 to 50,000 users. Adds Redis caching, connection pooling, and asynchronous BullMQ workers.</p>
                </div>
                <div className="doc-stage-arrow">→</div>
                <div className="doc-stage-card">
                  <div className="doc-stage-pill">STAGE 3</div>
                  <h4>Dedicated Microservices</h4>
                  <p>Handles 50,000 to 500,000 users. Decouples core domains (Auth, Dispatch, Payments) into autoscaling container pods.</p>
                </div>
                <div className="doc-stage-arrow">→</div>
                <div className="doc-stage-card highlight">
                  <div className="doc-stage-pill">STAGE 4</div>
                  <h4>Multi-Region Edge Mesh</h4>
                  <p>Handles 500,000+ users across nationwide Indian metropolitan clusters with Kafka event streaming.</p>
                </div>
              </div>
            </section>

            {/* 2.12 PROPOSED FUTURE DATA MODEL */}
            <section className="doc-section" id="prod-datamodel">
              <div className="doc-section-header">
                <h3>2.12 Proposed Production Data Model Extensions</h3>
                <span className="doc-tag future">PROPOSED SCHEMA</span>
              </div>
              <p>
                The following supplementary tables are planned for the commercial enterprise release (marked clearly as proposed):
              </p>

              <div className="doc-table-wrapper">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Proposed Table</th>
                      <th>Primary Fields & Structure</th>
                      <th>Business Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>notifications</code></td>
                      <td>id, user_id, channel ('SMS'|'PUSH'|'EMAIL'), title, body, status, sent_at</td>
                      <td>Multi-channel notification audit and delivery tracking.</td>
                    </tr>
                    <tr>
                      <td><code>worker_locations</code></td>
                      <td>id, worker_id, booking_id, lat, lng, speed, heading, timestamp (TimescaleDB)</td>
                      <td>High-frequency GPS telemetry time-series for live mapping and route history.</td>
                    </tr>
                    <tr>
                      <td><code>payouts</code></td>
                      <td>id, worker_id, amount, gateway ('RazorpayX'), utr_number, status, settled_at</td>
                      <td>Regulated banking payout disbursement records and bank UTR tracking.</td>
                    </tr>
                    <tr>
                      <td><code>settlements</code></td>
                      <td>id, booking_id, gross_amount, coop_fee, worker_payout, tax_tds, reconciled_at</td>
                      <td>Automated platform accounting, GST tax compliance, and TDS deduction ledger.</td>
                    </tr>
                    <tr>
                      <td><code>insurance_claims</code></td>
                      <td>id, worker_id, insurer_policy_id, claim_type, amount, status, surveyor_notes</td>
                      <td>Commercial group insurance claim submission and third-party settlement tracking.</td>
                    </tr>
                    <tr>
                      <td><code>audit_logs</code></td>
                      <td>id, actor_id, actor_role, action, resource, ip_address, user_agent, timestamp</td>
                      <td>Immutable compliance and governance audit log for all administrative modifications.</td>
                    </tr>
                    <tr>
                      <td><code>device_sessions</code></td>
                      <td>id, user_id, device_fingerprint, fcm_token, platform, last_active_at</td>
                      <td>Multi-device push notification routing and security session management.</td>
                    </tr>
                    <tr>
                      <td><code>service_zones</code></td>
                      <td>id, zone_name, city, polygon_boundary (PostGIS), base_surge, active_workers</td>
                      <td>PostGIS polygon boundary definitions for spatial zoning and dynamic surge pricing.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2.13 GOVERNANCE & COMPLIANCE */}
            <section className="doc-section" id="prod-compliance">
              <div className="doc-section-header">
                <h3>2.13 Regulatory Governance & Legal Compliance</h3>
                <span className="doc-tag future">PROPOSED</span>
              </div>
              <p>
                The production deployment will adhere to relevant Indian regulatory and legal frameworks:
              </p>
              <ul>
                <li>
                  <strong>Digital Personal Data Protection Act (DPDP Act 2023):</strong> Explicit customer and artisan consent collection, purpose-limited data processing, and user data deletion requests.
                </li>
                <li>
                  <strong>Gig Worker Social Security Compliance:</strong> Alignment with the Code on Social Security 2020 and state gig worker welfare board registrations.
                </li>
                <li>
                  <strong>Payment & Financial Compliance:</strong> RBI Master Directions on Payment Aggregators (PA/PG) for escrow handling and merchant settlements.
                </li>
                <li>
                  <strong>Consumer Protection (E-Commerce) Rules:</strong> Transparent pricing disclosures, mandatory 30-day warranty fulfillment, and formal grievance officer contact publishing.
                </li>
              </ul>
              <p className="doc-caption">
                <em>Note:</em> Final compliance policies will be finalized in consultation with qualified legal and regulatory counsel prior to commercial launch.
              </p>
            </section>

            {/* 2.14 PRODUCTION COST AREAS */}
            <section className="doc-section" id="prod-cost">
              <div className="doc-section-header">
                <h3>2.14 Production Infrastructure Cost Categories</h3>
                <span className="doc-tag future">COST ANALYSIS</span>
              </div>
              <p>
                The table below details the operational cost areas required to transition the current prototype into commercial production:
              </p>

              <div className="doc-table-wrapper">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Cost Category</th>
                      <th>Current Implementation</th>
                      <th>Production Upgrade</th>
                      <th>Strategic Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>1. Cloud Hosting</strong></td>
                      <td>Vercel Hobby Tier (Free)</td>
                      <td>Vercel Pro / AWS ECS Cluster</td>
                      <td>Provides dedicated compute, regional edge routing, and 99.99% uptime SLA.</td>
                    </tr>
                    <tr>
                      <td><strong>2. Database</strong></td>
                      <td>Supabase Free Tier</td>
                      <td>Supabase Pro / AWS RDS PostgreSQL</td>
                      <td>Unlocks dedicated CPU/RAM, daily PITR backups, and connection pooling.</td>
                    </tr>
                    <tr>
                      <td><strong>3. Maps & Geocoding</strong></td>
                      <td>Browser Geolocation (Free)</td>
                      <td>Google Maps Platform / Mapbox</td>
                      <td>Required for live artisan GPS tracking, route polylines, and dynamic ETAs.</td>
                    </tr>
                    <tr>
                      <td><strong>4. SMS & OTP</strong></td>
                      <td>Fixed Demo OTP 123456 (Free)</td>
                      <td>MSG91 / Twilio Verify</td>
                      <td>Enforces real cryptographic mobile authentication and TRAI DLT delivery.</td>
                    </tr>
                    <tr>
                      <td><strong>5. Push & Email</strong></td>
                      <td>In-app reactive state (Free)</td>
                      <td>Firebase FCM + Resend Email</td>
                      <td>Powers background dispatch alerts and automated PDF invoice email delivery.</td>
                    </tr>
                    <tr>
                      <td><strong>6. Payment Rails</strong></td>
                      <td>Razorpay Test Sandbox (Free)</td>
                      <td>Razorpay Live + RazorpayX Payouts</td>
                      <td>Standard regulated 2% merchant MDR + automated IMPS banking payout fee.</td>
                    </tr>
                    <tr>
                      <td><strong>7. AI & Diagnostics</strong></td>
                      <td>Gemini 1.5 Flash Free Quota</td>
                      <td>Google AI Studio / Vertex AI Pro</td>
                      <td>Guarantees low-latency multimodal vision inference without rate limiting.</td>
                    </tr>
                    <tr>
                      <td><strong>8. Storage & CDN</strong></td>
                      <td>Supabase Storage (1 GB)</td>
                      <td>AWS S3 + Cloudflare CDN</td>
                      <td>Scalable encrypted storage with image optimization and pre-signed token security.</td>
                    </tr>
                    <tr>
                      <td><strong>9. Monitoring & APM</strong></td>
                      <td>Browser Console Logging</td>
                      <td>Sentry Team + Datadog APM</td>
                      <td>Provides instant crash alerts, performance traces, and distributed telemetry.</td>
                    </tr>
                    <tr>
                      <td><strong>10. Security & WAF</strong></td>
                      <td>Default Vercel SSL</td>
                      <td>Cloudflare Pro WAF</td>
                      <td>Guards against Layer 7 DDoS, automated bot scraping, and credential stuffing.</td>
                    </tr>
                    <tr>
                      <td><strong>11. Mobile App Stores</strong></td>
                      <td>Web App (Free)</td>
                      <td>Apple Developer + Google Play</td>
                      <td>Annual store registration fees ($99/yr Apple, $25 one-time Google).</td>
                    </tr>
                    <tr>
                      <td><strong>12. Compliance & Legal</strong></td>
                      <td>Internal Open Source Terms</td>
                      <td>Legal Counsel Retainer</td>
                      <td>Required for DPDP Act compliance, terms of service, and insurance contracts.</td>
                    </tr>
                    <tr>
                      <td><strong>13. Support & IVR</strong></td>
                      <td>In-app feedback form</td>
                      <td>Exotel IVR + Zendesk / Freshdesk</td>
                      <td>Provides 24/7 emergency customer and worker voice hotline support.</td>
                    </tr>
                    <tr>
                      <td><strong>14. Backup & DR</strong></td>
                      <td>Manual SQL schema exports</td>
                      <td>Automated Multi-Region Backups</td>
                      <td>Ensures zero data loss with automated failover and 1-hour RTO disaster recovery.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2.15 CURRENT VS PRODUCTION COMPARISON */}
            <section className="doc-section highlight-box" id="prod-comparison">
              <div className="doc-section-header">
                <h3>2.15 Current MVP vs Full Production Comparison Matrix</h3>
                <span className="doc-tag matrix">SIDE-BY-SIDE EVALUATION</span>
              </div>
              <p>
                A comprehensive side-by-side technical comparison across all functional and architectural dimensions:
              </p>

              <div className="doc-matrix-table-wrapper">
                <table className="doc-table matrix">
                  <thead>
                    <tr>
                      <th>Architectural Dimension</th>
                      <th>Current AIDORA Application (MVP)</th>
                      <th>Full Production AIDORA (Funded)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Authentication</strong></td>
                      <td>Fixed prototype OTP <code>123456</code> via Supabase Auth bridge.</td>
                      <td>Real Indian SMS OTP gateway (MSG91) with dynamic 6-digit codes & rate limiting.</td>
                    </tr>
                    <tr>
                      <td><strong>Customer Payments</strong></td>
                      <td>Razorpay Checkout SDK in test mode + Cash on Service.</td>
                      <td>Production Razorpay merchant credentials + HMAC webhook verification.</td>
                    </tr>
                    <tr>
                      <td><strong>Worker Payouts</strong></td>
                      <td>Internal cooperative clearing ledger with reference codes.</td>
                      <td>Automated instant bank payouts via RazorpayX / Direct IMPS banking rails.</td>
                    </tr>
                    <tr>
                      <td><strong>Location & Proximity</strong></td>
                      <td>Browser Geolocation API + Haversine distance formula.</td>
                      <td>Google Maps Platform with real-time GPS telemetry, polyline paths & geofencing.</td>
                    </tr>
                    <tr>
                      <td><strong>Mapping Interface</strong></td>
                      <td>Locality coordinate tags with distance indicators.</td>
                      <td>Interactive live map rendering active worker marker tracking.</td>
                    </tr>
                    <tr>
                      <td><strong>Notifications</strong></td>
                      <td>Client-side reactive UI state transitions.</td>
                      <td>Multi-channel event-driven pipeline (FCM Push, MSG91 SMS, Resend Email, IVR).</td>
                    </tr>
                    <tr>
                      <td><strong>AI Photo Diagnosis</strong></td>
                      <td>Gemini 1.5 Flash multimodal API + domain heuristic fallback.</td>
                      <td>Managed Gemini 1.5 Pro pipeline with edge preprocessing and parts catalog matching.</td>
                    </tr>
                    <tr>
                      <td><strong>Demand Forecasting</strong></td>
                      <td>Statistical density aggregation based on active dispatches.</td>
                      <td>Trained ML time-series forecasting model (XGBoost / LightGBM) on multi-year data.</td>
                    </tr>
                    <tr>
                      <td><strong>Workforce Allocation</strong></td>
                      <td>Availability and radius heuristic threshold logic.</td>
                      <td>Operations Research constraint optimization solver (Google OR-Tools).</td>
                    </tr>
                    <tr>
                      <td><strong>KYC Verification</strong></td>
                      <td>Digital document upload + Admin review & approval queue.</td>
                      <td>Automated OCR document extraction, DigiLocker integration + Admin review.</td>
                    </tr>
                    <tr>
                      <td><strong>Worker Welfare</strong></td>
                      <td>Internal cooperative mutual aid safety net ledger.</td>
                      <td>Formal integration with licensed group insurance provider for cashless claim settlement.</td>
                    </tr>
                    <tr>
                      <td><strong>Mobile Platform</strong></td>
                      <td>Responsive Web Application / PWA.</td>
                      <td>Native iOS & Android apps (React Native / Flutter) with background GPS.</td>
                    </tr>
                    <tr>
                      <td><strong>Storage & Media</strong></td>
                      <td>Supabase Storage with folder-scoped RLS policies.</td>
                      <td>AWS S3 / Cloudflare R2 with signed short-lived URLs and automated WebP CDN.</td>
                    </tr>
                    <tr>
                      <td><strong>Observability</strong></td>
                      <td>Browser console logging and Supabase dashboard metrics.</td>
                      <td>Sentry error tracing, Datadog APM, OpenTelemetry, and synthetic uptime monitors.</td>
                    </tr>
                    <tr>
                      <td><strong>Security & WAF</strong></td>
                      <td>PostgreSQL RLS on all 9 tables + standard Vercel SSL.</td>
                      <td>Cloudflare WAF, DDoS protection, AWS KMS secrets manager, daily PITR backups.</td>
                    </tr>
                    <tr>
                      <td><strong>Scalability</strong></td>
                      <td>Single database instance (up to 5k active users).</td>
                      <td>Decoupled microservices, Redis caching, read replicas, and autoscaling clusters.</td>
                    </tr>
                    <tr>
                      <td><strong>Legal Compliance</strong></td>
                      <td>Internal cooperative agreements and terms.</td>
                      <td>Full DPDP Act 2023, RBI PA/PG escrow, and Gig Worker Social Security compliance.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2.16 IMPLEMENTATION ROADMAP */}
            <section className="doc-section" id="prod-roadmap">
              <div className="doc-section-header">
                <h3>2.16 5-Phase Implementation Roadmap</h3>
                <span className="doc-tag future">EXECUTION PLAN</span>
              </div>
              <p>
                A structured 26-week engineering roadmap to transition AIDORA from the current validated MVP into full commercial deployment:
              </p>

              <div className="doc-roadmap-timeline">
                <div className="doc-roadmap-phase">
                  <div className="doc-phase-marker">PHASE 1</div>
                  <div className="doc-phase-content">
                    <h4>Production Hardening & Real Phone Auth (Weeks 1–4)</h4>
                    <p><strong>Focus:</strong> Security, Authentication, and Infrastructure Hardening.</p>
                    <ul>
                      <li>Integrate MSG91 SMS OTP gateway with TRAI DLT approved message templates.</li>
                      <li>Deploy production Supabase Pro database with automated daily PITR backups.</li>
                      <li>Integrate Sentry exception monitoring and structured JSON logging.</li>
                      <li>Conduct third-party security vulnerability assessment and penetration testing.</li>
                    </ul>
                  </div>
                </div>

                <div className="doc-roadmap-phase">
                  <div className="doc-phase-marker">PHASE 2</div>
                  <div className="doc-phase-content">
                    <h4>Live Payment Rails & Multi-Channel Dispatch (Weeks 5–8)</h4>
                    <p><strong>Focus:</strong> Financial Automation and Dispatch Communications.</p>
                    <ul>
                      <li>Switch Razorpay from test mode to live production merchant credentials.</li>
                      <li>Implement RazorpayX Payouts API for automated artisan bank account disbursements.</li>
                      <li>Deploy Firebase Cloud Messaging (FCM) and Resend email pipelines.</li>
                      <li>Configure automated financial reconciliation and GST tax reporting engine.</li>
                    </ul>
                  </div>
                </div>

                <div className="doc-roadmap-phase">
                  <div className="doc-phase-marker">PHASE 3</div>
                  <div className="doc-phase-content">
                    <h4>Google Maps Platform & Native Mobile Apps (Weeks 9–14)</h4>
                    <p><strong>Focus:</strong> Hyperlocal Telemetry and Mobile App Store Release.</p>
                    <ul>
                      <li>Integrate Google Maps Platform (Routes, Directions, Places, Geocoding).</li>
                      <li>Build native React Native (Expo) mobile builds for iOS and Android.</li>
                      <li>Implement background GPS telemetry for artisans during active travel.</li>
                      <li>Publish official apps to Apple App Store and Google Play Store.</li>
                    </ul>
                  </div>
                </div>

                <div className="doc-roadmap-phase">
                  <div className="doc-phase-marker">PHASE 4</div>
                  <div className="doc-phase-content">
                    <h4>AI/ML Platform & Predictive Models (Weeks 15–20)</h4>
                    <p><strong>Focus:</strong> Advanced Machine Learning and Operational Efficiency.</p>
                    <ul>
                      <li>Deploy Gemini 1.5 Pro repair photo diagnosis microservice with parts catalog lookup.</li>
                      <li>Train and deploy XGBoost time-series demand forecasting model on historical data.</li>
                      <li>Implement Google OR-Tools constraint optimization dispatch engine.</li>
                      <li>Expand multilingual localization to 5 regional Indian languages (Kannada, Tamil, Telugu, etc.).</li>
                    </ul>
                  </div>
                </div>

                <div className="doc-roadmap-phase">
                  <div className="doc-phase-marker">PHASE 5</div>
                  <div className="doc-phase-content">
                    <h4>Regional Scale, Governance & Enterprise Operations (Weeks 21–26)</h4>
                    <p><strong>Focus:</strong> Metropolitan Expansion and Governance.</p>
                    <ul>
                      <li>Expand cooperative federation operations across Tier-1 and Tier-2 Indian cities.</li>
                      <li>Formalize institutional group insurance partnerships for worker welfare settlement.</li>
                      <li>Deploy multi-region database read replicas and Redis cluster caching.</li>
                      <li>Establish 24/7 cooperative operations and dispute resolution hotline.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.17 FINAL ENGINEERING STATEMENT */}
            <section className="doc-section final-block">
              <div className="doc-final-card">
                <h3>Engineering Integrity & Statement of Purpose</h3>
                <p>
                  "The current AIDORA build is a functional product implementation that demonstrates the complete service lifecycle. The production architecture described above is the planned path for replacing development/demo boundaries with real-world infrastructure, operational integrations and scale."
                </p>
                <div className="doc-final-footer">
                  <span>AIDORA Cooperative Engineering Team</span>
                  <span>September 2026</span>
                </div>
              </div>
            </section>
          </article>
        </main>
      </div>

      {/* Footer */}
      <footer className="doc-footer">
        <div className="doc-footer-inner">
          <div className="doc-footer-left">
            <div className="doc-footer-brand">
              <Logo size="xs" />
              <strong>AIDORA</strong>
            </div>
            <span>Architecture & Technical Implementation Documentation • v1.1.0</span>
          </div>
          <div className="doc-footer-right">
            <button
              type="button"
              className="doc-footer-link-btn"
              onClick={() => navigate('/resources')}
            >
              Project Resources
            </button>
            <span className="doc-footer-dot">•</span>
            <button
              type="button"
              className="doc-footer-link-btn"
              onClick={() => navigate('/')}
            >
              Open Application ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentationPage;
