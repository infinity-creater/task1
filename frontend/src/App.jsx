import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginView from './views/LoginView';
import EmployeeDashboard from './views/EmployeeDashboard';
import ITSupportDashboard from './views/ITSupportDashboard';
import AdminDashboard from './views/AdminDashboard';

function AppContent() {
  const { currentUser } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // When the user changes, reset the active tab to 'dashboard'
  useEffect(() => {
    setActiveTab('dashboard');
    setSidebarOpen(false);
    setSelectedTicketId(null);
  }, [currentUser]);

  if (!currentUser) {
    return <LoginView />;
  }

  const handleNotificationTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    
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
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="main-content">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onViewTicket={handleNotificationTicketClick}
        />
        
        <main style={{ marginTop: '20px' }}>
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
      </div>
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
