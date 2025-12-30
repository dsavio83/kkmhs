const ClassRoom = require('../models/ClassRoom');
const User = require('../models/User');
const SubjectAssignment = require('../models/SubjectAssignment');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin/Teacher)
const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassRoom.find()
      .populate('classTeacherId', 'name username')
      .populate({
        path: 'students',
        model: 'User',
        match: { role: 'STUDENT' }
      });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private (Admin/Teacher)
const getClassById = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findById(req.params.id)
      .populate('classTeacherId', 'name username')
      .populate({
        path: 'students',
        model: 'User',
        match: { role: 'STUDENT' }
      });
    
    if (!classRoom) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classRoom);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin only)
const createClass = async (req, res) => {
  try {
    const { name, section, gradeLevel, classTeacherId } = req.body;

    // Check if class teacher exists and is a teacher
    const teacher = await User.findById(classTeacherId);
    if (!teacher || teacher.role !== 'TEACHER') {
      return res.status(400).json({ message: 'Invalid class teacher' });
    }

    const classRoom = new ClassRoom({
      name,
      section,
      gradeLevel,
      classTeacherId
    });

    await classRoom.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: {
        id: classRoom._id,
        name: classRoom.name,
        section: classRoom.section,
        gradeLevel: classRoom.gradeLevel
      }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin only)
const updateClass = async (req, res) => {
  try {
    const { name, section, gradeLevel, classTeacherId } = req.body;

    const classRoom = await ClassRoom.findById(req.params.id);
    if (!classRoom) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if class teacher exists and is a teacher
    if (classTeacherId) {
      const teacher = await User.findById(classTeacherId);
      if (!teacher || teacher.role !== 'TEACHER') {
        return res.status(400).json({ message: 'Invalid class teacher' });
      }
      classRoom.classTeacherId = classTeacherId;
    }

    classRoom.name = name || classRoom.name;
    classRoom.section = section || classRoom.section;
    classRoom.gradeLevel = gradeLevel || classRoom.gradeLevel;
    classRoom.updatedAt = new Date();

    await classRoom.save();

    res.json({
      message: 'Class updated successfully',
      class: {
        id: classRoom._id,
        name: classRoom.name,
        section: classRoom.section,
        gradeLevel: classRoom.gradeLevel
      }
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin only)
const deleteClass = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findById(req.params.id);
    if (!classRoom) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await ClassRoom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get subjects assigned to class
// @route   GET /api/classes/:id/subjects
// @access  Private (Admin/Teacher)
const getClassSubjects = async (req, res) => {
  try {
    const subjects = await SubjectAssignment.find({ classId: req.params.id })
      .populate('subjectId', 'name shortCode')
      .populate('teacherId', 'name username');
    
    res.json(subjects);
  } catch (error) {
    console.error('Get class subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassSubjects
};