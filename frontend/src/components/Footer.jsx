import React from 'react';
import { Wrench } from 'lucide-react';

export default function Footer({ onNavClick, onLoginClick, onStatusClick, onInfoClick, currentUser }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-brand-column">
          <div className="logo-section" onClick={() => onNavClick('home')}>
            <Wrench className="logo-icon" />
            <span className="logo-text">HelpDesk LITE</span>
          </div>
          <p className="footer-brand-desc">
            Sleek enterprise IT management and support, connecting employees with technical solutions swiftly.
          </p>
          <div className="system-status-indicator-footer">
            <span className="footer-status-dot online"></span>
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="footer-links-column">
          <h4>Platform</h4>
          <ul>
            <li><button onClick={() => onNavClick('home')}>Home</button></li>
            <li><button onClick={() => onNavClick('features')}>Features</button></li>
            <li><button onClick={() => onNavClick('about')}>About SLAs</button></li>
            <li><button onClick={() => onNavClick('contact')}>Support Office</button></li>
          </ul>
        </div>

        <div className="footer-links-column">
          <h4>Quick Access</h4>
          <ul>
            {currentUser ? (
              <li><button onClick={() => onNavClick('dashboard')}>Dashboard</button></li>
            ) : (
              <li><button onClick={onLoginClick}>Portal Login</button></li>
            )}
            <li><button onClick={onStatusClick}>Help & Guides</button></li>
            <li><button onClick={() => onInfoClick('home')}>System Core Info</button></li>
          </ul>
        </div>

        <div className="footer-newsletter-column">
          <h4>Helpdesk Bulletin</h4>
          <p>Subscribe for system maintenance alerts and hardware refresh updates.</p>
          <div className="newsletter-form-mock">
            <input type="email" placeholder="mail@company.com" className="newsletter-input" readOnly />
            <button className="newsletter-btn" onClick={() => alert("Mock Subscription Enabled!")}>Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <span>&copy; {currentYear} HelpDesk LITE Enterprise Systems. All rights reserved.</span>
          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="bullet-sep">&bull;</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
