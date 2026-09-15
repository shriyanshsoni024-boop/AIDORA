import React from 'react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import './ResourcesPage.css';

export const ResourcesPage: React.FC = () => {
  const { navigate } = useAuth();

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="resources-page-root">
      <main className="resources-container">
        {/* Top Navigation Bar */}
        <header className="resources-topbar">
          <a
            className="resources-brand"
            href="/"
            onClick={handleBrandClick}
            aria-label="AIDORA Home"
          >
            <Logo size="xs" />
            <span>AIDORA</span>
          </a>

          <div className="resources-topbar-right">
            <span className="resources-topbar-label">Project Resources</span>
            <button
              type="button"
              className="resources-back-btn"
              onClick={() => navigate('/')}
            >
              <span>Go to App</span>
              <b>→</b>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="resources-hero">
          <div className="resources-eyebrow">AIDORA</div>
          <h1>Project Resources</h1>
          <p className="resources-intro">
            Everything you need to explore the project, open the live application, view the source code, and access the supporting material.
          </p>
        </section>

        {/* Resource Cards Grid */}
        <section className="resources-grid" aria-label="Project Resource Links">
          {/* 1. Live Application (Featured) */}
          <a
            className="resources-card featured"
            href="https://aidora.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">↗</span>
              <span className="resources-tag">LIVE</span>
            </div>
            <div>
              <h2>Live Application</h2>
              <p>Open AIDORA and explore the customer, worker and operations experience.</p>
            </div>
            <span className="resources-card-link">
              Open application <b>→</b>
            </span>
          </a>

          {/* 2. Source Code */}
          <a
            className="resources-card"
            href="https://github.com/shriyanshsoni024-boop/AIDORA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">⌘</span>
              <span className="resources-tag neutral">CODE</span>
            </div>
            <div>
              <h2>Source Code</h2>
              <p>Browse the AIDORA codebase, project structure and implementation.</p>
            </div>
            <span className="resources-card-link">
              View on GitHub <b>→</b>
            </span>
          </a>

          {/* 3. Documentation (Clean Placeholder / Disabled) */}
          <div className="resources-card disabled" aria-disabled="true">
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">▤</span>
              <span className="resources-tag neutral">DOCS</span>
            </div>
            <div>
              <h2>Documentation</h2>
              <p>Project notes, architecture, setup details and implementation references.</p>
            </div>
            <span className="resources-card-link muted">
              Add document link <b>→</b>
            </span>
          </div>

          {/* 4. Presentation (Clean Placeholder / Disabled) */}
          <div className="resources-card disabled" aria-disabled="true">
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">▣</span>
              <span className="resources-tag neutral">PRESENTATION</span>
            </div>
            <div>
              <h2>Presentation</h2>
              <p>Project presentation with the idea, solution, workflow and key features.</p>
            </div>
            <span className="resources-card-link muted">
              Add presentation link <b>→</b>
            </span>
          </div>

          {/* 5. Demo Video (Clean Placeholder / Disabled) */}
          <div className="resources-card disabled" aria-disabled="true">
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">▶</span>
              <span className="resources-tag neutral">DEMO</span>
            </div>
            <div>
              <h2>Demo Video</h2>
              <p>A quick walkthrough showing how AIDORA works from booking to completion.</p>
            </div>
            <span className="resources-card-link muted">
              Add video link <b>→</b>
            </span>
          </div>

          {/* 6. Project Files (Clean Placeholder / Disabled) */}
          <div className="resources-card disabled" aria-disabled="true">
            <div className="resources-card-top">
              <span className="resources-icon" aria-hidden="true">↓</span>
              <span className="resources-tag neutral">FILES</span>
            </div>
            <div>
              <h2>Project Files</h2>
              <p>Useful supporting files, diagrams and other material related to the project.</p>
            </div>
            <span className="resources-card-link muted">
              Add file link <b>→</b>
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="resources-footer">
          <div className="resources-footer-left">
            <strong>AIDORA</strong>
            <span>Cooperative services, made simpler.</span>
          </div>
          <a
            className="resources-footer-right"
            href="https://aidora.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            aidora.in ↗
          </a>
        </footer>
      </main>
    </div>
  );
};
