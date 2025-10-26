# Posturemon 🦴✨

A real-time posture monitoring application with gamification elements. Uses AI-powered pose detection to help you maintain good posture while working, with a virtual pet companion that grows as you improve your habits!

## Why?

In today's digital age, many people spend hours sitting in front of computers for work and entertainment. This often leads to poor posture, neck pain, and long-term health issues.

**Posturemon** solves this problem by:
- 🎯 Monitoring your posture in real-time using your webcam
- 🎮 Gamifying good posture habits with quests and achievements
- 🐾 Providing a virtual pet companion that evolves based on your performance
- 📊 Tracking your posture statistics over time
- ⏰ Reminding you to maintain proper posture and take breaks

## Features

- **Real-time Posture Detection**: Uses MediaPipe and OpenCV for accurate pose estimation
- **Personalized Calibration**: Set your ideal posture for customized monitoring
- **Gamification System**:
  - Daily and weekly quests
  - Achievement system with unlockable rewards
  - Virtual pet that grows with your progress
  - Experience points and leveling
- **Statistics Dashboard**: Track your posture performance over time
- **Session Management**: Start/stop monitoring sessions with detailed logs
- **SQLite Database**: Persistent storage of user data and posture logs

## Tech Stack

### Frontend (`/posturemon`)
- **Framework**: Next.js 16.0.0 (React 19.2.0)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI (tabs, progress, slots)
- **State Management**: Zustand
- **API Client**: Custom REST client for Flask backend

### Backend (`/backend`)
- **Framework**: Flask 3.1.2
- **Language**: Python 3
- **Computer Vision**:
  - OpenCV 4.12.0.88
  - MediaPipe 0.10.14 (pose detection)
- **Database**: SQLite with custom ORM
- **Data Processing**: NumPy, SciPy
- **Concurrency**: Threading for camera management

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Port 3000)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │  Main App    │  │   UI Store   │      │
│  │              │  │ (Tabs: Home, │  │   (Zustand)  │      │
│  │              │  │  Quest, Pet) │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                   │                  │             │
│         └───────────────────┴──────────────────┘             │
│                             ▼                                │
│                   ┌──────────────────┐                       │
│                   │  backend-api.ts  │                       │
│                   │  (API Client)    │                       │
│                   └──────────────────┘                       │
└────────────────────────────│────────────────────────────────┘
                             │ HTTP REST API
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                Flask Backend (Port 5050)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   main.py    │  │  posture.py  │  │ database.py  │      │
│  │ (API Routes) │  │ (Pose Logic) │  │(SQLite ORM)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                   │                  │             │
│         └───────────────────┴──────────────────┘             │
│                             ▼                                │
│                   ┌──────────────────┐                       │
│                   │ Camera Thread    │                       │
│                   │ (MediaPipe +     │                       │
│                   │  OpenCV)         │                       │
│                   └──────────────────┘                       │
│                             │                                │
│                             ▼                                │
│                   ┌──────────────────┐                       │
│                   │ posture_logs.db  │                       │
│                   │ (SQLite)         │                       │
│                   └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                             ▲
                             │ Webcam Access
                        (Hardware)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/camera/start` | Start webcam monitoring |
| POST | `/api/camera/stop` | Stop webcam |
| POST | `/api/camera/calibrate` | Calibrate ideal posture |
| GET | `/api/posture/current` | Get real-time posture status |
| GET | `/api/stats/today` | Get today's statistics |
| GET | `/api/stats/week` | Get 7-day statistics |
| POST | `/api/user/set` | Set username |
| GET | `/api/user/get` | Get user information |
| GET | `/api/health` | Health check |
| GET | `/api/status` | Get camera & calibration status |

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm/pnpm
- Webcam access

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Create the environment
   python3 -m venv .venv

   # Activate on macOS/Linux
   source .venv/bin/activate

   # Activate on Windows
   # .venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask backend:**
   ```bash
   python main.py
   ```

   Backend will run on `http://localhost:5050`

   **Optional demo mode** (shows OpenCV window):
   ```bash
   python main.py --demo
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd posturemon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Frontend will run on `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables

Create a `.env.local` file in `/posturemon` (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5050
```

## How to Use

1. **Start both backend and frontend** (in separate terminals)
2. **Open browser** to `http://localhost:3000`
3. **Click "Start Monitoring"** on the home screen
4. **Calibrate your posture**: Click calibrate when sitting in your ideal posture
5. **Start working!** The app will monitor your posture and alert you when slouching
6. **Complete quests** to earn XP and level up your virtual pet
7. **View statistics** to track your progress over time

## Project Structure

```
Posturemon/
├── backend/                    # Flask API server
│   ├── main.py                # API routes and Flask app
│   ├── posture.py             # PostureChecker class (MediaPipe logic)
│   ├── database.py            # SQLite database wrapper
│   ├── requirements.txt       # Python dependencies
│   └── .venv/                 # Python virtual environment
│
├── posturemon/                # Next.js frontend
│   ├── app/                   # Next.js app router
│   │   ├── page.tsx          # Landing page
│   │   └── app/page.tsx      # Main application
│   ├── components/            # React components
│   │   ├── screens/          # Tab screen components
│   │   ├── ui/               # Radix UI components
│   │   └── pet/              # Virtual pet components
│   ├── services/             # Business logic
│   │   ├── backend-api.ts    # API client
│   │   ├── quest-system.ts   # Quest management
│   │   └── achievement-system.ts
│   ├── store/                # Zustand state management
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

## Database Schema

**Users Table:**
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `created_at` (TIMESTAMP)

**Posture Logs Table:**
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `timestamp` (TIMESTAMP)
- `posture_quality` (TEXT): "good" or "bad"
- `session_id` (TEXT)

## How It Works

1. **Pose Detection**: MediaPipe detects 33 body landmarks from webcam feed
2. **Calibration**: Users calibrate their ideal posture, storing reference angles
3. **Real-time Monitoring**: Backend compares current angles to calibrated angles
4. **Threshold Detection**: Alerts when slouch duration exceeds threshold
5. **Data Logging**: Stores posture events in SQLite database
6. **Gamification**: Frontend processes logs into quests, achievements, and pet progression

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ to help you maintain better posture!
