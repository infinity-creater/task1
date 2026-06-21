import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Wrench, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  LogIn, 
  Activity, 
  User, 
  Check 
} from 'lucide-react';

export default function Header({ 
  toggleSidebar, 
  onViewTicket, 
  onNavClick, 
  onLoginClick, 
  onStatusClick,
  currentView,
  activeSection
}) {
  const { currentUser, logout, notifications, markNotificationRead, clearNotifications } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => !document.body.classList.contains('light'));

  const toggleTheme = () => {
    document.body.classList.toggle('light');
    setIsDarkMode(prev => !prev);
  };

  const userNotifications = notifications.filter(n => n.userId === currentUser?.username);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    setShowNotifications(false);
    if (notif.ticketId && onViewTicket) {
      onViewTicket(notif.ticketId);
    }
  };

  const isDashboard = currentView === 'dashboard' && currentUser;

  return (
    <header className={`landing-header ${isDashboard ? 'with-sidebar' : ''}`}>
      <div className={`header-container ${isDashboard ? 'full-width' : ''}`}>
        
        {/* Left Section: Mobile Menu Toggle for Dashboard + Logo */}
        <div className="logo-section-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDashboard && (
            <button className="btn-icon mobile-menu-toggle" style={{ display: 'none' }} onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
          )}
          
          <div className="logo-section" onClick={() => onNavClick('home')}>
            <Wrench className="logo-icon" />
            <span className="logo-text">HelpDesk LITE</span>
          </div>
        </div>

        {/* Middle Section: Desktop Navigation */}
        <nav className="desktop-nav">
          <button 
            className={`nav-item ${currentView === 'landing' && activeSection === 'home' ? 'active' : ''}`}
            onClick={() => onNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-item ${currentView === 'landing' && activeSection === 'features' ? 'active' : ''}`}
            onClick={() => onNavClick('features')}
          >
            Features
          </button>
          <button 
            className={`nav-item ${currentView === 'landing' && activeSection === 'about' ? 'active' : ''}`}
            onClick={() => onNavClick('about')}
          >
            About
          </button>
          <button 
            className={`nav-item ${currentView === 'landing' && activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => onNavClick('contact')}
          >
            Contact
          </button>
          
          {currentUser && (
            <button 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavClick('dashboard')}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Right Section: Actions */}
        <div className="header-actions">
          
          {/* Theme Toggler */}
          <button className="btn-icon" onClick={toggleTheme} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Status & Help Button */}
          <button 
            className="btn-status-toggle"
            onClick={onStatusClick}
            title="System Status & FAQ Help Center"
          >
            <Activity size={18} />
            <span>Status & Help</span>
          </button>

          {/* Logged In Features */}
          {currentUser ? (
            <>
              {/* Notifications */}
              <div className="notification-bell-container">
                <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                      {userNotifications.length > 0 && (
                        <button 
                          className="btn" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', background: 'transparent', color: 'var(--primary)' }}
                          onClick={clearNotifications}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {userNotifications.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          No notifications
                        </div>
                      ) : (
                        userNotifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notif)}
                          >
                            <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{notif.message}</div>
                            <div className="notification-time">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(notif.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile summary & Logout */}
              <div className="flex-align" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', gap: '10px' }}>
                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="user-profile-info" style={{ display: 'none' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentUser.role.toUpperCase()}</div>
                </div>
                <button className="btn-icon" onClick={logout} title="Log Out" style={{ color: 'var(--text-secondary)' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Logged Out: Sign In Button */
            <button className="btn-login-header" onClick={onLoginClick}>
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu trigger (Landing view only) */}
          {!isDashboard && (
            <button className="mobile-menu-btn" onClick={onStatusClick}>
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>


    </header>
  );
}
