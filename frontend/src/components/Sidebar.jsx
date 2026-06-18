import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  ListFilter, 
  History, 
  ShieldAlert, 
  Wrench,
  Download,
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }) {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) return null;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'support': return 'IT Support';
      case 'employee': return 'Employee';
      default: return role;
    }
  };

  const renderNavLinks = () => {
    const role = currentUser.role;

    if (role === 'employee') {
      return (
        <>
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'my-tickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('my-tickets')}
          >
            <FileText size={18} />
            <span>My Tickets</span>
          </button>
        </>
      );
    }

    if (role === 'support') {
      return (
        <>
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Workload Dashboard</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'assigned-tickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('assigned-tickets')}
          >
            <FileText size={18} />
            <span>Assigned Tickets</span>
          </button>
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Control Center</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'all-tickets' ? 'active' : ''}`}
            onClick={() => handleTabClick('all-tickets')}
          >
            <FileText size={18} />
            <span>Manage Tickets</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabClick('users')}
          >
            <Users size={18} />
            <span>Manage Users</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => handleTabClick('categories')}
          >
            <ListFilter size={18} />
            <span>Ticket Categories</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleTabClick('reports')}
          >
            <Download size={18} />
            <span>Generate Reports</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'activity-logs' ? 'active' : ''}`}
            onClick={() => handleTabClick('activity-logs')}
          >
            <History size={18} />
            <span>System Logs</span>
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="flex-align">
          <Wrench size={24} className="sidebar-brand-icon" />
          <span className="sidebar-brand-text">HelpDesk LITE</span>
        </div>
        <button className="btn-icon sidebar-close-btn" onClick={onClose} style={{ display: 'none' }}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {renderNavLinks()}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="avatar">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="user-details">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-role-badge">{getRoleLabel(currentUser.role)}</div>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-brand-icon {
          color: var(--primary);
        }
        .sidebar-brand-text {
          font-weight: 700;
          font-size: 1.25rem;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          font-family: var(--font-primary);
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: var(--btn-radius);
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
        }
        .nav-link:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .nav-link.active {
          background-color: var(--primary-glow);
          color: var(--primary);
          font-weight: 600;
        }
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--border-color);
          background-color: rgba(0, 0, 0, 0.15);
        }
        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .user-role-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }
        @media (max-width: 1024px) {
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </aside>
  );
}
