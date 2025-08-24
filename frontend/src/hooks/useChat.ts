import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useSendMessageMutation } from '../redux/api/features/chat/chatApi';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  structured_response?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  file?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: Date;
}

const CONVERSATIONS_STORAGE_KEY = 'legal-vision-conversations';
const CURRENT_CONVERSATION_STORAGE_KEY = 'legal-vision-current-conversation';

export const useChat = (userEmail?: string, routeChatId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sendMessageMutation] = useSendMessageMutation();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  // Generate user-specific storage keys
  const getUserStorageKey = useCallback(
    (key: string) => (userEmail ? `${key}-${userEmail}` : key),
    [userEmail]
  );

  // Helper function to convert stored conversation data back to proper types
  const convertStoredConversation = (conv: Conversation): Conversation => {
    const messagesWithDates = conv.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    return {
      ...conv,
      lastMessage: new Date(conv.lastMessage),
      messages: messagesWithDates,
    };
  };

  // Initialize conversations from localStorage
  useEffect(() => {
    const initializeChat = () => {
      try {
        // Only initialize if we have a user email
        if (!userEmail) {
          setIsInitialized(true);
          return;
        }

        const userConversationsKey = getUserStorageKey(
          CONVERSATIONS_STORAGE_KEY
        );
        const userCurrentConversationKey = getUserStorageKey(
          CURRENT_CONVERSATION_STORAGE_KEY
        );

        // Load conversations for this specific user
        const savedConversations = localStorage.getItem(userConversationsKey);
        if (savedConversations) {
          const parsedConversations = JSON.parse(
            savedConversations
          ) as Conversation[];
          const conversationsWithDates = parsedConversations.map(
            convertStoredConversation
          );
          setConversations(conversationsWithDates);
        }

        // Load current conversation ID for this user
        const savedCurrentId = localStorage.getItem(userCurrentConversationKey);
        if (savedCurrentId) {
          setCurrentConversationId(savedCurrentId);
        }
      } catch (error) {
        console.error('Error loading conversations from localStorage:', error);
        // Clear corrupted data for this user
        if (userEmail) {
          localStorage.removeItem(getUserStorageKey(CONVERSATIONS_STORAGE_KEY));
          localStorage.removeItem(
            getUserStorageKey(CURRENT_CONVERSATION_STORAGE_KEY)
          );
        }
      }
      setIsInitialized(true);
    };

    initializeChat();
  }, [userEmail, getUserStorageKey]);

  // If route contains chatId, load it from backend
  useEffect(() => {
    if (routeChatId) {
      setCurrentConversationId(routeChatId);
    }
  }, [routeChatId]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && userEmail) {
      const userConversationsKey = getUserStorageKey(CONVERSATIONS_STORAGE_KEY);
      localStorage.setItem(userConversationsKey, JSON.stringify(conversations));
    }
  }, [conversations, isInitialized, userEmail, getUserStorageKey]);

  // Save current conversation ID whenever it changes
  useEffect(() => {
    if (isInitialized && userEmail) {
      const userCurrentConversationKey = getUserStorageKey(
        CURRENT_CONVERSATION_STORAGE_KEY
      );
      if (currentConversationId) {
        localStorage.setItem(userCurrentConversationKey, currentConversationId);
      } else {
        localStorage.removeItem(userCurrentConversationKey);
      }
    }
  }, [currentConversationId, isInitialized, userEmail, getUserStorageKey]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const sendMessage = useCallback(
    async (content: string, file?: File) => {
      if (!content.trim() && !file) return;

      const messageId = generateId();
      const timestamp = new Date();

      // Create new conversation if none exists
      if (!currentConversationId) {
        const conversationId = generateId();
        const newConversation: Conversation = {
          id: conversationId,
          title:
            content.slice(0, 50) + (content.length > 50 ? '...' : '') ||
            (file ? file.name : 'New conversation'),
          messages: [],
          lastMessage: timestamp,
        };

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(conversationId);
      }

      let fileData;
      if (file) {
        // Create object URL for the file to display it
        const fileUrl = URL.createObjectURL(file);
        fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
        };
      }

      // Get current conversation to extract message history BEFORE adding the new message
      const targetConversationId =
        currentConversationId || conversations[0]?.id;
      const targetConversation = conversations.find(
        (conv) => conv.id === targetConversationId
      );

      // Get last 10 messages from current conversation (before adding the new user message)
      const existingMessages = targetConversation?.messages || [];
      const last10Messages = existingMessages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      // Add user message
      const userMessage: Message = {
        id: messageId,
        content,
        role: 'user',
        timestamp,
        file: fileData,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === (currentConversationId || prev[0]?.id)
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                lastMessage: timestamp,
              }
            : conv
        )
      );

      setIsLoading(true);

      try {
        // Build form data
        const fd = new FormData();
        fd.append('message', content);

        // Add message history as JSON string
        fd.append('message_history', JSON.stringify(last10Messages));

        if (file)
          fd.append(
            file.type === 'application/pdf' ? 'document' : 'image',
            file
          );
        const activeId = currentConversationId || undefined;
        if (activeId) fd.append('chat_id', activeId);

        const res = await sendMessageMutation(fd).unwrap();
        const assistantMessage: Message = {
          id: generateId(),
          content: res.response,
          role: 'assistant',
          timestamp: new Date(),
        };

        // Set chat id if newly created
        const effectiveChatId = activeId || res.chat_id || res.chatId;
        if (!activeId && effectiveChatId) {
          // Promote the newly created conversation to use backend id
          setConversations((prev) => {
            const [first, ...rest] = prev;
            const updatedFirst = { ...first, id: effectiveChatId };
            return [
              {
                ...updatedFirst,
                messages: [...updatedFirst.messages, assistantMessage],
                lastMessage: new Date(),
              },
              ...rest,
            ];
          });
          setCurrentConversationId(effectiveChatId);
        } else {
          const targetId =
            effectiveChatId || currentConversationId || conversations[0]?.id;
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === targetId
                ? {
                    ...conv,
                    messages: [...conv.messages, assistantMessage],
                    lastMessage: new Date(),
                  }
                : conv
            )
          );
        }
      } catch (error) {
        console.error('Error generating response:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, conversations, sendMessageMutation]
  );

  const newConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const hydrateConversation = useCallback(
    (id: string, title: string, messages: Message[]) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === id);
        if (existing) return prev;
        const conv: Conversation = {
          id,
          title,
          messages,
          lastMessage: messages[messages.length - 1]?.timestamp || new Date(),
        };
        return [conv, ...prev];
      });
      setCurrentConversationId(id);
    },
    []
  );

  const clearAllData = useCallback(() => {
    // Only clear current session data, not persistent user data
    setConversations([]);
    setCurrentConversationId(null);
    // Don't remove from localStorage - data should persist for when user logs back in
  }, []);

  const clearUserData = useCallback(() => {
    // This function completely removes user's chat history
    if (userEmail) {
      const userConversationsKey = getUserStorageKey(CONVERSATIONS_STORAGE_KEY);
      const userCurrentConversationKey = getUserStorageKey(
        CURRENT_CONVERSATION_STORAGE_KEY
      );
      localStorage.removeItem(userConversationsKey);
      localStorage.removeItem(userCurrentConversationKey);
    }
    setConversations([]);
    setCurrentConversationId(null);
  }, [userEmail, getUserStorageKey]);

  return {
    conversations,
    currentConversation,
    currentConversationId,
    isLoading,
    isInitialized,
    sendMessage,
    newConversation,
    selectConversation,
    hydrateConversation,
    clearAllData,
    clearUserData,
  };
};
