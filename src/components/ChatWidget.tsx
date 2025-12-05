import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatWidget.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const { siteConfig } = useDocusaurusContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am the Babylon AI assistant. Ask me anything about Babylon Labs!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const apiBaseUrl = siteConfig.customFields?.apiBaseUrl || '/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    // Create placeholder for AI response immediately
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMessage, {
      id: aiMessageId,
      role: 'assistant',
      content: ''
    }]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${apiBaseUrl}/query/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

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
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (parseError) {
            // Skip invalid JSON
          }
        }
      }

      if (!accumulatedContent) {
        setMessages(prev =>
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
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === 'assistant' && lastMsg.content === '') {
          return prev.map(msg =>
            msg.id === lastMsg.id
              ? { ...msg, content: "Sorry, something went wrong. Please try again later." }
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
  };

  return (
    <div className="babylon-chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="chat-window"
          >
            <div className="chat-header flex justify-between items-center p-4">
              <div className="flex items-center gap-2 font-semibold text-[var(--ifm-color-content)]">
                <Bot className="w-5 h-5 text-[var(--ifm-color-primary)]" />
                <span>Babylon AI</span>
              </div>
              <button
                onClick={handleClose}
                className="close-btn p-1 text-[var(--ifm-color-content)] opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-full"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-[var(--ifm-color-primary)] text-white rounded-full disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chat-trigger-btn shadow-lg flex items-center gap-2 px-4 py-3 rounded-full font-medium"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <span className={isOpen ? 'hidden sm:inline' : 'inline'}>
          {isOpen ? 'Close' : 'Ask Babylon AI'}
        </span>
      </motion.button>
    </div>
  );
}
