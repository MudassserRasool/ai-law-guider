import fitz
import logging
from PIL import Image
import pytesseract
from typing import List, Dict, Any
from datetime import datetime

class DocumentProcessor:
    """Handles PDF, image, and text document processing"""

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF files"""
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            return text.strip()
        except Exception as e:
            logging.error(f"PDF extraction error: {e}")
            return ""

    def extract_text_from_image(self, file_path: str) -> str:
        """Extract text from images using OCR"""
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            logging.error(f"OCR extraction error: {e}")
            return ""


        return processed_docs