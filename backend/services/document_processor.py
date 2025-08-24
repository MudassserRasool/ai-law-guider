import os
import tempfile
import logging
from typing import Optional
from fastapi import UploadFile, HTTPException
import PyPDF2
from docx import Document
import io

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Process various document formats and extract text content"""
    
    def __init__(self):
        self.supported_formats = {
            'pdf': self._process_pdf,
            'docx': self._process_docx,
            'txt': self._process_txt
        }
    
    async def process_document(self, file: UploadFile) -> Optional[str]:
        """
        Process uploaded document and extract text
        
        Args:
            file: Uploaded file from FastAPI
            
        Returns:
            Extracted text content or None if processing failed
        """
        try:
            # Validate file
            if not file.filename:
                raise HTTPException(status_code=400, detail="No filename provided")
            
            # Get file extension
            file_extension = self._get_file_extension(file.filename)
            
            if file_extension not in self.supported_formats:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported file format: {file_extension}. Supported: {', '.join(self.supported_formats.keys())}"
                )
            
            # Read file content
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty file")
            
            # Process based on file type
            processor = self.supported_formats[file_extension]
            text = processor(content)
            
            if not text or not text.strip():
                raise HTTPException(status_code=400, detail="No text content found in document")
            
            # Clean and limit text
            cleaned_text = self._clean_text(text)
            limited_text = self._limit_words(cleaned_text, max_words=500)
            
            logger.info(f"Successfully processed {file.filename}: {len(limited_text.split())} words")
            return limited_text
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing document {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")
    
    def _get_file_extension(self, filename: str) -> str:
        """Extract file extension from filename"""
        return filename.lower().split('.')[-1] if '.' in filename else ''
    
    def _process_pdf(self, content: bytes) -> str:
        """Extract text from PDF content"""
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            return text.strip()
        except Exception as e:
            logger.error(f"PDF processing error: {e}")
            raise Exception(f"Failed to process PDF: {str(e)}")
    
    def _process_docx(self, content: bytes) -> str:
        """Extract text from DOCX content"""
        try:
            docx_file = io.BytesIO(content)
            doc = Document(docx_file)
            
            text = ""
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text += paragraph.text + "\n"
            
            return text.strip()
        except Exception as e:
            logger.error(f"DOCX processing error: {e}")
            raise Exception(f"Failed to process DOCX: {str(e)}")
    
    def _process_txt(self, content: bytes) -> str:
        """Extract text from TXT content"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    text = content.decode(encoding)
                    return text.strip()
                except UnicodeDecodeError:
                    continue
            
            raise Exception("Could not decode text file with any supported encoding")
        except Exception as e:
            logger.error(f"TXT processing error: {e}")
            raise Exception(f"Failed to process TXT: {str(e)}")
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove excessive spaces
            cleaned_line = ' '.join(line.split())
            if cleaned_line:
                cleaned_lines.append(cleaned_line)
        
        return '\n'.join(cleaned_lines)
    
    def _limit_words(self, text: str, max_words: int = 500) -> str:
        """Limit text to maximum number of words"""
        words = text.split()
        
        if len(words) <= max_words:
            return text
        
        # Truncate to max_words and add ellipsis
        limited_words = words[:max_words]
        return ' '.join(limited_words) + "..."
