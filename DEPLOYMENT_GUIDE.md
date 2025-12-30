# Smart School Pro - Deployment Guide

## Overview
This guide will help you deploy the Smart School Pro application to Vercel with both frontend and backend.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Vercel account
- MongoDB Atlas account
- Git

## Step 1: Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://tamilvizuthukal_db_user:gwCXynzw60X4JOsn@cluster0.8vzoq98.mongodb.net/SmartSchoolPro?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 2: Local Testing

### Test Backend
```bash
cd backend
npm install
node test-connection.js  # Test MongoDB connection
npm run dev              # Start development server
```

### Test Frontend
```bash
npm install
npm run dev              # Start development server
```

## Step 3: Backend Deployment to Vercel

### Option A: Using Vercel CLI
```bash
cd backend
vercel login
vercel
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `backend/` directory
4. Configure environment variables in the dashboard

### Backend Environment Variables in Vercel
Set these variables in your Vercel project settings:

```
MONGODB_URI: mongodb+srv://tamilvizuthukal_db_user:gwCXynzw60X4JOsn@cluster0.8vzoq98.mongodb.net/SmartSchoolPro?retryWrites=true&w=majority
JWT_SECRET: your_production_jwt_secret_key
JWT_EXPIRES_IN: 7d
NODE_ENV: production
CORS_ORIGIN: https://your-frontend-domain.vercel.app
```

## Step 4: Frontend Deployment to Vercel

### Option A: Using Vercel CLI
```bash
cd ..
vercel login
vercel
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the root directory
4. Configure environment variables in the dashboard

### Frontend Environment Variables in Vercel
Set these variables in your Vercel project settings:

```
VITE_API_URL: https://your-backend-domain.vercel.app/api
```

## Step 5: Post-Deployment Configuration

### Update CORS Origin
After deploying the frontend, update the `CORS_ORIGIN` environment variable in your backend Vercel project to match your frontend URL.

### Test the Deployment
1. Visit your frontend URL
2. Try logging in with test credentials
3. Verify API calls are working

## Step 6: Production Considerations

### Security
- Change the JWT secret key for production
- Enable HTTPS (automatic with Vercel)
- Set up proper CORS origins
- Monitor API usage and logs

### Performance
- Enable MongoDB Atlas connection pooling
- Consider using a CDN for static assets
- Monitor database performance

### Monitoring
- Set up error tracking
- Monitor API response times
- Track user activity
- Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CORS_ORIGIN` environment variable
   - Ensure frontend and backend URLs are correct

2. **MongoDB Connection Issues**
   - Verify `MONGODB_URI` is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **JWT Authentication Issues**
   - Verify `JWT_SECRET` matches between environments
   - Check token expiration time

4. **Vercel Deployment Issues**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Check for any syntax errors

### Getting Help
- Check the API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Review Vercel deployment logs
- Test API endpoints with Postman
- Check MongoDB Atlas logs

## Maintenance

### Regular Tasks
- Monitor database usage and costs
- Update dependencies regularly
- Review and rotate JWT secrets
- Clean up old logs and data

### Scaling
- Consider upgrading MongoDB Atlas tier for high usage
- Enable Vercel's auto-scaling features
- Optimize database queries and indexes

## Contact
For support and questions, refer to the API documentation or contact the development team.