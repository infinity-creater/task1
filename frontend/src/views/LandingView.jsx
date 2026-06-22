import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Shield, 
  Laptop, 
  Headphones, 
  Server, 
  Clock, 
  Users, 
  ArrowRight, 
  BookOpen, 
  ChevronRight, 
  Activity, 
  Send, 
  Mail, 
  MapPin, 
  Phone, 
  LogIn, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  Info
} from 'lucide-react';

export default function LandingView({ onLoginClick, onInfoClick, onNavClick, activeSection, setActiveSection }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (setActiveSection) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (sectionId) => {
    if (onNavClick) {
      onNavClick(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

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

  // Features list
  const features = [
    {
      id: 'triage',
      icon: <Laptop className="feature-icon" />,
      title: "Smart Ticket Triage",
      short: "Automated priority level assessment and L1/L2 support staff routing.",
      detail: "Leverages direct category indexing to route tickets to specialized L1 or L2 agents instantly, minimizing manual dispatch delay. Critical tickets automatically trigger alert badges."
    },
    {
      id: 'chat',
      icon: <Headphones className="feature-icon" />,
      title: "Direct Agent Portal",
      short: "Interactive comments stream and files upload directly inside tickets.",
      detail: "Engage in direct collaboration. Users get notifications when support agents reply, allowing fast queries resolution and attachment uploads directly to active ticket pages."
    },
    {
      id: 'metrics',
      icon: <Activity className="feature-icon" />,
      title: "Admin Analytics Hub",
      short: "Real-time metrics charts, activity logs streaming, and user controls.",
      detail: "Administrators get high-level overviews of ticket distribution across categories, average resolution times, support workloads, and live auditable system operations logs."
    },
    {
      id: 'secure',
      icon: <Shield className="feature-icon" />,
      title: "Role-Based Security",
      short: "Strict access control lists separating Employees, Support, and Admins.",
      detail: "Built on robust JWT authentication, ensuring employees only see their raised tickets, support agents see assigned workload, and admins retain global administrative and deletion rights."
    }
  ];

  // Info details for header buttons when clicked to show extra modal content
  const modalContents = {
    home: {
      title: "Welcome to HelpDesk LITE",
      subtitle: "The Ultimate Enterprise IT Helpdesk Solution",
      content: "HelpDesk LITE is a modern, full-stack IT ticket management system. It bridges the gap between hardware/software issues and rapid IT support resolution. Built on high-performance frameworks (React + Node.js/Express + MongoDB), it ensures that business-critical operations never suffer from prolonged downtime."
    },
    about: {
      title: "About Our Support System",
      subtitle: "Designed for Speed, Security, and Scalability",
      content: "Our organization uses HelpDesk LITE to maintain a healthy IT infrastructure. With specialized workflows for Employees (submitting and confirming tickets), L1/L2 Support Agents (diagnosing and resolving tickets), and IT Administrators (overseeing workloads and editing system assets), we maintain a SLA target of 99.8% resolution success."
    },
    contact: {
      title: "IT Support Operational Hours",
      subtitle: "We are here to assist you 24/7",
      content: "While the online ticketing portal is open 24/7, our physical IT Helpdesk office is open Monday to Friday, 8:00 AM - 6:00 PM. Urgent tickets marked as 'Critical' automatically notify the on-call engineer at any hour, day or night."
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Dynamic Background Glows */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      {/* Main Content Area */}
      <main className="landing-main">

        {/* 1. HERO SECTION */}
        <section id="home" className="hero-section">
          <div className="section-container hero-grid-layout">
            <div className="hero-text-content">
              <div className="hero-badge">
                <Sparkles size={14} className="badge-spark-icon" />
                <span>Next-Gen Enterprise Helpdesk</span>
              </div>
              <h1>
                Calm, Swift, and <br />
                <span className="gradient-text">Intelligent IT Solutions</span>
              </h1>
              <p className="hero-description">
                Experience lightning-fast IT resolutions. Raise tickets, discuss issues in real time, and track support agents workloads inside a beautifully calm, glassmorphic work hub.
              </p>
              
              <div className="hero-ctas">
                <button className="btn-hero-primary" onClick={onLoginClick}>
                  <span>Access Helpdesk Portal</span>
                  <ArrowRight size={18} />
                </button>
                <button className="btn-hero-secondary" onClick={() => handleNavClick('features')}>
                  <span>Explore Features</span>
                </button>
              </div>

              {/* Interactive Quick Info Buttons */}
              <div className="quick-info-strip">
                <button onClick={() => onInfoClick('home')} className="info-strip-btn">
                  <Info size={16} />
                  <span>What is HelpDesk LITE?</span>
                </button>
                <button onClick={() => onInfoClick('about')} className="info-strip-btn">
                  <BookOpen size={16} />
                  <span>Support Service SLAs</span>
                </button>
              </div>
            </div>

            {/* High-Fidelity CSS Mockup Dashboard Preview */}
            <div className="hero-preview-visual">
              <div className="dashboard-preview-card">
                {/* Header Mockup */}
                <div className="preview-header">
                  <div className="preview-window-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                  </div>
                  <div className="preview-search-bar"></div>
                  <div className="preview-avatar-glow"></div>
                </div>

                {/* Body Grid Mockup */}
                <div className="preview-body">
                  <div className="preview-sidebar-mini">
                    <div className="preview-nav-item active"></div>
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                    <div className="preview-nav-item"></div>
                  </div>

                  <div className="preview-main-pane">
                    {/* Status Stats row */}
                    <div className="preview-stats-row">
                      <div className="preview-stat-item">
                        <span className="p-stat-title">Active Tickets</span>
                        <span className="p-stat-value">12</span>
                      </div>
                      <div className="preview-stat-item">
                        <span className="p-stat-title">Resolved (Today)</span>
                        <span className="p-stat-value green">24</span>
                      </div>
                      <div className="preview-stat-item">
                        <span className="p-stat-title">Resolution Speed</span>
                        <span className="p-stat-value indigo">14m</span>
                      </div>
                    </div>

                    {/* Mock Ticket List Card */}
                    <div className="preview-ticket-list">
                      <div className="preview-ticket-row critical">
                        <div className="p-ticket-info">
                          <span className="p-ticket-title">VPN Server Connection Failure</span>
                          <span className="p-ticket-meta">ID: TKT-1082 • raised by John</span>
                        </div>
                        <span className="p-badge critical">Critical</span>
                      </div>

                      <div className="preview-ticket-row active">
                        <div className="p-ticket-info">
                          <span className="p-ticket-title">Requesting Photoshop License</span>
                          <span className="p-ticket-meta">ID: TKT-1094 • raised by Jane</span>
                        </div>
                        <span className="p-badge in-progress">In Progress</span>
                      </div>

                      <div className="preview-ticket-row resolved">
                        <div className="p-ticket-info">
                          <span className="p-ticket-title">Keyboard key replacement</span>
                          <span className="p-ticket-meta">ID: TKT-1065 • Resolved by support</span>
                        </div>
                        <span className="p-badge resolved">Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 2. FEATURES SECTION */}
        <section id="features" className="features-section">
          <div className="section-container">
            <div className="section-header-centered">
              <span className="section-subtitle">System Capabilities</span>
              <h2>Optimized Workflows for Faster Resolving</h2>
              <p>Everything you need to streamline enterprise operations and communication, organized into three targeted dashboards.</p>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  className={`feature-card ${selectedFeature === feature.id ? 'expanded' : ''}`}
                  onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                >
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p className="feature-short">{feature.short}</p>
                  
                  <div className="feature-expand-content">
                    <p className="feature-detail-text">{feature.detail}</p>
                  </div>

                  <div className="feature-card-footer">
                    <span>{selectedFeature === feature.id ? "Show Less" : "Learn More"}</span>
                    <ChevronRight size={14} className="chevron-right-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 3. ABOUT SECTION */}
        <section id="about" className="about-section">
          <div className="section-container about-grid-layout">
            <div className="about-visual">
              <div className="timeline-card">
                <h3>Our Simple 4-Step Resolution Cycle</h3>
                <div className="timeline-steps">
                  <div className="timeline-step">
                    <div className="step-num">1</div>
                    <div className="step-text">
                      <h5>Ticket Raised</h5>
                      <p>Employee submits hardware, software, or account issues in 1 click.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="step-num">2</div>
                    <div className="step-text">
                      <h5>Smart Assignment</h5>
                      <p>Admin triages and assigns the ticket to specialized L1/L2 Support personnel.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="step-num">3</div>
                    <div className="step-text">
                      <h5>Live Collaboration</h5>
                      <p>Real-time chat and document exchanges resolve details efficiently.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="step-num">4</div>
                    <div className="step-text">
                      <h5>Resolution & Sign-Off</h5>
                      <p>Support inputs resolution notes; employee confirms closure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-text-content">
              <span className="section-subtitle">About HelpDesk LITE</span>
              <h2>Keeping Your Infrastructure Operational</h2>
              <p>
                HelpDesk LITE provides an efficient workflow architecture. By segregating roles clearly, users are never cluttered with features they don't need. 
              </p>
              <p style={{ marginTop: '12px' }}>
                Employees get a clean, zero-friction portal to get their systems back on track. Support staff get dedicated lists, easy status changes, and filter controls. Administrators get auditing, reports generation, and system category configurations.
              </p>

              <div className="about-bullet-points">
                <div className="bullet-point">
                  <CheckCircle size={18} className="bullet-icon" />
                  <span>SLA Alerts and Priority badging for L1/L2 workloads</span>
                </div>
                <div className="bullet-point">
                  <CheckCircle size={18} className="bullet-icon" />
                  <span>Integrated real-time commenting and files tracker</span>
                </div>
                <div className="bullet-point">
                  <CheckCircle size={18} className="bullet-icon" />
                  <span>Downloadable analytics reports (CSV) and activity stream audibility</span>
                </div>
              </div>

              <button className="btn-about-info" onClick={() => onInfoClick('about')}>
                <Info size={16} />
                <span>View SLA Guidelines</span>
              </button>
            </div>
          </div>
        </section>


        {/* 4. CONTACT SECTION */}
        <section id="contact" className="contact-section">
          <div className="section-container contact-grid-layout">
            <div className="contact-info-column">
              <span className="section-subtitle">Get In Touch</span>
              <h2>How Can We Assist Your Team?</h2>
              <p>Reach out directly if you need workspace support credentials, custom integration inquiries, or system administration adjustments.</p>
              
              <div className="contact-details-list">
                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper"><Mail size={18} /></div>
                  <div className="detail-text">
                    <h5>Support Email</h5>
                    <span>helpdesk@company.com</span>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper"><Phone size={18} /></div>
                  <div className="detail-text">
                    <h5>Helpline Extension</h5>
                    <span>+1 (555) 019-9022 (Ext. 404)</span>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon-wrapper"><MapPin size={18} /></div>
                  <div className="detail-text">
                    <h5>IT Office Location</h5>
                    <span>Building C, Floor 4, Suite 410</span>
                  </div>
                </div>
              </div>

              <button className="btn-about-info" onClick={() => onInfoClick('contact')}>
                <Clock size={16} />
                <span>IT Desk Working Hours</span>
              </button>
            </div>

            {/* Interactive Contact Form */}
            <div className="contact-form-column">
              <div className="contact-form-card">
                <h3>Send Support Query</h3>
                {contactSubmitted ? (
                  <div className="form-success-alert">
                    <CheckCircle size={32} className="success-check-icon" />
                    <h4>Message Transmitted Successfully</h4>
                    <p>Our IT support leads will review this external query and reach back to your department within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="form-control" 
                        placeholder="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Work Email</label>
                      <input 
                        type="email" 
                        required
                        className="form-control" 
                        placeholder="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message / Support Requirement</label>
                      <textarea 
                        required
                        className="form-control" 
                        rows="4" 
                        placeholder="Provide details about your query..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', marginTop: '8px' }}>
                      <Send size={16} />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>



      {/* Styled JSX Styles block for full styling control and zero conflicts */}
      <style>{`
        /* Landing Wrapper styles */
        .landing-wrapper {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          position: relative;
          overflow-x: hidden;
          font-family: var(--font-primary);
        }

        /* Ambient Glow Backgrounds */
        .bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
        }
        .bg-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
          top: -100px;
          right: -50px;
        }
        .bg-glow-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0) 70%);
          top: 30%;
          left: -150px;
        }
        .bg-glow-3 {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, rgba(217, 70, 239, 0) 70%);
          bottom: -100px;
          right: -100px;
        }

        /* Landing Header */
        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 76px;
          background-color: rgba(11, 15, 25, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          z-index: 90;
        }
        body.light .landing-header {
          background-color: rgba(248, 250, 252, 0.75);
        }
        .header-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-icon {
          color: var(--primary);
          width: 28px;
          height: 28px;
        }
        .logo-text {
          font-weight: 700;
          font-size: 1.35rem;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .desktop-nav {
          display: flex;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
        }
        .nav-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-primary);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 0;
          position: relative;
          transition: var(--transition);
        }
        .nav-item:hover {
          color: var(--text-primary);
        }
        .nav-item.active {
          color: var(--primary);
          font-weight: 600;
        }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--primary);
          border-radius: 2px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-status-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 9999px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-family: var(--font-primary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-status-toggle:hover {
          border-color: var(--primary);
          color: var(--text-primary);
          background-color: var(--primary-glow);
        }
        @media (max-width: 640px) {
          .btn-status-toggle span {
            display: none;
          }
        }
        .btn-login-header {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: var(--btn-radius);
          border: 1px solid transparent;
          background-color: var(--primary);
          color: #ffffff;
          font-family: var(--font-primary);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-login-header:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-glow);
        }
        @media (max-width: 500px) {
          .btn-login-header {
            display: none;
          }
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
        }

        /* Landing Sidebar */
        .landing-sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 320px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          z-index: 110;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .landing-sidebar.open {
          transform: translateX(0);
        }
        .sidebar-header-landing {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-pulse-icon {
          color: var(--success);
          animation: pulse 2s infinite;
        }
        .sidebar-close-btn-landing {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .sidebar-close-btn-landing:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .sidebar-scroll-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .sidebar-section h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 12px;
          font-weight: 700;
        }
        .mobile-only-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-only-nav {
            display: block;
            margin-bottom: 8px;
          }
          .mobile-only-nav h4 {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 12px;
            font-weight: 700;
          }
          .mobile-nav-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .mobile-nav-grid button {
            padding: 10px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            font-family: var(--font-primary);
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          }
          .mobile-nav-grid button:hover {
            border-color: var(--primary);
            background-color: var(--primary-glow);
          }
        }

        /* Health Card style */
        .health-card {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .health-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-indicator.online {
          background-color: var(--success);
          box-shadow: 0 0 8px var(--success);
          animation: pulse 2s infinite;
        }
        .health-details {
          flex: 1;
          min-width: 0;
        }
        .health-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .health-status {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        .health-icon {
          color: var(--text-muted);
        }
        .metrics-summary-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        .metric-box {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .metric-value {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--primary);
        }
        .metric-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 2px;
        }

        /* FAQs accordion in sidebar */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-item-small {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
          transition: var(--transition);
        }
        .faq-item-small.expanded {
          border-color: var(--primary);
        }
        .faq-question-btn {
          width: 100%;
          padding: 12px 14px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-align: left;
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .faq-question-btn .chevron {
          transition: transform 0.2s ease;
          flex-shrink: 0;
          color: var(--text-secondary);
        }
        .faq-item-small.expanded .chevron {
          transform: rotate(180deg);
          color: var(--primary);
        }
        .faq-answer-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item-small.expanded .faq-answer-container {
          max-height: 120px;
        }
        .faq-answer-text {
          padding: 0 14px 14px 14px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        /* Preset Credentials Quick Reference */
        .login-hint-card {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .hint-row code {
          background-color: var(--bg-primary);
          color: var(--primary);
          padding: 2px 5px;
          border-radius: 4px;
          font-size: 0.72rem;
        }

        /* Sidebar backdrop overlay */
        .sidebar-overlay-landing {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 105;
          animation: fade-in 0.2s ease-out;
        }

        /* Main Section Container */
        .landing-main {
          z-index: 5;
          position: relative;
        }
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 24px;
          position: relative;
        }

        /* 1. HERO SECTION */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 76px;
        }
        .hero-grid-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .hero-grid-layout {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 80px 24px;
          }
        }
        .hero-text-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        @media (max-width: 992px) {
          .hero-text-content {
            align-items: center;
          }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background-color: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .badge-spark-icon {
          animation: spin-pulse 3s linear infinite;
        }
        .hero-text-content h1 {
          font-size: 3.5rem;
          line-height: 1.15;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }
        @media (max-width: 640px) {
          .hero-text-content h1 {
            font-size: 2.5rem;
          }
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, var(--info) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-description {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 36px;
        }
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 40px;
        }
        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: var(--btn-radius);
          font-family: var(--font-primary);
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-hero-primary:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }
        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 26px;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--btn-radius);
          font-family: var(--font-primary);
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-hero-secondary:hover {
          background-color: var(--border-color);
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }
        .quick-info-strip {
          display: flex;
          gap: 20px;
        }
        .info-strip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-primary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .info-strip-btn:hover {
          color: var(--primary);
        }

        /* Dashboard Preview Mockup Visuals */
        .hero-preview-visual {
          display: flex;
          justify-content: center;
          perspective: 1000px;
        }
        @media (max-width: 992px) {
          .hero-preview-visual {
            margin-top: 40px;
            max-width: 600px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
          }
        }
        .dashboard-preview-card {
          width: 100%;
          height: 380px;
          background-color: rgba(19, 26, 43, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: rotateY(-10deg) rotateX(5deg);
          transition: transform 0.5s ease;
        }
        .dashboard-preview-card:hover {
          transform: rotateY(0deg) rotateX(0deg);
        }
        .preview-header {
          height: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .preview-window-dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-red { background-color: #ef4444; }
        .dot-yellow { background-color: #f59e0b; }
        .dot-green { background-color: #10b981; }
        .preview-search-bar {
          width: 180px;
          height: 18px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
        }
        .preview-avatar-glow {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--info));
        }
        .preview-body {
          flex: 1;
          display: flex;
          min-height: 0;
        }
        .preview-sidebar-mini {
          width: 50px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .preview-nav-item {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.05);
        }
        .preview-nav-item.active {
          background-color: var(--primary-glow);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
        .preview-main-pane {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
        }
        .preview-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .preview-stat-item {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
        }
        .p-stat-title {
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .p-stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 2px;
        }
        .p-stat-value.green { color: var(--success); }
        .p-stat-value.indigo { color: var(--primary); }

        .preview-ticket-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        .preview-ticket-row {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .p-ticket-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .p-ticket-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .p-ticket-meta {
          font-size: 0.62rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .p-badge {
          font-size: 0.55rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 9999px;
        }
        .p-badge.critical {
          background-color: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }
        .p-badge.in-progress {
          background-color: rgba(168, 85, 247, 0.1);
          color: #c084fc;
        }
        .p-badge.resolved {
          background-color: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }

        /* 2. FEATURES SECTION */
        .features-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        body.light .features-section {
          background-color: #ffffff;
        }
        .section-header-centered {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 60px auto;
        }
        .section-subtitle {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          margin-bottom: 12px;
        }
        .section-header-centered h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .section-header-centered p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }
        body.light .feature-card {
          background-color: var(--bg-secondary);
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: var(--shadow-glow);
        }
        .feature-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background-color: var(--primary-glow);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: var(--transition);
        }
        .feature-card:hover .feature-icon-wrapper {
          background-color: var(--primary);
          color: #ffffff;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }
        .feature-icon {
          width: 24px;
          height: 24px;
        }
        .feature-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        .feature-short {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex: 1;
        }
        .feature-expand-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, margin-top 0.3s ease;
        }
        .feature-card.expanded .feature-expand-content {
          max-height: 150px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }
        .feature-detail-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .feature-card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
          margin-top: 20px;
        }
        .chevron-right-icon {
          transition: transform 0.2s ease;
        }
        .feature-card.expanded .chevron-right-icon {
          transform: rotate(90deg);
        }

        /* 3. ABOUT SECTION */
        .about-section {
          background-color: var(--bg-primary);
        }
        .about-grid-layout {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .about-grid-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .about-text-content h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }
        .about-text-content p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }
        .about-bullet-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 24px 0 32px 0;
        }
        .bullet-point {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bullet-icon {
          color: var(--success);
          flex-shrink: 0;
        }
        .bullet-point span {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .btn-about-info {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--btn-radius);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          font-family: var(--font-primary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-about-info:hover {
          border-color: var(--primary);
          color: var(--text-primary);
          background-color: var(--bg-tertiary);
        }

        /* Timeline cycle styles */
        .timeline-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 30px;
          box-shadow: var(--shadow-md);
        }
        body.light .timeline-card {
          background-color: #ffffff;
        }
        .timeline-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .timeline-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .timeline-steps::before {
          content: '';
          position: absolute;
          left: 18px;
          top: 15px;
          bottom: 15px;
          width: 2px;
          background-color: var(--border-color);
        }
        .timeline-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
          z-index: 1;
        }
        .step-num {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          transition: var(--transition);
        }
        body.light .step-num {
          background-color: var(--bg-primary);
        }
        .timeline-step:hover .step-num {
          background-color: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
        }
        .step-text h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .step-text p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-top: 2px;
        }

        /* 4. CONTACT SECTION */
        .contact-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
        }
        body.light .contact-section {
          background-color: #ffffff;
        }
        .contact-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .contact-grid-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .contact-info-column h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .contact-info-column p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.5;
          margin-bottom: 32px;
        }
        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }
        .contact-detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .detail-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        body.light .detail-icon-wrapper {
          background-color: var(--bg-primary);
        }
        .detail-text h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .detail-text span {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Interactive Contact Form Panel */
        .contact-form-card {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 36px;
          box-shadow: var(--shadow-md);
        }
        body.light .contact-form-card {
          background-color: var(--bg-secondary);
        }
        .contact-form-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .form-success-alert {
          text-align: center;
          padding: 24px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: fade-in 0.3s ease-out;
        }
        .success-check-icon {
          color: var(--success);
        }
        .form-success-alert h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .form-success-alert p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Landing Footer */
        .landing-footer {
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 70px 24px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 40px;
        }
        @media (max-width: 992px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 576px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
        .footer-brand-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .footer-brand-desc {
          font-size: 0.88rem;
          line-height: 1.5;
          max-width: 280px;
        }
        .system-status-indicator-footer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-primary);
          font-weight: 600;
        }
        .footer-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .footer-status-dot.online {
          background-color: var(--success);
          box-shadow: 0 0 6px var(--success);
        }
        .footer-links-column h4, 
        .footer-newsletter-column h4 {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 20px;
          letter-spacing: 0.05em;
        }
        .footer-links-column ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links-column ul button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-primary);
          font-size: 0.88rem;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: var(--transition);
        }
        .footer-links-column ul button:hover {
          color: var(--primary);
        }
        .footer-newsletter-column p {
          font-size: 0.85rem;
          line-height: 1.45;
          margin-bottom: 16px;
        }
        .newsletter-form-mock {
          display: flex;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          border-radius: 8px;
          padding: 4px;
          width: 100%;
        }
        .newsletter-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-size: 0.85rem;
          padding: 8px 12px;
          outline: none;
          min-width: 0;
        }
        .newsletter-btn {
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-family: var(--font-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .newsletter-btn:hover {
          background-color: var(--primary-hover);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding: 24px 0;
        }
        .footer-bottom-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 640px) {
          .footer-bottom-container {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-legal-links a {
          color: var(--text-muted);
          transition: var(--transition);
        }
        .footer-legal-links a:hover {
          color: var(--primary);
        }
        .bullet-sep {
          color: var(--border-color);
        }

        /* Info details modal custom width override */
        .info-modal-content {
          max-width: 500px !important;
        }

        /* Animations */
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-pulse {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
