import React, { useState, useRef, useEffect } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { Bot, Send, Sparkles, X, User, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export function NovaAiAssistant() {
  const { isAiAssistantOpen, setIsAiAssistantOpen, askAiAssistant, totalBalance } = useBanking();

  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello, I'm NovaAI, your authorized institutional financial copilot. I have read-only access to your permitted demo ledger, active balances ($${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}), and budget velocity. How can I assist your treasury today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['Real-Time Ledger API v1.0.0'],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'What is my total liquidity?',
    'What is my highest yield account?',
    'How much did I spend this month?',
    'Show my recent wire transfers',
    'How is my account security score?',
  ];

  useEffect(() => {
    if (isAiAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiAssistantOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuestion;
    if (!query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const response = askAiAssistant(query);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  if (!isAiAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAiAssistantOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden z-10 flex flex-col h-[600px] max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-royal-600 to-teal-500 text-white flex items-center justify-center shadow-fintech">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  NovaAI Financial Copilot
                </h3>
                <Badge variant="teal" size="sm" pulse dot>Live Data</Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Connected to encrypted demo accounts, budgets & transactions
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAssistantOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-royal-600 text-white'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-royal-600 text-white shadow-fintech rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                      <Database className="w-3 h-3" /> Data Sources:
                    </span>
                    {msg.sources.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <span className="block text-[10px] text-right mt-1 opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 text-teal-500 animate-spin" />
              <span>Analyzing financial ledger...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-royal-500" /> Prompts:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0c1626]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask NovaAI about your balances, spending, yield, or wires..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 outline-none focus:ring-2 focus:ring-royal-500/40"
            />
            <Button type="submit" variant="teal" icon={Send} disabled={!inputQuestion.trim() || isTyping}>
              Ask
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovaAiAssistant;
