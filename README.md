AI-Powered Study Buddy

An intelligent study companion that explains complex topics, summarizes notes, generates quizzes, and creates flashcards — all powered by AI.

📌 About the Project

Students often struggle to understand complex concepts while studying. Searching online gives long or irrelevant results, and teachers may not always be available. AI Study Buddy solves this by acting as a personal AI tutor — available 24/7, adapting explanations to the student's level, and turning raw notes into structured summaries, quizzes, and flashcards on demand.

This project was built as a full-stack, production-ready web application using modern technologies — from a React frontend to a FastAPI backend, MongoDB database, and the Groq LLaMA 3.3 70B model for AI generation.


✨ Features

💡 Topic Explainer

Enter any topic and get a clear AI-generated explanation at three levels:


Simple — explained like you're 10 years old, with fun analogies
Medium — clear explanation with real-world examples for high school level
Advanced — in-depth technical explanation with theory for college level


📄 Notes Summarizer

Summarize your study notes in seconds. Supports:


Typed notes — paste text directly
File uploads — PDF, DOCX, PPTX, and TXT files with drag & drop
Three summary styles: Bullet Points, Paragraph, or Key Points


🏆 Quiz Generator

Auto-generates multiple choice questions on any topic with:


Configurable number of questions (3, 5, 8, or 10)
Three difficulty levels: Easy, Medium, Hard
Instant scoring with correct answer highlights and explanations


🗂️ Flashcard Generator

Creates flip-card style flashcards for any topic with:


Configurable number of cards (5, 8, 10, or 15)
Click-to-flip interaction
Shuffle mode for randomized practice
"Got it" tracking to mark mastered cards
Progress bar showing study progress


🕘 Study History

Every session is automatically saved — users can review past explanations, summaries, quizzes, and flashcard sets, and delete entries they no longer need.

🔐 User Authentication


Secure JWT-based login and registration
Passwords hashed with bcrypt
Auto-logout on token expiry
Each user's history is private and isolated


🌓 Dark / Light Mode

Persistent theme toggle with system-friendly design, saved across sessions.


🛠️ Tech Stack

LayerTechnologyFrontendReact 18 (Vite) + Tailwind CSSBackendFastAPI (Python 3.10)DatabaseMongoDB AtlasAI ModelGroq API — LLaMA 3.3 70B VersatileAuthJWT (python-jose) + Bcrypt (passlib)File ParsingPyMuPDF (PDF), python-docx (DOCX), python-pptx (PPTX)HTTP ClientAxios with interceptorsDeploymentRender (single full-stack service)


📁 Project Structure

ai-study-buddy/
├── build.sh                        ← Render build script
├── README.md
├── backend/
│   ├── main.py                     ← FastAPI app + static file serving
│   ├── requirements.txt
│   ├── runtime.txt                 ← Python 3.10.13
│   ├── routers/
│   │   ├── auth.py                 ← Register & login endpoints
│   │   ├── ai.py                   ← All AI feature endpoints
│   │   └── history.py              ← Study history CRUD
│   ├── models/
│   │   └── schemas.py              ← Pydantic request models
│   └── utils/
│       ├── database.py             ← MongoDB connection
│       └── auth_utils.py           ← JWT + password utilities
└── frontend/
    └── src/
        ├── lib/
        │   └── api.js              ← Axios instance with interceptors
        ├── context/
        │   └── AuthContext.jsx     ← Global auth state
        ├── hooks/
        │   └── useToast.js         ← Toast notification hook
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Explainer.jsx
        │   ├── Summarizer.jsx      ← With file upload support
        │   ├── QuizGenerator.jsx
        │   ├── Flashcards.jsx      ← With shuffle + "got it" tracking
        │   ├── History.jsx
        │   ├── Toast.jsx
        │   └── Loader.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx


🚀 Getting Started (Local Setup)

Prerequisites


Python 3.10+
Node.js 18+
MongoDB Atlas account (free tier)
Groq API key — get one free at console.groq.com


1. Clone the repository

bashgit clone https://github.com/Vamsi-Pabbiti/AI-Powered-Study-Buddy.git
cd AI-Powered-Study-Buddy

2. Backend setup

bashcd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt

Create backend/.env:

envMONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=study_buddy
SECRET_KEY=your_long_random_secret_key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

Run the backend:

bashuvicorn main:app --reload --port 8000

API docs: http://localhost:8000/docs

3. Frontend setup

bashcd frontend
npm install

Create frontend/.env:

envVITE_API_URL=http://localhost:8000

Run the frontend:

bashnpm run dev

App runs at: http://localhost:3000


🌐 Deployment (Render — Single Service)

This project is deployed as a single full-stack service on Render. The build.sh script builds the React frontend and copies the output into backend/static/, which FastAPI then serves as static files. This means one URL serves both the API and the frontend — no CORS issues, no separate platforms.

Render Configuration

FieldValueRoot Directory(empty)Build Command./build.shStart Commandcd backend && uvicorn main:app --host 0.0.0.0 --port $PORTPython Version3.10.13 (via runtime.txt)

Environment Variables on Render

MONGO_URL       = your MongoDB Atlas connection string
DB_NAME         = study_buddy
SECRET_KEY      = your secret key
GROQ_API_KEY    = your Groq API key


⚠️ Render free tier spins down after 15 min of inactivity. First request after idle may take 30–50 seconds to respond.




📡 API Endpoints

MethodEndpointDescriptionAuth RequiredPOST/api/auth/registerCreate a new account❌POST/api/auth/loginLogin and receive JWT token❌POST/api/ai/explainExplain a topic at a given level✅POST/api/ai/summarizeSummarize notes or uploaded file✅POST/api/ai/quizGenerate MCQ quiz on a topic✅POST/api/ai/flashcardsGenerate flashcards for a topic✅GET/api/history/Get user's study history✅DELETE/api/history/{id}Delete a history entry✅


🔑 Key Implementation Details


Single Render deployment — FastAPI serves the built React app as static files, eliminating cross-origin issues
Custom Axios instance (lib/api.js) — automatically attaches JWT token to every request and handles 401 auto-logout
Multipart file upload — Summarizer accepts PDF/DOCX/PPTX/TXT via multipart/form-data, parsed server-side
Robust JSON parsing — AI responses for quiz/flashcard endpoints are cleaned and parsed with fallback bracket extraction
Toast notifications — lightweight custom hook (useToast) for non-blocking user feedback
Persistent dark mode — theme saved to localStorage and applied on every load



📌 Roadmap


 OCR support for scanned PDFs and handwritten notes
 Export quiz results as PDF report
 Study progress analytics dashboard
 Spaced-repetition scheduling for flashcards
 Topic-based study planner



👤 Author

Vamsi Pabbiti


how to run this project
# Terminal 1 — Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev