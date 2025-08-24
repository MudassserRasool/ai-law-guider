import os
import logging
from typing import Optional
from fastapi import UploadFile, HTTPException
import io
from PIL import Image
import pytesseract
from services.Client import get_client

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Process images and extract text content using OCR and AI vision"""
    
    def __init__(self):
        self.supported_formats = {'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'}
        self.max_file_size = 10 * 1024 * 1024  # 10MB
    
    async def process_image(self, file: UploadFile) -> Optional[str]:
        """
        Process uploaded image and extract text
        
        Args:
            file: Uploaded image file from FastAPI
            
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
                    detail=f"Unsupported image format: {file_extension}. Supported: {', '.join(self.supported_formats)}"
                )
            
            # Read file content
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty file")
            
            # Check file size
            if len(content) > self.max_file_size:
                raise HTTPException(
                    status_code=400, 
                    detail=f"File too large ({len(content) / 1024 / 1024:.1f}MB). Maximum allowed: {self.max_file_size / 1024 / 1024}MB"
                )
            
            # Process image
            text = await self._extract_text_from_image(content)
            
            if not text or not text.strip():
                raise HTTPException(status_code=400, detail="No text content found in image")
            
            # Clean and limit text
            cleaned_text = self._clean_text(text)
            limited_text = self._limit_words(cleaned_text, max_words=500)
            
            logger.info(f"Successfully processed {file.filename}: {len(limited_text.split())} words")
            return limited_text
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing image {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")
    
    def _get_file_extension(self, filename: str) -> str:
        """Extract file extension from filename"""
        return filename.lower().split('.')[-1] if '.' in filename else ''
    
    async def _extract_text_from_image(self, image_content: bytes) -> str:
        """Extract text from image using OCR and AI vision"""
        try:
            # First try OCR
            ocr_text = self._extract_text_ocr(image_content)
            
            # If OCR fails or returns minimal text, try AI vision
            if not ocr_text or len(ocr_text.strip()) < 10:
                logger.info("OCR returned minimal text, trying AI vision")
                ai_text = await self._extract_text_ai_vision(image_content)
                
                if ai_text and len(ai_text.strip()) > len(ocr_text.strip()):
                    return ai_text
            
            return ocr_text
            
        except Exception as e:
            logger.error(f"Text extraction error: {e}")
            raise Exception(f"Failed to extract text from image: {str(e)}")
    
    def _extract_text_ocr(self, image_content: bytes) -> str:
        """Extract text using OCR (Tesseract)"""
        try:
            # Open image
            image = Image.open(io.BytesIO(image_content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(image)
            
            return text.strip()
            
        except Exception as e:
            logger.error(f"OCR error: {e}")
            return ""
    
    async def _extract_text_ai_vision(self, image_content: bytes) -> str:
        """Extract text using AI vision (OpenAI GPT-4 Vision)"""
        try:
            client = get_client()
            
            # Convert image to base64
            import base64
            image_base64 = base64.b64encode(image_content).decode('utf-8')
            
            # Create vision prompt
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract all text content from this image. If there are legal documents, contracts, or forms, extract all text including headers, body text, and any fine print. Return only the extracted text without any additional commentary."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
            
            # Call AI vision API
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # Use vision-capable model
                messages=messages,
                max_tokens=1000,
                temperature=0.1
            )
            
            text = response.choices[0].message.content
            return text.strip() if text else ""
            
        except Exception as e:
            logger.error(f"AI vision error: {e}")
            return ""
    
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
