import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  Plus,
  User,
} from 'lucide-react';
import React from 'react';
import { User as UserType } from '../hooks/useAuth';

interface SidebarProps {
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: Date;
  }>;
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  user: UserType | null;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-80'
      } bg-gray-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col h-full transition-all duration-300 ease-in-out relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-gray-700 transition-all duration-200 z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-3'
          } p-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all duration-200`}
          title={isCollapsed ? 'New chat' : ''}
        >
          <Plus size={18} />
          {!isCollapsed && <span className="font-medium">New chat</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          <div className="p-2">
            <div className="text-xs text-white/60 px-3 py-2 font-medium uppercase tracking-wider">
              Recent
            </div>

            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors group ${
                  currentConversationId === conversation.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {conversation.lastMessage.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-2">
          <div className="flex flex-col items-center gap-2 mt-4">
            {conversations.slice(0, 3).map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white/90'
                }`}
                title={conversation.title}
              >
                <MessageSquare size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/10 space-y-2">
        {!isCollapsed && (
          <button className="w-full flex items-center justify-between p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white/90 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
              <span className="text-sm">{user?.name || 'User Account'}</span>
            </div>
            <ChevronDown size={14} />
          </button>
        )}

        {isCollapsed && (
          <button
            className="w-full flex items-center justify-center p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white/90 transition-colors"
            title={user?.name || 'User Account'}
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
          </button>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-3'
          } p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white/90 transition-colors`}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut size={16} />
          {!isCollapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};
