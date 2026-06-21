import React, { useState } from 'react';
import { 
  Activity, 
  X, 
  Server, 
  ShieldCheck, 
  Mail, 
  ChevronDown 
} from 'lucide-react';

export default function StatusSidebar({ isOpen, onClose, onNavClick }) {
  const [activeFaq, setActiveFaq] = useState(null);

  // Mock FAQs
  const faqs = [
    {
      q: "How do I raise an IT ticket?",
      a: "Once you sign in to your employee account, click the 'Create Ticket' button, select a category, set the priority (Low to Critical), describe your issue, and optionally attach a file. Your ticket is immediately placed in the system queue."
    },
    {
      q: "What is the difference between L1 and L2 Support?",
      a: "L1 Support is the first line of defense, handling standard issues (password resets, software access, basic troubleshooting). L2 Support handles complex technical issues, infrastructure configurations, and advanced system debugging."
    },
    {
      q: "Can I communicate with the assigned agent?",
      a: "Yes! Each ticket has an integrated discussion portal. You can type comments, reply to information requests, and attach files to communicate directly with the support staff in real time."
    },
    {
      q: "How long does resolution take?",
      a: "Our system automatically categorizes and monitors ticket ages. High and Critical priority tickets trigger notifications to our IT staff and are usually investigated within 15-30 minutes."
    }
  ];

  return (
    <>
      <aside className={`landing-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-landing">
          <div className="sidebar-title-group">
            <Activity className="status-pulse-icon" />
            <h3>Help & Status</h3>
          </div>
          <button className="sidebar-close-btn-landing" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-scroll-content">
          {/* Quick Nav for Mobile */}
          <div className="mobile-only-nav">
            <h4>Navigate</h4>
            <div className="mobile-nav-grid">
              <button onClick={() => onNavClick('home')}>Home</button>
              <button onClick={() => onNavClick('features')}>Features</button>
              <button onClick={() => onNavClick('about')}>About</button>
              <button onClick={() => onNavClick('contact')}>Contact</button>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="sidebar-section">
            <h4>System Health</h4>
            <div className="health-card">
              <div className="health-item">
                <div className="status-indicator online"></div>
                <div className="health-details">
                  <div className="health-name">API Server</div>
                  <div className="health-status">Operational</div>
                </div>
                <Server size={16} className="health-icon" />
              </div>
              <div className="health-item">
                <div className="status-indicator online"></div>
                <div className="health-details">
                  <div className="health-name">Database (MongoDB Atlas)</div>
                  <div className="health-status">Operational</div>
                </div>
                <ShieldCheck size={16} className="health-icon" />
              </div>
              <div className="health-item">
                <div className="status-indicator online"></div>
                <div className="health-details">
                  <div className="health-name">Email Relays</div>
                  <div className="health-status">Operational</div>
                </div>
                <Mail size={16} className="health-icon" />
              </div>
            </div>
            
            <div className="metrics-summary-card">
              <div className="metric-box">
                <span className="metric-value">15m</span>
                <span className="metric-label">Avg. Response</span>
              </div>
              <div className="metric-box">
                <span className="metric-value">99.8%</span>
                <span className="metric-label">SLA Rate</span>
              </div>
            </div>
          </div>

          {/* Help Center Accordion FAQs */}
          <div className="sidebar-section">
            <h4>Support FAQs</h4>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`faq-item-small ${activeFaq === idx ? 'expanded' : ''}`}>
                  <button className="faq-question-btn" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className="chevron" />
                  </button>
                  <div className="faq-answer-container">
                    <p className="faq-answer-text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Credentials Quick Reference */}
          <div className="sidebar-section">
            <h4>Quick Logins (Presets)</h4>
            <div className="login-hint-card">
              <div className="hint-row"><strong>Admin:</strong> <code>admin</code> / <code>password</code></div>
              <div className="hint-row"><strong>Support L1:</strong> <code>support_alice</code> / <code>password</code></div>
              <div className="hint-row"><strong>Employee:</strong> <code>employee_john</code> / <code>password</code></div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay-landing" onClick={onClose}></div>}
    </>
  );
}
