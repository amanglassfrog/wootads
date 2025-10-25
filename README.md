# WootAds - AI-Powered Ad Creation Platform

WootAds is a SaaS platform that leverages AI to create stunning advertisements in seconds. Built with modern web technologies and powered by OpenAI.

## 🚀 Features

- **AI-Powered Design**: Generate beautiful ads using advanced AI models
- **Smart Copy Generation**: Create compelling ad copy tailored to your audience
- **Multi-Platform Export**: Export ads optimized for various platforms
- **User Authentication**: Secure registration and login system
- **Dashboard**: Intuitive dashboard for managing ads and projects

## 🛠️ Tech Stack

### Frontend
- **Vite + React**: Fast development and optimized builds
- **TypeScript**: Type-safe code
- **React Router**: Client-side routing
- **Zustand**: State management
- **Lucide React**: Beautiful icons

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### AI Integration (Coming Soon)
- **OpenAI GPT-4**: Text generation and design descriptions
- **DALL-E 3**: Image generation
- **Canvas Libraries**: Fabric.js/Konva.js for visual editing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wootads
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update the `.env` file with your credentials:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key (to be added later)
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🌐 Project Structure

```
wootads/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── ...
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   └── routes/        # API routes
│   └── package.json
└── package.json           # Root package.json
```

## 🔑 Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`: OpenAI API key (to be added)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## 📝 Available Scripts

### Root Directory
- `npm run dev`: Start both frontend and backend
- `npm run dev:frontend`: Start only frontend
- `npm run dev:backend`: Start only backend
- `npm run install:all`: Install all dependencies

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Backend
- `npm run dev`: Start with nodemon (auto-reload)
- `npm start`: Start production server

## 🎨 Features Roadmap

### Phase 1 (Current)
- ✅ Landing page
- ✅ User authentication
- ✅ Dashboard layout
- ✅ MongoDB integration

### Phase 2 (Coming Soon)
- [ ] OpenAI GPT-4 integration
- [ ] Ad creation interface
- [ ] Template library
- [ ] Canvas editing with Fabric.js/Konva.js

### Phase 3 (Future)
- [ ] DALL-E 3 image generation
- [ ] Multi-platform export
- [ ] Project management
- [ ] Collaboration features

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Protected API routes
- Input validation and sanitization

## 🤝 Contributing

This is a private project. If you have access and want to contribute:

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

Private and Proprietary

## 👤 Author

Amit Bajaj

## 📧 Support

For support, please contact the development team.


