# WootAds Setup Guide

Follow these steps to get WootAds up and running on your local machine.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Terminal/Command Line access

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# From the root directory
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 2. Set Up MongoDB

If you haven't already:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Whitelist your IP address (or use 0.0.0.0/0 for development)

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update with your credentials:

```env
# MongoDB - ADD YOUR MONGODB URI HERE
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/wootads?retryWrites=true&w=majority

# JWT Secret - Change this to a random secret
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI (optional for now)
# OPENAI_API_KEY=your_openai_api_key_here

# Server
PORT=5000
NODE_ENV=development
```

**Important:**
- Replace `your_username` and `your_password` with your MongoDB credentials
- Replace `cluster` with your actual cluster name
- Generate a random JWT_SECRET (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 4. Start the Application

From the root directory:

```bash
npm run dev
```

This will start both servers:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### 5. Verify Everything Works

1. Open http://localhost:3000 in your browser
2. You should see the WootAds landing page
3. Click "Get Started" or "Sign Up"
4. Create a test account
5. After registration, you should be redirected to the dashboard

## Troubleshooting

### MongoDB Connection Issues

If you see `MongoDB connection error`:
1. Check your MongoDB URI is correct
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Verify your database user credentials

### Port Already in Use

If ports 3000 or 5000 are taken:
1. Edit `backend/.env` to change the PORT
2. Edit `frontend/vite.config.ts` to change the frontend port

### Dependencies Not Installing

Try:
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json
npm run install:all
```

## Next Steps

Once your application is running:

1. **Add OpenAI API Key** (when ready):
   - Get API key from https://platform.openai.com/api-keys
   - Add to `backend/.env`: `OPENAI_API_KEY=sk-...`

2. **Explore the Dashboard**:
   - Overview: See your stats
   - Create Ad: AI-powered ad creation (coming soon)
   - Templates: Browse templates (coming soon)
   - Projects: Manage projects (coming soon)
   - Settings: Account settings (coming soon)

3. **Start Building Features**:
   - The foundation is ready
   - Add AI integration
   - Build the canvas editor
   - Create template system

## Development Scripts

```bash
# Start both servers
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build frontend for production
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

## Project Structure

```
wootads/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── api/       # API integration
│   │   ├── pages/     # Page components
│   │   ├── store/     # Zustand state management
│   │   ├── App.tsx    # Main app component
│   │   └── main.tsx   # Entry point
│   └── package.json
│
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── config/    # Database config
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/    # MongoDB models
│   │   ├── routes/    # API routes
│   │   └── server.js  # Entry point
│   └── package.json
│
└── package.json       # Root package.json
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Zustand, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **AI (Coming Soon)**: OpenAI GPT-4, DALL-E 3

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in the terminal
3. Check MongoDB Atlas status
4. Verify all dependencies are installed

Happy coding! 🚀


