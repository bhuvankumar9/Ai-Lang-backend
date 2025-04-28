const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Auto generates createdAt and updatedAt
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
