const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    unique: true
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    trim: true,
    uppercase: true,
    maxlength: [5, 'Short code cannot exceed 5 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', subjectSchema);