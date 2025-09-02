import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getFinancialAdvice, FinancialData } from '../services/geminiService';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Input from './ui/Input';
import { Sparkles, Bot, Send, User as UserIcon, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

interface AiAdvisorProps {
  financialData: FinancialData;
  userId: string;
  isMobile: boolean;
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

const parseMarkdown = (text: string) => {
  const elements = text.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-[var(--accent-primary)]">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)] uppercase tracking-wide border-b-2 border-[var(--border-subtle)] pb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 my-2 list-disc marker:text-[var(--accent-primary)] marker:text-xl">{line.substring(2)}</li>;
    }
    if (line.match(/^\d+\.\s/)) {
        return <li key={index} className="ml-5 my-2 list-decimal marker:text-[var(--accent-primary)] marker:font-bold">{line.substring(line.indexOf(' ') + 1)}</li>;
    }
    if (line === '') {
        return null;
    }
    return <p key={index} className="my-3 leading-relaxed">{line}</p>;
  }).filter(Boolean);
  return <div className="space-y-2">{elements}</div>;
};


const AiAdvisor: React.FC<AiAdvisorProps> = ({ financialData, userId, isMobile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const storageKey = `ai_advisor_history_${userId}`;

  useEffect(() => {
    const savedHistory = localStorage.getItem(storageKey);
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }
  }, [storageKey]);

  useEffect(() => {
    // Only save if there are messages to prevent creating empty storage items
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearHistory = () => {
      setMessages([]);
      setError('');
  }

  const handleInitialAdvice = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    // The component is now responsible for creating the initial prompt
    const initialAnalysisPrompt = `
      Please provide a systematic, clear, and concise analysis of my financial data.
      The analysis must follow this structure precisely:
      ## Overall Financial Health
      ### Key Metrics, ### Summary
      ## Spending Analysis
      ### Top Spending Categories, ### Budget vs. Actual
      ## Debt Management
      ## Investment & Goals
      ### Goal Progress, ### Portfolio Overview
      ## Actionable Recommendations (3 concrete actions)
      
      Here is my financial data in JSON format:
      ${JSON.stringify(financialData, null, 2)}
    `;
    
    const initialHistory: Message[] = [{ role: 'user', content: initialAnalysisPrompt }];

    try {
      const result = await getFinancialAdvice(initialHistory);
      setMessages([...initialHistory, { role: 'model', content: result }]);
    } catch (err: any) {
      setError(err.message || t('advisor.error'));
    } finally {
      setIsLoading(false);
    }
  }, [financialData, t, storageKey]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
        const result = await getFinancialAdvice(newMessages);
        setMessages(prev => [...prev, { role: 'model', content: result }]);
    } catch (err: any) {
        setError(err.message || t('advisor.error'));
        // If there's an error, roll back the user's message so they can try again
        setMessages(messages);
    } finally {
        setIsLoading(false);
    }
  }, [userInput, isLoading, messages, t]);


  return (
    <div className={`flex flex-col max-w-4xl mx-auto bg-[var(--surface-primary)] shadow-xl ${
        isMobile
        ? 'fixed inset-0 top-16 rounded-none border-none'
        : 'h-[calc(100vh-80px)] border border-[var(--border-subtle)] rounded-2xl'
    }`}>
       {messages.length === 0 && !isLoading && (
        <div className="text-center space-y-4 my-auto p-8">
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="inline-block p-4 bg-[var(--accent-primary)] rounded-full shadow-lg">
              <Bot className="h-10 w-10 text-white" />
           </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('advisor.title')}</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">{t('advisor.subtitle')}</p>
          <div className="flex justify-center pt-4">
              <Button onClick={handleInitialAdvice} disabled={isLoading} size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                {t('advisor.buttonGenerate')}
              </Button>
          </div>
        </div>
       )}

      {(messages.length > 0 || isLoading) && (
        <>
        <header className="flex justify-between items-center p-4 border-b border-[var(--border-subtle)]">
            <h2 className="font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--accent-primary)]" />
                AI Financial Advisor
            </h2>
            <Button variant="secondary" size="sm" onClick={handleClearHistory} title="Clear conversation history">
                <Eraser className="h-4 w-4" />
            </Button>
        </header>

        <div className="flex-1 overflow-y-auto space-y-6 p-6 scroll-smooth">
            {messages.map((msg, index) => {
                const isInitialUserPrompt = index === 0 && msg.role === 'user';
                const displayContent = isInitialUserPrompt ? "Initial analysis of my financial data." : msg.content;
                
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.role === 'model' && <div className="p-2 bg-[var(--surface-secondary)] rounded-full"><Bot className="h-6 w-6 text-[var(--accent-primary)] flex-shrink-0" /></div>}
                        <div className={`rounded-xl p-4 max-w-xl shadow-md ${msg.role === 'user' ? 'bg-gray-200 text-[var(--text-primary)]' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]'}`}>
                            {msg.role === 'user' ? <p>{displayContent}</p> : <div className="prose-base max-w-none">{parseMarkdown(msg.content)}</div>}
                        </div>
                        {msg.role === 'user' && <div className="p-2 bg-[var(--surface-secondary)] rounded-full"><UserIcon className="h-6 w-6 text-[var(--text-secondary)] flex-shrink-0" /></div>}
                    </motion.div>
                );
            })}
             <AnimatePresence>
             {isLoading && (
                <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-4">
                    <div className="p-2 bg-[var(--surface-secondary)] rounded-full"><Bot className="h-6 w-6 text-[var(--accent-primary)] flex-shrink-0" /></div>
                    <div className="rounded-xl p-4 bg-[var(--surface-secondary)] flex items-center space-x-2 shadow-md">
                        <span className="h-2 w-2 bg-[var(--text-secondary)] rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-[var(--text-secondary)] rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-[var(--text-secondary)] rounded-full animate-pulse"></span>
                    </div>
                </motion.div>
             )}
             </AnimatePresence>
            <div ref={chatEndRef} />
        </div>
        </>
      )}
      
      {error && (
        <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center font-semibold text-sm">{error}</p>
        </div>
      )}

      {(messages.length > 0 || isLoading) && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                  <Input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ask a follow-up question..."
                      className="flex-1"
                      disabled={isLoading}
                  />
                  <Button type="submit" size="md" disabled={isLoading || !userInput.trim()}>
                      {isLoading ? <Spinner /> : <Send className="h-5 w-5" />}
                  </Button>
              </div>
          </form>
      )}

    </div>
  );
};

export default AiAdvisor;