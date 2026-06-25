const mongoose = require('mongoose');

const QuestionBankSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    unique: true
  },
  questions: [
    {
      text: { 
        type: String, 
        required: true 
      },
      category: { 
        type: String, 
        required: true,
        enum: ['Easy', 'Medium', 'Hard', 'Scenario', 'Behavioral']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);
