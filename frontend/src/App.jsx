import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatusSidebar from './components/StatusSidebar';
import InfoModal from './components/InfoModal';
import Footer from './components/Footer';
import LoginView from './views/LoginView';
import LandingView from './views/LandingView';
import EmployeeDashboard from './views/EmployeeDashboard';
import ITSupportDashboard from './views/ITSupportDashboard';
import AdminDashboard from './views/AdminDashboard';

function AppContent() {
  const { currentUser } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [activeSection, setActiveSection] = useState('home');
  const [statusSidebarOpen, setStatusSidebarOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState(null);

  // Sync view state with auth changes
  useEffect(() => {
    if (currentUser) {
      setCurrentView('dashboard');
      setActiveTab('dashboard');
    } else {
      setCurrentView('landing');
    }
    setSidebarOpen(false);
    setSelectedTicketId(null);
  }, [currentUser]);

  const handleNavigation = (target) => {
    setStatusSidebarOpen(false);
    
    if (target === 'dashboard') {
      if (currentUser) {
        setCurrentView('dashboard');
        setActiveTab('dashboard');
      } else {
        setShowLogin(true);
      }
    } else {
      // It's a landing page section (home, features, about, contact)
      setCurrentView('landing');
      setShowLogin(false);
      setActiveSection(target);
      
      // Scroll to the element
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleNotificationTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentView('dashboard'); // Redirect to dashboard if viewing from notification
    
    // Set appropriate view tab
    if (currentUser.role === 'employee') {
      setActiveTab('my-tickets');
    } else if (currentUser.role === 'support') {
      setActiveTab('assigned-tickets');
    } else if (currentUser.role === 'admin') {
      setActiveTab('all-tickets');
    }
  };

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onViewTicket={handleNotificationTicketClick}
        onNavClick={handleNavigation}
        onLoginClick={() => setShowLogin(true)}
        onStatusClick={() => setStatusSidebarOpen(true)}
        currentView={currentView}
        activeSection={activeSection}
      />
      
      <StatusSidebar 
        isOpen={statusSidebarOpen}
        onClose={() => setStatusSidebarOpen(false)}
        onNavClick={(sectionId) => handleNavigation(sectionId)}
      />

      <InfoModal 
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Main View Area */}
      {!currentUser && showLogin ? (
        <LoginView onBack={() => setShowLogin(false)} />
      ) : currentUser && currentView === 'dashboard' ? (
        <div className="app-container">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          <div className="main-content">
            <main style={{ marginTop: '20px', flex: '1 0 auto' }}>
              {currentUser.role === 'employee' && (
                <EmployeeDashboard 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  selectedTicketId={selectedTicketId}
                  clearSelectedTicket={() => setSelectedTicketId(null)}
                />
              )}

              {currentUser.role === 'support' && (
                <ITSupportDashboard 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  selectedTicketId={selectedTicketId}
                  clearSelectedTicket={() => setSelectedTicketId(null)}
                />
              )}

              {currentUser.role === 'admin' && (
                <AdminDashboard 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  selectedTicketId={selectedTicketId}
                  clearSelectedTicket={() => setSelectedTicketId(null)}
                />
              )}
            </main>
            <Footer 
              onNavClick={handleNavigation}
              onLoginClick={() => setShowLogin(true)}
              onStatusClick={() => setStatusSidebarOpen(true)}
              onInfoClick={setInfoModalType}
              currentUser={currentUser}
            />
          </div>
        </div>
      ) : (
        <>
          <LandingView 
            onLoginClick={() => setShowLogin(true)}
            onInfoClick={setInfoModalType}
            onNavClick={handleNavigation}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <Footer 
            onNavClick={handleNavigation}
            onLoginClick={() => setShowLogin(true)}
            onStatusClick={() => setStatusSidebarOpen(true)}
            onInfoClick={setInfoModalType}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
