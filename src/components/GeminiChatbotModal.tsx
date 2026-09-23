import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [modelType, setModelType] = useState<'general' | 'complex' | 'fast'>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'Namaste! I am your **DiplomaJob AI Mentor & Shopfloor Advisor**.\n\nI specialize in Indian polytechnic curricula (MSBTE, BTEUP, DTE, SBTET, GTU), Diploma Engineer Trainee (DET) recruitment, NATS apprenticeships, factory machine operations (CNC, PLC, hydraulic presses), capstone projects, and PSU junior engineer examinations.\n\nHow can I help power your engineering career today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I crack the Tata Motors DET technical interview?',
    'What is the difference between NATS 1-year training and regular employment?',
    'Explain CNC milling G02 circular interpolation vs G03 with examples.',
    'What is the standard format for a 6-week summer plant training report?',
    'What are the RRB JE syllabus and age limits for diploma engineers?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call server-side API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          modelType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save conversation log to Firestore asynchronously if online
      try {
        await addDoc(collection(db, 'chatConversations'), {
          userEmail: userEmail || 'anonymous',
          modelType,
          userPrompt: queryText,
          replyPreview: data.reply.slice(0, 150),
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Continue even if logging fails
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Error: ${err.message || 'Unable to connect to AI engine. Please check your network and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[780px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-5 py-3.5 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">Polytechnic AI Mentor & Career Copilot</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                MSBTE • BTEUP • DET technical viva • NATS 16-digit guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector Tabs */}
            <div className="hidden sm:flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/30 text-xs">
              <button
                type="button"
                onClick={() => setModelType('fast')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  modelType === 'fast'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="gemini-3.1-flash-lite: Fast quick responses"
              >
                ⚡ Fast
              </button>
              <button
                type="button"
                onClick={() => setModelType('general')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  modelType === 'general'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="gemini-3.8-flash: Balanced general reasoning"
              >
                🧠 General
              </button>
              <button
                type="button"
                onClick={() => setModelType('complex')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  modelType === 'complex'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="gemini-3.1-pro-preview: Deep technical reasoning & viva drills"
              >
                🔬 Deep Tech
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Quick prompt strip (mobile model selector fallback) */}
        <div className="sm:hidden px-4 py-2 bg-surface-container flex items-center justify-between text-xs border-b border-outline-variant/30">
          <span className="font-semibold text-on-surface-variant">Model:</span>
          <div className="flex gap-1">
            {(['fast', 'general', 'complex'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModelType(m)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  modelType === m ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {m === 'fast' ? '⚡ Fast' : m === 'general' ? '🧠 General' : '🔬 Pro'}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary text-white rounded-br-none shadow-sm'
                      : 'bg-surface-container-low text-on-surface rounded-bl-none border border-outline-variant/30'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2 font-normal">
                    {msg.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        {paragraph.split('**').map((chunk, ci) =>
                          ci % 2 === 1 ? <strong key={ci} className="font-bold text-primary-fixed">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-2.5 pt-2 border-t border-white/10 text-[10px] opacity-75">
                    <div className="flex items-center gap-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                    </div>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:opacity-100 flex items-center gap-1 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedId === msg.id ? 'check' : 'content_copy'}
                        </span>
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    Me
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-on-surface-variant">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <div className="bg-surface-container-low px-4 py-2.5 rounded-2xl border border-outline-variant/30 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-semibold ml-1">Analyzing shopfloor syllabus & career records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface-container-low/60 border-t border-outline-variant/20 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors border border-outline-variant/20"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything (e.g., G-code differences, NATS stipend DBT, Tata Motors DET questions)..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:border-primary placeholder:text-on-surface-variant/60"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
