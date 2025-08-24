# Legal AI Chat API

A FastAPI-based chat API that integrates with a Legal AI Agent to provide intelligent legal assistance. The API can process documents, images, and text queries while maintaining conversation history.

## Features

- 🤖 **Legal AI Agent Integration**: Powered by GPT-4 with specialized legal tools
- 📄 **Document Processing**: Supports PDF, DOCX, and TXT files
- 🖼️ **Image Processing**: OCR and AI vision for text extraction from images
- 💬 **Conversation History**: Maintains context across multiple interactions
- 📏 **Word Limit Enforcement**: Automatically limits document/image content to 500 words
- 🔍 **Legal Search Tools**: Web search for recent laws and vector search for established legal context

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
AIML_API_KEY=your_aiml_api_key_here
SEARCH_API_KEY=your_search_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

### 3. Install Tesseract OCR (for image processing)

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download and install from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)

### 4. Run the API

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```http
GET /health
```

### Chat with Document/Image
```http
POST /chat
Content-Type: multipart/form-data

message: "What are the legal implications of this contract?"
document: [optional PDF/DOCX/TXT file]
image: [optional JPG/PNG file]
```

### Text-only Chat
```http
POST /chat/text
Content-Type: application/json

{
  "message": "What are the requirements for forming a corporation?",
  "context": "Optional additional context"
}
```

### Clear Conversation History
```http
POST /chat/clear
```

## Usage Examples

### Using cURL

**Chat with document:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -F "message=What are the key terms in this contract?" \
  -F "document=@contract.pdf"
```

**Text-only chat:**
```bash
curl -X POST "http://localhost:8000/chat/text" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the legal requirements for starting a business?",
    "context": "I'm planning to start a tech company in California"
  }'
```

### Using Python

```python
import requests

# Chat with document
with open('contract.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/chat',
        files={'document': f},
        data={'message': 'Analyze this contract for potential issues'}
    )

# Text-only chat
response = requests.post(
    'http://localhost:8000/chat/text',
    json={
        'message': 'What are the tax implications of LLC vs Corporation?',
        'context': 'I run a small consulting business'
    }
)

print(response.json())
```

## Response Format

```json
{
  "response": "Based on the contract analysis...",
  "context_used": "Document content: [extracted text]",
  "word_count": 245
}
```

## File Limitations

- **Documents**: PDF, DOCX, TXT files up to 500 words
- **Images**: JPG, PNG, BMP, TIFF, WEBP files up to 10MB
- **Text**: Maximum 500 words for context

## Error Handling

The API returns appropriate HTTP status codes:
- `400`: Bad request (invalid file format, content too large)
- `500`: Internal server error
- `503`: Service unavailable (agent not initialized)

## Development

### Project Structure
```
├── main.py                 # FastAPI application
├── LegalAIAgent.py         # Legal AI Agent implementation
├── VectorStore.py          # MongoDB vector store
├── WebSearchAgent.py       # Web search functionality
├── services/
│   ├── Client.py          # Centralized AI client
│   ├── document_processor.py  # Document processing
│   └── image_processor.py     # Image processing
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

### Adding New Features

1. **New Document Formats**: Add processors to `DocumentProcessor`
2. **New Image Formats**: Update `supported_formats` in `ImageProcessor`
3. **New Tools**: Extend `LegalAIAgent` with additional tools

## License

This project is for educational and development purposes.
