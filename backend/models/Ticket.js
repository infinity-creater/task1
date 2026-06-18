import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true }
});

const ticketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'Assigned', 'In Progress', 'Pending User Response', 'Resolved', 'Closed'],
    default: 'Open'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdByName: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    default: null
  },
  assignedToName: {
    type: String,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolutionNotes: {
    type: String,
    default: null
  },
  comments: [commentSchema],
  attachments: [attachmentSchema]
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
