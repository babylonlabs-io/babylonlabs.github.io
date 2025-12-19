import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot, Plus, MessageSquare, Pencil, Check, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatWidget.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface TokenLimits {
  input_limit: {
    max_tokens: number;
    enabled: boolean;
  };
  output_limit: {
    max_tokens: number;
    enabled: boolean;
  };
}

// Approximate token count: ~3.5 characters per token (cl100k_base encoding estimate)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 3.5);
};

interface ChatSession {
  id: string;
  thread_uuid: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const STORAGE_KEY = 'babylon_ai_chat_sessions';
const OLD_STORAGE_KEY = 'babylon_ai_chat_history'; // For migration

// Helper to generate UUID using cryptographically secure random
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback using crypto.getRandomValues for cryptographic security
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version (4) and variant (8, 9, A, or B)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
  // Last resort fallback (should rarely happen in modern browsers)
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export default function ChatWidget() {
  const { siteConfig } = useDocusaurusContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // Removed showSidebar state as it's now strictly tied to isExpanded

  // State for sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      // Try new format first
      const savedSessions = localStorage.getItem(STORAGE_KEY);
      if (savedSessions) {
        try {
          return JSON.parse(savedSessions);
        } catch (e) {
          console.error('Failed to parse sessions', e);
        }
      }

      // Migration: Check for old format
      const oldHistory = localStorage.getItem(OLD_STORAGE_KEY);
      if (oldHistory) {
        try {
          const messages = JSON.parse(oldHistory);
          if (Array.isArray(messages) && messages.length > 0) {
             const migratedSession: ChatSession = {
               id: Date.now().toString(),
               thread_uuid: generateUUID(), // Best effort migration
               title: 'Previous Chat',
               messages: messages,
               timestamp: Date.now()
             };
             return [migratedSession];
          }
        } catch (e) {
          console.error('Failed to migrate old history', e);
        }
      }
    }
    // Default initial session
    return [{
      id: Date.now().toString(),
      thread_uuid: generateUUID(),
      title: 'New Chat',
      messages: [{ id: '1', role: 'assistant', content: 'Hello! I am the Babylon AI assistant. Ask me anything about Babylon Labs!' }],
      timestamp: Date.now()
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
     // Initialize with the most recent session or the first one
     return ''; // Will be set in effect if empty
  });

  // Ensure currentSessionId is valid
  useEffect(() => {
    if (sessions.length > 0 && (!currentSessionId || !sessions.find(s => s.id === currentSessionId))) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [tokenLimits, setTokenLimits] = useState<TokenLimits | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Default fallback limits if API fails
  const DEFAULT_INPUT_LIMIT = 1000;

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const saveTitle = (e: React.MouseEvent | React.KeyboardEvent, sessionId: string) => {
    e.stopPropagation();
    // e.preventDefault() is not needed for generic events, but good for form submissions
    if (editTitle.trim()) {
      setSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, title: editTitle.trim().slice(0, 50) } : s
      ));
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const cancelEditing = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
    setEditTitle('');
  };

  const apiBaseUrl = siteConfig.customFields?.apiBaseUrl || '/api';

  // Fetch token limits on mount
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/limits`);
        if (response.ok) {
          const limits = await response.json();
          setTokenLimits(limits);
        }
      } catch (error) {
        console.error('Failed to fetch token limits:', error);
      }
    };
    fetchLimits();
  }, [apiBaseUrl]);

  // Validate input on change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Use tokenLimits if available, otherwise fallback to default
    const maxTokens = tokenLimits?.input_limit.enabled 
      ? tokenLimits.input_limit.max_tokens 
      : DEFAULT_INPUT_LIMIT;

    if (value.trim()) {
      const estimatedTokens = estimateTokens(value);
      if (estimatedTokens > maxTokens) {
        setInputError(`Message too long (~${estimatedTokens}/${maxTokens} tokens).Please shorten your question.`);
      } else if (estimatedTokens > maxTokens * 0.8) {
        setInputError(`Approaching limit (~${estimatedTokens}/${maxTokens} tokens)`);
      } else {
        setInputError(null);
      }
    } else {
      setInputError(null);
    }
  };

  const maxTokens = tokenLimits?.input_limit.enabled 
    ? tokenLimits.input_limit.max_tokens 
    : DEFAULT_INPUT_LIMIT;
  const isInputTooLong = estimateTokens(input) > maxTokens;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll on new messages or open
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isExpanded, currentSessionId]);

  // Persist sessions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      // Clean up old key if exists
      localStorage.removeItem(OLD_STORAGE_KEY);
    }
  }, [sessions]);

  // Listen for header button clicks
  useEffect(() => {
    const handleHeaderClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.header-ai-chat-link')) {
        e.preventDefault();
        setIsOpen(true);
        setIsExpanded(true);
      }
    };

    document.addEventListener('click', handleHeaderClick);
    return () => document.removeEventListener('click', handleHeaderClick);
  }, []);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const createNewSession = () => {
    if (sessions.length >= 15) {
      alert("Maximum chat limit (15) reached. Please delete an old chat to start a new one.");
      return;
    }

    const newSession: ChatSession = {
      id: Date.now().toString(),
      thread_uuid: generateUUID(),
      title: 'New Chat',
      messages: [{ id: '1', role: 'assistant', content: 'Hello! I am the Babylon AI assistant. Ask me anything about Babylon Labs!' }],
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== sessionId);
    if (newSessions.length === 0) {
      // If all deleted, create a new fresh one
      createNewSession();
    } else {
      setSessions(newSessions);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(newSessions[0].id);
      }
    }
  };

  const updateCurrentSessionMessages = (updateFn: (msgs: Message[]) => Message[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = updateFn(session.messages);

        // Auto-update title if it's "New Chat" and we have a user message
        let newTitle = session.title;
        if (session.title === 'New Chat') {
          const firstUserMsg = updatedMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
             newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          }
        }

        return {
          ...session,
          messages: updatedMessages,
          title: newTitle,
          timestamp: Date.now() // Update timestamp to move to top if we were sorting
        };
      }
      return session;
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || isInputTooLong) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    // Create placeholder for AI response immediately
    const aiMessageId = (Date.now() + 1).toString();

    updateCurrentSessionMessages(prev => [...prev, userMessage, {
      id: aiMessageId,
      role: 'assistant',
      content: ''
    }]);

    setInput('');
    setInputError(null);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${apiBaseUrl}/api/query/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          thread_uuid: currentSession.thread_uuid
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        // Handle input_too_long error from server
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.detail?.error === 'input_too_long') {
            throw new Error(`INPUT_TOO_LONG:${errorData.detail.message}`);
          }
        }
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'content') {
              accumulatedContent += data.content;

              updateCurrentSessionMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );

            } else if (data.type === 'metadata') {
              // Update thread_uuid if backend provides a new one or confirms it
              if (data.thread_uuid) {
                setSessions(prev => prev.map(s =>
                  s.id === currentSessionId ? { ...s, thread_uuid: data.thread_uuid } : s
                ));
              }
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (parseError) {
            // Skip invalid JSON
          }
        }
      }

      if (!accumulatedContent) {
        updateCurrentSessionMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: "I'm sorry, I couldn't get an answer." }
              : msg
          )
        );
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      console.error(error);

      let errorMessage = "Sorry, something went wrong. Please try again later.";
      let isErrorMessage = false;

      if (error instanceof Error && error.message.startsWith('INPUT_TOO_LONG:')) {
        errorMessage = `⚠️ **Your message is too long.**\n\n${error.message.replace('INPUT_TOO_LONG:', '')}\n\n*Input limits help ensure faster responses and protect against abuse. Please try breaking your question into smaller, focused parts.*`;
        isErrorMessage = true;
      }

      updateCurrentSessionMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
          return prev.map(msg =>
            msg.id === lastMsg.id
              ? { ...msg, content: errorMessage, isError: isErrorMessage }
              : msg
          );
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClose = () => {
    abortControllerRef.current?.abort();
    setIsOpen(false);
    setIsExpanded(false);
  };

  return (
    <div className={`babylon-chat-widget ${isExpanded ? 'expanded-overlay' : ''}`}>
      {/* Backdrop for expanded mode */}
      {isExpanded && isOpen && (
        <div className="chat-backdrop" onClick={handleClose} />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isExpanded
              ? { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }
              : { opacity: 0, y: 20, scale: 0.95 }
            }
            animate={isExpanded
              ? { opacity: 1, scale: 1, x: "-50%", y: "-50%", top: "50%", left: "50%" }
              : { opacity: 1, y: 0, scale: 1, x: 0, top: "auto", left: "auto" }
            }
            exit={isExpanded
              ? { opacity: 0, scale: 0.9 }
              : { opacity: 0, y: 20, scale: 0.95 }
            }
            transition={{ duration: 0.2 }}
            className={`chat-window ${isExpanded ? 'expanded' : ''}`}
            style={isExpanded ? { position: 'fixed' } : {}}
          >
            <div className="flex h-full w-full overflow-hidden">
              {/* Sidebar - ONLY shown when expanded */}
              {isExpanded && (
                 <div className="chat-sidebar">
                    <div className="p-3 border-b border-[var(--ifm-color-emphasis-200)] flex justify-between items-center bg-[var(--ifm-background-surface-color)]">
                      <button
                        onClick={createNewSession}
                        className="new-chat-btn flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity w-full justify-center"
                      >
                        <Plus className="w-4 h-4" />
                        New Chat
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1 bg-[var(--ifm-background-surface-color)]">
                      {sessions.map(session => (
                        <div
                          key={session.id}
                          onClick={() => setCurrentSessionId(session.id)}
                          className={`group flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors ${
                            session.id === currentSessionId 
                              ? 'bg-[var(--ifm-color-emphasis-200)] font-medium' 
                              : 'hover:bg-[var(--ifm-color-emphasis-100)] text-[var(--ifm-color-content)] opacity-80 hover:opacity-100'
                          }`}
                        >
                          {editingSessionId === session.id ? (
                            <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                              <input
                                autoFocus
                                type="text"
                                maxLength={50}
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') saveTitle(e, session.id);
                                  if (e.key === 'Escape') cancelEditing(e);
                                }}
                                onClick={e => e.stopPropagation()}
                                className="flex-1 bg-[var(--ifm-background-color)] border border-[var(--ifm-color-emphasis-300)] rounded px-2 py-1 text-sm outline-none focus:border-[var(--ifm-color-primary)]"
                              />
                              <button onClick={e => saveTitle(e, session.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <Check className="w-3 h-3" />
                              </button>
                              <button onClick={cancelEditing} className="p-1 text-red-600 hover:bg-red-100 rounded">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 overflow-hidden flex-1">
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <span className="truncate">{session.title}</span>
                              </div>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                <button
                                  onClick={(e) => startEditing(e, session)}
                                  className="p-1 hover:text-[var(--ifm-color-primary)] hover:bg-[var(--ifm-color-emphasis-200)] rounded"
                                  title="Rename Chat"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => deleteSession(e, session.id)}
                                  className="p-1 hover:text-red-500 hover:bg-red-100 rounded"
                                  title="Delete Chat"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                 </div>
              )}

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col h-full relative bg-[var(--ifm-background-surface-color)]">
                {/* Header */}
                <div className="chat-header flex justify-between items-center p-4">
                  {editingSessionId === currentSession.id ? (
                    <div className={`flex items-center gap-2 flex-1 mr-2 ${isExpanded ? 'max-w-[280px]' : 'max-w-[160px]'}`} onClick={e => e.stopPropagation()}>
                      <Bot className="w-5 h-5 text-[var(--ifm-color-primary)] shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        maxLength={50}
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveTitle(e, currentSession.id);
                          if (e.key === 'Escape') cancelEditing(e);
                        }}
                        className="flex-1 bg-[var(--ifm-background-color)] border border-[var(--ifm-color-emphasis-300)] rounded-md px-2 py-1 text-sm outline-none focus:border-[var(--ifm-color-primary)] font-normal h-8"
                      />
                      <button onClick={e => saveTitle(e, currentSession.id)} className="p-1 text-green-600 hover:bg-green-100 rounded shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEditing} className="p-1 text-red-600 hover:bg-red-100 rounded shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 font-semibold text-[var(--ifm-color-content)] group flex-1 mr-2 overflow-hidden ${isExpanded ? 'max-w-[280px]' : 'max-w-[160px]'}`}>
                      <Bot className="w-5 h-5 text-[var(--ifm-color-primary)] shrink-0" />
                      <span
                        className="truncate cursor-pointer hover:text-[var(--ifm-color-primary)] transition-colors min-w-0"
                        onClick={(e) => startEditing(e, currentSession)}
                        title="Click to rename"
                      >
                        {currentSession.title}
                      </span>
                      <button
                        onClick={(e) => startEditing(e, currentSession)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--ifm-color-primary)] hover:bg-[var(--ifm-color-emphasis-200)] rounded transition-all shrink-0"
                        title="Rename Chat"
                      >
                        <Pencil className="w-3 h-3 shrink-0" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      title={isExpanded ? "Minimize" : "Expand"}
                      className="header-control-btn"
                      aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleClose}
                      className="header-control-btn chat-close-btn"
                      title="Close"
                      aria-label="Close chat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages flex-1 p-4 overflow-y-auto bg-[var(--ifm-background-color)]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-[var(--ifm-color-primary)] text-white' 
                          : 'bg-[var(--ifm-color-emphasis-200)] text-[var(--ifm-color-content)]'
                      }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                        msg.role === 'user'
                          ? 'message-bubble-user'
                          : 'message-bubble-ai'
                      }`}>
                        <div className="markdown-body">
                          {msg.role === 'assistant' && msg.content === '' && isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin opacity-60" />
                          ) : (
                            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.content}</ReactMarkdown>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="chat-input p-4 flex gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask a question..."
                      className="flex-1 px-4 py-2 rounded-full"
                      disabled={isLoading}
                    />
                    {inputError && (
                      <p className={`text-xs px-4 ${
                        isInputTooLong ? 'text-red-500' : 'text-yellow-600'
                      }`}>
                        {inputError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || isInputTooLong}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] bg-[var(--ifm-color-primary)] text-white rounded-full disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="chat-trigger-btn shadow-lg flex items-center gap-2 px-4 py-3 rounded-full font-medium"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          <span className={isOpen ? 'hidden sm:npm ' : 'inline'}>
            {isOpen ? 'Close' : 'Ask Babylon AI'}
          </span>
        </motion.button>
      )}
    </div>
  );
}
