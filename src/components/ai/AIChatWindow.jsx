import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useBudgets } from '../../hooks/useBudgets';
import { useBudgetStats } from '../../hooks/useBudgetStats';
import { getFinancialAdvice } from '../../lib/gemini';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../Icon';

export default function AIChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm Penny, your personal finance assistant. How can I help you today?", parts: [{ text: "Hi! I'm Penny, your personal finance assistant. How can I help you today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const { cards, wallets, monthlyStats, transactions } = useDashboardData(10);
  const { user, profile } = useAuth();
  const { budgets } = useBudgets();
  const { data: budgetStats } = useBudgetStats();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const totalBalance = cards.reduce((sum, c) => sum + Number(c.balance || 0), 0) + 
                       wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);

  const budgetProgress = budgets.length > 0 
    ? Math.round((budgets.reduce((sum, b) => sum + (budgetStats?.[b.category_id] || 0), 0) / 
      budgets.reduce((sum, b) => sum + Number(b.limit_amount || 0), 0)) * 100) 
    : 0;

  const topCategory = budgets.length > 0
    ? budgets.reduce((prev, current) => {
        const prevSpent = budgetStats?.[prev.category_id] || 0;
        const currentSpent = budgetStats?.[current.category_id] || 0;
        return (prevSpent > currentSpent) ? prev : current;
      }).category?.name
    : 'N/A';

  const detailedBudgets = budgets.map(b => {
    const spent = budgetStats?.[b.category_id] || 0;
    const limit = Number(b.limit_amount || 0);
    return `${b.category?.name || 'Unknown'}: ₱${spent} / ₱${limit}`;
  }).join(', ');

  const accountBalances = [
    ...cards.map(c => `${c.card_name} (Card): ₱${c.balance}`),
    ...wallets.map(w => `${w.wallet_name} (eWallet): ₱${w.balance}`)
  ].join(', ');

  const recentTransactions = transactions?.map(t => {
    const isExpense = t.type === 'expense' || t.type === 'withdrawal';
    const amountStr = `${isExpense ? '-' : '+'}₱${t.amount}`;
    return `${t.transaction_date?.split('T')[0]} | ${amountStr} | ${t.description || t.category?.name || 'Transfer'}`;
  }).join('\n') || 'None';

  const userContext = {
    totalBalance,
    monthlyExpenses: monthlyStats.expenses,
    monthlyIncome: monthlyStats.income,
    topExpenseCategory: topCategory,
    budgetProgress: `${budgetProgress}% used`,
    detailedBudgets,
    accountBalances,
    recentTransactions,
    userName: profile?.full_name || user?.user_metadata?.full_name || 'Friend'
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input, parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Filter out 'text' property for Gemini API
      const history = messages.map(({ role, parts }) => ({ role, parts }));
      const response = await getFinancialAdvice(input, userContext, history);
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response, 
        parts: [{ text: response }] 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: error.message || "Sorry, I'm having trouble connecting to my brain right now. Please try again later!",
        parts: [{ text: error.message || "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="hidden md:flex fixed bottom-6 right-6 w-96 h-[600px] max-h-[70vh] bg-white dark:bg-dark-card border border-pink-100 dark:border-dark-border rounded-[2.5rem] shadow-2xl flex-col overflow-hidden z-[60]"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <Icon name="sparkles" color="white" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">Penny AI</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Personal Assistant</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Icon name="close" color="white" className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-pink-50/10 dark:bg-dark-bg/10"
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-3xl ${
                    msg.role === 'user' 
                      ? 'bg-pink-500 text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-dark-bg border border-pink-50 dark:border-dark-border text-gray-800 dark:text-dark-text rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-dark-bg border border-pink-50 dark:border-dark-border p-4 rounded-3xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-dark-card border-t border-pink-50 dark:border-dark-border shrink-0">
            <div className="flex gap-2 p-2 bg-pink-50/50 dark:bg-dark-bg/50 rounded-2xl border border-pink-100/50 dark:border-dark-border/50">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Penny anything..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-800 dark:text-dark-text placeholder:text-gray-400 dark:placeholder:text-dark-muted px-2"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-pink-500/20"
              >
                <Icon name="arrowRight" color="white" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
