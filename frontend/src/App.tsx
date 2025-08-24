import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { useGetChatByIdQuery } from './redux/api/features/chat/chatApi';
import { useGetHistoryQuery } from './redux/api/features/history/historyApi';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  // Handle login success - properly navigate after authentication
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // After successful login, navigate to /app
      navigate('/app');
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.data.detail);
    }
  };
  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (error) {
      console.error('Register failed:', error);
      alert(error.data.detail);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          isAuthenticated ? (
            <ChatApplication />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/app/c/:chatId"
        element={
          isAuthenticated ? (
            <ChatApplication />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/app" replace />
          ) : (
            <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
          )
        }
      />
      {/* Add a catch-all redirect to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ChatApplication() {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { chatId } = useParams();
  const {
    conversations,
    currentConversation,
    currentConversationId,
    isLoading,
    sendMessage,
    newConversation,
    selectConversation,
    hydrateConversation,
  } = useChat(user?.email, chatId);
  const navigate = useNavigate();
  const { data: historyData } = useGetHistoryQuery(undefined, { skip: !user });
  const { data: chatData, isFetching: isChatFetching } = useGetChatByIdQuery(
    chatId as string,
    { skip: !chatId }
  );

  // Push chatId to URL when it changes
  useEffect(() => {
    if (currentConversationId) {
      navigate(`/app/c/${currentConversationId}`, { replace: false });
    }
  }, [currentConversationId]);

  // When route chatId changes, select it
  useEffect(() => {
    if (chatId) {
      selectConversation(chatId);
    }
  }, [chatId]);
  const { refetch: refetchHistory } = useGetHistoryQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  // Hydrate conversation when chat data loads
  useEffect(() => {
    if (chatData?.chat) {
      const mapped = {
        id: chatData.chat.id,
        title: chatData.chat.title,
        messages: (chatData.chat.messages || []).map((m: any) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          timestamp: new Date(m.timestamp),
          structured_response: m.structured_response,
        })),
      };
      hydrateConversation(mapped.id, mapped.title, mapped.messages);
      refetchHistory();
    }
  }, [chatData]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollContainer && scrollContainer.scrollTop > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-green-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 h-full flex">
        <Sidebar
          conversations={(historyData?.chats || []).map((c: any) => ({
            id: c.id,
            title: c.title,
            lastMessage: new Date(c.updatedAt),
          }))}
          currentConversationId={currentConversationId}
          onNewConversation={newConversation}
          onSelectConversation={selectConversation}
          user={user}
          onLogout={logout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
            {!currentConversation ? (
              <WelcomeScreen onSendMessage={sendMessage} />
            ) : (
              <div className="max-w-4xl mx-auto w-full">
                {currentConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {(isLoading || isChatFetching) && (
                  <div className="flex gap-3 p-4 justify-end">
                    <div className="max-w-[70%]">
                      <div className="p-4 rounded-2xl rounded-br-md bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className="flex items-center gap-2 text-white/60">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-200"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-400"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={() => {
                const scrollContainer = document.querySelector(
                  '.flex-1.overflow-y-auto'
                );
                if (scrollContainer) {
                  scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="fixed bottom-24 right-8 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

export default App;
