import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './models/User.js';
import Ticket from './models/Ticket.js';
import ActivityLog from './models/ActivityLog.js';
import Category from './models/Category.js';
import authMiddleware from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk')
  .then(async () => {
    console.log('MongoDB Connected successfully!');
    await seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
  });

// Seeding logic
async function seedDatabase() {
  try {
    // 1. Seed Users
    const hashedPassword = await bcrypt.hash('password', 10);
    const adminHashedPassword = await bcrypt.hash('admin', 10);

    // Update password and display name for existing admin user to sync immediately
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      existingAdmin.password = adminHashedPassword;
      existingAdmin.name = 'Admin';
      await existingAdmin.save();
      console.log('Synchronized admin profile in database.');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default users...');
      const defaultUsers = [
        { username: 'admin', password: adminHashedPassword, role: 'admin', name: 'Admin', department: 'IT Operations', email: 'eleanor.vance@company.com' },
        { username: 'support_alice', password: hashedPassword, role: 'support', name: 'Alice Cooper', department: 'IT Support Tier 1', email: 'alice.cooper@company.com' },
        { username: 'support_bob', password: hashedPassword, role: 'support', name: 'Bob Dylan', department: 'IT Support Tier 2', email: 'bob.dylan@company.com' },
        { username: 'employee_john', password: hashedPassword, role: 'employee', name: 'John Smith', department: 'Marketing', email: 'john.smith@company.com' },
        { username: 'employee_jane', password: hashedPassword, role: 'employee', name: 'Jane Doe', department: 'Human Resources', email: 'jane.doe@company.com' }
      ];
      await User.insertMany(defaultUsers);
    } else {
      // Ensure we have support agents even if db was pre-populated without them
      const supportCount = await User.countDocuments({ role: 'support' });
      if (supportCount === 0) {
        console.log('Seeding missing default support agents...');
        const defaultSupport = [
          { username: 'support_alice', password: hashedPassword, role: 'support', name: 'Alice Cooper', department: 'IT Support Tier 1', email: 'alice.cooper@company.com' },
          { username: 'support_bob', password: hashedPassword, role: 'support', name: 'Bob Dylan', department: 'IT Support Tier 2', email: 'bob.dylan@company.com' }
        ];
        await User.insertMany(defaultSupport);
      }
      // Ensure we have default employees
      const employeeCount = await User.countDocuments({ role: 'employee' });
      if (employeeCount === 0) {
        console.log('Seeding missing default employees...');
        const defaultEmployees = [
          { username: 'employee_john', password: hashedPassword, role: 'employee', name: 'John Smith', department: 'Marketing', email: 'john.smith@company.com' },
          { username: 'employee_jane', password: hashedPassword, role: 'employee', name: 'Jane Doe', department: 'Human Resources', email: 'jane.doe@company.com' }
        ];
        await User.insertMany(defaultEmployees);
      }
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding default categories...');
      const defaultCategories = [
        { name: 'Hardware Issues' },
        { name: 'Software Issues' },
        { name: 'Network Issues' },
        { name: 'Email Issues' },
        { name: 'Access Requests' },
        { name: 'System Configuration Requests' },
        { name: 'Other IT Support Requests' }
      ];
      await Category.insertMany(defaultCategories);
    }

    // 3. Seed Tickets
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log('Seeding default tickets...');
      const defaultTickets = [
        {
          id: 'TCK-1001',
          subject: 'Laptop Battery Overheating',
          category: 'Hardware Issues',
          priority: 'High',
          description: 'My corporate laptop battery gets extremely hot after 30 minutes of usage and drains from 100% to 10% in less than an hour. I am worried about safety.',
          status: 'Closed',
          createdBy: 'employee_john',
          createdByName: 'John Smith',
          assignedTo: 'support_alice',
          assignedToName: 'Alice Cooper',
          resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          resolutionNotes: 'Verified battery bulge. Replaced the laptop battery pack under warranty. Diagnostics ran successfully, stable temperature observed.',
          comments: [
            { sender: 'support_alice', senderName: 'Alice Cooper', senderRole: 'support', text: 'Hi John, please bring your laptop down to the IT Lab on Floor 3. I have prepared a replacement battery for you.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { sender: 'employee_john', senderName: 'John Smith', senderRole: 'employee', text: 'Thanks Alice, I have dropped it off. Let me know when it is ready.', timestamp: new Date(Date.now() - 3.8 * 24 * 60 * 60 * 1000) },
            { sender: 'support_alice', senderName: 'Alice Cooper', senderRole: 'support', text: 'Battery replacement is done and verified. You can pick it up!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
          ],
          attachments: [{ name: 'battery_stats.png', size: '1.2 MB' }]
        },
        {
          id: 'TCK-1002',
          subject: 'VPN Connection Fails on macOS',
          category: 'Network Issues',
          priority: 'Critical',
          description: 'Since the macOS security update last night, the corporate Cisco AnyConnect VPN client fails to establish a handshake. I cannot access production databases.',
          status: 'In Progress',
          createdBy: 'employee_john',
          createdByName: 'John Smith',
          assignedTo: 'support_bob',
          assignedToName: 'Bob Dylan',
          comments: [
            { sender: 'support_bob', senderName: 'Bob Dylan', senderRole: 'support', text: 'John, are you receiving a specific error code? E.g., Gateway timed out or Authentication failed?', timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) },
            { sender: 'employee_john', senderName: 'John Smith', senderRole: 'employee', text: 'It says "Connection attempt has failed due to host resolution." Attached screenshot.', timestamp: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000) }
          ],
          attachments: [{ name: 'vpn_error.jpg', size: '425 KB' }]
        },
        {
          id: 'TCK-1003',
          subject: 'Cannot login to Salesforce CRM',
          category: 'Software Issues',
          priority: 'Medium',
          description: 'My account seems locked or single-sign-on (SSO) is broken. It displays "Access Denied: User account deactivated" when redirecting.',
          status: 'Pending User Response',
          createdBy: 'employee_jane',
          createdByName: 'Jane Doe',
          assignedTo: 'support_alice',
          assignedToName: 'Alice Cooper',
          comments: [
            { sender: 'support_alice', senderName: 'Alice Cooper', senderRole: 'support', text: 'Hi Jane, we checked Okta and your profile is active. Could you try clearing your browser cache or opening Salesforce in Incognito mode and checking if it works?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
          ],
          attachments: []
        },
        {
          id: 'TCK-1004',
          subject: 'Request for Adobe Creative Cloud License',
          category: 'Access Requests',
          priority: 'Low',
          description: 'I need Adobe Premiere Pro and Photoshop licenses to create video marketing collateral for the upcoming Q3 product release.',
          status: 'Open',
          createdBy: 'employee_jane',
          createdByName: 'Jane Doe',
          assignedTo: null,
          assignedToName: null,
          comments: [],
          attachments: [{ name: 'manager_approval_email.pdf', size: '200 KB' }]
        }
      ];
      await Ticket.insertMany(defaultTickets);
    }

    // 4. Seed Audit Logs
    const logCount = await ActivityLog.countDocuments();
    if (logCount === 0) {
      console.log('Seeding default activity logs...');
      const defaultLogs = [
        { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), user: 'employee_john', action: 'Created Ticket TCK-1001', details: 'Laptop Battery Overheating' },
        { timestamp: new Date(Date.now() - 4.8 * 24 * 60 * 60 * 1000), user: 'admin', action: 'Assigned Ticket TCK-1001', details: 'Assigned to Alice Cooper' },
        { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), user: 'support_alice', action: 'Resolved Ticket TCK-1001', details: 'Replaced battery' },
        { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), user: 'employee_john', action: 'Closed Ticket TCK-1001', details: 'Confirmed solution' },
        { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), user: 'employee_john', action: 'Created Ticket TCK-1002', details: 'VPN Connection Fails' },
        { timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000), user: 'admin', action: 'Assigned Ticket TCK-1002', details: 'Assigned to Bob Dylan' }
      ];
      await ActivityLog.insertMany(defaultLogs);
    }
  } catch (err) {
    console.error('Seeding database error:', err.message);
  }
}

// Activity logging helper
async function logActivity(username, action, details = '') {
  try {
    const log = new ActivityLog({ user: username, action, details });
    await log.save();
  } catch (err) {
    console.error('Log activity error:', err.message);
  }
}

// Auth API Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, department, email } = req.body;
  try {
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: 'employee',
      name,
      department,
      email: email || `${username.toLowerCase()}@company.com`
    });

    await newUser.save();
    await logActivity(newUser.username, 'Registered Account', `Department: ${department}`);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { username: user.username, name: user.name, role: user.role, department: user.department, email: user.email },
      process.env.JWT_SECRET || 'helpdesk_super_secret_key',
      { expiresIn: '24h' }
    );

    await logActivity(user.username, 'Logged In', `Role: ${user.role}`);

    res.json({
      token,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Category API Endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats.map(c => c.name));
  } catch (err) {
    res.status(500).json({ message: 'Server error loading categories', error: err.message });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  const { name } = req.body;
  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const cat = new Category({ name });
    await cat.save();
    await logActivity(req.user.username, 'Added Category', name);
    res.status(201).json({ name });
  } catch (err) {
    res.status(500).json({ message: 'Server error adding category', error: err.message });
  }
});

app.delete('/api/categories/:name', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  try {
    await Category.findOneAndDelete({ name: req.params.name });
    await logActivity(req.user.username, 'Deleted Category', req.params.name);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting category', error: err.message });
  }
});

// Users Management Endpoints (Admin-only)
app.get('/api/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  try {
    const list = await User.find().select('-password');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error listing accounts', error: err.message });
  }
});

app.post('/api/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  const { username, password, name, department, role, email } = req.body;
  try {
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
      department,
      role,
      email: email || `${username.toLowerCase()}@company.com`
    });
    await newUser.save();
    await logActivity(req.user.username, 'Created Account', `${role}: ${name}`);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating user account', error: err.message });
  }
});

app.delete('/api/users/:username', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  try {
    await User.findOneAndDelete({ username: req.params.username.toLowerCase() });
    await logActivity(req.user.username, 'Deleted User Account', req.params.username);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting user', error: err.message });
  }
});

// Tickets API Endpoints
app.get('/api/tickets', authMiddleware, async (req, res) => {
  try {
    let list;
    if (req.user.role === 'admin' || req.user.role === 'support') {
      list = await Ticket.find().sort({ createdAt: -1 });
    } else {
      list = await Ticket.find({ createdBy: req.user.username }).sort({ createdAt: -1 });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error loading tickets', error: err.message });
  }
});

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const { subject, category, priority, description, attachment } = req.body;
  const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    // 1. Fetch support agents sorted alphabetically by username
    const supportAgents = await User.find({ role: 'support' }).sort({ username: 1 });
    
    let assignedTo = null;
    let assignedToName = null;
    let status = 'Open';
    const comments = [];

    if (supportAgents.length > 0) {
      // 2. Find the last assigned ticket to a support agent
      const lastAssignedTicket = await Ticket.findOne({ assignedTo: { $ne: null } }).sort({ createdAt: -1 });
      
      let nextIndex = 0;
      if (lastAssignedTicket && lastAssignedTicket.assignedTo) {
        const lastIndex = supportAgents.findIndex(agent => agent.username === lastAssignedTicket.assignedTo);
        if (lastIndex !== -1) {
          nextIndex = (lastIndex + 1) % supportAgents.length;
        }
      }
      
      const agent = supportAgents[nextIndex];
      assignedTo = agent.username;
      assignedToName = agent.name;
      status = 'Assigned';
      
      comments.push({
        sender: 'system',
        senderName: 'System',
        senderRole: 'system',
        text: `Ticket automatically assigned to ${agent.name} via Round-Robin scheduling.`
      });
    }

    const newTicket = new Ticket({
      id: ticketId,
      subject,
      category,
      priority,
      description,
      status,
      createdBy: req.user.username,
      createdByName: req.user.name,
      assignedTo,
      assignedToName,
      comments,
      attachments: attachment ? [attachment] : []
    });

    await newTicket.save();
    await logActivity(req.user.username, 'Created Ticket', `${ticketId}: ${subject}`);
    
    if (assignedTo) {
      await logActivity('system', 'Assigned Ticket', `${ticketId} automatically assigned to ${assignedToName}`);
    }

    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating ticket', error: err.message });
  }
});

app.put('/api/tickets/:id/assign', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'support') {
    return res.status(403).json({ message: 'Permission denied' });
  }
  const { supportUsername } = req.body;
  try {
    const agent = await User.findOne({ username: supportUsername, role: 'support' });
    if (!agent) {
      return res.status(404).json({ message: 'Support agent not found' });
    }

    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.assignedTo = supportUsername;
    ticket.assignedToName = agent.name;
    ticket.status = 'Assigned';
    ticket.comments.push({
      sender: 'system',
      senderName: 'System',
      senderRole: 'system',
      text: `Ticket assigned to ${agent.name} by ${req.user.name}.`
    });

    await ticket.save();
    await logActivity(req.user.username, 'Assigned Ticket', `${ticket.id} assigned to ${agent.name}`);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error assigning ticket', error: err.message });
  }
});

app.put('/api/tickets/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    ticket.comments.push({
      sender: 'system',
      senderName: 'System',
      senderRole: 'system',
      text: `Status updated to ${status} by ${req.user.name}.`
    });

    await ticket.save();
    await logActivity(req.user.username, 'Updated Ticket Status', `${ticket.id} set to ${status}`);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error changing status', error: err.message });
  }
});

app.post('/api/tickets/:id/comments', authMiddleware, async (req, res) => {
  const { text } = req.body;
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Dynamic status update logic
    let updatedStatus = ticket.status;
    if (req.user.role === 'employee' && ticket.status === 'Pending User Response') {
      updatedStatus = 'In Progress';
    } else if (req.user.role === 'support' && ticket.status === 'Assigned') {
      updatedStatus = 'In Progress';
    }

    ticket.status = updatedStatus;
    ticket.comments.push({
      sender: req.user.username,
      senderName: req.user.name,
      senderRole: req.user.role,
      text
    });

    await ticket.save();
    await logActivity(req.user.username, 'Added Ticket Comment', `Comment on ${ticket.id}`);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error posting comment', error: err.message });
  }
});

app.put('/api/tickets/:id/resolve', authMiddleware, async (req, res) => {
  const { resolutionNotes } = req.body;
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = 'Resolved';
    ticket.resolvedAt = new Date();
    ticket.resolutionNotes = resolutionNotes;
    ticket.comments.push({
      sender: 'system',
      senderName: 'System',
      senderRole: 'system',
      text: `Ticket resolved by ${req.user.name}. Notes: ${resolutionNotes}`
    });

    await ticket.save();
    await logActivity(req.user.username, 'Resolved Ticket', `${ticket.id}`);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error resolving ticket', error: err.message });
  }
});

app.put('/api/tickets/:id/close', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = 'Closed';
    ticket.comments.push({
      sender: 'system',
      senderName: 'System',
      senderRole: 'system',
      text: `Ticket marked as closed by ${req.user.name}.`
    });

    await ticket.save();
    await logActivity(req.user.username, 'Closed Ticket', `${ticket.id}`);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error closing ticket', error: err.message });
  }
});

// Logs API Endpoint (Admin-only)
app.get('/api/logs', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error listing audit logs', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
