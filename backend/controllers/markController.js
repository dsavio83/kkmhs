const Mark = require('../models/Mark');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Subject = require('../models/Subject');

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private (Admin/Teacher)
const getAllMarks = async (req, res) => {
  try {
    const marks = await Mark.find()
      .populate('studentId', 'name username admissionNo')
      .populate('subjectId', 'name shortCode')
      .populate('examId', 'name');
    res.json(marks);
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get marks by exam
// @route   GET /api/marks/exam/:examId
// @access  Private (Admin/Teacher)
const getMarksByExam = async (req, res) => {
  try {
    const marks = await Mark.find({ examId: req.params.examId })
      .populate('studentId', 'name username admissionNo')
      .populate('subjectId', 'name shortCode')
      .populate('examId', 'name');
    res.json(marks);
  } catch (error) {
    console.error('Get marks by exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get marks by student
// @route   GET /api/marks/student/:studentId
// @access  Private (Admin/Teacher/Student)
const getMarksByStudent = async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.params.studentId })
      .populate('subjectId', 'name shortCode')
      .populate('examId', 'name');
    res.json(marks);
  } catch (error) {
    console.error('Get marks by student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new mark record
// @route   POST /api/marks
// @access  Private (Admin/Teacher)
const createMark = async (req, res) => {
  try {
    const { studentId, subjectId, examId, teMark, ceMark } = req.body;

    // Validate student exists and is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'STUDENT') {
      return res.status(400).json({ message: 'Invalid student' });
    }

    // Validate subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Validate exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if mark already exists for this student-subject-exam combination
    const existingMark = await Mark.findOne({ studentId, subjectId, examId });
    if (existingMark) {
      return res.status(400).json({ message: 'Mark already exists for this student-subject-exam combination' });
    }

    const mark = new Mark({
      studentId,
      subjectId,
      examId,
      teMark,
      ceMark
    });

    await mark.save();

    res.status(201).json({
      message: 'Mark created successfully',
      mark: {
        id: mark._id,
        studentId: mark.studentId,
        subjectId: mark.subjectId,
        examId: mark.examId,
        teMark: mark.teMark,
        ceMark: mark.ceMark
      }
    });
  } catch (error) {
    console.error('Create mark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update mark record
// @route   PUT /api/marks/:id
// @access  Private (Admin/Teacher)
const updateMark = async (req, res) => {
  try {
    const { teMark, ceMark } = req.body;

    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    mark.teMark = teMark || mark.teMark;
    mark.ceMark = ceMark || mark.ceMark;
    mark.updatedAt = new Date();

    await mark.save();

    res.json({
      message: 'Mark updated successfully',
      mark: {
        id: mark._id,
        studentId: mark.studentId,
        subjectId: mark.subjectId,
        examId: mark.examId,
        teMark: mark.teMark,
        ceMark: mark.ceMark
      }
    });
  } catch (error) {
    console.error('Update mark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete mark record
// @route   DELETE /api/marks/:id
// @access  Private (Admin/Teacher)
const deleteMark = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    await Mark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    console.error('Delete mark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get marks by student and exam
// @route   GET /api/marks/student/:studentId/exam/:examId
// @access  Private (Admin/Teacher/Student)
const getMarksByStudentAndExam = async (req, res) => {
  try {
    const marks = await Mark.find({ 
      studentId: req.params.studentId, 
      examId: req.params.examId 
    })
      .populate('subjectId', 'name shortCode')
      .populate('examId', 'name');
    res.json(marks);
  } catch (error) {
    console.error('Get marks by student and exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllMarks,
  getMarksByExam,
  getMarksByStudent,
  createMark,
  updateMark,
  deleteMark,
  getMarksByStudentAndExam
};