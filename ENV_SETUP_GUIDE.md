# Environment Variables Setup Guide

This guide explains how to set up your environment variables for WootAds.

## Backend Environment Variables

### Location
Create a file: `backend/.env`

### Required Variables

```env
# ============================================
# MONGODB CONNECTION (REQUIRED)
# ============================================
# Get this from MongoDB Atlas (see MONGODB_SETUP.md)
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?options
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/wootads?retryWrites=true&w=majority

# ============================================
# JWT SECRET (REQUIRED)
# ============================================
# This is used to sign authentication tokens
# Generate a random secret key (see instructions below)
JWT_SECRET=your_super_secret_jwt_key_change_this

# ============================================
# OPENAI API KEY (OPTIONAL - Add later)
# ============================================
# Get this from: https://platform.openai.com/api-keys
# Uncomment when you're ready to add AI features
# OPENAI_API_KEY=sk-your-openai-api-key-here

# ============================================
# SERVER CONFIGURATION
# ============================================
# Port for the backend server
PORT=5000

# Environment (development or production)
NODE_ENV=development
```

## Step-by-Step Setup

### 1. Create the .env File

```bash
cd backend
cp .env.example .env
```

### 2. Get MongoDB URI

Follow the [MONGODB_SETUP.md](./MONGODB_SETUP.md) guide to:
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `.env`

### 3. Generate JWT Secret

The JWT_SECRET should be a random, secure string. Generate one using:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Online Generator**
Visit: https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys"

**Option C: Simple Random String**
Just create a long random string:
```
wootads_my_super_secret_jwt_key_2025_random_12345
```

### 4. (Optional) Add OpenAI API Key

When you're ready to add AI features:

1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add to `.env`:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

## Example .env File

Here's a complete example (with fake credentials):

```env
# MongoDB
MONGODB_URI=mongodb+srv://wootads_user:MyPassword123@cluster0.abc123.mongodb.net/wootads?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=8f7e6d5c4b3a2910fedcba9876543210abcdef1234567890aabbccdd

# OpenAI (optional)
# OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# Server
PORT=5000
NODE_ENV=development
```

## Frontend Environment Variables

The frontend doesn't need any environment variables right now because it uses Vite's proxy to connect to the backend.

If you need to add frontend env vars later:

1. Create `frontend/.env.local`
2. Prefix all variables with `VITE_`
3. Access them with `import.meta.env.VITE_VARIABLE_NAME`

Example:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=WootAds
```

## Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use different values for development and production
- Rotate secrets regularly
- Use strong, random JWT secrets
- Keep OpenAI keys secure

### ❌ DON'T:
- Commit `.env` files to Git
- Share your `.env` file publicly
- Use simple/guessable secrets
- Hardcode secrets in your code
- Use the same secrets across projects

## Troubleshooting

### Error: "MONGODB_URI is not defined"
- Make sure `.env` file exists in `backend/` directory
- Check that `MONGODB_URI` is spelled correctly
- Verify there are no spaces around the `=` sign

### Error: "Invalid connection string"
- Check your MongoDB URI format
- Ensure username/password are correct
- URL-encode special characters in password

### Error: "JWT malformed"
- Make sure `JWT_SECRET` is set
- Check that it's a valid string
- Don't use quotes around the value

### OpenAI API Errors
- Verify your API key starts with `sk-`
- Check you have credits in your OpenAI account
- Make sure the key is not expired

## Verification Checklist

Before running the app, verify:

- [ ] `backend/.env` file exists
- [ ] `MONGODB_URI` is set with your actual MongoDB connection string
- [ ] `JWT_SECRET` is set to a random secret
- [ ] `PORT` is set (default: 5000)
- [ ] `NODE_ENV` is set to "development"
- [ ] No quotes around values (unless the value contains spaces)
- [ ] No extra spaces before or after `=`
- [ ] `.env` is listed in `.gitignore`

## Testing Your Setup

Run these commands to test:

```bash
# Test backend connection
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

If you see errors, review this guide and check your `.env` values.

## Need Help?

- MongoDB issues? See [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- General setup? See [SETUP.md](./SETUP.md)
- Quick start? See [QUICKSTART.md](./QUICKSTART.md)

---

Once your `.env` is configured, run `npm run dev` from the root directory to start both frontend and backend!


