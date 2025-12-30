# Smart School Pro - API Documentation

## Overview
Smart School Pro is a comprehensive school management system with RESTful APIs for managing students, teachers, classes, subjects, exams, and marks.

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-domain.vercel.app/api`

## Authentication
All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login a user (Admin, Teacher, or Student)

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "admin",
    "name": "Admin User",
    "role": "ADMIN",
    "mobile": "1234567890",
    "email": "admin@example.com"
  }
}
```

#### POST /api/auth/register
Register a new user (Admin only)

**Request Body:**
```json
{
  "username": "teacher1",
  "name": "John Teacher",
  "role": "TEACHER",
  "password": "teacher123",
  "mobile": "9876543210",
  "email": "john@example.com"
}
```

#### GET /api/auth/profile
Get current user profile

**Response:**
```json
{
  "id": "user_id",
  "username": "admin",
  "name": "Admin User",
  "role": "ADMIN",
  "mobile": "1234567890",
  "email": "admin@example.com"
}
```

### Users

#### GET /api/users
Get all users (Admin only)

#### GET /api/users/:id
Get user by ID (Admin only)

#### PUT /api/users/:id
Update user (Admin only)

#### DELETE /api/users/:id
Delete user (Admin only)

#### GET /api/users/class/:classId
Get students by class

### Classes

#### GET /api/classes
Get all classes

#### GET /api/classes/:id
Get class by ID

#### POST /api/classes
Create new class (Admin only)

#### PUT /api/classes/:id
Update class (Admin only)

#### DELETE /api/classes/:id
Delete class (Admin only)

#### GET /api/classes/:id/subjects
Get subjects assigned to class

### Subjects

#### GET /api/subjects
Get all subjects

#### GET /api/subjects/:id
Get subject by ID

#### POST /api/subjects
Create new subject (Admin only)

#### PUT /api/subjects/:id
Update subject (Admin only)

#### DELETE /api/subjects/:id
Delete subject (Admin only)

### Exams

#### GET /api/exams
Get all exams

#### GET /api/exams/:id
Get exam by ID

#### POST /api/exams
Create new exam (Teacher/Admin)

#### PUT /api/exams/:id
Update exam (Teacher/Admin)

#### DELETE /api/exams/:id
Delete exam (Teacher/Admin)

#### GET /api/exams/class/:classId
Get exams by class

### Marks

#### GET /api/marks
Get all marks

#### GET /api/marks/exam/:examId
Get marks by exam

#### GET /api/marks/student/:studentId
Get marks by student

#### POST /api/marks
Create new mark record (Teacher/Admin)

#### PUT /api/marks/:id
Update mark record (Teacher/Admin)

#### DELETE /api/marks/:id
Delete mark record (Teacher/Admin)

#### GET /api/marks/student/:studentId/exam/:examId
Get marks by student and exam

## Error Responses
All error responses follow this format:
```json
{
  "message": "Error description"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Roles and Permissions

### Admin
- Full access to all endpoints
- Can manage users, classes, subjects, exams, and marks

### Teacher
- Can view classes, subjects, exams
- Can create, update, and delete marks
- Can create, update, and delete exams
- Can view students in assigned classes

### Student
- Can view own profile and marks
- Can view assigned classes and subjects

## Deployment

### Backend Deployment to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Deploy to Vercel:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRES_IN`: Token expiration time (e.g., "7d")
   - `CORS_ORIGIN`: Your frontend domain

### Frontend Deployment to Vercel

1. Set environment variable in `.env` file:
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

2. Deploy to Vercel:
```bash
vercel
```

## Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts (Admin, Teacher, Student)
- `classrooms` - Class information
- `subjects` - Subject details
- `exams` - Exam configurations
- `marks` - Student marks
- `attendances` - Attendance records
- `subjectassignments` - Class-subject-teacher assignments

## Security Notes

1. Always use HTTPS in production
2. Store JWT secrets securely
3. Implement rate limiting for login attempts
4. Validate all input data
5. Use strong passwords for all users

## Support

For support and questions:
- Check the API endpoints using tools like Postman
- Monitor logs in Vercel dashboard
- Ensure MongoDB connection is stable
- Verify CORS settings for frontend-backend communication