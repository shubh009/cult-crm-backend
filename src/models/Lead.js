import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    contact: { type: String, trim: true }, 
    city: { type: String, trim: true },

    status: {
      type: String,
      enum: ['new', 'contacted', 'site_visit', 'negotiation', 'booked', 'closed', 'lost'],
      default: 'new',
      index: true
    },

    intent: { type: String, trim: true },
    source: {
      type: String,
      enum: ['website', 'facebook', 'instagram', 'google_ads', 'referral', 'other'],
      default: 'other',
      index: true
    },

    budget: { type: Number },
    propertyType: { type: String, trim: true }, 
    timeline: { type: String, enum: ['immediate', '3_months', '6_months', 'later'] }, 
    priority: { type: String, enum: ['hot', 'warm', 'cold'], default: 'warm' }, 
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    tags: [{ type: String }],
    notes: [{ body: String, at: { type: Date, default: Date.now } }],
    followUps: [{ body: String, at: { type: Date, default: Date.now } }],
    requirements: { type: String, trim: true },
    dateOfInquiry: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
  },
  { timestamps: true }
);

// ✅ Full-text index for fast searching
leadSchema.index({
  name: 'text',
  email: 'text',
  contact: 'text',
  requirements: 'text',
  tags: 'text'
});

export const Lead = mongoose.model('Lead', leadSchema);
