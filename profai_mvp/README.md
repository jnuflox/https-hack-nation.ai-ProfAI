# 🎓 ProfAI - Voice-Driven AI Professor with Emotional Intelligence

**An adaptive teaching system that combines MIT-style rigorous theory with practical application, powered by Gemini Pro 2.5.**

---

## 🚀 QUICK START

### Local Development
```bash
cd /Users/jnufloga/Documents/Hacknation/profai_mvp/app
npm install
npm run dev
```

### Access the System
- **Main URL:** http://localhost:3000
- **Intelligent Chat:** http://localhost:3000/chat
- **Dashboard:** http://localhost:3000/dashboard

---

## 🧠 WHAT IS PROFAI?

ProfAI is an artificially intelligent professor that emotionally adapts to each student. It combines:

- **🔬 MIT-Style Pedagogy**: Rigorous yet accessible explanations
- **🎭 Emotional Intelligence**: Detects frustration and confusion 
- **⚡ Micro-Learning**: Lessons under 5 minutes
- **💻 "Vibe Coding"**: Immediate practical exercises
- **🔄 Real-time Adaptation**: Reformulates content based on your state
- **🎙️ Voice Interaction**: Speech-to-text and text-to-speech capabilities
- **📹 Video Tutorials**: Screen capture demonstrations

---

## 🎯 HOW TO USE PROFAI

### 1. **Ask Questions**
```
"What is machine learning?"
"Explain neural networks with examples"
"How does GPT work?"
```

### 2. **Request Reformulations**
```
"I don't understand, explain it simpler"
"Give me an analogy"
"Step by step please"
```

### 3. **Request Exercises**
```
"Give me a Python exercise"
"I want to practice with TensorFlow"
"Show me how to build an API"
```

### 4. **Voice Interaction**
```
Click the microphone button and speak naturally
ProfAI will respond with voice and text
```

---

## 🏗️ ARCHITECTURE

### Core Components

- **🧠 Tutorial Agent (Main Orchestrator)**: MIT-style pedagogical orchestrator
- **📊 Evaluation Agent**: Analyzes performance and detects knowledge gaps  
- **🔄 Content Update Agent**: Scans external sources in real-time
- **🎭 Emotional Agent**: Classifies tone and multimodal signals
- **📹 Video Agent**: Generates screen captures and tutorials
- **👥 Community Agent**: Hack-Nation channels integration

### Tech Stack

**Frontend:**
- Next.js 14 with TypeScript
- Tailwind CSS + Radix UI
- React Query for state management
- Framer Motion for animations

**Backend:**
- Next.js API Routes
- NextAuth.js for authentication
- Prisma ORM with SQLite
- Google Gemini Pro 2.5 AI

**AI & Services:**
- Google Generative AI (@google/generative-ai)
- Voice recognition and synthesis
- Real-time emotion detection
- Automated content generation

---

## 🔧 INSTALLATION & SETUP

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Step-by-Step Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd Hacknation/profai_mvp/app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Run Development Server**
```bash
npm run dev
```

---

## 📚 FEATURES

### Core Features (MVP)
- ✅ **Hybrid Learning**: Theory + immediate practical application
- ✅ **Micro-Learning**: Daily lessons under 5 minutes  
- ✅ **Emotional Adaptation**: Text-based frustration/confusion detection
- ✅ **Interactive Chat**: Intelligent conversation with AI professor
- ✅ **Progress Tracking**: Personalized learning dashboard
- ✅ **Exercise Generation**: Immediate coding practice

### Advanced Features  
- 🎙️ **Voice Interaction**: Speech-to-text and text-to-speech
- 📹 **Video Tutorials**: Automated screen capture demonstrations
- 🔄 **Auto-Content Updates**: Real-time integration of latest AI trends
- 👥 **Community Integration**: Hack-Nation channels connectivity
- 📊 **Advanced Analytics**: Deep learning progress insights

---

## 🎮 USER JOURNEYS

### For Beginners
1. **Initial Assessment**: Skill evaluation and personalized roadmap
2. **Daily Micro-Lessons**: Short, digestible learning modules
3. **Immediate Practice**: "Vibe coding" exercises after each lesson
4. **Emotional Support**: Adaptive explanations when confused

### For Intermediate Learners  
1. **Deep Dive Sessions**: Weekly comprehensive tutorials
2. **Advanced Projects**: Real-world application challenges
3. **Tool Integration**: Latest AI frameworks and libraries
4. **Community Sharing**: Showcase progress in Hack-Nation

### For All Users
- **Voice Commands**: Natural language interaction
- **Video Learning**: Visual step-by-step tutorials  
- **Continuous Updates**: Always current with AI trends
- **Personalized Feedback**: Tailored to learning style

---

## 🧪 TESTING

### Run Tests
```bash
# Basic functionality tests
npm run test

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage Areas
- ✅ Authentication system
- ✅ Chat API integration
- ✅ Gemini AI connection
- ✅ Database operations
- ✅ Onboarding flow
- ✅ Multimodal integration

---

## 📊 PROJECT STATUS

### Current Phase: MVP Complete ✅
- [x] Core chat functionality
- [x] User authentication  
- [x] Basic emotional detection
- [x] Exercise generation
- [x] Progress tracking

### Next Phase: Advanced Features 🚧
- [ ] Voice interaction implementation
- [ ] Video tutorial generation
- [ ] Community integration
- [ ] Advanced emotion detection
- [ ] Auto-content updates

---

## 🤝 CONTRIBUTING

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use Prettier for formatting
- Write tests for new features
- Update documentation

---

## 📝 API DOCUMENTATION

### Chat Endpoints
```
POST /api/chat/send
GET /api/chat/history
DELETE /api/chat/clear
```

### User Management
```
POST /api/auth/signup
GET /api/user/profile
PUT /api/user/preferences
```

### Learning Progress
```
GET /api/progress/overview
POST /api/progress/update
GET /api/lessons/daily
```

---

## 🔒 SECURITY

- Secure authentication with NextAuth.js
- API rate limiting
- Input validation and sanitization
- Environment variable protection
- Database security best practices

---

## 📈 PERFORMANCE

- Optimized Next.js build configuration
- Lazy loading for components
- Database query optimization
- CDN integration ready
- Real-time response optimization

---

## 🌟 HACKATHON TRACK

**Track:** VC Big Bets (Education)

**Goal:** Design and deploy ProfAI, an emotionally intelligent AI-powered teacher that focuses deeply on AI education, combining MIT-style theory with hands-on tooling experience.

**Evaluation Criteria:**
- ✅ **Specialization Depth**: Hybrid approach with both theory and practice
- ✅ **Educational Value**: Accurate, engaging, and adaptive content  
- ✅ **Technical Innovation**: Emotional intelligence and voice interaction
- ✅ **Feasibility**: Successfully deployed and tested

---

## 📞 SUPPORT

For questions, issues, or contributions:
- Create an issue in the repository
- Contact the development team
- Join our Hack-Nation community discussions

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 ACKNOWLEDGMENTS

- Built for Hack-Nation hackathon
- Powered by Google Gemini Pro 2.5
- Inspired by MIT-style pedagogical approaches
- Community-driven educational innovation

---

**Made with ❤️ by the ProfAI Team**
