# LegalVision - AI-Powered Legal Assistant

<div align="center">

**Your AI-Powered Legal Assistant with Advanced Document Analysis and Multi-Modal Processing**

These are our actual repos with all commit history. This new repo is created to merge both the codes into a single repository.

[🌐 Live Website](https://legal-vision-app-for-law-flame.vercel.app/) | [📱 Frontend Repo](https://github.com/abdullahxyz85/Legal-Vision-app-for-law.git) | [⚙️ Backend Repo](https://github.com/MUHAMMAD-AZEEM-AZAM/LegalVision-backend.git)

</div>

---

## 🚀 Overview

LegalVision is a sophisticated AI-powered legal assistant that combines the latest GPT-5 technology with specialized legal tools to provide comprehensive legal guidance, document analysis, and research capabilities. Built with a modern tech stack, it offers both web and API interfaces for seamless legal assistance.

**🎯 Perfect for:**
- Legal professionals seeking AI-powered research assistance
- Individuals needing legal guidance and document analysis
- Developers building legal tech applications
- Students studying law and legal procedures

### 🎯 Key Features

- **🤖 GPT-5 Powered**: Latest AI model for superior legal reasoning and analysis
- **📄 Multi-Modal Processing**: Handle documents (PDF, DOCX, TXT), images, and text queries
- **🔍 Intelligent Agent**: Tool-based architecture with web search and vector database integration
- **🏛️ Jurisdiction Aware**: Never assumes location without clarification for accurate legal advice
- **📊 Structured Responses**: Professional legal analysis with actionable next steps
- **🔐 Secure Authentication**: JWT-based user management with MongoDB
- **📱 Modern UI**: Responsive React interface with real-time chat
- **⚡ Real-time Updates**: Web search integration for latest legal information

---

## 🎬 Demo & Screenshots

### Live Demo
**🌐 Try it now**: [https://legal-vision-app-for-law-flame.vercel.app/](https://legal-vision-app-for-law-flame.vercel.app/)

### Key Features Demo
1. **Document Analysis**: Upload legal documents for instant analysis
2. **Legal Research**: Get current legal information with web search
3. **Multi-Modal Input**: Process images, documents, and text queries
4. **Structured Responses**: Professional legal analysis with actionable steps
5. **Jurisdiction Safety**: Always asks for location before providing specific advice

### Example Interactions
```
User: "What are my rights as a tenant in California?"
AI: [Provides structured legal analysis with jurisdiction-specific information]

User: [Uploads lease agreement]
AI: [Analyzes document and highlights key terms and potential issues]

User: "What are the latest employment law changes in 2024?"
AI: [Searches web for current information and provides structured response]
```

---

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: Redux Toolkit for global state
- **Routing**: React Router for navigation
- **Build Tool**: Vite for fast development and building
- **Deployment**: Vercel for seamless hosting

### Backend (FastAPI + Python)
- **Framework**: FastAPI for high-performance API
- **AI Model**: GPT-5 integration via AIML API
- **Database**: MongoDB for data persistence
- **Authentication**: JWT with bcrypt password hashing
- **File Processing**: Multi-format document and image analysis
- **Agent System**: Tool-based AI agent with web search capabilities

---

## 🛠️ Technology Stack

### Frontend Technologies
```
React 18 + TypeScript
├── Tailwind CSS (Styling)
├── Redux Toolkit (State Management)
├── React Router (Navigation)
├── Vite (Build Tool)
└── Vercel (Deployment)
```

### Backend Technologies
```
FastAPI + Python 3.9+
├── GPT-5 (AI Model)
├── MongoDB (Database)
├── JWT (Authentication)
├── PyMuPDF (PDF Processing)
├── Pillow + Tesseract (Image OCR)
└── Uvicorn (ASGI Server)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **MongoDB** database
- **Tesseract OCR** (for image processing)
- **API Keys**: AIML API, Search API

### 1. Clone the Repository

```bash
# Clone the combined repository
git clone <your-repo-url>
cd LegalVision

# Or clone individual repositories
git clone https://github.com/abdullahxyz85/Legal-Vision-app-for-law.git frontend
git clone https://github.com/MUHAMMAD-AZEEM-AZAM/LegalVision-backend.git backend
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Install Tesseract OCR
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr

# macOS:
brew install tesseract

# Windows: Download from GitHub releases

# Create environment file
cp .env.example .env
# Edit .env with your API keys and MongoDB URI

# Run the server
python main.py
```

**Environment Variables (Backend)**
```env
AIML_API_KEY=your_aiml_api_key_here
SEARCH_API_KEY=your_search_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET_KEY=your_jwt_secret_here
```

### 3. Frontend Setup

```bash
cd frontend/Legal-Vision-app-for-law

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm run dev
```

**Environment Variables (Frontend)**
```env
VITE_API_URL=http://localhost:8000
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /register
POST /login
```

### Chat Endpoints

```http
POST /chat                    # Main chat with file upload
POST /chat/fast              # Fast mode with GPT-5-mini
GET /chat/actions/stream     # Real-time agent actions
POST /chat/clear             # Clear conversation history
```

### History Endpoints

```http
GET /history                 # Get chat history
GET /history/{chat_id}       # Get specific chat
```

### Health Check

```http
GET /health                  # API health status
GET /test-agent             # Test agent setup
```

### Example Usage

```bash
# Chat with document
curl -X POST "http://localhost:8000/chat" \
  -F "message=Analyze this contract for legal issues" \
  -F "document=@contract.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Text-only chat
curl -X POST "http://localhost:8000/chat" \
  -F "message=What are tenant rights in California?" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Features in Detail

### 🤖 GPT-5 Integration
- **Primary Model**: `gpt-5-2025-08-07` for superior reasoning
- **Fallback Models**: GPT-5-mini and GPT-4o-mini for performance
- **Structured Output**: JSON responses with legal analysis
- **Tool Calling**: Intelligent agent decides when to use web search

### 📄 Document Processing
- **Supported Formats**: PDF, DOCX, TXT
- **Word Limit**: 500 words per document
- **OCR Integration**: Text extraction from scanned documents
- **Legal Analysis**: Contract review and clause interpretation

### 🖼️ Image Processing
- **Supported Formats**: JPG, PNG, BMP, TIFF, WEBP
- **OCR Capabilities**: Text extraction from legal documents
- **Size Limit**: 10MB per image
- **AI Vision**: Document type recognition

### 🔍 Legal Research Tools
- **Web Search**: Real-time legal information retrieval
- **Vector Database**: Established legal context search
- **Jurisdiction Handling**: Location-specific legal advice
- **Latest Updates**: Current law and regulation access

### 💬 Conversation Management
- **History Persistence**: MongoDB-based chat storage
- **Context Awareness**: Maintains conversation context
- **Multi-turn Dialogues**: Complex legal scenario handling
- **User Sessions**: Secure authentication and authorization

---

## 🏛️ Legal Capabilities

### Legal Analysis
- Contract review and interpretation
- Legal document analysis
- Jurisdiction-specific advice
- Step-by-step legal procedures

### Research & Updates
- Current law and regulation search
- Legal precedent analysis
- Policy change tracking
- Multi-jurisdiction comparison

### Document Generation
- Legal document templates
- Customized legal advice
- Action plan generation
- Resource recommendations

### Compliance & Risk
- Legal compliance checking
- Risk assessment
- Required documentation lists
- Alternative legal options

---

## 🏆 What Makes LegalVision Unique?

### 🚀 Advanced AI Technology
- **GPT-5 Integration**: Uses the latest and most advanced AI model available
- **Intelligent Agent System**: Automatically decides when to search the web or use local knowledge
- **Multi-Modal Processing**: Handles text, documents, and images seamlessly

### 🏛️ Legal Expertise
- **Jurisdiction Safety**: Never assumes location without clarification
- **Structured Legal Analysis**: Professional format with actionable steps
- **Real-time Legal Updates**: Web search integration for current laws
- **Comprehensive Coverage**: Contract analysis, legal research, compliance checking

### 🔧 Technical Excellence
- **Modern Tech Stack**: React 18, FastAPI, MongoDB, GPT-5
- **Scalable Architecture**: Microservices-ready with clear separation of concerns
- **Security First**: JWT authentication, secure file handling, data encryption
- **Performance Optimized**: Fast response times with intelligent caching

### 💡 User Experience
- **Intuitive Interface**: Clean, responsive design that works on all devices
- **Real-time Chat**: Instant responses with conversation history
- **File Upload Support**: Drag-and-drop document and image processing
- **Professional Output**: Structured responses suitable for legal professionals

---

## 🔧 Development

### Project Structure

```
LegalVision/
├── frontend/                    # React frontend
│   └── Legal-Vision-app-for-law/
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom hooks
│       │   ├── redux/          # State management
│       │   └── constants/      # Configuration
│       ├── package.json
│       └── vite.config.ts
├── backend/                     # FastAPI backend
│   ├── services/               # Core services
│   │   ├── Client.py          # AI client
│   │   ├── document_processor.py
│   │   └── image_processor.py
│   ├── LegalAIAgent.py        # Main AI agent
│   ├── main.py                # FastAPI app
│   └── requirements.txt
└── README.md
```

### Adding New Features

1. **New Document Formats**: Extend `DocumentProcessor`
2. **Additional AI Tools**: Add to `LegalAIAgent`
3. **UI Components**: Create in `frontend/src/components`
4. **API Endpoints**: Add to `main.py`

### Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend/Legal-Vision-app-for-law
npm test
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend/Legal-Vision-app-for-law
npm run build
# Deploy to Vercel via GitHub integration
```

### Backend (Heroku)
```bash
cd backend
# Add Procfile for Heroku
# Configure environment variables
# Deploy via Git integration
```

### Environment Setup
- Set production environment variables
- Configure CORS for production domains
- Set up MongoDB Atlas for production database
- Configure API rate limiting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-5 technology
- **AIML API** for model access
- **MongoDB** for database services
- **Vercel** for frontend hosting
- **FastAPI** for backend framework

---

## 📞 Support

- **Live Demo**: [https://legal-vision-app-for-law-flame.vercel.app/](https://legal-vision-app-for-law-flame.vercel.app/)
- **Frontend Repository**: [https://github.com/abdullahxyz85/Legal-Vision-app-for-law.git](https://github.com/abdullahxyz85/Legal-Vision-app-for-law.git)
- **Backend Repository**: [https://github.com/MUHAMMAD-AZEEM-AZAM/LegalVision-backend.git](https://github.com/MUHAMMAD-AZEEM-AZAM/LegalVision-backend.git)
- **Issues**: Create an issue in the respective repository

---

<div align="center">

**Built with ❤️ for the legal community**

*Empowering legal professionals and individuals with AI-driven legal assistance*

</div>



