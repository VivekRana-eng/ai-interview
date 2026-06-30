const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  aiMatchScore: {
    type: Number,
    required: true,
  },
  integrityScore: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interviewing', 'Shortlisted', 'Hired'],
    default: 'Applied',
  },
  recommendation: {
    type: String,
    enum: ['Strong Hire', 'Hire', 'Maybe', 'Reject'],
    default: 'Maybe',
  },
  interviewDate: {
    type: String,
    default: 'TBD',
  },
  skills: {
    type: [String],
    default: [],
  },
  education: {
    type: [String],
    default: [],
  },
  experience: {
    type: [String],
    default: [],
  },
  certifications: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    default: '',
  },
  previousTrackRecord: {
    type: String,
    enum: ['clean', 'switched_tab', 'cheated'],
    default: 'clean'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
