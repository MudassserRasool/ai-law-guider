import React from 'react';
import { Shield, FileText, Scale, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSendMessage }) => {
  const suggestions = [
    {
      icon: <Shield size={20} />,
      title: "Explain tenant rights",
      subtitle: "in California"
    },
    {
      icon: <FileText size={20} />,
      title: "Help with eviction notice",
      subtitle: "review my situation"
    },
    {
      icon: <Scale size={20} />,
      title: "Analyze small claims case",
      subtitle: "for contract dispute"
    },
    {
      icon: <BookOpen size={20} />,
      title: "Explain legal document",
      subtitle: "for non-disclosure agreement"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to LegalVision
        </h1>
        <p className="text-white/60 text-lg">
          Your AI Civic Copilot for smart law & policy assistance
        </p>
      </div>

      <div className="w-full max-w-3xl mb-8 px-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3 flex items-center">
            <Shield className="mr-2 text-blue-400" size={18} />
            How LegalVision Can Help
          </h2>
          <p className="text-white/70 mb-4">
            LegalVision provides guidance on various legal matters, with a focus on consumer rights, housing issues, 
            employment disputes, and navigating government services. Upload documents or describe your situation to get started.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-white/60">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              <span>Understanding legal documents</span>
            </div>
            <div className="flex items-center text-white/60">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
              <span>Navigating housing disputes</span>
            </div>
            <div className="flex items-center text-white/60">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
              <span>Consumer rights protection</span>
            </div>
            <div className="flex items-center text-white/60">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
              <span>Official form preparation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSendMessage(`${suggestion.title} ${suggestion.subtitle}`)}
            className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left group hover:scale-[1.02]"
          >
            <div className="flex items-start gap-3">
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                {suggestion.icon}
              </div>
              <div>
                <div className="text-white font-medium mb-1">
                  {suggestion.title}
                </div>
                <div className="text-white/60 text-sm">
                  {suggestion.subtitle}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl mt-8 px-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3 flex items-center">
            <FileText className="mr-2 text-blue-400" size={18} />
            Upload Legal Documents
          </h2>
          <p className="text-white/70 mb-4">
            You can upload legal documents for analysis. LegalVision can review contracts, 
            notices, letters, and other legal documents to help you understand them.
          </p>
          <div className="bg-white/5 rounded-lg p-3 mb-2 border border-dashed border-white/20">
            <div className="flex items-center text-white/60 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs">1</span>
              </div>
              <span>Click the paper clip icon in the chat input</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 mb-2 border border-dashed border-white/20">
            <div className="flex items-center text-white/60 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs">2</span>
              </div>
              <span>Select your PDF or document file (max 10MB)</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-dashed border-white/20">
            <div className="flex items-center text-white/60 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs">3</span>
              </div>
              <span>Ask specific questions about the document</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-6 text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Up-to-date legal information</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Clear guidance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Document assistance</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 max-w-2xl mx-auto text-center">
        <p className="text-white/40 text-xs italic">
          Disclaimer: LegalVision provides information and assistance but does not replace professional legal advice. 
          The guidance provided is for informational purposes only and may not apply to all situations.
        </p>
      </div>
    </div>
  );
};