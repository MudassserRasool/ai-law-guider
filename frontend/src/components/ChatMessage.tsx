import { Bot, FileText, User } from 'lucide-react';
import React from 'react';
import { StructuredResponse } from './StructuredResponse';

const renderContent = (content: any) => {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2); // Pretty print JSON
  } catch (error) {
    // If it's not JSON, return as plain text
    return content;
  }
};

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    structured_response?: any;
    file?: {
      name: string;
      size: number;
      type: string;
      url: string;
    };
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Parse structured response if it exists
  let structuredData = null;
  let responseText = message.content;

  if (!isUser) {
    try {
      // First try to parse the content as JSON to extract structured_response
      const parsedContent = JSON.parse(message.content);
      
      // Extract the text content
      if (parsedContent.text) {
        responseText = parsedContent.text;
      }
      
      // Extract structured response if available
      if (parsedContent.structured_response) {
        structuredData = parsedContent.structured_response;
      }
    } catch (error) {
      // If content is not JSON, check if structured_response is directly available
      if (message.structured_response) {
        try {
          structuredData = typeof message.structured_response === 'string'
            ? JSON.parse(message.structured_response)
            : message.structured_response;
        } catch (parseError) {
          console.error('Error parsing structured response:', parseError);
        }
      }
    }
  }

  return (
    <div
      className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`${isUser ? 'max-w-[90%]' : 'max-w-[90%]'} ${
          !isUser ? 'order-2' : 'order-1'
        }`}
      >
        <div
          className={`p-4 rounded-2xl shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
              : 'bg-gray-900/90 backdrop-blur-sm text-white rounded-bl-md border border-white/10'
          }`}
        >
          {!isUser && structuredData ? (
            <div className="space-y-4">
              {responseText && (
                <div className="leading-relaxed whitespace-pre-wrap break-words mb-4">
                  {responseText}
                </div>
              )}
              <StructuredResponse data={structuredData} />
            </div>
          ) : (
            <div className="space-y-4">
              {responseText && (
                <div className="leading-relaxed whitespace-pre-wrap break-words">
                  {responseText}
                </div>
              )}

              {message.file && (
                <div className="mt-3 border border-white/10 rounded-lg overflow-hidden">
                  {message.file.type.startsWith('image/') ? (
                    <div className="relative">
                      <img
                        src={message.file.url}
                        alt={message.file.name}
                        className="w-full h-auto max-h-64 object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-3 py-2 text-xs text-white/80 flex justify-between items-center">
                        <span className="truncate max-w-[200px]">
                          {message.file.name}
                        </span>
                        <span>
                          {(message.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white/5">
                      <FileText size={24} className="text-purple-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">
                          {message.file.name}
                        </div>
                        <div className="text-xs text-white/60">
                          {message.file.type === 'application/pdf'
                            ? 'PDF Document'
                            : 'Document'}{' '}
                          • {(message.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <a
                        href={message.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1 px-3 bg-purple-500/30 hover:bg-purple-500/50 rounded-full text-white/90 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className={`text-xs text-white/40 mt-1 px-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};
