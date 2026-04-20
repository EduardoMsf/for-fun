// src/components/ui/chatbot/Chatbot.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/src/store';

export const Chatbot = () => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setInput('');
    await sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-3 w-[360px] bg-white rounded-[20px] border border-gray-100 shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center text-white text-sm font-medium shrink-0">
              M
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Mitsuha</p>
              <p className="text-[11px] text-[#34A853] flex items-center gap-1">
                <span className="w-[6px] h-[6px] rounded-full bg-[#34A853] inline-block" />
                Online
              </p>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2.5 p-4 overflow-y-auto h-[280px]">
            {messages.length === 0 && (
              <div className="flex gap-2 items-end">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] shrink-0 flex items-center justify-center text-[9px] text-white font-medium">
                  M
                </div>
                <div className="bg-gray-100 text-gray-800 text-[13px] leading-relaxed px-[14px] py-[10px] rounded-[18px] rounded-bl-[4px] max-w-[240px]">
                  Hi! I'm Mitsuha, your shopping assistant. How can I help you
                  today?
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] shrink-0 flex items-center justify-center text-[9px] text-white font-medium">
                    M
                  </div>
                )}
                <div
                  className={`text-[13px] leading-relaxed px-[14px] py-[10px] max-w-[240px] ${
                    msg.role === 'user'
                      ? 'bg-[#4285F4] text-white rounded-[18px] rounded-br-[4px]'
                      : 'bg-gray-100 text-gray-800 rounded-[18px] rounded-bl-[4px]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-end">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] shrink-0" />
                <div className="bg-gray-100 px-[14px] py-[10px] rounded-[18px] rounded-bl-[4px] flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[7px] h-[7px] rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only shown when no messages */}
          {messages.length === 0 && (
            <div className="flex gap-1.5 px-4 pb-2.5 flex-wrap">
              {['Show me hoodies', "What's on sale?", 'Find a gift'].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[#4285F4] hover:text-[#4285F4] hover:bg-[#E8F0FE] transition-colors"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Mitsuha..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-[13px] outline-none focus:border-[#4285F4] focus:bg-white transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-gray-200 flex items-center justify-center shrink-0 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-[16px] bg-[#4285F4] hover:bg-[#3367D6] flex items-center justify-center transition-colors shadow-md"
      >
        {isOpen ? (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};
