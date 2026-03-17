import React, { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { useBankCards } from "../hooks/useBankCards";
import { useEWallets } from "../hooks/useEWallets";
import { useTransactions } from "../hooks/useTransactions";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function Dashboard() {
  const { user } = useAuth();
  const { cards } = useBankCards();
  const { wallets } = useEWallets();
  const { transactions, loading: loadingTx } = useTransactions(5);

  const totalBalance = useMemo(() => {
    const cardTotal = cards.reduce((sum, card) => sum + Number(card.balance || 0), 0);
    const walletTotal = wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
    return cardTotal + walletTotal;
  }, [cards, wallets]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return (transactions || []).reduce((acc, tx) => {
      if (!tx || !tx.transaction_date) return acc;
      
      const txDate = new Date(tx.transaction_date);
      if (txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear) {
        const amount = Number(tx.amount || 0);
        if (tx.type === 'income') acc.income += amount;
        else if (tx.type === 'expense') acc.expenses += amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });
  }, [transactions]);

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">My PennyWings</h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium italic">"Every penny has wings, keep them flying in the right direction."</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-black text-pink-400 uppercase tracking-widest mb-1">Current Date</p>
            <p className="text-lg font-bold text-gray-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Total Balance Card */}
          <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 text-white shadow-2xl shadow-pink-200 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-10 translate-y-[-20px] blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30">
                  <Icon name="bank" color="white" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] opacity-80">Total Net Worth</p>
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 sm:mb-10 break-all">
                ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div>
                  <div className="flex items-center gap-2 opacity-80 mb-1">
                    <Icon name="income" color="#6EE7B7" className="w-4 h-4" />
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Monthly Income</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black">₱{stats.income.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 opacity-80 mb-1">
                    <Icon name="expense" color="#FDA4AF" className="w-4 h-4" />
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Monthly Expenses</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black">₱{stats.expenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Reports Summary */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-8 border border-pink-50 shadow-sm flex flex-col">
            <h3 className="text-lg sm:text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
              Pulse Report
            </h3>
            <div className="space-y-6 flex-1">
              <div className="p-5 bg-pink-50/50 rounded-3xl border border-pink-100/50">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Savings Rate</p>
                  <p className="text-lg font-black text-pink-600">
                    {stats.income > 0 ? Math.round(((stats.income - stats.expenses) / stats.income) * 100) : 0}%
                  </p>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden border border-pink-100">
                  <div 
                    className="h-full bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, stats.income > 0 ? ((stats.income - stats.expenses) / stats.income) * 100 : 0))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link to="/accounts" className="p-6 bg-white border border-pink-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:translate-y-[-4px] transition-all group">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <Icon name="bank" color="currentColor" className="w-6 h-6 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">Accounts</span>
                </Link>
                <Link to="/transactions" className="p-6 bg-white border border-pink-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:translate-y-[-4px] transition-all group">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Icon name="clock" color="currentColor" className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">Activity</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 border border-pink-50 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Icon name="clock" color="#EC4899" className="w-6 h-6 sm:w-7 sm:h-7" />
              Recent Activity
            </h3>
            <Link to="/transactions" className="text-sm font-black text-pink-500 hover:text-pink-600 flex items-center gap-1 group self-start sm:self-auto">
              View All History
              <Icon name="plus" color="currentColor" className="w-4 h-4 rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {loadingTx ? (
              <div className="py-20 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-bold animate-pulse">Scanning the ledger...</p>
              </div>
            ) : transactions?.length > 0 ? (
              transactions.map(tx => (
                <div key={tx?.id} className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5 bg-white border border-pink-50 rounded-[2rem] sm:rounded-[2.5rem] hover:shadow-xl sm:hover:translate-x-2 transition-all group overflow-hidden">
                  <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center p-3 sm:p-4 shadow-sm group-hover:scale-110 transition-transform shrink-0"
                    style={{ backgroundColor: tx?.category?.color || '#F3F4F6' }}
                  >
                    <Icon 
                      name={tx?.type === 'income' ? 'income' : 'expense'} 
                      color="white" 
                      className="w-5 h-5 sm:w-8 sm:h-8"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-black text-gray-900 truncate tracking-tight">{tx?.description || tx?.category?.name || 'Uncategorized'}</p>
                    <p className="text-[10px] sm:text-sm font-bold text-gray-400 flex flex-wrap items-center gap-1 sm:gap-2 uppercase tracking-widest">
                      <span className="truncate max-w-[100px] sm:max-w-none">{tx?.category?.name || 'No Category'}</span> 
                      <span className="hidden sm:inline">•</span> 
                      <span className="shrink-0">{tx?.transaction_date ? new Date(tx.transaction_date).toLocaleDateString() : 'No Date'}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className={`text-lg sm:text-xl font-black tracking-tighter ${tx?.type === 'income' ? 'text-emerald-500' : 'text-gray-900'}`}>
                      {tx?.type === 'income' ? '+' : '-'}₱{Number(tx?.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-300 uppercase tracking-tighter truncate max-w-[70px] sm:max-w-[120px] ml-auto">
                      {tx?.card?.card_name || tx?.wallet?.wallet_name || 'Cash'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-pink-50/30 rounded-[3rem] border-2 border-dashed border-pink-100">
                <p className="text-gray-500 font-black uppercase tracking-widest mb-2">No Transactions Yet</p>
                <p className="text-sm text-gray-400">Head to the transactions page to track your first penny.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
