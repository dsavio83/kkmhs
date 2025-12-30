const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'TEACHER', 'STUDENT'],
    required: [true, 'Role is required']
  },
  password: {
    type: String,
    required: function() {
      return this.role !== 'STUDENT';
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // Student & Teacher metadata
  admissionNo: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be 10 digits'
    }
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: {
    type: Date
  },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST']
  },
  caste: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  motherName: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  transportMode: {
    type: String,
    enum: ['School Bus', 'Private Bus', 'Govt. Bus', 'Auto', 'Jeep', 'Bicycle', 'Two Wheeler', 'Car', 'Cab', 'By Walk']
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassRoom',
    required: function() {
      return this.role === 'STUDENT';
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);