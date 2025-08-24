import React from 'react';
import { CheckCircle, FileText, Users, Lightbulb, ArrowRight, AlertTriangle, Clock, Shield } from 'lucide-react';

interface StructuredResponseData {
  answer?: string;
  legal_basis?: string;
  next_steps?: string;
  documents_needed?: string;
  resources?: string;
  alternatives?: string;
  urgency?: string;
  disclaimer?: string;
}

interface StructuredResponseProps {
  data: StructuredResponseData;
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'answer':
      return <CheckCircle size={20} className="text-green-400" />;
    case 'legal_basis':
      return <Shield size={20} className="text-blue-400" />;
    case 'next_steps':
      return <ArrowRight size={20} className="text-blue-400" />;
    case 'documents_needed':
      return <FileText size={20} className="text-purple-400" />;
    case 'resources':
      return <Users size={20} className="text-orange-400" />;
    case 'alternatives':
      return <Lightbulb size={20} className="text-yellow-400" />;
    case 'urgency':
      return <Clock size={20} className="text-red-400" />;
    case 'disclaimer':
      return <AlertTriangle size={20} className="text-gray-400" />;
    default:
      return <CheckCircle size={20} className="text-gray-400" />;
  }
};

const getColorForCategory = (category: string) => {
  switch (category) {
    case 'answer':
      return 'border-green-400/30 bg-green-400/10';
    case 'legal_basis':
      return 'border-blue-400/30 bg-blue-400/10';
    case 'next_steps':
      return 'border-blue-400/30 bg-blue-400/10';
    case 'documents_needed':
      return 'border-purple-400/30 bg-purple-400/10';
    case 'resources':
      return 'border-orange-400/30 bg-orange-400/10';
    case 'alternatives':
      return 'border-yellow-400/30 bg-yellow-400/10';
    case 'urgency':
      return 'border-red-400/30 bg-red-400/10';
    case 'disclaimer':
      return 'border-gray-400/30 bg-gray-400/10';
    default:
      return 'border-gray-400/30 bg-gray-400/10';
  }
};

const getTitleForCategory = (category: string) => {
  switch (category) {
    case 'answer':
      return 'Answer';
    case 'legal_basis':
      return 'Legal Basis';
    case 'next_steps':
      return 'Next Steps';
    case 'documents_needed':
      return 'Documents Needed';
    case 'resources':
      return 'Resources';
    case 'alternatives':
      return 'Alternatives';
    case 'urgency':
      return 'Urgency';
    case 'disclaimer':
      return 'Disclaimer';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
  }
};

export const StructuredResponse: React.FC<StructuredResponseProps> = ({ data }) => {
  const categories = Object.entries(data).filter(([_, value]) => value && value.trim() !== '');

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="border-b border-white/20 pb-2 mb-3">
        <h3 className="text-white font-semibold text-sm">Structured Analysis</h3>
      </div>
      {categories.map(([category, value]) => (
        <div
          key={category}
          className={`p-4 rounded-xl border backdrop-blur-sm ${getColorForCategory(category)} hover:scale-[1.02] transition-all duration-200`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIconForCategory(category)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-2 text-sm">
                {getTitleForCategory(category)}
              </h4>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};