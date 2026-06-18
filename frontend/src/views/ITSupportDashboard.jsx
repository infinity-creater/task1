import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Eye, 
  X, 
  Paperclip, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  UserPlus, 
  CheckSquare, 
  HelpCircle 
} from 'lucide-react';

export default function ITSupportDashboard({ activeTab, selectedTicketId, clearSelectedTicket }) {
  const { 
    currentUser, 
    tickets, 
    assignTicket, 
    updateTicketStatus, 
    addComment, 
    requestAdditionalInfo, 
    resolveTicket 
  } = useContext(AppContext);

  // States
  const [viewingTicket, setViewingTicket] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('assigned'); // assigned, unassigned, history
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [chatComment, setChatComment] = useState('');
  const [requestInfoQuery, setRequestInfoQuery] = useState('');
  const [showRequestInfoForm, setShowRequestInfoForm] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Handle selected ticket from Header notification click
  React.useEffect(() => {
    if (selectedTicketId) {
      const ticket = tickets.find(t => t.id === selectedTicketId);
      if (ticket) {
        setViewingTicket(ticket);
      }
      clearSelectedTicket(); // Clear reference in parent
    }
  }, [selectedTicketId, tickets]);

  // Ticket segregation
  const assignedTickets = tickets.filter(t => t.assignedTo === currentUser.username && t.status !== 'Closed' && t.status !== 'Resolved');
  const unassignedTickets = tickets.filter(t => !t.assignedTo && t.status !== 'Closed' && t.status !== 'Resolved');
  const historyTickets = tickets.filter(t => t.assignedTo === currentUser.username && (t.status === 'Closed' || t.status === 'Resolved'));

  // Metrics
  const activeCount = assignedTickets.length;
  const pendingCount = assignedTickets.filter(t => t.status === 'Pending User Response').length;
  const criticalCount = assignedTickets.filter(t => t.priority === 'Critical' || t.priority === 'High').length;
  const resolvedCount = historyTickets.filter(t => t.status === 'Resolved').length;

  const handleAssignToMe = (tckId) => {
    assignTicket(tckId, currentUser.username);
    // Refresh modal details if viewing
    if (viewingTicket && viewingTicket.id === tckId) {
      setViewingTicket(tickets.find(t => t.id === tckId));
    }
  };

  const handleStatusChange = (tckId, newStatus) => {
    updateTicketStatus(tckId, newStatus);
    if (viewingTicket && viewingTicket.id === tckId) {
      setViewingTicket(tickets.find(t => t.id === tckId));
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!chatComment.trim()) return;
    addComment(viewingTicket.id, chatComment);
    setChatComment('');
    setViewingTicket(tickets.find(t => t.id === viewingTicket.id));
  };

  const handleRequestInfoSubmit = (e) => {
    e.preventDefault();
    if (!requestInfoQuery.trim()) return;
    requestAdditionalInfo(viewingTicket.id, requestInfoQuery);
    setRequestInfoQuery('');
    setShowRequestInfoForm(false);
    setViewingTicket(tickets.find(t => t.id === viewingTicket.id));
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    resolveTicket(viewingTicket.id, resolutionNotes);
    setResolutionNotes('');
    setShowResolveModal(false);
    setViewingTicket(null); // Close modal on resolution
  };

  // Get active queue list based on sub-tab
  const getActiveQueue = () => {
    switch (activeSubTab) {
      case 'unassigned': return unassignedTickets;
      case 'history': return historyTickets;
      case 'assigned':
      default:
        return assignedTickets;
    }
  };

  const filteredQueue = getActiveQueue().filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.createdByName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesCategory;
  });

  const getPriorityBadge = (prio) => {
    return <span className={`badge badge-priority-${prio.toLowerCase()}`}>{prio}</span>;
  };

  const getStatusBadge = (stat) => {
    const statClass = stat.toLowerCase().replace(/ /g, '_');
    return <span className={`badge badge-status-${statClass}`}>{stat}</span>;
  };

  return (
    <div>
      {activeTab === 'dashboard' ? (
        <>
          {/* 1. Header Area */}
          <div style={{ marginBottom: '24px' }}>
            <h1>Support Agent Workspaces</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage queues, resolve requests, and interact with employees.</p>
          </div>

          {/* 2. Stats Grid */}
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value">{activeCount}</div>
                <div className="stat-label">Assigned Active</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <CheckSquare size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{pendingCount}</div>
                <div className="stat-label">Pending User Response</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                <HelpCircle size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--danger)' }}>{criticalCount}</div>
                <div className="stat-label">High & Critical Prio</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                <AlertTriangle size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--success)' }}>{resolvedCount}</div>
                <div className="stat-label">Recently Resolved</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          {/* Workload overview card */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3>My Pending Actions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Quick view of your assigned active tickets that need attention.</p>
            {assignedTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                No active tickets assigned to you. Enjoy your clean queue!
              </div>
            ) : (
              <div className="table-container" style={{ margin: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Requester</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTickets.slice(0, 5).map(t => (
                      <tr key={t.id} className="ticket-row-clickable" onClick={() => setViewingTicket(t)}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                        <td>{t.createdByName}</td>
                        <td>{t.subject}</td>
                        <td>{getPriorityBadge(t.priority)}</td>
                        <td>{getStatusBadge(t.status)}</td>
                        <td>
                          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); setViewingTicket(t); }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Header Area */}
          <div style={{ marginBottom: '24px' }}>
            <h1>Assigned Ticket Queues</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Filter, claim, and work on your active support tickets.</p>
          </div>

          {/* 3. Sub-tabs Navigation */}
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeSubTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('assigned')}
            >
              My Assigned Tickets ({assignedTickets.length})
            </button>
            <button 
              className={`tab-btn ${activeSubTab === 'unassigned' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('unassigned')}
            >
              Unassigned Queue ({unassignedTickets.length})
            </button>
            <button 
              className={`tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('history')}
            >
              My Resolution History ({historyTickets.length})
            </button>
          </div>

          {/* 4. Main Panel List */}
          <div className="card">
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <h3>
                {activeSubTab === 'assigned' && 'My Active Workload'}
                {activeSubTab === 'unassigned' && 'Unassigned Pool'}
                {activeSubTab === 'history' && 'Resolved and Closed Tickets'}
              </h3>

              <div className="search-filter-panel" style={{ margin: 0 }}>
                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search ID, Subject, or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={16} className="search-icon-inside" />
                </div>

                <select 
                  className="filter-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>

                <select 
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Hardware Issues">Hardware</option>
                  <option value="Software Issues">Software</option>
                  <option value="Network Issues">Network</option>
                  <option value="Email Issues">Email</option>
                  <option value="Access Requests">Access</option>
                  <option value="System Configuration Requests">System Config</option>
                  <option value="Other IT Support Requests">Other</option>
                </select>
              </div>
            </div>

            {filteredQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                No tickets found in this queue.
              </div>
            ) : (
              <div className="table-container" style={{ margin: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Requester</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue.map(t => (
                      <tr key={t.id} className="ticket-row-clickable" onClick={() => setViewingTicket(t)}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{t.createdByName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.createdBy}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{t.subject}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px', overflow: 'hidden' }}>{t.description}</div>
                        </td>
                        <td>{t.category}</td>
                        <td>{getPriorityBadge(t.priority)}</td>
                        <td>{getStatusBadge(t.status)}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex-align" onClick={e => e.stopPropagation()}>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setViewingTicket(t)}>
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            {!t.assignedTo && (
                              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAssignToMe(t.id)}>
                                <UserPlus size={14} />
                                <span>Claim</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 5. Ticket Detail View Modal */}
      {viewingTicket && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div className="flex-align">
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{viewingTicket.id}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <h3>{viewingTicket.subject}</h3>
              </div>
              <button className="btn-icon" onClick={() => setViewingTicket(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Actions & Work Toolbar */}
              <div className="card" style={{ padding: '16px', background: 'var(--bg-tertiary)' }}>
                <h4 style={{ marginBottom: '10px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-secondary)' }}>Ticket Controls</h4>
                <div className="flex-align" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Claim ticket button */}
                  {viewingTicket.assignedTo !== currentUser.username ? (
                    <button className="btn btn-primary" onClick={() => handleAssignToMe(viewingTicket.id)}>
                      <UserPlus size={16} />
                      <span>Assign to Myself</span>
                    </button>
                  ) : (
                    <>
                      {/* Status Dropdown */}
                      {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                        <div className="flex-align">
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Status:</span>
                          <select 
                            className="filter-select"
                            value={viewingTicket.status}
                            onChange={(e) => handleStatusChange(viewingTicket.id, e.target.value)}
                            style={{ height: '38px', padding: '8px 12px' }}
                          >
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending User Response">Pending Response</option>
                          </select>
                        </div>
                      )}

                      {/* Request Info Toggle Button */}
                      {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                        <button 
                          className="btn btn-outline"
                          onClick={() => { setShowRequestInfoForm(!showRequestInfoForm); setShowResolveModal(false); }}
                        >
                          <HelpCircle size={16} />
                          <span>Request Info</span>
                        </button>
                      )}

                      {/* Resolve Button */}
                      {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => { setShowResolveModal(true); setShowRequestInfoForm(false); }}
                        >
                          <CheckCircle size={16} />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Request Additional Info form overlay */}
                {showRequestInfoForm && (
                  <form onSubmit={handleRequestInfoSubmit} style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--warning)' }}>Query text for Employee</label>
                      <textarea 
                        className="form-control"
                        placeholder="Detail exactly what information, settings, or log files you need from the employee..."
                        value={requestInfoQuery}
                        onChange={(e) => setRequestInfoQuery(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-align" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                      <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setShowRequestInfoForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', backgroundColor: 'var(--warning)', borderColor: 'var(--warning)' }}>Send Request</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Meta Grid */}
              <div className="card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Requester</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{viewingTicket.createdByName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dept: {tickets.find(t => t.id === viewingTicket.id)?.createdBy === 'employee_john' ? 'Marketing' : 'HR'}</div>
                </div>
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Category</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{viewingTicket.category}</div>
                </div>
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Priority</div>
                  <div>{getPriorityBadge(viewingTicket.priority)}</div>
                </div>
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Status</div>
                  <div>{getStatusBadge(viewingTicket.status)}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ marginBottom: '8px' }}>Problem Description</h4>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: 'var(--input-radius)', 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-line'
                }}>
                  {viewingTicket.description}
                </div>
              </div>

              {/* Attachments */}
              {viewingTicket.attachments && viewingTicket.attachments.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '8px' }}>User Attachments</h4>
                  {viewingTicket.attachments.map((file, idx) => (
                    <div key={idx} className="attachment-pill" style={{ cursor: 'pointer' }} onClick={() => alert(`Simulated file download: ${file.name}`)} title="Download Attachment">
                      <Paperclip size={14} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{file.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({file.size})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Resolution Notes display if Resolved or Closed */}
              {(viewingTicket.status === 'Resolved' || viewingTicket.status === 'Closed') && (
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '16px',
                  borderRadius: 'var(--input-radius)'
                }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '4px' }}>Resolution Details</h4>
                  <p style={{ fontSize: '0.9rem' }}>
                    <strong>Notes:</strong> {viewingTicket.resolutionNotes}
                  </p>
                  {viewingTicket.resolvedAt && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Resolved on: {new Date(viewingTicket.resolvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Discussion Thread */}
              <div>
                <h4>Discussion History</h4>
                <div className="chat-container">
                  <div className="chat-history">
                    <div className="chat-bubble admin-note">
                      Ticket logged on {new Date(viewingTicket.createdAt).toLocaleString()}
                    </div>

                    {viewingTicket.comments.map((comm, idx) => {
                      if (comm.senderRole === 'system') {
                        return (
                          <div key={idx} className="chat-bubble admin-note">
                            {comm.text}
                          </div>
                        );
                      }

                      const isMe = comm.sender === currentUser.username;
                      return (
                        <div key={idx} className={`chat-bubble ${isMe ? 'sender-me' : 'sender-other'}`}>
                          <div className="chat-meta">
                            <span>{comm.senderName} ({comm.senderRole.toUpperCase()})</span>
                            <span>{new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div>{comm.text}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Post Comment */}
                  {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                    <form onSubmit={handlePostComment} className="chat-input-area">
                      <input 
                        type="text" 
                        className="chat-input"
                        placeholder="Post an update, comment, or note..."
                        value={chatComment}
                        onChange={(e) => setChatComment(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        <MessageSquare size={16} />
                        <span>Send</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingTicket(null)}>Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Resolve Resolution Modal Dialog */}
      {showResolveModal && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Resolve Ticket: {viewingTicket?.id}</h3>
              <button className="btn-icon" onClick={() => setShowResolveModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleResolveSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Resolution Summary / Notes</label>
                  <textarea 
                    className="form-control"
                    placeholder="Enter what steps were taken to resolve this problem (this will be visible to the employee)..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowResolveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Submit Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
