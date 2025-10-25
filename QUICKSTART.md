# WootAds Quick Start Guide

Get started with WootAds in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

### 2. Add Your MongoDB URI

Edit `backend/.env` file and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/wootads?retryWrites=true&w=majority
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a cluster (free tier is fine)
3. Create a database user
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password

### 3. Start the App

```bash
npm run dev
```

This starts both frontend (localhost:3000) and backend (localhost:5000)

### 4. Open Your Browser

Visit: http://localhost:3000

### 5. Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in your details
3. You'll be redirected to the dashboard!

## ✅ That's It!

You now have:
- ✅ Beautiful landing page
- ✅ User authentication (register/login)
- ✅ Dashboard with sidebar navigation
- ✅ MongoDB backend
- ✅ JWT-based security
- ✅ Protected routes

## 🎨 Next Steps

1. **Add OpenAI API Key** (optional):
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

2. **Start Building Features**:
   - The foundation is ready
   - All files are organized
   - Add your custom features

## 📝 Important Files

- `frontend/src/pages/` - Add new pages here
- `frontend/src/store/` - State management
- `backend/src/routes/` - Add API endpoints
- `backend/src/models/` - Database models
- `backend/src/controllers/` - Business logic

## 🆘 Need Help?

Check the full [SETUP.md](./SETUP.md) for:
- Detailed instructions
- Troubleshooting
- Architecture overview
- Development tips

## 🎯 Folder Structure

```
wootads/
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/        # Landing, Login, Register, Dashboard
│   │   ├── store/        # Zustand state management
│   │   └── api/          # Axios API client
│   └── package.json
│
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   └── middleware/   # Auth & error handling
│   ├── .env             # YOUR MONGODB URI GOES HERE
│   └── package.json
│
└── package.json          # Root scripts
```

---

Made with ❤️ using Vite, React, Node.js, Express, and MongoDB


