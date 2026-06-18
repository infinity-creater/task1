import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Eye, 
  X, 
  Paperclip, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  FileText
} from 'lucide-react';

export default function EmployeeDashboard({ activeTab, selectedTicketId, clearSelectedTicket }) {
  const { 
    currentUser, 
    tickets, 
    categories, 
    createTicket, 
    addComment, 
    closeTicket 
  } = useContext(AppContext);

  // Stats
  const employeeTickets = tickets.filter(t => t.createdBy === currentUser.username);
  const totalRaised = employeeTickets.length;
  const openCount = employeeTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const closedCount = employeeTickets.filter(t => t.status === 'Closed').length;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);

  // Form Fields
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Chat/Comment input
  const [chatComment, setChatComment] = useState('');

  // Handle selected ticket from Header notification click
  React.useEffect(() => {
    if (selectedTicketId) {
      const ticket = tickets.find(t => t.id === selectedTicketId);
      if (ticket && ticket.createdBy === currentUser.username) {
        setViewingTicket(ticket);
      }
      clearSelectedTicket(); // Clear reference in parent
    }
  }, [selectedTicketId, tickets]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description) {
      alert('Please fill in Subject and Description');
      return;
    }

    createTicket(subject, category, priority, description, attachment);
    
    // Reset form
    setSubject('');
    setCategory(categories[0] || '');
    setPriority('Medium');
    setDescription('');
    setAttachment(null);
    setShowCreateModal(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(0) > 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
          : (file.size / 1024).toFixed(0) + ' KB'
      });
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!chatComment.trim()) return;
    addComment(viewingTicket.id, chatComment);
    setChatComment('');
    // Refresh viewing ticket details
    const updated = tickets.find(t => t.id === viewingTicket.id);
    setViewingTicket(updated);
  };

  const handleCloseTicketAction = (tckId) => {
    closeTicket(tckId);
    // Refresh
    const updated = tickets.find(t => t.id === tckId);
    setViewingTicket(updated);
  };

  // Filter logic
  const filteredTickets = employeeTickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getPriorityBadge = (prio) => {
    return <span className={`badge badge-priority-${prio.toLowerCase()}`}>{prio}</span>;
  };

  const getStatusBadge = (stat) => {
    const statClass = stat.toLowerCase().replace(/ /g, '_');
    return <span className={`badge badge-status-${statClass}`}>{stat}</span>;
  };

  // Safe check if categories loaded
  React.useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories]);

  return (
    <div>
      {/* 1. Header Area with Create Button */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Welcome, {currentUser.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Raise, monitor, and resolve your IT requests.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>New Support Ticket</span>
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* 2. Stats cards grid */}
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value">{totalRaised}</div>
                <div className="stat-label">Total Raised</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <FileText size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{openCount}</div>
                <div className="stat-label">Active Tickets</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                <Clock size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--success)' }}>{closedCount}</div>
                <div className="stat-label">Closed Tickets</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          {/* Recent Ticket Activity */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3>Recent Ticket Activity</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Latest updates on your raised support requests.</p>
            {employeeTickets.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                You haven't raised any support tickets yet.
              </div>
            ) : (
              <div className="table-container" style={{ margin: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeTickets.slice(0, 4).map(t => (
                      <tr key={t.id} className="ticket-row-clickable" onClick={() => setViewingTicket(t)}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                        <td style={{ fontWeight: 500 }}>{t.subject}</td>
                        <td>{getPriorityBadge(t.priority)}</td>
                        <td>{getStatusBadge(t.status)}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); setViewingTicket(t); }}>
                            <Eye size={12} />
                            <span>View</span>
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
        /* 3. Ticket Listing View */
        <div className="card">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <h3>My Support Requests</h3>
            
            <div className="search-filter-panel" style={{ margin: 0 }}>
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search ticket # or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="search-icon-inside" />
              </div>

              <select 
                className="filter-select" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending User Response">Pending Response</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select 
                className="filter-select" 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

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
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              No tickets match your filters.
            </div>
          ) : (
            <div className="table-container" style={{ margin: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(t => (
                    <tr key={t.id} className="ticket-row-clickable" onClick={() => setViewingTicket(t)}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px', overflow: 'hidden' }}>{t.description}</div>
                      </td>
                      <td>{t.category}</td>
                      <td>{getPriorityBadge(t.priority)}</td>
                      <td>{getStatusBadge(t.status)}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); setViewingTicket(t); }}>
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Create Ticket Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Raise New IT Support Request</h3>
              <button className="btn-icon" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Short description of the issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-control"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low (Non-blocking)</option>
                      <option value="Medium">Medium (General support)</option>
                      <option value="High">High (Impacting work)</option>
                      <option value="Critical">Critical (System down)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Explain the problem, steps to reproduce, or requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Supporting Document / Screenshot</label>
                  <div className="file-upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                    <Paperclip size={20} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                    <div>{attachment ? attachment.name : 'Select file (PDF, PNG, JPG)'}</div>
                    <div className="file-upload-text">
                      {attachment ? `Size: ${attachment.size}` : 'Click here to browse files'}
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="fileInput" 
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
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
              
              {/* Top Row Meta */}
              <div className="card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', background: 'var(--bg-tertiary)' }}>
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
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Assigned Agent</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {viewingTicket.assignedToName || 'Unassigned'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ marginBottom: '8px' }}>Description</h4>
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
                  <h4 style={{ marginBottom: '8px' }}>Attachments</h4>
                  {viewingTicket.attachments.map((file, idx) => (
                    <div key={idx} className="attachment-pill">
                      <Paperclip size={14} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontWeight: 500 }}>{file.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({file.size})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Resolution Info */}
              {viewingTicket.status === 'Resolved' && (
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '16px',
                  borderRadius: 'var(--input-radius)'
                }}>
                  <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle size={18} />
                    <span>Issue Resolved</span>
                  </h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                    <strong>Resolution Notes: </strong> {viewingTicket.resolutionNotes}
                  </p>
                  <div className="flex-align gap-12">
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleCloseTicketAction(viewingTicket.id)}
                    >
                      Confirm Resolution & Close Ticket
                    </button>
                  </div>
                </div>
              )}

              {/* Discussion Thread */}
              <div>
                <h4>Discussion & Ticket History</h4>
                <div className="chat-container">
                  <div className="chat-history">
                    {/* System creation log */}
                    <div className="chat-bubble admin-note">
                      Ticket submitted on {new Date(viewingTicket.createdAt).toLocaleString()}
                    </div>

                    {/* Messages thread */}
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

                  {/* Post Comment Input */}
                  {viewingTicket.status !== 'Closed' && (
                    <form onSubmit={handlePostComment} className="chat-input-area">
                      <input 
                        type="text" 
                        className="chat-input"
                        placeholder={viewingTicket.status === 'Pending User Response' ? "Provide requested information..." : "Type a message..."}
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
              {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                <button 
                  className="btn btn-danger" 
                  style={{ marginRight: 'auto' }}
                  onClick={() => handleCloseTicketAction(viewingTicket.id)}
                >
                  <XCircle size={16} />
                  <span>Cancel Request (Close)</span>
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setViewingTicket(null)}>Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
