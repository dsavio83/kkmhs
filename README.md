# Smart School Pro

A comprehensive school management system with modern React frontend and Node.js/Express backend.

## Features

### 🎯 Core Functionality
- **User Management**: Admin, Teacher, and Student roles
- **Class Management**: Create and manage classes with assigned teachers
- **Subject Management**: Comprehensive subject catalog with short codes
- **Exam Management**: Flexible exam configurations with subject mappings
- **Mark Management**: TE and CE mark tracking per student per exam
- **Authentication**: JWT-based secure authentication

### 🛠️ Technical Features
- **Frontend**: React 19 with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access
- **Deployment**: Vercel-ready configuration
- **API**: RESTful endpoints with comprehensive documentation

## Project Structure

```
Smart-School-Pro/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # API controllers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── config/             # Configuration files
│   └── api/                # Vercel API integration
├── pages/                  # React pages/components
├── components/             # Reusable components
├── services/               # API service layer
└── [other frontend files]
```

## API Endpoints (12 APIs)

### Authentication (3 APIs)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/profile` - Get user profile

### User Management (5 APIs)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/class/:classId` - Get students by class

### Class Management (6 APIs)
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/:id/subjects` - Get class subjects

### Subject Management (5 APIs)
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Exam Management (6 APIs)
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam
- `GET /api/exams/class/:classId` - Get exams by class

### Mark Management (7 APIs)
- `GET /api/marks` - Get all marks
- `GET /api/marks/exam/:examId` - Get marks by exam
- `GET /api/marks/student/:studentId` - Get marks by student
- `POST /api/marks` - Create mark record
- `PUT /api/marks/:id` - Update mark record
- `DELETE /api/marks/:id` - Delete mark record
- `GET /api/marks/student/:studentId/exam/:examId` - Get marks by student and exam

## Database Schema

### Collections
- **users** - User accounts with role-based access
- **classrooms** - Class information and class teachers
- **subjects** - Subject details with short codes
- **exams** - Exam configurations with subject mappings
- **marks** - Student marks (TE and CE)
- **attendances** - Attendance records
- **subjectassignments** - Class-subject-teacher relationships

## Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

## Deployment

### Backend to Vercel
1. Navigate to `backend/` directory
2. Run `vercel`
3. Set environment variables in Vercel dashboard

### Frontend to Vercel
1. Navigate to project root
2. Run `vercel`
3. Set `VITE_API_URL` environment variable

## Environment Variables

### Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/SmartSchoolPro
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend
```env
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

## Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token validation on API calls
- Role-based access control (Admin, Teacher, Student)
- Token expiration handling

## Roles and Permissions

### Admin
- Full system access
- User management
- Class and subject management
- Exam and mark management

### Teacher
- View assigned classes and subjects
- Manage exams and marks
- View student information
- Generate reports

### Student
- View personal information
- View marks and grades
- Access assigned classes

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt
- MongoDB connection security

## Development

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Styling**: Tailwind CSS

### Development Workflow
1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Start development servers
5. Make changes and test
6. Deploy to Vercel

## Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## Support

For support and questions:
- Check the API documentation
- Review deployment guides
- Test with Postman
- Monitor logs in Vercel dashboard

## License

This project is licensed under the MIT License.

---

**Note**: This is a complete school management system ready for production deployment with Vercel and MongoDB Atlas.
