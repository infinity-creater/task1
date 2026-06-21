import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Sun, Moon, LogOut, Menu, User, Check } from 'lucide-react';

export default function Header({ toggleSidebar, onViewTicket }) {
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

  return (
    <header className="app-header">
      <div className="flex-align">
        <button className="btn-icon mobile-menu-toggle" style={{ display: 'none' }} onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h2>HelpDesk LITE Portal</h2>
      </div>

      <div className="flex-align gap-12">
        {/* Theme Toggler */}
        <button className="btn-icon" onClick={toggleTheme} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

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
                  <div style={{ padding: '24px 16px', textAlignment: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications
                  </div>
                ) : (
                  userNotifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div style={{ color: 'var(--text-primary)' }}>{notif.message}</div>
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

        {/* Profile Card */}
        {currentUser && (
          <div className="flex-align" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="user-profile-info" style={{ display: 'none' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentUser.role.toUpperCase()}</div>
            </div>
            <button className="btn-icon" onClick={logout} title="Log Out">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        .user-profile-info {
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 640px) {
          .user-profile-info {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
