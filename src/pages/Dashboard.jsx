import React, { useMemo, useEffect } from "react";
import Layout from "../components/Layout";
import { useDashboardData } from "../hooks/useDashboardData";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import SkeletonLoader from "../components/common/SkeletonLoader";
import { motion as Motion, AnimatePresence } from "motion/react";
import { queryClient } from "../lib/queryClient";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useAuth } from "../hooks/useAuth";
import { useGoals } from "../hooks/useGoals";
import { useBudgets } from "../hooks/useBudgets";
import { useBudgetStats } from "../hooks/useBudgetStats";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    }
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const { cards, wallets, transactions, monthlyStats: stats, loading: dashboardLoading } = useDashboardData(5);

  const { goals, loading: goalsLoading } = useGoals();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { data: budgetStats, isLoading: budgetStatsLoading } = useBudgetStats();

  const loading = dashboardLoading || goalsLoading || budgetsLoading || budgetStatsLoading;

  // Background Prefetching for other pages
  useEffect(() => {
    if (!user?.id) return;

    // Prefetch Transactions (Page 1)
    queryClient.prefetchQuery({
      queryKey: ['transactions', user.id, 1, 10, '', 'all'],
      staleTime: 1000 * 60 * 5,
    });

    // Prefetch Reports (This Month)
    const now = new Date();
    const start = format(startOfMonth(now), 'yyyy-MM-dd');
    const end = format(endOfMonth(now), 'yyyy-MM-dd');
    queryClient.prefetchQuery({
      queryKey: ['report_transactions', user.id, start, end],
      staleTime: 1000 * 60 * 5,
    });

    // Prefetch Budgets and Goals
    queryClient.prefetchQuery({ queryKey: ['budgets', user.id], staleTime: 1000 * 60 * 5 });
    queryClient.prefetchQuery({ queryKey: ['goals', user.id], staleTime: 1000 * 60 * 5 });
    queryClient.prefetchQuery({ queryKey: ['budget_stats', user.id], staleTime: 1000 * 60 * 5 });

    // Prefetch JS Chunks
    import("./Transactions");
    import("./Reports");
    import("./Accounts");
    import("./Monitoring");
  }, [user?.id]);


  const totalBalance = useMemo(() => {
    const cardTotal = cards.reduce((sum, card) => sum + Number(card.balance || 0), 0);
    const walletTotal = wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0);
    return cardTotal + walletTotal;
  }, [cards, wallets]);

  const budgetProgress = useMemo(() => {
    if (!budgets.length) return 0;
    const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit_amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => {
      const spent = budgetStats ? (budgetStats[b.category_id] || 0) : 0;
      return sum + spent;
    }, 0);
    return totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  }, [budgets, budgetStats]);

  const goalProgress = useMemo(() => {
    if (!goals.length) return 0;
    const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount || 0), 0);
    const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0);
    return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  }, [goals]);

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <Motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-end gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-dark-text tracking-tight mb-2">My PennyWings</h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-dark-muted font-medium italic">"Every penny has wings, keep them flying in the right direction."</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-black text-pink-400 uppercase tracking-widest mb-1">Current Date</p>
            <p className="text-lg font-bold text-gray-800 dark:text-dark-text">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </Motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Total Balance Card */}
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 text-white group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-10 translate-y-[-20px] blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30">
                  <Icon name="bank" color="white" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] opacity-80">Total Net Worth</p>
              </div>
              <Motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 sm:mb-10 break-all"
              >
                ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </Motion.h2>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center gap-2 opacity-80 mb-1">
                    <Icon name="income" color="#6EE7B7" className="w-4 h-4" />
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Monthly Income</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black">₱{stats.income.toLocaleString()}</p>
                </Motion.div>
                <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <div className="flex items-center gap-2 opacity-80 mb-1">
                    <Icon name="expense" color="#FDA4AF" className="w-4 h-4" />
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Monthly Expenses</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black">₱{stats.expenses.toLocaleString()}</p>
                </Motion.div>
              </div>
            </div>
          </Motion.div>

          {/* Quick Actions / Reports Summary */}
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-dark-card rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-8 border border-pink-50 dark:border-dark-border flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-black text-gray-800 dark:text-dark-text mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
              Pulse Report
            </h3>
            <div className="space-y-6 flex-1">
              <div className="p-5 bg-pink-50/50 dark:bg-dark-bg/50 rounded-3xl border border-pink-100/50 dark:border-dark-border/50">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-xs font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest">Savings Rate</p>
                  <p className="text-lg font-black text-pink-600">
                    {stats.income > 0 ? Math.round(((stats.income - stats.expenses) / stats.income) * 100) : 0}%
                  </p>
                </div>
                <div className="h-3 bg-white dark:bg-dark-bg rounded-full overflow-hidden border border-pink-100 dark:border-dark-border">
                  <Motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, stats.income > 0 ? ((stats.income - stats.expenses) / stats.income) * 100 : 0))}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-pink-500 rounded-full"
                  ></Motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <Link to="/accounts" className="p-6 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:translate-y-[-4px] transition-all group active:scale-95">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-dark-border rounded-2xl flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <Icon name="bank" color="currentColor" className="w-6 h-6 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-black text-gray-800 dark:text-dark-text uppercase tracking-tighter">Accounts</span>
                </Link>
                <Link to="/transactions" className="p-6 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:translate-y-[-4px] transition-all group active:scale-95">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-dark-border rounded-2xl flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Icon name="clock" color="currentColor" className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-gray-800 dark:text-dark-text uppercase tracking-tighter">Activity</span>
                </Link>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Monitoring Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/monitoring?tab=budgets" className="block group">
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-pink-50 dark:border-dark-border hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-dark-text tracking-tight flex items-center gap-2">
                  <Icon name="reports" className="w-6 h-6 text-pink-500" />
                  Budget Status
                </h3>
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 dark:bg-dark-bg px-3 py-1 rounded-full group-hover:bg-pink-500 group-hover:text-white transition-colors">Manage</span>
              </div>
              <p className="text-sm text-gray-400 dark:text-dark-muted font-bold mb-4 italic">Monitor your category spending limits.</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-pink-50 dark:bg-dark-bg rounded-full overflow-hidden border border-pink-100 dark:border-dark-border">
                  <Motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, budgetProgress)}%` }} 
                    className="h-full bg-pink-500 rounded-full"
                  ></Motion.div>
                </div>
                <span className="text-xs font-black text-gray-800 dark:text-dark-text tracking-tighter shrink-0">{budgetProgress}% USED</span>
              </div>
            </Motion.div>
          </Link>

          <Link to="/monitoring?tab=goals" className="block group">
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-pink-50 dark:border-dark-border hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-dark-text tracking-tight flex items-center gap-2">
                  <Icon name="plus" className="w-6 h-6 text-pink-500" />
                  Savings Goals
                </h3>
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 dark:bg-dark-bg px-3 py-1 rounded-full group-hover:bg-pink-500 group-hover:text-white transition-colors">View All</span>
              </div>
              <p className="text-sm text-gray-400 dark:text-dark-muted font-bold mb-4 italic">Track progress toward your financial dreams.</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-pink-50 dark:bg-dark-bg rounded-full overflow-hidden border border-pink-100 dark:border-dark-border">
                  <Motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, goalProgress)}%` }} 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                  ></Motion.div>
                </div>
                <span className="text-xs font-black text-gray-800 dark:text-dark-text tracking-tighter shrink-0">{goalProgress}% REACHED</span>
              </div>
            </Motion.div>
          </Link>
        </div>


        {/* Recent Activity */}

        <Motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 border border-pink-50 dark:border-dark-border"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-dark-text tracking-tight flex items-center gap-3">
              <Icon name="clock" color="#EC4899" className="w-6 h-6 sm:w-7 sm:h-7" />
              Recent Activity
            </h3>
            <Link to="/transactions" className="text-sm font-black text-pink-500 hover:text-pink-600 flex items-center gap-1 group self-start sm:self-auto">
              View All History
              <Icon name="plus" color="currentColor" className="w-4 h-4 rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5 bg-white dark:bg-dark-bg border border-pink-50 dark:border-dark-border rounded-[2rem] sm:rounded-[2.5rem]">
                    <SkeletonLoader className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <SkeletonLoader className="h-4 sm:h-5 w-2/3" />
                      <SkeletonLoader className="h-3 w-1/3" />
                    </div>
                    <div className="text-right space-y-2">
                       <SkeletonLoader className="h-5 sm:h-6 w-16 sm:w-20 ml-auto" />
                       <SkeletonLoader className="h-2 w-10 sm:w-12 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions?.length > 0 ? (
              <Motion.div 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                <AnimatePresence mode="popLayout">
                  {transactions.map(tx => (
                    <Motion.div 
                      key={tx?.id} 
                      variants={fadeInUp}
                      layout
                      className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5 bg-white dark:bg-dark-bg border border-pink-50 dark:border-dark-border rounded-[2rem] sm:rounded-[2.5rem] sm:hover:translate-x-2 transition-all group overflow-hidden"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg font-black text-gray-900 dark:text-dark-text truncate tracking-tight">{tx?.description || tx?.category?.name || 'Uncategorized'}</p>
                        <p className="text-[10px] sm:text-sm font-bold text-gray-400 dark:text-dark-muted flex flex-wrap items-center gap-1 sm:gap-2 uppercase tracking-widest">
                          <span className="truncate max-w-[100px] sm:max-w-none">{tx?.category?.name || 'No Category'}</span> 
                          <span className="hidden sm:inline">•</span> 
                          <span className="shrink-0">{tx?.transaction_date ? new Date(tx.transaction_date).toLocaleDateString() : 'No Date'}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className={`text-lg sm:text-xl font-black tracking-tighter ${
                          tx?.type === 'income' ? 'text-emerald-500' : 
                          tx?.type === 'expense' ? 'text-rose-500' : 
                          tx?.type === 'transfer' ? 'text-blue-500' :
                          'text-orange-500'
                        }`}>
                          {tx?.type === 'income' ? '+' : tx?.type === 'transfer' ? '' : '-'}₱{Number(tx?.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-300 dark:text-dark-muted/50 uppercase tracking-tighter truncate max-w-[70px] sm:max-w-[120px] ml-auto">
                          {tx?.type === 'transfer' 
                            ? `${tx.card?.card_name || tx.wallet?.wallet_name || 'Account'} → ${tx.to_card?.card_name || tx.to_wallet?.wallet_name || 'Account'}`
                            : tx?.card?.card_name || tx?.wallet?.wallet_name || 'Cash'}
                        </p>
                      </div>
                    </Motion.div>
                  ))}
                </AnimatePresence>
              </Motion.div>
            ) : (
              <div className="py-20 text-center bg-pink-50/30 dark:bg-dark-bg/30 rounded-[3rem] border-2 border-dashed border-pink-100 dark:border-dark-border">
                <p className="text-gray-500 dark:text-dark-muted font-black uppercase tracking-widest mb-2">No Transactions Yet</p>
                <p className="text-sm text-gray-400 dark:text-dark-muted/80">Head to the transactions page to track your first penny.</p>
              </div>
            )}
          </div>
        </Motion.div>
      </div>
    </Layout>
  );
}
