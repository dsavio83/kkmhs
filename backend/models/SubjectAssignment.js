const mongoose = require('mongoose');

const subjectAssignmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassRoom',
    required: [true, 'Class ID is required']
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
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

// Compound index to ensure unique subject assignment per class per subject
subjectAssignmentSchema.index({ classId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('SubjectAssignment', subjectAssignmentSchema);