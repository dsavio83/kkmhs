const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  percentage: {
    type: String,
    required: [true, 'Attendance percentage is required'],
    validate: {
      validator: function(v) {
        const num = parseFloat(v);
        return num >= 0 && num <= 100;
      },
      message: 'Attendance percentage must be between 0 and 100'
    }
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

// Compound index to ensure unique attendance per student per exam
attendanceSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);