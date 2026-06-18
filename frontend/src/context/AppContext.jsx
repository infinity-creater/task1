import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const local = localStorage.getItem('helpdesk_notifications');
    return local ? JSON.parse(local) : [];
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync notifications locally
  useEffect(() => {
    localStorage.setItem('helpdesk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Determine API Base URL depending on deployment context
  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return ''; // Dev proxy handles relative URLs
    }
    // If accessed externally or hosted on Netlify, route to the host machine's backend dynamically
    return `http://${window.location.hostname}:5000`;
  };

  // Auth fetch headers helper
  const getHeaders = () => {
    const token = localStorage.getItem('helpdesk_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // Fetch initial profile on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('helpdesk_token');
      if (token) {
        try {
          const res = await fetch(getApiUrl() + '/api/auth/me', { headers: getHeaders() });
          if (res.ok) {
            const user = await res.json();
            setCurrentUser(user);
          } else {
            localStorage.removeItem('helpdesk_token');
          }
        } catch (err) {
          console.error('Auth verification failed', err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fetch contextual data when user is set
  useEffect(() => {
    if (!currentUser) {
      setTickets([]);
      setCategories([]);
      setActivityLog([]);
      setUsers([]);
      return;
    }

    loadTickets();
    loadCategories();
    
    if (currentUser.role === 'admin') {
      loadLogs();
      loadUsers();
    }
  }, [currentUser]);

  // Load functions
  const loadTickets = async () => {
    try {
      const res = await fetch(getApiUrl() + '/api/tickets', { headers: getHeaders() });
      if (res.ok) {
        const list = await res.json();
        setTickets(list);
      }
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(getApiUrl() + '/api/categories', { headers: getHeaders() });
      if (res.ok) {
        const list = await res.json();
        setCategories(list);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch(getApiUrl() + '/api/logs', { headers: getHeaders() });
      if (res.ok) {
        const list = await res.json();
        setActivityLog(list);
      }
    } catch (err) {
      console.error('Error loading activity logs:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(getApiUrl() + '/api/users', { headers: getHeaders() });
      if (res.ok) {
        const list = await res.json();
        setUsers(list);
      }
    } catch (err) {
      console.error('Error loading user list:', err);
    }
  };

  // Auth Operations
  const login = async (username, password) => {
    try {
      const res = await fetch(getApiUrl() + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('helpdesk_token', data.token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server error connection failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('helpdesk_token');
    setCurrentUser(null);
  };

  const register = async (username, password, name, department, email) => {
    try {
      const res = await fetch(getApiUrl() + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, department, email })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server error connection failed' };
    }
  };

  // Add Notification helper (retained local UI state for ease)
  const addNotification = (userId, message, ticketId) => {
    const newNotif = {
      id: `NTF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      message,
      ticketId,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Ticket Operations
  const createTicket = async (subject, category, priority, description, fileAttachment) => {
    try {
      const res = await fetch(getApiUrl() + '/api/tickets', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          subject,
          category,
          priority,
          description,
          attachment: fileAttachment ? { name: fileAttachment.name, size: fileAttachment.size } : null
        })
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();
        
        // Notify local mock notifications
        addNotification('admin', `New ticket ${ticket.id} raised: "${subject}"`, ticket.id);
        
        return ticket.id;
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  };

  const assignTicket = async (ticketId, supportUsername) => {
    try {
      const res = await fetch(getApiUrl() + `/api/tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ supportUsername })
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();
        if (currentUser.role === 'admin') {
          await loadLogs();
        }

        // Notify local mock notifications
        addNotification(supportUsername, `Ticket ${ticketId} has been assigned to you.`, ticketId);
        addNotification(ticket.createdBy, `Your ticket ${ticketId} has been assigned.`, ticketId);
      }
    } catch (err) {
      console.error('Error assigning ticket:', err);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(getApiUrl() + `/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();
        addNotification(ticket.createdBy, `Status of ticket ${ticketId} changed to: ${newStatus}`, ticketId);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addComment = async (ticketId, text) => {
    try {
      const res = await fetch(getApiUrl() + `/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();

        // Local notification routing
        if (currentUser.role === 'employee') {
          if (ticket.assignedTo) {
            addNotification(ticket.assignedTo, `Employee ${currentUser.name} replied on ${ticketId}`, ticketId);
          }
          addNotification('admin', `New reply on ${ticketId} by ${currentUser.name}`, ticketId);
        } else {
          addNotification(ticket.createdBy, `Support agent ${currentUser.name} replied on ${ticketId}`, ticketId);
        }
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const requestAdditionalInfo = async (ticketId, queryText) => {
    try {
      // 1. Post requested details comment
      await addComment(ticketId, `[INFORMATION REQUESTED] ${queryText}`);
      // 2. Modify status
      await updateTicketStatus(ticketId, 'Pending User Response');
    } catch (err) {
      console.error('Error requesting info:', err);
    }
  };

  const resolveTicket = async (ticketId, resolutionNotes) => {
    try {
      const res = await fetch(getApiUrl() + `/api/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ resolutionNotes })
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();
        addNotification(ticket.createdBy, `Your ticket ${ticketId} has been resolved. Please confirm resolution.`, ticketId);
      }
    } catch (err) {
      console.error('Error resolving ticket:', err);
    }
  };

  const closeTicket = async (ticketId) => {
    try {
      const res = await fetch(getApiUrl() + `/api/tickets/${ticketId}/close`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        const ticket = await res.json();
        await loadTickets();
        if (ticket.assignedTo) {
          addNotification(ticket.assignedTo, `Ticket ${ticketId} has been closed by the employee.`, ticketId);
        }
        addNotification('admin', `Ticket ${ticketId} closed.`, ticketId);
      }
    } catch (err) {
      console.error('Error closing ticket:', err);
    }
  };

  // Administrator Configurations
  const addCategory = async (name) => {
    try {
      const res = await fetch(getApiUrl() + '/api/categories', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        await loadCategories();
        await loadLogs();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding category:', err);
      return false;
    }
  };

  const deleteCategory = async (name) => {
    try {
      const res = await fetch(getApiUrl() + `/api/categories/${name}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await loadCategories();
        await loadLogs();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const addUser = async (userObj) => {
    try {
      const res = await fetch(getApiUrl() + '/api/users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userObj)
      });
      const data = await res.json();
      if (res.ok) {
        await loadUsers();
        await loadLogs();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Error adding user account:', err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const deleteUser = async (username) => {
    try {
      const res = await fetch(getApiUrl() + `/api/users/${username}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await loadUsers();
        await loadLogs();
      }
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) return { ...n, read: true };
      return n;
    }));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.username));
  };

  // Calculate metrics
  const getMetrics = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const closed = tickets.filter(t => t.status === 'Closed').length;
    const pending = tickets.filter(t => t.status === 'Pending User Response').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;

    // Distribution
    const catDistribution = {};
    categories.forEach(cat => {
      catDistribution[cat] = tickets.filter(t => t.category === cat).length;
    });

    // Workload
    const supportWorkload = {};
    users.forEach(u => {
      if (u.role === 'support') {
        supportWorkload[u.username] = {
          name: u.name,
          active: tickets.filter(t => t.assignedTo === u.username && t.status !== 'Closed' && t.status !== 'Resolved').length,
          resolved: tickets.filter(t => t.assignedTo === u.username && (t.status === 'Resolved' || t.status === 'Closed')).length
        };
      }
    });

    // Resolution Time
    let totalResTime = 0;
    let resolvedCount = 0;
    tickets.forEach(t => {
      if (t.resolvedAt) {
        const diffMs = new Date(t.resolvedAt) - new Date(t.createdAt);
        totalResTime += diffMs / (1000 * 60 * 60);
        resolvedCount++;
      }
    });
    const avgResolutionTime = resolvedCount > 0 ? (totalResTime / resolvedCount).toFixed(1) : '0';

    return {
      total,
      open,
      closed,
      pending,
      resolved,
      inProgress,
      catDistribution,
      supportWorkload,
      avgResolutionTime
    };
  };

  return (
    <AppContext.Provider value={{
      users,
      categories,
      tickets,
      activityLog,
      notifications,
      currentUser,
      loading,
      login,
      logout,
      register,
      createTicket,
      assignTicket,
      updateTicketStatus,
      addComment,
      requestAdditionalInfo,
      resolveTicket,
      closeTicket,
      addCategory,
      deleteCategory,
      addUser,
      deleteUser,
      markNotificationRead,
      clearNotifications,
      getMetrics
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};
