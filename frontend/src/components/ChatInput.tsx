import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, X, FileText, Image } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showUploadPopover, setShowUploadPopover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowUploadPopover(false);
      }
    };

    if (showUploadPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadPopover]);

  // File validation function for images
  const validateImageFile = async (file: File): Promise<boolean> => {
    const allowedImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'
    ];
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError(`File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      return false;
    }
    
    if (!allowedImageTypes.includes(file.type)) {
      setFileError('Only images (JPEG, PNG, GIF, etc.) are allowed.');
      return false;
    }
    
    setFileError(null);
    return true;
  };

  // File validation function for PDFs
  const validatePdfFile = async (file: File): Promise<boolean> => {
    // Check file type
    if (file.type !== 'application/pdf') {
      setFileError('Only PDF documents are allowed.');
      return false;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError(`File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      return false;
    }
    
    // Check page count using heuristic
    try {
      const estimatedPages = Math.ceil(file.size / 102400); // 100KB per page estimate
      
      if (estimatedPages > 30) {
        setFileError('PDF documents appear to exceed 30 pages. Please upload a smaller document.');
        return false;
      }
    } catch (error) {
      console.error('Error checking PDF:', error);
      setFileError('Could not validate PDF document. Please try another file.');
      return false;
    }
    
    setFileError(null);
    return true;
  };

  // File validation function
  const validateFile = async (file: File): Promise<boolean> => {
    // Check file type
    const allowedImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'
    ];
    const isPdf = file.type === 'application/pdf';
    const isImage = allowedImageTypes.includes(file.type);
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError(`File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      return false;
    }
    
    if (!isPdf && !isImage) {
      setFileError('Only PDF documents and images (JPEG, PNG, etc.) are allowed.');
      return false;
    }
    
    // For PDFs, check page count
    if (isPdf) {
      try {
        // Simpler approach: we'll assume PDFs are valid for now
        // In a production environment, you'd want to integrate with a server-side
        // PDF validation service or use a different client-side approach
        
        // For now, let's use a basic heuristic: PDF size / 100KB to estimate pages
        // This is a very rough approximation but avoids the PDF.js integration issues
        const estimatedPages = Math.ceil(file.size / 102400); // 100KB per page estimate
        
        if (estimatedPages > 30) {
          setFileError('PDF documents appear to exceed 30 pages. Please upload a smaller document.');
          return false;
        }
      } catch (error) {
        console.error('Error checking PDF:', error);
        setFileError('Could not validate PDF document. Please try another file.');
        return false;
      }
    }
    
    setFileError(null);
    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isValid = await validateFile(file);
    if (isValid) {
      setSelectedFile(file);
      setFileError(null);
      setShowUploadPopover(false);
    } else {
      e.target.value = '';
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isValid = await validateImageFile(file);
    if (isValid) {
      setSelectedFile(file);
      setFileError(null);
      setShowUploadPopover(false);
    } else {
      e.target.value = '';
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isValid = await validatePdfFile(file);
    if (isValid) {
      setSelectedFile(file);
      setFileError(null);
      setShowUploadPopover(false);
    } else {
      e.target.value = '';
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isLoading) {
      onSendMessage(message.trim(), selectedFile || undefined);
      setMessage('');
      clearSelectedFile();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="relative">
        {fileError && (
          <div className="mb-2 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
            {fileError}
          </div>
        )}
        
        {selectedFile && (
          <div className="mb-2 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              <div className="text-white/90 text-sm truncate max-w-[200px]">
                {selectedFile.name}
              </div>
              <div className="text-white/50 text-xs">
                ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="p-1 rounded-full bg-gray-800/50 text-white/60 hover:text-white/90 hover:bg-gray-700/50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="relative rounded-xl bg-white/5 backdrop-blur-sm border border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 p-[1px] shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="rounded-xl bg-gray-900/90 backdrop-blur-sm">
            <div className="flex items-end gap-3 p-4">
              <div className="relative" ref={popoverRef}>
                {/* Hidden file inputs */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={imageInputRef}
                />
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handlePdfSelect}
                  ref={pdfInputRef}
                />
                
                {/* Plus button */}
                <button
                  type="button"
                  onClick={() => setShowUploadPopover(!showUploadPopover)}
                  className="flex-shrink-0 p-2 rounded-lg bg-blue-500/20 text-white/80 hover:text-white hover:bg-blue-500/30 hover:scale-110 active:scale-95 transition-all relative"
                  title="Upload file"
                >
                  <Plus size={18} />
                </button>

                {/* Upload popover */}
                {showUploadPopover && (
                  <div className="absolute bottom-full left-0 mb-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg p-2 shadow-xl z-10 min-w-[120px]">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          imageInputRef.current?.click();
                          setShowUploadPopover(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-md text-white/80 hover:text-white hover:bg-blue-500/20 transition-colors text-sm"
                      >
                        <Image size={16} />
                        <span>Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          pdfInputRef.current?.click();
                          setShowUploadPopover(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-md text-white/80 hover:text-white hover:bg-red-500/20 transition-colors text-sm"
                      >
                        <FileText size={16} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message ChatGPT..."
                  rows={1}
                  className="w-full bg-transparent text-white placeholder-white/50 resize-none focus:outline-none max-h-32 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
                  style={{
                    minHeight: '24px',
                    height: 'auto',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={(!message.trim() && !selectedFile) || isLoading}
                  className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
