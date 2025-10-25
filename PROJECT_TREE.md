# WootAds - Complete Project Structure

Generated: October 17, 2025

## 📁 Full Directory Tree

```
wootads/
│
├── 📄 START_HERE.md                    ⭐ READ THIS FIRST!
├── 📄 QUICKSTART.md                    Quick 5-minute setup guide
├── 📄 README.md                         Main project documentation
├── 📄 SETUP.md                          Detailed setup instructions
├── 📄 MONGODB_SETUP.md                  MongoDB Atlas setup guide
├── 📄 ENV_SETUP_GUIDE.md               Environment variables guide
├── 📄 ARCHITECTURE.md                   Technical architecture doc
├── 📄 PROJECT_STATUS.md                 Current status & roadmap
├── 📄 PROJECT_TREE.md                   This file
│
├── 📄 .gitignore                        Git ignore rules
├── 📄 .cursorignore                     Cursor ignore rules
├── 📄 package.json                      Root package.json (workspace)
│
├── 📁 frontend/                         🎨 REACT FRONTEND
│   ├── 📄 package.json                  Frontend dependencies
│   ├── 📄 vite.config.ts               Vite configuration
│   ├── 📄 tsconfig.json                TypeScript config
│   ├── 📄 tsconfig.node.json           Node TypeScript config
│   ├── 📄 index.html                    HTML entry point
│   │
│   ├── 📁 public/                       Static assets
│   │   └── 📄 vite.svg                  Vite logo
│   │
│   └── 📁 src/                          Source code
│       ├── 📄 main.tsx                  Entry point
│       ├── 📄 App.tsx                   Main app component + routing
│       ├── 📄 index.css                 Global styles
│       ├── 📄 vite-env.d.ts            Vite type definitions
│       │
│       ├── 📁 pages/                    Page components
│       │   ├── 📄 LandingPage.tsx      Landing page
│       │   ├── 📄 LandingPage.css      Landing styles
│       │   ├── 📄 Login.tsx            Login page
│       │   ├── 📄 Register.tsx         Registration page
│       │   ├── 📄 Auth.css             Auth pages styles
│       │   ├── 📄 Dashboard.tsx        Dashboard (protected)
│       │   └── 📄 Dashboard.css        Dashboard styles
│       │
│       ├── 📁 store/                    State management
│       │   └── 📄 authStore.ts         Zustand auth store
│       │
│       └── 📁 api/                      API integration
│           └── 📄 axios.ts             Axios config + interceptors
│
└── 📁 backend/                          🚀 NODE.JS BACKEND
    ├── 📄 package.json                  Backend dependencies
    ├── 📄 .env.example                  Environment template
    ├── 📄 .env                          🔒 YOUR CONFIG (create this)
    │
    └── 📁 src/                          Source code
        ├── 📄 server.js                 Express server entry
        │
        ├── 📁 config/                   Configuration
        │   └── 📄 db.js                 MongoDB connection
        │
        ├── 📁 models/                   Database schemas
        │   └── 📄 User.js               User model (Mongoose)
        │
        ├── 📁 routes/                   API routes
        │   └── 📄 auth.js               Auth routes
        │
        ├── 📁 controllers/              Business logic
        │   └── 📄 authController.js     Auth controller
        │
        └── 📁 middleware/               Custom middleware
            ├── 📄 auth.js               JWT verification
            └── 📄 errorHandler.js       Error handling
```

## 📊 File Count by Category

| Category | Count | Description |
|----------|-------|-------------|
| Documentation | 9 | Guides and references |
| Frontend Files | 17 | React components, styles, config |
| Backend Files | 9 | API, models, middleware |
| Configuration | 5 | Package.json, tsconfig, vite |
| **Total** | **40+** | Complete project |

## 🎯 Key Files to Know

### Frontend
```
📄 frontend/src/App.tsx              → Main routing logic
📄 frontend/src/pages/LandingPage.tsx → Landing page component
📄 frontend/src/pages/Dashboard.tsx   → Dashboard component
📄 frontend/src/store/authStore.ts    → Authentication state
📄 frontend/src/api/axios.ts          → API client setup
📄 frontend/src/index.css             → Global styles & theme
```

### Backend
```
📄 backend/src/server.js              → Express server
📄 backend/src/models/User.js         → User database schema
📄 backend/src/routes/auth.js         → Auth API routes
📄 backend/src/controllers/authController.js → Auth logic
📄 backend/src/middleware/auth.js     → JWT verification
📄 backend/src/config/db.js           → MongoDB connection
```

### Configuration
```
📄 backend/.env                       → 🔒 IMPORTANT: Your secrets
📄 frontend/vite.config.ts            → Vite dev server config
📄 package.json (root)                → Workspace scripts
```

### Documentation
```
📄 START_HERE.md                      → ⭐ Start here!
📄 QUICKSTART.md                      → Quick setup
📄 MONGODB_SETUP.md                   → MongoDB guide
📄 ARCHITECTURE.md                    → Technical details
```

## 📦 Dependencies Overview

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",    // Routing
  "axios": "^1.6.2",                 // HTTP client
  "zustand": "^4.4.7",               // State management
  "lucide-react": "^0.294.0",        // Icons
  "typescript": "^5.3.3",            // Type safety
  "vite": "^5.0.8"                   // Build tool
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",              // Web framework
  "mongoose": "^8.0.3",              // MongoDB ODM
  "bcryptjs": "^2.4.3",              // Password hashing
  "jsonwebtoken": "^9.0.2",          // JWT tokens
  "cors": "^2.8.5",                  // CORS
  "dotenv": "^16.3.1",               // Environment vars
  "express-validator": "^7.0.1",     // Input validation
  "openai": "^4.20.1"                // OpenAI (future)
}
```

## 🚀 Development Scripts

### From Root Directory
```bash
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Start frontend only (port 3000)
npm run dev:backend      # Start backend only (port 5000)
npm run install:all      # Install all dependencies
npm run build            # Build frontend for production
```

### From Frontend Directory
```bash
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### From Backend Directory
```bash
cd backend
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server
```

## 🎨 Pages & Routes

### Public Routes (No Auth Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Beautiful landing page |
| `/login` | Login | User login form |
| `/register` | Register | User registration form |

### Protected Routes (Auth Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | Dashboard (Overview) | User stats |
| `/dashboard/create` | Dashboard (CreateAd) | Ad creation |
| `/dashboard/templates` | Dashboard (Templates) | Template library |
| `/dashboard/projects` | Dashboard (Projects) | Project management |
| `/dashboard/settings` | Dashboard (Settings) | User settings |

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login user |
| GET | `/api/auth/me` | ✅ Yes | Get current user |

### Future Endpoints (To be added)
- `/api/ads` - Ad management
- `/api/templates` - Template operations
- `/api/projects` - Project management
- `/api/ai` - AI generation

## 📐 Design System

### Color Palette
```css
--primary: #6366f1         /* Indigo */
--primary-dark: #4f46e5
--primary-light: #818cf8
--secondary: #ec4899       /* Pink */
--background: #0f172a      /* Dark slate */
--surface: #1e293b         /* Slate */
--surface-light: #334155
--text: #f1f5f9            /* Light */
--text-muted: #94a3b8      /* Gray */
--border: #334155
--success: #10b981         /* Green */
--error: #ef4444           /* Red */
```

### Typography
- Font Family: System fonts (Apple, Segoe UI, Roboto)
- Headings: 800 weight
- Body: 400-600 weight

### Components
- Buttons: Primary, Secondary, Outline
- Forms: Email, Password, Text inputs
- Cards: Feature cards, Stat cards
- Navigation: Sidebar, Header

## 🔒 Security Features

- ✅ Password hashing (bcryptjs with salt)
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation (express-validator)
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ HTTP-only cookies (can be added)
- ✅ Rate limiting (to be added)

## 🎯 What Works Right Now

✅ Landing page with animations  
✅ User registration with validation  
✅ User login with JWT tokens  
✅ Dashboard with navigation  
✅ Protected routes  
✅ Logout functionality  
✅ Persistent authentication  
✅ Responsive design  
✅ Error handling  
✅ MongoDB integration  

## 🔜 Ready to Add

⏳ OpenAI integration for text generation  
⏳ DALL-E for image generation  
⏳ Canvas editor (Fabric.js/Konva.js)  
⏳ Template system  
⏳ Project management  
⏳ Export functionality  
⏳ Payment integration  
⏳ Email notifications  

## 📊 Code Statistics

- **Total Lines**: ~2000+
- **TypeScript Files**: 10
- **JavaScript Files**: 8
- **CSS Files**: 4
- **Documentation Files**: 9
- **Configuration Files**: 5

## 🎓 Learning Path

1. **Understand the Structure** → Read ARCHITECTURE.md
2. **Set Up Environment** → Follow QUICKSTART.md
3. **Explore Frontend** → Start with LandingPage.tsx
4. **Explore Backend** → Start with server.js
5. **Add Features** → Follow PROJECT_STATUS.md roadmap

## 🆘 Quick Help

| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | See MONGODB_SETUP.md |
| Environment variables error | See ENV_SETUP_GUIDE.md |
| Port already in use | Change PORT in backend/.env |
| Dependencies not installing | Run `npm run install:all` |
| TypeScript errors | Check tsconfig.json |

---

**Ready to start?** Open [START_HERE.md](./START_HERE.md) and follow the 5-minute guide!

---

*Generated from WootAds project structure*


