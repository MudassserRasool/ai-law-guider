from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import logging
import asyncio
import json
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from pymongo import MongoClient
from bson import ObjectId

# Import our custom modules
from LegalAIAgent import LegalAIAgent
from services.document_processor import DocumentProcessor
from services.image_processor import ImageProcessor

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Legal AI Chat API",
    description="API for legal document analysis and chat with AI agent",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
document_processor = DocumentProcessor()
image_processor = ImageProcessor()

# Database setup
MONGODB_URI = os.getenv("MONGODB_URI")
mongo_client: Optional[MongoClient] = None
db = None
if MONGODB_URI:
    try:
        mongo_client = MongoClient(MONGODB_URI)
        db = mongo_client.get_database()
        # Ensure indexes
        db.users.create_index("email", unique=True)
        db.chats.create_index([("user_id", 1), ("updated_at", -1)])
        db.messages.create_index([("chat_id", 1), ("timestamp", 1)])
        print("MongoDB connected successfully")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")

# Auth config
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))  # default 7 days

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRES_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def get_current_user(authorization: Optional[str] = None) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])  # serialize id
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Serialization helpers
def serialize_chat(chat: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(chat["_id"]),
        "title": chat.get("title", "Untitled"),
        "userId": str(chat["user_id"]) if isinstance(chat.get("user_id"), ObjectId) else chat.get("user_id"),
        "createdAt": chat.get("created_at"),
        "updatedAt": chat.get("updated_at"),
    }

def serialize_message(msg: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(msg["_id"]),
        "chatId": str(msg["chat_id"]) if isinstance(msg.get("chat_id"), ObjectId) else msg.get("chat_id"),
        "userId": str(msg["user_id"]) if isinstance(msg.get("user_id"), ObjectId) else msg.get("user_id"),
        "role": msg.get("role"),
        "content": msg.get("content"),
        "timestamp": msg.get("timestamp"),
        "file": msg.get("file"),
        "structured_response": msg.get("structured_response"),
    }

# Initialize Legal AI Agent
try:
    search_api_key = os.getenv("SEARCH_API_KEY")
    mongo_connection_string = os.getenv("MONGODB_URI")
    
    if not search_api_key or not mongo_connection_string:
        raise ValueError("Missing required environment variables")
    
    legal_agent = LegalAIAgent(
        search_api_key=search_api_key,
        mongo_connection_string=mongo_connection_string
    )
    logger.info("Legal AI Agent initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Legal AI Agent: {e}")
    legal_agent = None

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool = True
    response: str
    document_text: Optional[str] = None
    image_text: Optional[str] = None
    prompt: str
    word_count: Optional[int] = None
    agent_actions: Optional[list] = None
    chat_id: Optional[str] = None

class AgentAction(BaseModel):
    action: str
    description: str
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    agent_ready: bool

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str

class AuthResponse(BaseModel):
    success: bool = True
    token: str
    user: UserOut

class ChatSummary(BaseModel):
    id: str
    title: str
    updatedAt: str

class HistoryResponse(BaseModel):
    success: bool = True
    chats: List[ChatSummary]

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and agent status"""
    return HealthResponse(
        status="healthy",
        agent_ready=legal_agent is not None
    )

# Auth endpoints
@app.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        existing = db.users.find_one({"email": payload.email.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user_doc = {
            "name": payload.name.strip(),
            "email": payload.email.lower().strip(),
            "password": hash_password(payload.password),
            "created_at": datetime.utcnow().isoformat(),
        }
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        token = create_access_token({"sub": user_id})
        return AuthResponse(
            token=token,
            user=UserOut(id=user_id, name=user_doc["name"], email=user_doc["email"])
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Register error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        user = db.users.find_one({"email": payload.email.lower().strip()})
        if not user or not verify_password(payload.password, user.get("password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user_id = str(user["_id"])
        token = create_access_token({"sub": user_id})
        return AuthResponse(
            token=token,
            user=UserOut(id=user_id, name=user.get("name", ""), email=user.get("email", ""))
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

# Real-time agent actions stream
@app.get("/chat/actions/stream")
async def stream_agent_actions():
    """Stream agent actions in real-time using Server-Sent Events"""
    
    async def event_stream():
        while True:
            if legal_agent:
                actions = legal_agent.get_agent_actions()
                if actions:
                    # Send latest actions
                    yield f"data: {json.dumps(actions)}\n\n"
            
            await asyncio.sleep(1)  # Check every second
    
    return StreamingResponse(
        event_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )

# Unified chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    message: str = Form(...),
    document: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    context: Optional[str] = Form(None),
    chat_id: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None)
):
    """
    Unified chat endpoint with Legal AI Agent
    
    - message: Text message from user (required)
    - document: Optional document file (PDF, DOCX, TXT)
    - image: Optional image file (JPG, PNG, BMP, TIFF, WEBP)
    - context: Optional additional text context
    """
    
    # Auth
    user = get_current_user(authorization)

    if not legal_agent:
        raise HTTPException(status_code=503, detail="Legal AI Agent not available")
    
    try:
        # Clear previous agent actions
        legal_agent.clear_agent_actions()
        
        document_text = None
        image_text = None
        total_word_count = 0
        
        # Process document if provided
        if document:
            logger.info(f"Processing document: {document.filename}")
            document_text = await document_processor.process_document(document)
            if document_text:
                total_word_count += len(document_text.split())
        
        # Process image if provided
        if image:
            logger.info(f"Processing image: {image.filename}")
            image_text = await image_processor.process_image(image)
            if image_text:
                total_word_count += len(image_text.split())
        
        # Add context word count if provided
        if context:
            total_word_count += len(context.split())
        
        # Check word limit
        if total_word_count > 500:
            raise HTTPException(
                status_code=400, 
                detail=f"Total content too large ({total_word_count} words). Maximum allowed: 500 words."
            )
        
        # Build final prompt
        prompt_parts = []
        
        if document_text:
            prompt_parts.append(f"Document content:\n{document_text}")
        
        if image_text:
            prompt_parts.append(f"Image content:\n{image_text}")
        
        if context:
            prompt_parts.append(f"Additional context:\n{context}")
        
        if prompt_parts:
            separator = '\n\n'
            final_prompt = f"{separator.join(prompt_parts)}\n\nUser question: {message}"
        else:
            final_prompt = message
        
        # Persist conversation: create or use existing chat
        if db is None:
            raise HTTPException(status_code=503, detail="Database not available")

        chat_obj_id: Optional[ObjectId] = None
        if chat_id:
            try:
                chat_obj_id = ObjectId(chat_id)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid chat_id")
            chat_doc = db.chats.find_one({"_id": chat_obj_id, "user_id": user["_id"]})
            if not chat_doc:
                raise HTTPException(status_code=404, detail="Chat not found")
        else:
            # Create new chat
            title = (message[:50] + ("..." if len(message) > 50 else "")) or "New conversation"
            chat_doc = {
                "user_id": user["_id"],
                "title": title,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            result = db.chats.insert_one(chat_doc)
            chat_obj_id = result.inserted_id

        # Insert user message
        user_msg_doc = {
            "chat_id": chat_obj_id,
            "user_id": user["_id"],
            "role": "user",
            "content": message,
            "timestamp": datetime.utcnow().isoformat(),
        }
        db.messages.insert_one(user_msg_doc)

        # Get response from Legal AI Agent
        logger.info("Sending request to Legal AI Agent")
        response = legal_agent.chat_with_agent(final_prompt)
        
        # Insert assistant message
        assistant_msg_doc = {
            "chat_id": chat_obj_id,
            "user_id": user["_id"],
            "role": "assistant",
            "content": response,
            "timestamp": datetime.utcnow().isoformat(),
        }
        db.messages.insert_one(assistant_msg_doc)

        # Update chat timestamp and title if new
        db.chats.update_one({"_id": chat_obj_id}, {"$set": {"updated_at": datetime.utcnow().isoformat()}})

        return ChatResponse(
            response=response,
            document_text=document_text,
            image_text=image_text,
            prompt=final_prompt,
            word_count=total_word_count if total_word_count > 0 else None,
            agent_actions=legal_agent.get_agent_actions(),
            chat_id=str(chat_obj_id)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Clear conversation history
@app.post("/chat/clear")
async def clear_conversation():
    """Clear the conversation history"""
    
    if not legal_agent:
        raise HTTPException(status_code=503, detail="Legal AI Agent not available")
    
    try:
        legal_agent.clear_history()
        return {"message": "Conversation history cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing conversation: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# History endpoints
@app.get("/history", response_model=HistoryResponse)
async def get_history(authorization: Optional[str] = Header(None)):
    user = get_current_user(authorization)
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    chats = list(db.chats.find({"user_id": user["_id"]}).sort("updated_at", -1))
    summaries = [
        ChatSummary(
            id=str(c["_id"]),
            title=c.get("title", "Untitled"),
            updatedAt=c.get("updated_at", "")
        ) for c in chats
    ]
    return HistoryResponse(chats=summaries)

@app.get("/history/{chat_id}")
async def get_chat_by_id(chat_id: str, authorization: Optional[str] = Header(None)):
    user = get_current_user(authorization)
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        chat_obj_id = ObjectId(chat_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid chat_id")

    chat = db.chats.find_one({"_id": chat_obj_id, "user_id": user["_id"]})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    msgs = list(db.messages.find({"chat_id": chat_obj_id}).sort("timestamp", 1))
    return {
        "success": True,
        "chat": {
            "id": str(chat["_id"]),
            "title": chat.get("title", "Untitled"),
            "messages": [serialize_message(m) for m in msgs],
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
