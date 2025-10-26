# 🏦 FinCoach - AI-Powered Investment Assistant

<div align="center">

![FinCoach Logo](https://img.shields.io/badge/FinCoach-AI%20Investment%20Assistant-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.0-blue?logo=react&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue?logo=tailwindcss&style=for-the-badge)

**"Invierte con Confianza, No con Pánico"**

*Making smarter investment decisions through AI-powered sentiment analysis and anti-panic alerts*

</div>

---

## 📋 Table of Contents

- [Inspiration 💡](#-inspiration)
- [Features ✨](#-features)
- [Tech Stack 🛠️](#-tech-stack)
- [Project Structure 📁](#-project-structure)
- [Getting Started 🚀](#-getting-started)
- [Architecture Overview 🏗️](#-architecture-overview)
- [Key Components 🧩](#-key-components)
- [What We Learned 📚](#-what-we-learned)
- [Challenges & Solutions 💪](#-challenges--solutions)
- [Design System 🎨](#-design-system)
- [Contributing 🤝](#-contributing)
- [License 📄](#-license)

---

## 💡 Inspiration

The inspiration for **FinCoach** came from a fundamental problem in investing: **emotional behavior and panic-selling tendencies**. The vision was to create a technological solution that helps people make confident decisions and avoid reacting impulsively to market fluctuations.

### Design Thinking Methodology
- **Empathy**: We focused on understanding the emotional challenges investors face during market volatility
- **Problem**: Many investors make poor decisions driven by fear and panic rather than rational analysis
- **Solution**: An AI-powered assistant that analyzes sentiment, provides anti-panic alerts, and suggests personalized micro-investments

### Design Inspiration
- **Branding**: Inspired by Capital One's professional fintech aesthetic (Navy Blue and Red color scheme)
- **Slogan**: "Invest with Confidence, Not with Panic" - perfectly encapsulates the mission
- **Goal**: Create a trustworthy, professional platform that instills confidence in investors

---

## ✨ Features

### 🌐 Landing Page
- ✅ **Fully Responsive Design** - Mobile-first approach, works flawlessly on all devices
- ✅ **Sticky Navigation** - Smooth scroll navigation with offset compensation
- ✅ **Bilingual Support** - Spanish and English language switching
- ✅ **Hero Section** - Impactful headline with dual CTAs and trust indicators
- ✅ **Feature Showcase** - How it works, benefits, and testimonials
- ✅ **Contact Form** - Validated contact form with backend integration

### 🤖 AI Features
- 🧠 **Gemini AI Integration** - Powering personalized financial recommendations
- 📊 **Market Sentiment Analysis** - Real-time sentiment monitoring from news sources
- ⚠️ **Anti-Panic Alerts** - Personalized alerts based on market stress vs. user financial stability
- 💡 **Smart Recommendations** - Context-aware investment opportunities
- 🎯 **Resilience Score** - ML-based financial health assessment

### 📱 Dashboard
- 👤 **User Profile** - Display user information with avatar
- 💰 **Portfolio Management** - View portfolio value with historical data
- 📈 **Market Sentiment Graph** - Real-time sentiment visualization (0-1 impact scale)
- 🥧 **Asset Distribution** - Visual pie chart with percentage labels
- 🔔 **AI Recommendations** - Dynamic recommendations based on:
  - User resilience score (0-100)
  - Market sentiment (0-1)
  - Financial situation stability
- 💬 **Floating Chat** - AI-powered financial assistance via chat

### 🔐 Authentication
- ✅ **Firebase Auth** - Secure email/password authentication
- ✅ **Google Sign-In** - One-click Google authentication
- ✅ **Protected Routes** - Secure dashboard access
- ✅ **User Profile Management** - Display name and photo handling

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Component library
- **Lucide React** - Icon library
- **Wouter** - Lightweight routing (SPA)
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Express.js** - Minimal REST API
- **Node.js** - Runtime environment
- **Python** - AI/ML scripts
- **Firebase** - Authentication and analytics
- **SQL Server** - News database

### AI & Analytics
- **Google Gemini AI** - Natural language processing
- **Custom ML Models** - Resilience score prediction (XGBoost)
- **News API** - Real-time financial news aggregation
- **Sentiment Analysis** - AI-powered market sentiment detection

### DevOps & Tools
- **Render** - Production deployment
- **dotenv** - Environment variable management
- **cross-env** - Cross-platform environment variables

---

## 📁 Project Structure

```
FinCoach/
├── 📁 client/                    # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── home.tsx         # Landing page
│   │   │   ├── dashboard.tsx    # User dashboard
│   │   │   └── not-found.tsx    # 404 page
│   │   ├── 📁 components/
│   │   │   ├── AuthModal.tsx    # Login/Register modal
│   │   │   ├── AuthGuard.tsx    # Protected routes
│   │   │   ├── FloatingChat.tsx # AI chat interface
│   │   │   ├── ChatMessage.tsx  # Chat message component
│   │   │   ├── TypingIndicator.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── 📁 ui/           # Shadcn UI components
│   │   ├── 📁 hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-auth-modal.ts
│   │   │   ├── use-market-sentiment.ts
│   │   │   ├── use-resilience-score.ts
│   │   │   ├── use-ai-recommendations.ts
│   │   │   └── use-toast.ts
│   │   ├── 📁 contexts/
│   │   │   ├── ChatContext.tsx
│   │   │   └── language-context.tsx
│   │   ├── 📁 lib/
│   │   │   ├── firebase.ts
│   │   │   ├── chatAPI.ts
│   │   │   ├── translations.ts  # i18n translations
│   │   │   └── utils.ts
│   │   └── 📁 assets/
│   │       └── images/
│   ├── index.html
│   └── package.json
│
├── 📁 server/                    # Backend Express.js
│   ├── index.ts
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # In-memory storage
│   └── vite.ts                  # Vite dev integration
│
├── 📁 scripts/                   # Python AI scripts
│   ├── script.py                # Market sentiment analysis
│   └── install-dependencies.sh
│
├── 📁 models/                    # ML models
│   ├── model.py                 # Resilience score predictor
│   ├── resiliencia_model.pkl
│   └── model_columns.pkl
│
├── 📁 shared/                    # Shared schemas
│   └── schema.ts
│
├── 📄 requirements.txt           # Python dependencies
├── 📄 package.json              # Node.js dependencies
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 vite.config.ts
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Firebase project configured
- Google Gemini API key
- News API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fincoach.git
   cd fincoach
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create `client/.env`:
   ```env
   # Firebase
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   
   # Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_MODEL_GEMINI_API_KEY=your_model_key
   
   # News API
   VITE_NEWS_API_KEY=your_news_key
   
   # Database (for Python scripts)
   SERVER=your_db_server
   UID=your_username
   PWD=your_password
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Frontend: `http://localhost:5000`
   - API: `http://localhost:5000/api`

---

## 🏗️ Architecture Overview

### Client-Side (React)
- **Language System**: React Context for i18n (Spanish/English)
- **Authentication**: Firebase Auth with custom hooks
- **Routing**: Wouter for SPA navigation
- **State Management**: React Context + custom hooks
- **API Communication**: Fetch API with error handling

### Server-Side (Express.js)
- **Static File Serving**: Vite in development, pre-built in production
- **API Endpoints**: RESTful design
- **Contact Form**: Email validation and storage
- **Python Integration**: Child process execution for ML scripts

### AI/ML Pipeline
```
News API → Python Script → Gemini AI Sentiment Analysis → SQL Server → Dashboard
                        ↓
                   Resilience Model → XGBoost ML → User Score
```

### Authentication Flow
```
User → Firebase Auth → JWT Token → Protected Routes → Dashboard
```

---

## 🧩 Key Components

### `AuthModal`
- Login/Register forms
- Google Sign-In integration
- Form validation with Zod
- Toast notifications
- Password visibility toggle

### `FloatingChat`
- AI-powered chat interface
- Gemini API integration
- Chat history persistence
- Typing indicator
- Clear chat functionality

### `useAIRecommendations`
- Context-aware recommendations
- Three types:
  - **Alert**: Market stress but stable finances
  - **Opportunity**: Favorable market + stable finances
  - **Cushion**: Financial cushion needs improvement
- Gemini API calls with fallback messages

### `useResilienceScore`
- ML-based score calculation (0-100)
- Status levels: Excellent, Good, Regular, Low
- Personalized messages

### `useMarketSentiment`
- Real-time market sentiment data
- 8 data points per day (3-hour intervals)
- 0-1 impact scale
- News event descriptions

---

## 📚 What We Learned

### Design & Development Integration
- **Structured Design System**: Implemented consistent design using Tailwind CSS utilities and Shadcn UI components
- **Brand Consistency**: Successfully applied Capital One's color scheme throughout the application
- **Visual Hierarchy**: Proper use of typography, spacing, and color to guide user attention

### Mobile-First Development
- **Responsive Breakpoints**: Thoroughly tested and optimized for mobile (<768px), tablet (768-1024px), and desktop (>1024px)
- **Touch Interactions**: Large tap targets, smooth scrolling, and mobile-friendly navigation
- **Performance**: Optimized images, lazy loading, and efficient re-renders

### AI & API Integration
- **Gemini API**: Learned to handle streaming responses, token limits, and fallback strategies
- **Error Handling**: Robust error handling for API failures, network issues, and rate limits
- **Data Synchronization**: Real-time updates between different data sources
- **ML Model Integration**: Successfully connected Python ML models with React frontend

### Accessibility & SEO
- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **ARIA Labels**: Screen reader support for all interactive elements
- **Meta Tags**: SEO optimization with proper descriptions and keywords
- **Keyboard Navigation**: Full keyboard accessibility

---

## 💪 Challenges & Solutions

### Challenge 1: AI API Token Limits
**Problem**: Gemini 2.5-flash consumed tokens on internal "thoughts" before generating output.

**Solution**: 
- Switched to direct API calls with simpler prompts
- Implemented fallback messages when API fails
- Reduced token usage with concise prompts
- Added proper error handling and logging

### Challenge 2: Cross-Environment Variable Passing
**Problem**: Python scripts couldn't access Node.js environment variables.

**Solution**:
- Implemented `dotenv` for server-side variable loading
- Pass environment variables via `execAsync` options
- Updated Python scripts to use `os.getenv()` instead of `python-decouple`
- Added multiple fallback API key sources

### Challenge 3: Real-Time Data Synchronization
**Problem**: Market sentiment graph showed flat line because of single-valued API response.

**Solution**:
- Generated realistic variations around the sentiment value
- Created dynamic chart data with base variations array
- Added tooltips with news descriptions for each point
- Implemented proper fallback for missing data

### Challenge 4: Dynamic Financial Cushion Values
**Problem**: Financial cushion amount changed on every render due to `Math.random()`.

**Solution**:
- Implemented `useMemo` for stable calculations
- Made amount proportional to resilience score (50-100 → $2,000-$10,000)
- Calculated months of expenses based on score ranges
- Ensured values update only when resilience data changes

---

## 🎨 Design System

### Colors
- **Primary Navy**: `#004879` (hsl(203 100% 24%)) - Capital One inspired
- **Accent Red**: `#D7372F` (hsl(4 78% 52%)) - Trust and urgency
- **Background**: White with subtle gradients
- **Text**: Dark gray with proper hierarchy

### Typography
- **Headings**: Poppins (Bold 600, Semi-Bold 500)
- **Body**: Inter (Regular 400, Medium 500)
- **Monospace**: 'Fira Code' for code elements

### Components
- **Button States**: Hover elevation system
- **Cards**: Subtle shadows with hover effects
- **Forms**: Rounded inputs with focus states
- **Modals**: Centered, responsive, with backdrop blur

### Responsive Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow Tailwind CSS utility-first approach
- Write descriptive commit messages
- Add comments for complex logic
- Maintain responsive design

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Gemini AI**

**Made for investors who want to invest with confidence, not panic**

[Report Bug](https://github.com/yourusername/fincoach/issues) · [Request Feature](https://github.com/yourusername/fincoach/issues) · [Documentation](./docs)

</div>
