# WootAds Architecture

This document explains the technical architecture of WootAds.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Port 3000)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Vite + React + TypeScript                            │  │
│  │  ┌─────────────┬──────────────┬───────────────────┐  │  │
│  │  │  Landing    │  Auth Pages  │  Dashboard        │  │  │
│  │  │  Page       │  Login/      │  Protected        │  │  │
│  │  │             │  Register    │  Routes           │  │  │
│  │  └─────────────┴──────────────┴───────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  State Management (Zustand)                     │ │  │
│  │  │  - Auth Store (user, token, isAuthenticated)   │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  API Client (Axios)                             │ │  │
│  │  │  - Auth interceptors                            │ │  │
│  │  │  - Token injection                              │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ /api/*
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Port 5000)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Node.js + Express                                    │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Routes                                          │ │  │
│  │  │  /api/auth/register                              │ │  │
│  │  │  /api/auth/login                                 │ │  │
│  │  │  /api/auth/me (protected)                        │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Middleware                                      │ │  │
│  │  │  - CORS                                          │ │  │
│  │  │  - Body Parser                                   │ │  │
│  │  │  - Auth (JWT verification)                       │ │  │
│  │  │  - Error Handler                                 │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Controllers                                     │ │  │
│  │  │  - Auth Controller (register, login, getMe)     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Models (Mongoose)                               │ │  │
│  │  │  - User (name, email, password, subscription)   │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ MongoDB Driver
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Collections:                                         │  │
│  │  - users (id, name, email, password, subscription,   │  │
│  │           credits, timestamps)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Stack
```
├── React 18          (UI library)
├── TypeScript        (Type safety)
├── Vite              (Build tool)
├── React Router v6   (Client-side routing)
├── Zustand           (State management)
├── Axios             (HTTP client)
└── Lucide React      (Icons)
```

### Backend Stack
```
├── Node.js           (Runtime)
├── Express           (Web framework)
├── MongoDB           (Database)
├── Mongoose          (ODM)
├── JWT               (Authentication)
├── bcryptjs          (Password hashing)
└── express-validator (Input validation)
```

## Data Flow

### Authentication Flow

```
1. User Registration
   ┌────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ User   │─────▶│ Register │─────▶│ Backend  │─────▶│ MongoDB  │
   │ Form   │      │ Page     │      │ /register│      │ users    │
   └────────┘      └──────────┘      └──────────┘      └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Hash     │
                                     │ Password │
                                     └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Generate │
                                     │ JWT      │
                                     └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Return   │
                                     │ Token +  │
                                     │ User     │
                                     └──────────┘

2. User Login
   ┌────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ User   │─────▶│ Login    │─────▶│ Backend  │─────▶│ MongoDB  │
   │ Form   │      │ Page     │      │ /login   │      │ Find User│
   └────────┘      └──────────┘      └──────────┘      └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Compare  │
                                     │ Password │
                                     └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Generate │
                                     │ JWT      │
                                     └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │ Store in │
                                     │ Zustand +│
                                     │ LocalSt. │
                                     └──────────┘

3. Protected Route Access
   ┌────────┐      ┌──────────┐      ┌──────────┐
   │ User   │─────▶│ Dashboard│─────▶│ Check    │
   │ Clicks │      │ Route    │      │ Auth     │
   └────────┘      └──────────┘      └──────────┘
                                           │
                                      Authenticated?
                                           │
                          ┌────────────────┴────────────────┐
                          │ Yes                             │ No
                          ▼                                 ▼
                    ┌──────────┐                     ┌──────────┐
                    │ Show     │                     │ Redirect │
                    │ Dashboard│                     │ to Login │
                    └──────────┘                     └──────────┘
```

### API Request Flow

```
Frontend Request
      │
      ▼
[Axios Interceptor]
      │
      ├─ Add Authorization Header
      │  (Bearer {token})
      │
      ▼
Backend Endpoint
      │
      ▼
[CORS Middleware]
      │
      ▼
[Body Parser]
      │
      ▼
[Auth Middleware]
      │
      ├─ Verify JWT Token
      │
      ▼
[Route Handler]
      │
      ├─ Validate Input
      ├─ Business Logic
      ├─ Database Query
      │
      ▼
[Response]
      │
      ├─ Success: JSON data
      ├─ Error: Error message
      │
      ▼
[Error Handler]
      │
      ▼
Response to Frontend
```

## File Structure

```
wootads/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts              # Axios config + interceptors
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx       # Public landing
│   │   │   ├── Login.tsx             # Login form
│   │   │   ├── Register.tsx          # Registration form
│   │   │   └── Dashboard.tsx         # Protected dashboard
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth state
│   │   ├── App.tsx                   # Main app + routing
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   └── authController.js     # Auth logic
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/
│   │   │   └── User.js               # User schema
│   │   ├── routes/
│   │   │   └── auth.js               # Auth routes
│   │   └── server.js                 # Express app
│   ├── .env                          # Environment variables
│   └── package.json
│
└── package.json                      # Root package.json
```

## Security Architecture

### Password Security
```
User Password
      │
      ▼
bcrypt.genSalt(10)
      │
      ▼
bcrypt.hash(password, salt)
      │
      ▼
Hashed Password stored in DB
(never store plain passwords!)
```

### JWT Token Security
```
User Credentials
      │
      ▼
Verify Password
      │
      ▼
Generate JWT Token
  ├─ Payload: { id: user._id }
  ├─ Secret: process.env.JWT_SECRET
  └─ Expiry: 30 days
      │
      ▼
Return Token to Client
      │
      ▼
Store in LocalStorage + Zustand
      │
      ▼
Include in Authorization Header
(Bearer {token})
      │
      ▼
Backend Verifies Token
  ├─ jwt.verify(token, secret)
  ├─ Check expiry
  └─ Extract user ID
      │
      ▼
Allow Access to Protected Resource
```

## State Management

### Zustand Store Structure
```javascript
useAuthStore {
  user: {
    id: string
    email: string
    name: string
  } | null
  
  token: string | null
  
  isAuthenticated: boolean
  
  login(user, token): void
  logout(): void
}
```

### State Persistence
- Stored in `localStorage`
- Keys: `auth-token`, `auth-user`
- Loaded on app initialization
- Cleared on logout

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |

### Request/Response Examples

**Register**
```javascript
// Request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": "free",
    "credits": 10
  }
}
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed, not selected by default),
  subscription: String (enum: ['free', 'pro', 'enterprise'], default: 'free'),
  credits: Number (default: 10),
  createdAt: Date,
  updatedAt: Date
}
```

## Future Architecture (Planned)

### AI Integration Layer
```
┌──────────────────────────────────────────┐
│         AI Services                       │
├──────────────────────────────────────────┤
│ - OpenAI GPT-4 (text generation)        │
│ - DALL-E 3 (image generation)           │
│ - CLIP (image-text matching)            │
│ - Layout AI (design optimization)        │
└──────────────────────────────────────────┘
```

### Canvas Layer
```
┌──────────────────────────────────────────┐
│         Canvas/Editor                     │
├──────────────────────────────────────────┤
│ - Fabric.js or Konva.js                  │
│ - Drag-drop functionality                │
│ - Layers management                      │
│ - Export functionality                   │
└──────────────────────────────────────────┘
```

## Performance Considerations

### Frontend
- Vite for fast HMR (Hot Module Replacement)
- Code splitting with React.lazy (future)
- Zustand for minimal re-renders
- CSS variables for theming

### Backend
- Express middleware for efficient request processing
- MongoDB indexes on email field
- JWT for stateless authentication
- Connection pooling via Mongoose

## Scalability

Current architecture supports:
- Horizontal scaling of backend instances
- MongoDB Atlas auto-scaling
- CDN for static assets (future)
- Serverless functions (future)

## Development vs Production

### Development
- `NODE_ENV=development`
- Error stack traces shown
- CORS allows all origins
- Detailed logging

### Production (Future)
- `NODE_ENV=production`
- No stack traces
- CORS restricted to frontend domain
- Minimal logging
- HTTPS required
- Rate limiting
- Compression

---

This architecture provides a solid foundation for building the AI-powered ad creation features on top of it!


