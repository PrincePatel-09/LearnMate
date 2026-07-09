# ╔══════════════════════════════════════════════════════════════╗
# ║         LearnMate — Agentic AI for Personalized             ║
# ║              Course Pathways                                 ║
# ║         Powered by IBM Granite via watsonx.ai               ║
# ╚══════════════════════════════════════════════════════════════╝

> **Production-ready full-stack AI learning coach** built with React, Flask, and IBM Granite through watsonx.ai.

---

## 🗂 Project Structure

```
learnmate/
├── backend/                      ← Python Flask API
│   ├── app.py                    ← Application factory
│   ├── run.py                    ← Entry point
│   ├── Procfile                  ← Render / Heroku deployment
│   ├── Dockerfile                ← IBM Cloud Code Engine
│   ├── requirements.txt
│   ├── .env.example              ← Copy to .env and fill in your keys
│   ├── database/
│   │   └── db.py                 ← SQLAlchemy instance
│   ├── models/
│   │   └── models.py             ← User, Roadmap, ChatMessage, Progress, Achievement, Bookmark
│   ├── routes/
│   │   ├── auth_routes.py        ← POST /register, /login, /logout, GET /me
│   │   ├── chat_routes.py        ← POST /chat, GET /chat/history, DELETE /chat/clear
│   │   ├── roadmap_routes.py     ← POST /generate-roadmap, GET /roadmap
│   │   ├── course_routes.py      ← GET /courses, POST /courses/bookmark
│   │   ├── dashboard_routes.py   ← GET /dashboard
│   │   ├── profile_routes.py     ← GET/PUT /profile, POST /skill-assessment
│   │   └── progress_routes.py    ← POST /update-progress, GET /analytics
│   ├── services/
│   │   └── watsonx_service.py    ← IBM Granite model wrapper
│   ├── prompts/
│   │   └── AGENT_INSTRUCTIONS.py ← ⭐ Customise the AI personality here
│   └── utils/
│       └── helpers.py            ← Password hashing, achievements, streak
│
└── frontend/                     ← React + Tailwind CSS
    ├── package.json
    ├── tailwind.config.js
    ├── vercel.json                ← Vercel deployment config
    └── src/
        ├── App.js                ← Routing + protected routes
        ├── index.js
        ├── index.css             ← Global styles + animations
        ├── context/
        │   ├── AuthContext.js    ← JWT auth state
        │   └── ThemeContext.js   ← Dark/light mode
        ├── services/
        │   └── api.js            ← All Axios API calls
        ├── components/
        │   └── layout/
        │       ├── AppLayout.js  ← Sidebar + Topbar wrapper
        │       ├── Sidebar.js    ← Navigation sidebar
        │       └── Topbar.js     ← Header with dark mode toggle
        └── pages/
            ├── LandingPage.js    ← Hero, Features, FAQ, CTA
            ├── LoginPage.js      ← Sign in
            ├── RegisterPage.js   ← 2-step registration
            ├── Dashboard.js      ← Main dashboard
            ├── ChatPage.js       ← AI coach chat (ChatGPT-style)
            ├── RoadmapPage.js    ← Generate & track roadmap
            ├── CoursesPage.js    ← Browse & bookmark courses
            ├── ProfilePage.js    ← View & edit profile
            └── ProgressPage.js   ← Charts, badges, analytics
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd learnmate/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your IBM watsonx.ai API key and Project ID

# Run the server
python run.py
# API available at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd learnmate/frontend

# Install dependencies
npm install

# Configure environment
# Edit .env.local — set REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
# App available at http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend `.env` (copy from `.env.example`)

| Variable | Description |
|---|---|
| `WATSONX_API_KEY` | Your IBM watsonx.ai API key |
| `WATSONX_PROJECT_ID` | Your watsonx.ai project ID |
| `WATSONX_URL` | watsonx.ai region URL (default: us-south) |
| `GRANITE_MODEL_ID` | Model to use (default: `ibm/granite-13b-chat-v2`) |
| `SECRET_KEY` | Flask session secret |
| `JWT_SECRET_KEY` | JWT signing secret |
| `DATABASE_URL` | SQLite path or MongoDB URI |

### Get IBM watsonx.ai Credentials

1. Go to [cloud.ibm.com](https://cloud.ibm.com) → Create account (free tier available)
2. Search for **IBM Watson Studio** → Create project
3. Go to **IBM watsonx.ai** → Find your Project ID in project settings
4. Generate API key: IBM Cloud → Manage → Access → API Keys

---

## 🤖 AI Agent Customisation

Edit [`learnmate/backend/prompts/AGENT_INSTRUCTIONS.py`](learnmate/backend/prompts/AGENT_INSTRUCTIONS.py) to customise:

- **`AGENT_PERSONA`** — Change the AI's personality and tone
- **`PREFERRED_PLATFORMS`** — Reorder course platform preferences
- **`INDIA_CONTEXT`** — Indian student specific context (modify for other regions)
- **`CAREER_GUIDANCE`** — How the AI handles career advice
- **`ROADMAP_BEHAVIOUR`** — How roadmaps are structured and generated
- **`LEARNING_STRATEGY`** — The underlying teaching philosophy
- **`SAFETY_RULES`** — What the AI should/shouldn't do

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | ❌ | Register new user |
| POST | `/api/login` | ❌ | Login, get JWT token |
| GET | `/api/me` | ✅ | Get current user |
| POST | `/api/logout` | ✅ | Logout |
| POST | `/api/chat` | ✅ | Chat with IBM Granite |
| GET | `/api/chat/history` | ✅ | Get conversation history |
| DELETE | `/api/chat/clear` | ✅ | Clear chat history |
| POST | `/api/generate-roadmap` | ✅ | Generate AI roadmap |
| GET | `/api/roadmap` | ✅ | Get active roadmap |
| GET | `/api/dashboard` | ✅ | Dashboard summary |
| GET | `/api/courses` | ✅ | Get courses (optional AI mode) |
| POST | `/api/courses/bookmark` | ✅ | Toggle course bookmark |
| GET | `/api/profile` | ✅ | Get user profile |
| PUT | `/api/profile` | ✅ | Update user profile |
| POST | `/api/skill-assessment` | ✅ | Run skill assessment |
| POST | `/api/update-progress` | ✅ | Update topic progress |
| GET | `/api/analytics` | ✅ | Progress analytics |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `ibm-blue` | `#0F62FE` | Primary actions, links |
| `ibm-purple` | `#8A3FFC` | Gradients, accents |
| `ibm-teal` | `#08BDBA` | Success, AI indicators |
| `ibm-gray` | `#F4F4F4` | Page backgrounds |
| `ibm-dark` | `#161616` | Dark mode backgrounds |

---

## 🚢 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set `REACT_APP_API_URL` environment variable to your backend URL
4. Deploy — Vercel auto-detects Create React App

### Backend → Render
1. Push backend folder to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn run:app --workers 2 --bind 0.0.0.0:$PORT`
5. Set all environment variables from `.env.example`

### Backend → IBM Cloud Code Engine
```bash
# Build and push Docker image
docker build -t learnmate-backend .
docker tag learnmate-backend us.icr.io/your-namespace/learnmate-backend
docker push us.icr.io/your-namespace/learnmate-backend

# Deploy via IBM Cloud CLI
ibmcloud ce app create --name learnmate-backend --image us.icr.io/your-namespace/learnmate-backend --port 5000
```

---

## 🗃 Database Migration (SQLite → MongoDB)

1. Install `pymongo` and `flask-pymongo`
2. Change `DATABASE_URL` in `.env` to your MongoDB URI
3. The models follow a clear schema — migrate each table to a collection
4. Update `db.py` to use PyMongo instead of SQLAlchemy

---

## ✨ Features

| Feature | Status |
|---|---|
| JWT Authentication | ✅ |
| IBM Granite AI Chat | ✅ |
| Personalised Roadmap Generation | ✅ |
| roadmap.sh Integration | ✅ |
| Course Recommendations | ✅ |
| Course Bookmarks | ✅ |
| Progress Tracking | ✅ |
| Charts & Analytics | ✅ |
| Achievements & Badges | ✅ |
| Learning Streak | ✅ |
| XP System | ✅ |
| Dark Mode | ✅ |
| Skill Assessment | ✅ |
| Indian Student Context | ✅ |
| Agent Personality File | ✅ |
| Docker / Cloud Ready | ✅ |

---

## 📄 License

MIT License — Built with ❤️ using IBM watsonx.ai + IBM Granite
