import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Users, 
  Settings, 
  Database, 
  BarChart, 
  Download, 
  Plus, 
  Trash2, 
  UserPlus, 
  ArrowRight, 
  Check, 
  Clock, 
  FileText,
  AlertCircle,
  Eye,
  X,
  Paperclip,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboard({ activeTab, setActiveTab }) {
  const { 
    tickets, 
    users, 
    categories, 
    activityLog, 
    addCategory, 
    deleteCategory, 
    addUser, 
    deleteUser, 
    assignTicket, 
    getMetrics,
    addComment
  } = useContext(AppContext);

  // Metrics
  const metrics = getMetrics();

  // User Management fields
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState('support'); // support, employee, admin
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [userMsg, setUserMsg] = useState({ type: '', text: '' });

  // Category Configuration fields
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');

  // Reassignment fields
  const [reassignTargetTicket, setReassignTargetTicket] = useState(null);
  const [reassignAgent, setReassignAgent] = useState('');

  // Ticket Viewing fields
  const [viewingTicket, setViewingTicket] = useState(null);
  const [chatComment, setChatComment] = useState('');

  // Support list
  const supportAgents = users.filter(u => u.role === 'support');

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserMsg({ type: '', text: '' });

    if (!newUserName || !newUserUsername || !newUserDept) {
      setUserMsg({ type: 'error', text: 'Please fill in Name, Username, and Department.' });
      return;
    }

    const email = newUserEmail || `${newUserUsername.toLowerCase()}@company.com`;
    const res = await addUser({
      name: newUserName,
      username: newUserUsername.toLowerCase(),
      role: newUserRole,
      department: newUserDept,
      email,
      password: newUserPass
    });

    if (res && res.success) {
      setUserMsg({ type: 'success', text: `Successfully added ${newUserRole} account for ${newUserName}!` });
      // Reset after confirmation
      setNewUserName('');
      setNewUserUsername('');
      setNewUserRole('support');
      setNewUserDept('');
      setNewUserEmail('');
      setNewUserPass('password');
    } else {
      setUserMsg({ type: 'error', text: res && res.message ? res.message : 'Failed to add user' });
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    setCatMsg('');
    if (!newCatName.trim()) return;

    const added = addCategory(newCatName.trim());
    if (added) {
      setCatMsg('Category added successfully.');
      setNewCatName('');
    } else {
      setCatMsg('Category already exists.');
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!reassignTargetTicket) return;
    assignTicket(reassignTargetTicket.id, reassignAgent);
    setReassignTargetTicket(null);
    setReassignAgent('');
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!chatComment.trim()) return;
    addComment(viewingTicket.id, chatComment);
    setChatComment('');
    // Refresh modal
    const updated = tickets.find(t => t.id === viewingTicket.id);
    setViewingTicket(updated);
  };

  // Report Downloader
  const downloadReport = (reportType) => {
    let csvContent = '';
    let fileName = '';

    switch (reportType) {
      case 'monthly_summary':
        fileName = 'Monthly_Ticket_Summary.csv';
        csvContent = 'Metric,Value\n' +
          `Total Tickets Raised,${metrics.total}\n` +
          `Open Tickets,${metrics.open}\n` +
          `Closed Tickets,${metrics.closed}\n` +
          `Resolved Tickets,${metrics.resolved}\n` +
          `Pending Response,${metrics.pending}\n` +
          `In Progress,${metrics.inProgress}\n` +
          `Average Resolution Time (Hours),${metrics.avgResolutionTime}\n`;
        break;

      case 'resolution_report':
        fileName = 'Ticket_Resolution_Report.csv';
        csvContent = 'Ticket ID,Subject,Category,Priority,Created By,Assigned To,Created Date,Resolved Date,Resolution Notes\n';
        tickets.forEach(t => {
          if (t.status === 'Resolved' || t.status === 'Closed') {
            csvContent += `"${t.id}","${t.subject}","${t.category}","${t.priority}","${t.createdByName}","${t.assignedToName || 'Unassigned'}","${t.createdAt}","${t.resolvedAt || ''}","${t.resolutionNotes || ''}"\n`;
          }
        });
        break;

      case 'category_analysis':
        fileName = 'Category_Wise_Analysis.csv';
        csvContent = 'Category,Ticket Count\n';
        Object.entries(metrics.catDistribution).forEach(([cat, count]) => {
          csvContent += `"${cat}",${count}\n`;
        });
        break;

      case 'department_requests':
        fileName = 'Department_Wise_Requests.csv';
        csvContent = 'Department,Ticket Count\n';
        const deptDistribution = {};
        tickets.forEach(t => {
          const u = users.find(user => user.username === t.createdBy);
          const dept = u ? u.department : 'Unknown';
          deptDistribution[dept] = (deptDistribution[dept] || 0) + 1;
        });
        Object.entries(deptDistribution).forEach(([dept, count]) => {
          csvContent += `"${dept}",${count}\n`;
        });
        break;

      case 'ticket_ageing':
        fileName = 'Ticket_Ageing_Report.csv';
        csvContent = 'Ticket ID,Subject,Priority,Status,Created Date,Age (Hours)\n';
        tickets.forEach(t => {
          if (t.status !== 'Closed') {
            const ageHrs = ((Date.now() - new Date(t.createdAt)) / (1000 * 60 * 60)).toFixed(1);
            csvContent += `"${t.id}","${t.subject}","${t.priority}","${t.status}","${t.createdAt}",${ageHrs}\n`;
          }
        });
        break;

      case 'support_performance':
        fileName = 'Support_Team_Performance.csv';
        csvContent = 'Support Agent,Active Tickets,Resolved/Closed Tickets\n';
        Object.entries(metrics.supportWorkload).forEach(([agent, data]) => {
          csvContent += `"${data.name}",${data.active},${data.resolved}\n`;
        });
        break;

      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (prio) => {
    return <span className={`badge badge-priority-${prio.toLowerCase()}`}>{prio}</span>;
  };

  const getStatusBadge = (stat) => {
    const statClass = stat.toLowerCase().replace(/ /g, '_');
    return <span className={`badge badge-status-${statClass}`}>{stat}</span>;
  };

  // Safe category data mapping for chart max value helper
  const maxCategoryCount = Math.max(...Object.values(metrics.catDistribution), 1);

  return (
    <div>
      {/* SUB-TAB A: ANALYTICS & CHARTS */}
      {activeTab === 'dashboard' && (
        <>
          {/* Header Title */}
          <div style={{ marginBottom: '24px' }}>
            <h1>Administrative Command Center</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Configure settings, manage user accounts, and review metrics.</p>
          </div>

          {/* Top Stats Grid */}
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value">{metrics.total}</div>
                <div className="stat-label">Total Tickets</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <FileText size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{metrics.open + metrics.inProgress}</div>
                <div className="stat-label">Total Active</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                <Clock size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div className="stat-info">
                <div className="stat-value" style={{ color: 'var(--success)' }}>{metrics.closed + metrics.resolved}</div>
                <div className="stat-label">Resolved/Closed</div>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <Check size={24} />
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
          
          {/* Custom Ticket Distribution Chart */}
          <div className="card">
            <h3>Ticket Distribution by Category</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Total distribution metrics across all reported tickets.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {Object.entries(metrics.catDistribution).map(([cat, count]) => {
                const percentage = ((count / maxCategoryCount) * 100).toFixed(0);
                return (
                  <div key={cat}>
                    <div className="flex-between" style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>
                      <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '240px' }}>{cat}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{count} {count === 1 ? 'ticket' : 'tickets'}</span>
                    </div>
                    {/* Beautiful SVG Progress Bar */}
                    <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, var(--primary), var(--accent))', 
                          borderRadius: '999px', 
                          transition: 'width 1s ease' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Workload Table */}
          <div className="card">
            <h3>Support Workloads</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Current active workload assigned to support agents.</p>
            
            <div className="table-container" style={{ border: 'none', margin: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Active</th>
                    <th>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.supportWorkload).map(([username, data]) => (
                    <tr key={username}>
                      <td style={{ fontWeight: 600 }}>{data.name}</td>
                      <td>
                        <span className="badge badge-priority-medium" style={{ backgroundColor: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>
                          {data.active} active
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-status-resolved">
                          {data.resolved} done
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      )}

      {/* SUB-TAB B: OVERSEE TICKETS (REASSIGNMENT QUEUE) */}
      {activeTab === 'all-tickets' && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h1>Manage & Assign Tickets</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Assign, reassign, or monitor the status of all support request tickets.</p>
          </div>
          <div className="card">
          <h3>Manage & Assign Tickets</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Assign, reassign, or monitor the status of all support request tickets.</p>
          
          <div className="table-container" style={{ margin: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Requester</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Assigned Support Agent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{t.createdByName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.createdBy}</div>
                    </td>
                    <td>{t.subject}</td>
                    <td>{getPriorityBadge(t.priority)}</td>
                    <td style={{ fontWeight: 600, color: t.assignedToName ? 'var(--text-primary)' : 'var(--danger)' }}>
                      {t.assignedToName || '🚨 Unassigned'}
                    </td>
                    <td>{getStatusBadge(t.status)}</td>
                    <td>
                      <div className="flex-align" style={{ gap: '8px' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => setViewingTicket(t)}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        {t.status !== 'Closed' && t.status !== 'Resolved' ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => { setReassignTargetTicket(t); setReassignAgent(t.assignedTo || ''); }}
                          >
                            {t.assignedTo ? 'Reassign' : 'Assign'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Finalized</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {/* SUB-TAB C: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h1>User Accounts</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Create and manage system credentials for employees, support agents, and administrators.</p>
          </div>
          <div className="dashboard-grid">
          {/* User Creator Form */}
          <div className="card">
            <h3>Create Support or Employee Account</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Add new support agents, administrators, or employees.</p>
            
            {userMsg.text && (
              <div style={{ 
                backgroundColor: userMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: userMsg.type === 'error' ? 'var(--danger)' : 'var(--success)',
                border: `1px solid ${userMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                padding: '12px',
                borderRadius: 'var(--input-radius)',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                {userMsg.text}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. jdoe"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. Finance"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-control"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                  >
                    <option value="support">IT Support Staff</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="jdoe@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Create Account</span>
              </button>
            </form>
          </div>

          {/* Existing Users List */}
          <div className="card">
            <h3>Active Accounts</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Review and manage system credentials.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '440px', overflowY: 'auto', paddingRight: '8px' }}>
              {users.map(u => (
                <div key={u.username} className="user-card flex-between">
                  <div className="flex-align">
                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        @{u.username} | <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
                      </div>
                    </div>
                  </div>
                  {u.username !== 'admin' && u.username !== 'support_alice' && (
                    <button 
                      className="btn-icon" 
                      onClick={() => deleteUser(u.username)}
                      style={{ color: 'var(--danger)' }}
                      title="Delete Account"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
      )}

      {/* SUB-TAB D: TICKET CATEGORIES */}
      {activeTab === 'categories' && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h1>Ticket Categories</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Create and manage custom categories for issue segregation.</p>
          </div>
          <div className="dashboard-grid">
          {/* Add Category */}
          <div className="card">
            <h3>Add Ticket Category</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Create new custom categories for issue segregation.</p>
            
            {catMsg && (
              <div style={{ 
                backgroundColor: 'var(--primary-glow)', 
                color: 'var(--primary)', 
                padding: '12px', 
                borderRadius: 'var(--input-radius)', 
                marginBottom: '16px', 
                fontSize: '0.85rem',
                border: '1px solid var(--border-color)'
              }}>
                {catMsg}
              </div>
            )}

            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Printer Issues"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* List Categories */}
          <div className="card">
            <h3>Ticket Categories List</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Active issue categories available on system.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map(cat => (
                <div key={cat} className="user-card flex-between" style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{cat}</span>
                  {categories.length > 2 && (
                    <button 
                      className="btn-icon" 
                      onClick={() => deleteCategory(cat)}
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
      )}

      {/* SUB-TAB E: GENERATE REPORTS */}
      {activeTab === 'reports' && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h1>Generate Reports</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Select and download CSV format analytical audit reports.</p>
          </div>
          <div className="card">
          <h3>Reports Generator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Select and download CSV format analytical audit reports.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Monthly Ticket Summary</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Overview of created, resolved, and active tickets count.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('monthly_summary')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Ticket Resolution Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Logs of resolved tickets detailing agent actions & resolution times.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('resolution_report')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Category-wise Analysis</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Breakdown distribution of tickets across categories.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('category_analysis')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Department-wise Requests</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Shows which department raises the most IT assistance requests.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('department_requests')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Ticket Ageing Report</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Identifies how long currently open tickets have been active.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('ticket_ageing')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <div className="card flex-between" style={{ background: 'var(--bg-tertiary)' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Support Team Performance</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Metrics on workload and resolved tickets count per agent.</p>
              </div>
              <button className="btn btn-primary" onClick={() => downloadReport('support_performance')}>
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </>
      )}

      {/* SUB-TAB F: AUDIT LOGS */}
      {activeTab === 'activity-logs' && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h1>System Logs</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Real-time audit logs of support transactions, ticket actions, and profile changes.</p>
          </div>
          <div className="card">
          <h3>System Activity Stream</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Real-time audit logs of support transactions, ticket actions, and profile changes.</p>
          
          <div className="log-stream">
            {activityLog.map((log, idx) => (
              <div key={idx} className="log-item">
                <div className="log-header-info">
                  <span>@{log.user}</span>
                  <span>{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{log.action}</span>
                  {log.details && (
                    <>
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      )}

      {/* Reassignment Modal */}
      {reassignTargetTicket && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Reassign Ticket {reassignTargetTicket.id}</h3>
              <button className="btn-icon" onClick={() => setReassignTargetTicket(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{reassignTargetTicket.subject}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Support Agent</label>
                  <select 
                    className="form-control"
                    value={reassignAgent}
                    onChange={(e) => setReassignAgent(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Support Staff --</option>
                    {supportAgents.map(agent => (
                      <option key={agent.username} value={agent.username}>
                        {agent.name} ({agent.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReassignTargetTicket(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Ticket Detail View Modal */}
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
              
              {/* Meta Grid */}
              <div className="card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', background: 'var(--bg-tertiary)' }}>
                <div>
                  <div className="form-label" style={{ fontSize: '0.75rem' }}>Requester</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{viewingTicket.createdByName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{viewingTicket.createdBy}</div>
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

                      const isMe = comm.senderRole === 'admin';
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
              {viewingTicket.status !== 'Closed' && viewingTicket.status !== 'Resolved' && (
                <button 
                  className="btn btn-primary" 
                  style={{ marginRight: 'auto' }}
                  onClick={() => { setReassignTargetTicket(viewingTicket); setReassignAgent(viewingTicket.assignedTo || ''); setViewingTicket(null); }}
                >
                  Reassign Ticket
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
