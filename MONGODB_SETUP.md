# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas and get your connection URI.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" to create an account
3. Sign up with email or Google

## Step 2: Create a Cluster

1. After logging in, click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose closest to you)
4. Click "Create Cluster" (takes 3-5 minutes)

## Step 3: Create Database User

1. Click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose authentication method: **Password**
4. Enter username and password (save these!)
   - Example: username: `wootads_user`
   - Password: Generate a secure one or create your own
5. User Privileges: Choose "Read and write to any database"
6. Click "Add User"

## Step 4: Whitelist Your IP Address

1. Click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, use specific IP addresses
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Your Connection String

Replace the placeholders:
- `<username>` → Your database username
- `<password>` → Your database password (URL encode special characters!)
- Optionally add database name: `mongodb+srv://...mongodb.net/wootads?retryWrites=true...`

### Example Connection String

```
mongodb+srv://wootads_user:MyPassword123@cluster0.abc123.mongodb.net/wootads?retryWrites=true&w=majority
```

## Step 7: Add to Your Project

1. Open `backend/.env` file
2. Update the MONGODB_URI:

```env
MONGODB_URI=mongodb+srv://wootads_user:MyPassword123@cluster0.abc123.mongodb.net/wootads?retryWrites=true&w=majority
```

3. Save the file

## Step 8: Test Connection

Run your backend:
```bash
cd backend
npm run dev
```

If successful, you'll see:
```
✅ MongoDB Connected: cluster0-shard-00-00.abc123.mongodb.net
🚀 Server running on port 5000
```

## Troubleshooting

### Error: "Authentication failed"
- Check your username and password are correct
- Make sure password is URL encoded (replace special chars)

### Error: "Connection timeout"
- Verify your IP is whitelisted
- Check if you're behind a VPN/firewall

### Error: "Network error"
- MongoDB Atlas might be down (rare)
- Check your internet connection

### Special Characters in Password

If your password has special characters like `@`, `#`, `$`, etc., URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `:` → `%3A`
- `/` → `%2F`

Or use MongoDB Compass to generate the proper connection string.

## Using MongoDB Compass (Optional)

MongoDB Compass is a GUI for MongoDB:

1. Download from: https://www.mongodb.com/products/compass
2. Install and open it
3. Paste your connection string
4. Connect and browse your database visually

## Database Structure

WootAds will automatically create these collections:
- `users` - User accounts
- More collections will be added as features are built

## Security Notes

⚠️ **Important**:
- Never commit `.env` files to Git
- Use strong passwords
- For production, use specific IP whitelisting
- Rotate credentials regularly

## Need Help?

- MongoDB Docs: https://docs.mongodb.com/
- Atlas Support: https://www.mongodb.com/support
- Community Forums: https://www.mongodb.com/community/forums

---

Once your MongoDB is set up, continue with the main [SETUP.md](./SETUP.md) guide!


