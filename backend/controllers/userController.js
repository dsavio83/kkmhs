const User = require('../models/User');
const { adminAuth, teacherAuth, studentAuth } = require('../middleware/auth');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('classId', 'name');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('classId', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { username, name, role, password, admissionNo, mobile, email, gender, dob, category, caste, religion, fatherName, motherName, address, transportMode, classId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.username = username || user.username;
    user.name = name || user.name;
    user.role = role || user.role;
    user.admissionNo = admissionNo || user.admissionNo;
    user.mobile = mobile || user.mobile;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.dob = dob || user.dob;
    user.category = category || user.category;
    user.caste = caste || user.caste;
    user.religion = religion || user.religion;
    user.fatherName = fatherName || user.fatherName;
    user.motherName = motherName || user.motherName;
    user.address = address || user.address;
    user.transportMode = transportMode || user.transportMode;
    user.classId = classId || user.classId;

    if (password && role !== 'STUDENT') {
      user.password = password;
    }

    user.updatedAt = new Date();

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get students by class
// @route   GET /api/users/class/:classId
// @access  Private (Teacher/Admin)
const getStudentsByClass = async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT', classId: req.params.classId });
    res.json(students);
  } catch (error) {
    console.error('Get students by class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStudentsByClass
};