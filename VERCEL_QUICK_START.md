# Quick Start - Vercel Deployment

## ✅ What's Done

Your Smart School Pro backend is now **Vercel-ready** with:
- ✅ 7 serverless API functions (within 12-function limit)
- ✅ Optimized MongoDB connection with caching
- ✅ Frontend updated to work with new API structure
- ✅ Comprehensive documentation created

## 🚀 Deploy to Vercel (3 Steps)

### Step 1: Deploy Backend
```bash
cd backend
vercel --prod
```

### Step 2: Set Environment Variables
In Vercel dashboard, add these environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- `CORS_ORIGIN` - Your frontend URL (will be set after frontend deployment)
- `NODE_ENV` - "production"

### Step 3: Deploy Frontend
```bash
# Update .env with backend URL
echo "VITE_API_URL=https://your-backend.vercel.app/api" > .env

# Deploy
vercel --prod
```

### Step 4: Update CORS
Go back to backend Vercel settings and update `CORS_ORIGIN` to your frontend URL.

## 📚 Documentation

- **[SERVERLESS_API_GUIDE.md](file:///d:/Web%20Apps/Unnikrishnan%20Sir/backend/SERVERLESS_API_GUIDE.md)** - Complete API documentation
- **[walkthrough.md](file:///C:/Users/Dominic/.gemini/antigravity/brain/7c54df64-26ee-4057-b2a5-04685d668c4f/walkthrough.md)** - Implementation details

## 🧪 Local Development (Unchanged)

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
npm run dev
```

Local development continues to work exactly as before!

## 📊 API Structure

All APIs now use **query parameters** instead of URL paths:

**Before:** `GET /api/users/:id`  
**After:** `GET /api/users?id={id}`

The frontend has been updated automatically - no changes needed to your UI code!

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Whitelist `0.0.0.0/0` in MongoDB Atlas (Settings → Network Access)
- Verify MONGODB_URI is correct

### CORS Errors
- Make sure CORS_ORIGIN matches your frontend URL exactly
- Include `https://` in the URL

### Need Help?
Check the detailed guides:
- [SERVERLESS_API_GUIDE.md](file:///d:/Web%20Apps/Unnikrishnan%20Sir/backend/SERVERLESS_API_GUIDE.md)
- [walkthrough.md](file:///C:/Users/Dominic/.gemini/antigravity/brain/7c54df64-26ee-4057-b2a5-04685d668c4f/walkthrough.md)
