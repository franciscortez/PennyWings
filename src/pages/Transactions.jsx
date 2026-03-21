import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { useTransactions } from "../hooks/useTransactions";
import TransactionForm from "../components/transactions/TransactionForm";
import Icon from "../components/Icon";
import { useTheme } from "../contexts/ThemeContext";
import { getToast } from "../utils/toast";
import { getConfirm, confirmPresets } from "../utils/confirm";
import { motion as Motion, AnimatePresence } from "motion/react";

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    }
  }
};

export default function Transactions() {
  const { theme } = useTheme();
  const Toast = getToast(theme);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL-synced states
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const filterType = searchParams.get('type') || 'all';
  const searchQuery = searchParams.get('search') || '';
  
  const pageSize = 10;

  const { 
    transactions, 
    totalCount,
    totalPages,
    loading, 
    addTransaction, 
    updateTransaction,
    deleteTransaction 
  } = useTransactions({ 
    page, 
    pageSize, 
    search: searchQuery, 
    type: filterType 
  });

  // Handle out-of-bounds pagination (e.g., after deletion or manual URL entry)
  useEffect(() => {
    if (!loading && totalPages > 0 && page > totalPages) {
      // If current page is beyond total pages, snap to last page
      onPageChange(totalPages, true);
    } else if (!loading && totalPages === 0 && page > 1) {
      // If no data exists at all but page is not 1, snap to page 1
      onPageChange(1, true);
    }
  }, [page, totalPages, loading, setSearchParams]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        Toast.fire({
          icon: 'success',
          title: 'Transaction updated! ✨'
        });
      } else {
        await addTransaction(data);
        Toast.fire({
          icon: 'success',
          title: 'Transaction recorded! ✨'
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: error.message || 'Failed to save transaction'
      });
      throw error; // Re-throw to keep TransactionForm modal open
    }
  };

  const handleDeleteTransaction = async (tx) => {
    getConfirm(theme).fire(confirmPresets.deleteItem('Transaction')).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTransaction(tx);
          Toast.fire({
            icon: 'success',
            title: 'Deleted!'
          });
        } catch (error) {
          Toast.fire({
            icon: 'error',
            title: error.message || 'Delete failed'
          });
        }
      }
    });
  };

  // State update handlers that sync with URL
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => {
      if (value) prev.set('search', value);
      else prev.delete('search');
      prev.set('page', '1'); // Reset to page 1 on search
      return prev;
    }, { replace: true });
  };

  const onFilterChange = (type) => {
    setSearchParams(prev => {
      prev.set('type', type);
      prev.set('page', '1'); // Reset to page 1 on filter
      return prev;
    });
  };

  const onPageChange = useCallback((newPage, replace = false) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    }, { replace });
  }, [setSearchParams]);

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <Motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-dark-text tracking-tight mb-2">Transaction History</h1>
            <p className="text-gray-500 dark:text-dark-muted font-medium font-bold">Manage your cashflow with precision.</p>
          </div>
          <Motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-[2rem] font-black hover:bg-pink-600 transition-all font-bold"
          >
            <Icon name="plus" color="white" className="w-5 h-5" />
            New Transaction
          </Motion.button>
        </Motion.div>

        {/* Filters & Search */}
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-center bg-white dark:bg-dark-card p-6 rounded-[2.5rem] border border-pink-50 dark:border-dark-border"
        >
          <div className="relative flex-1 w-full text-left">
            <label className="block text-[10px] font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-4">Search Ledger</label>
            <div className="relative">
              <Icon name="search" color="#F9A8D4" className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Description, category..." 
                value={searchQuery}
                onChange={onSearchChange}
                className="w-full pl-12 pr-6 py-4 bg-pink-50/30 dark:bg-dark-bg/30 border border-pink-100 dark:border-dark-border rounded-[1.5rem] focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-dark-text"
              />
            </div>
          </div>
          <div className="w-full lg:w-auto text-left">
            <label className="block text-[10px] font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-4">Filter Type</label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['all', 'income', 'expense', 'withdrawal', 'transfer'].map(type => (
                <button
                  key={type}
                  onClick={() => onFilterChange(type)}
                  className={`px-6 py-4 rounded-[1.2rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                    filterType === type 
                    ? 'bg-gray-900 dark:bg-pink-500 text-white'
                    : 'bg-pink-50/50 dark:bg-dark-bg/50 text-gray-400 dark:text-white/50 hover:text-pink-500 hover:bg-pink-100/50 dark:hover:bg-dark-border border border-pink-100 dark:border-dark-border'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </Motion.div>

        {/* Transactions Table */}
        <Motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-[3rem] border border-pink-50 dark:border-dark-border overflow-hidden"
        >
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 dark:text-dark-muted font-black tracking-widest uppercase animate-pulse text-xs">Fetching Ledger...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-pink-50/50 dark:bg-dark-bg/50 border-b border-pink-100 dark:border-dark-border">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em]">Transaction</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em]">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em]">Account</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em]">Payment</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em] text-right">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em] text-center">Action</th>
                  </tr>
                </thead>
                <Motion.tbody 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="divide-y divide-pink-50 dark:divide-dark-border"
                >
                  <AnimatePresence mode="popLayout">
                    {transactions.map(tx => (
                      <Motion.tr 
                        key={tx.id} 
                        variants={fadeInUp}
                        layout
                        className="group hover:bg-pink-50/30 dark:hover:bg-dark-bg/30 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-black text-gray-900 dark:text-dark-text tracking-tight leading-none mb-1">{tx.description || tx.category?.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest flex items-center gap-1">
                              <Icon name="clock" className="w-3 h-3" />
                              {new Date(tx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 dark:bg-dark-bg text-pink-500 dark:text-pink-400 text-xs font-black uppercase tracking-widest border border-pink-100 dark:border-dark-border">
                            {tx.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-dark-muted">
                              <Icon name="bank" className="w-4 h-4 opacity-50" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                {tx.type === 'transfer' ? (
                                  `${tx.card?.card_name || tx.wallet?.wallet_name || 'Account'} → ${tx.to_card?.card_name || tx.to_wallet?.wallet_name || 'Account'}`
                                ) : (
                                  tx.card?.card_name || tx.wallet?.wallet_name || 'Cash'
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">
                            {tx.type === 'transfer' ? '---' : tx.payment_method === 'card' ? 'Bank Card' : tx.payment_method === 'ewallet' ? 'E-Wallet' : 'Cash'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className={`text-sm sm:text-base font-black tracking-tight ${
                            tx.type === 'income' ? 'text-emerald-500' : 
                            tx.type === 'expense' ? 'text-rose-500' : 
                            tx.type === 'transfer' ? 'text-blue-500' :
                            'text-orange-500'
                          }`}>
                            {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '' : '-'}₱{Number(tx.amount).toLocaleString()}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
                            tx.type === 'withdrawal' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
                            tx.type === 'transfer' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
                            'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: theme === 'dark' ? '#312e8166' : '#F0F9FF' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleOpenEdit(tx)}
                              className="p-3 text-gray-200 dark:text-dark-muted hover:text-blue-500 rounded-xl transition-colors"
                            >
                              <Icon name="edit" color="currentColor" className="w-5 h-5" />
                            </Motion.button>
                            <Motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: theme === 'dark' ? '#312e8166' : '#FFF1F2' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteTransaction(tx)}
                              className="p-3 text-gray-200 dark:text-dark-muted hover:text-rose-500 rounded-xl transition-colors"
                            >
                              <Icon name="delete" color="currentColor" className="w-5 h-5" />
                            </Motion.button>
                          </div>
                        </td>
                      </Motion.tr>
                    ))}
                  </AnimatePresence>
                </Motion.tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-pink-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                 <Icon name="bank" color={theme === 'dark' ? '#4a3b5a' : '#F9A8D4'} className="w-10 h-10" />
              </div>
               <p className="text-lg font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest">No entries found</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-pink-50/30 dark:bg-dark-bg/30 border-t border-pink-100 dark:border-dark-border flex items-center justify-between">
              <p className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest">
                Showing <span className="text-pink-500 dark:text-pink-400">{(page - 1) * pageSize + 1}</span> to <span className="text-pink-500 dark:text-pink-400">{Math.min(page * pageSize, totalCount)}</span> of {totalCount}
              </p>
              <div className="flex gap-2">
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl bg-white dark:bg-dark-card border border-pink-100 dark:border-dark-border text-gray-400 dark:text-dark-muted hover:text-pink-500 hover:border-pink-200 dark:hover:border-dark-muted transition-all disabled:opacity-30"
                >
                  <Icon name="arrowLeft" className="w-4 h-4" />
                </Motion.button>
                <div className="hidden sm:flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    // Improved pagination logic for many pages
                    if (totalPages > 7) {
                      if (p > 1 && p < totalPages && (p < page - 1 || p > page + 1)) {
                        if (p === 2 || p === totalPages - 1) return <span key={p} className="w-10 h-10 flex items-center justify-center text-gray-300">...</span>;
                        return null;
                      }
                    }
                    return (
                      <Motion.button
                        key={p}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPageChange(p)}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                          page === p
                            ? 'bg-pink-500 text-white'
                            : 'bg-white dark:bg-dark-card border border-pink-100 dark:border-dark-border text-gray-400 dark:text-dark-muted hover:bg-pink-50 dark:hover:bg-dark-bg'
                        }`}
                      >
                        {p}
                      </Motion.button>
                    );
                  })}
                </div>
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl bg-white dark:bg-dark-card border border-pink-100 dark:border-dark-border text-gray-400 dark:text-dark-muted hover:text-pink-500 hover:border-pink-200 dark:hover:border-dark-muted transition-all rotate-180 disabled:opacity-30"
                >
                  <Icon name="arrowLeft" className="w-4 h-4" />
                </Motion.button>
              </div>
            </div>
          )}
        </Motion.div>
      </div>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleFormSubmit} 
        transaction={editingTransaction}
      />
    </Layout>
  );
}
