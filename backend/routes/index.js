const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const classController = require('../controllers/classController');
const subjectController = require('../controllers/subjectController');
const examController = require('../controllers/examController');
const markController = require('../controllers/markController');
const { auth, adminAuth, teacherAuth, studentAuth } = require('../middleware/auth');

const router = express.Router();

// Middleware to convert query params to route params for compatibility
const queryToParams = (paramName) => (req, res, next) => {
    if (req.query[paramName] && !req.params[paramName]) {
        req.params[paramName] = req.query[paramName];
    }
    next();
};

// Authentication Routes
router.post('/auth/register', adminAuth, authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.get('/auth/profile', auth, authController.getProfile);

// User Routes - Support both URL params and query params
router.get('/users', auth, (req, res, next) => {
    const { id, classId } = req.query;

    // If query params exist, handle them
    if (classId) {
        req.params.classId = classId;
        return userController.getStudentsByClass(req, res);
    }
    if (id) {
        req.params.id = id;
        return userController.getUserById(req, res);
    }

    // Otherwise get all users
    return userController.getAllUsers(req, res);
});
router.get('/users/class/:classId', auth, userController.getStudentsByClass);
router.get('/users/:id', auth, userController.getUserById);
router.put('/users/:id', adminAuth, userController.updateUser);
router.put('/users', adminAuth, queryToParams('id'), userController.updateUser);
router.delete('/users/:id', adminAuth, userController.deleteUser);
router.delete('/users', adminAuth, queryToParams('id'), userController.deleteUser);

// Class Routes - Support both URL params and query params
router.get('/classes', auth, (req, res, next) => {
    const { id, subjects } = req.query;

    if (id && subjects === 'true') {
        req.params.id = id;
        return classController.getClassSubjects(req, res);
    }
    if (id) {
        req.params.id = id;
        return classController.getClassById(req, res);
    }

    return classController.getAllClasses(req, res);
});
router.get('/classes/:id/subjects', auth, classController.getClassSubjects);
router.get('/classes/:id', auth, classController.getClassById);
router.post('/classes', adminAuth, classController.createClass);
router.put('/classes/:id', adminAuth, classController.updateClass);
router.put('/classes', adminAuth, queryToParams('id'), classController.updateClass);
router.delete('/classes/:id', adminAuth, classController.deleteClass);
router.delete('/classes', adminAuth, queryToParams('id'), classController.deleteClass);

// Subject Routes - Support both URL params and query params
router.get('/subjects', auth, (req, res, next) => {
    const { id } = req.query;

    if (id) {
        req.params.id = id;
        return subjectController.getSubjectById(req, res);
    }

    return subjectController.getAllSubjects(req, res);
});
router.get('/subjects/:id', auth, subjectController.getSubjectById);
router.post('/subjects', adminAuth, subjectController.createSubject);
router.put('/subjects/:id', adminAuth, subjectController.updateSubject);
router.put('/subjects', adminAuth, queryToParams('id'), subjectController.updateSubject);
router.delete('/subjects/:id', adminAuth, subjectController.deleteSubject);
router.delete('/subjects', adminAuth, queryToParams('id'), subjectController.deleteSubject);

// Exam Routes - Support both URL params and query params
router.get('/exams', auth, (req, res, next) => {
    const { id, classId } = req.query;

    if (classId) {
        req.params.classId = classId;
        return examController.getExamsByClass(req, res);
    }
    if (id) {
        req.params.id = id;
        return examController.getExamById(req, res);
    }

    return examController.getAllExams(req, res);
});
router.get('/exams/class/:classId', auth, examController.getExamsByClass);
router.get('/exams/:id', auth, examController.getExamById);
router.post('/exams', teacherAuth, examController.createExam);
router.put('/exams/:id', teacherAuth, examController.updateExam);
router.put('/exams', teacherAuth, queryToParams('id'), examController.updateExam);
router.delete('/exams/:id', teacherAuth, examController.deleteExam);
router.delete('/exams', teacherAuth, queryToParams('id'), examController.deleteExam);

// Mark Routes - Support both URL params and query params
router.get('/marks', auth, (req, res, next) => {
    const { id, examId, studentId } = req.query;

    if (studentId && examId) {
        req.params.studentId = studentId;
        req.params.examId = examId;
        return markController.getMarksByStudentAndExam(req, res);
    }
    if (examId) {
        req.params.examId = examId;
        return markController.getMarksByExam(req, res);
    }
    if (studentId) {
        req.params.studentId = studentId;
        return markController.getMarksByStudent(req, res);
    }

    return markController.getAllMarks(req, res);
});
router.get('/marks/exam/:examId', auth, markController.getMarksByExam);
router.get('/marks/student/:studentId', auth, markController.getMarksByStudent);
router.get('/marks/student/:studentId/exam/:examId', auth, markController.getMarksByStudentAndExam);
router.post('/marks', teacherAuth, markController.createMark);
router.put('/marks/:id', teacherAuth, markController.updateMark);
router.put('/marks', teacherAuth, queryToParams('id'), markController.updateMark);
router.delete('/marks/:id', teacherAuth, markController.deleteMark);
router.delete('/marks', teacherAuth, queryToParams('id'), markController.deleteMark);

// Grade Scheme Routes - Support both URL params and query params
const gradeSchemeController = require('../controllers/gradeSchemeController');

router.get('/grades', auth, (req, res, next) => {
    const { id, className } = req.query;

    if (className) {
        req.params.className = className;
        return gradeSchemeController.getGradeSchemesByClass(req, res);
    }
    if (id) {
        req.params.id = id;
        return gradeSchemeController.getGradeSchemeById(req, res);
    }

    return gradeSchemeController.getAllGradeSchemes(req, res);
});
router.get('/grades/class/:className', auth, gradeSchemeController.getGradeSchemesByClass);
router.get('/grades/:id', auth, gradeSchemeController.getGradeSchemeById);
router.post('/grades', adminAuth, gradeSchemeController.createGradeScheme);
router.put('/grades/:id', adminAuth, gradeSchemeController.updateGradeScheme);
router.put('/grades', adminAuth, queryToParams('id'), gradeSchemeController.updateGradeScheme);
router.delete('/grades/:id', adminAuth, gradeSchemeController.deleteGradeScheme);
router.delete('/grades', adminAuth, queryToParams('id'), gradeSchemeController.deleteGradeScheme);

module.exports = router;
