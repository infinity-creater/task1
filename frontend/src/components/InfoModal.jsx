import React from 'react';
import { X } from 'lucide-react';

export default function InfoModal({ type, onClose }) {
  if (!type) return null;

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

  const currentModal = modalContents[type];
  if (!currentModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>{currentModal.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {currentModal.subtitle}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: '24px', lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          <p>{currentModal.content}</p>
          
          {type === 'about' && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)' }}>Support SLA Summary</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Critical Issues:</strong> Investigated within 15 minutes, 24/7.</li>
                <li><strong>High Priority:</strong> Response within 2 hours during office hours.</li>
                <li><strong>Medium & Low Priority:</strong> Checked within 24 hours.</li>
              </ul>
            </div>
          )}

          {type === 'contact' && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--success)' }}>Office Working Hours</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Monday - Friday: 8:00 AM - 6:00 PM EST<br />
                Saturday: 10:00 AM - 2:00 PM (Emergency Walk-ins)<br />
                Sunday: Closed (On-call remote support only)
              </p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            <span>Understood</span>
          </button>
        </div>
      </div>
    </div>
  );
}
