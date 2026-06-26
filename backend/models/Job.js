const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Closed', 'Hold', 'Deactive'],
    default: 'Active',
  },
  candidatesCount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: '',
  },
  aboutJob: {
    type: String,
    default: '',
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  aiSummary: {
    type: String,
  },
  aiQuestions: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Job', JobSchema);
