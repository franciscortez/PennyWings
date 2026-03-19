import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format, startOfMonth, endOfMonth, startOfYear, startOfWeek, subDays, subMonths } from 'date-fns';
import { getCategoryData, getTrendData, getReportSummary } from '../utils/reportUtils';
import { useReportData } from '../hooks/useReportData';
import Layout from '../components/Layout';
import ReportSummary from '../components/reports/ReportSummary';
import SpendingChart from '../components/reports/SpendingChart';
import AllocationChart from '../components/reports/AllocationChart';
import Icon from '../components/Icon';
import Swal from 'sweetalert2';
import { motion as Motion, AnimatePresence } from 'motion/react'
import SkeletonLoader from '../components/common/SkeletonLoader';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Reports() {
  const { user } = useAuth();
  
  // Filtering States
  const [timeframe, setTimeframe] = useState('month'); 
  const [filterProvider, setFilterProvider] = useState('all');

  // Timeframe calculation
  const dateRange = useMemo(() => {
    const today = new Date();
    switch (timeframe) {
      case 'week':
        return { start: startOfWeek(today), end: today };
      case '30days':
        return { start: subDays(today, 30), end: today };
      case 'lastMonth': {
        const lastM = subMonths(today, 1);
        return { start: startOfMonth(lastM), end: endOfMonth(lastM) };
      }
      case 'year':
        return { start: startOfYear(today), end: today };
      case 'month':
      default:
        return { start: startOfMonth(today), end: endOfMonth(today) };
    }
  }, [timeframe]);

  // Use TanStack Query hook for data fetching
  const { 
    data: allTransactions = [], 
    isLoading, 
    error: fetchError 
  } = useReportData(dateRange);

  useEffect(() => {
    if (fetchError) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load report data. Please try again.',
        confirmButtonColor: '#EC4899',
        customClass: {
          popup: 'rounded-[2.5rem]'
        }
      });
    }
  }, [fetchError]);

  // Derive providers from fetched transactions to populate the sub-filter
  const availableProviders = useMemo(() => {
    const providers = [];
    allTransactions.forEach(t => {
      if (t.card_id && t.bank_cards) {
        if (!providers.some(p => p.id === t.card_id)) {
          providers.push({ id: t.card_id, name: t.bank_cards.card_name, type: 'card' });
        }
      } else if (t.wallet_id && t.e_wallets) {
        if (!providers.some(p => p.id === t.wallet_id)) {
          providers.push({ id: t.wallet_id, name: t.e_wallets.wallet_name, type: 'wallet' });
        }
      } else if (t.payment_method === 'cash') {
        if (!providers.some(p => p.id === 'cash')) {
          providers.push({ id: 'cash', name: 'Cash', type: 'cash' });
        }
      }
    });
    return providers;
  }, [allTransactions]);

  // Apply Provider Filter
  const filteredTransactions = useMemo(() => {
    if (filterProvider === 'all') return allTransactions;
    if (filterProvider === 'cash') return allTransactions.filter(t => t.payment_method === 'cash');
    return allTransactions.filter(t => t.card_id === filterProvider || t.wallet_id === filterProvider);
  }, [allTransactions, filterProvider]);


  // Computed Data for Charts and UI
  const summary = useMemo(() => getReportSummary(filteredTransactions), [filteredTransactions]);
  const trendData = useMemo(() => getTrendData(filteredTransactions, dateRange.start, dateRange.end), [filteredTransactions, dateRange]);
  const categoryData = useMemo(() => getCategoryData(filteredTransactions), [filteredTransactions]);

  // Pulse Check Math
  const savingsRate = summary.income > 0 
    ? (((summary.income - summary.expense) / summary.income) * 100).toFixed(0) 
    : "N/A";
  
  const burnRate = summary.income > 0 
    ? ((summary.expense / summary.income) * 100).toFixed(0) 
    : "N/A";

  const getPulseMessage = () => {
    if (summary.expense === 0 && summary.income === 0) return "It's quiet... no flow recorded yet.";
    if (summary.net > 0) return "Your wings are strong! You've successfully kept more pennies in the nest this period.";
    return "Your pennies are flying a bit too fast. Let's aim for a calmer flight going forward.";
  };

  if (isLoading && allTransactions.length === 0) {
    return (
      <Layout>
        <div className="space-y-10 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <SkeletonLoader className="w-48 h-10 rounded-xl" />
              <SkeletonLoader className="w-64 h-5 rounded-lg" />
            </div>
            <div className="flex gap-4">
              <SkeletonLoader className="w-32 h-12 rounded-[2rem]" />
              <SkeletonLoader className="w-32 h-12 rounded-[2rem]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <SkeletonLoader className="w-full h-64 rounded-[3rem]" />
              <SkeletonLoader className="w-full h-80 rounded-[3rem]" />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <SkeletonLoader className="w-full h-[400px] rounded-[3rem]" />
              <SkeletonLoader className="w-full h-64 rounded-[3rem]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10 pb-20"
      >
        <Motion.header 
          variants={item}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center"
              >
                 <Icon name="reports" color="white" className="w-6 h-6" />
              </Motion.div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-dark-text tracking-tight">Financial Insights</h1>
            </div>
            <p className="text-gray-500 dark:text-dark-muted font-medium italic">
              "Every penny tells a story. Let's see yours."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Provider Filter */}
            {availableProviders.length > 0 && (
              <Motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-5 pr-12 py-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-pink-100 dark:border-dark-border rounded-[2rem] text-sm font-bold text-gray-700 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all cursor-pointer"
                >
                  <option value="all">All Accounts</option>
                  {availableProviders.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                  <Icon name="chevronDown" className="w-4 h-4" />
                </div>
              </Motion.div>
            )}

            {/* Timeframe Filter */}
            <Motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-5 pr-10 py-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-pink-100 dark:border-dark-border rounded-[2rem] text-sm font-bold text-pink-600 dark:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all cursor-pointer hover:scale-105"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="30days">Last 30 Days</option>
                <option value="year">This Year</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-500">
                <Icon name="calendar" className="w-4 h-4" />
              </div>
            </Motion.div>
          </div>
        </Motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Summary & Allocation */}
          <div className="lg:col-span-1 space-y-8">
            <Motion.div variants={item}>
              <ReportSummary summary={summary} />
            </Motion.div>
            <Motion.div variants={item}>
              <AllocationChart data={categoryData} />
            </Motion.div>
          </div>

          {/* Right Column: Trends */}
          <div className="lg:col-span-2 space-y-8">
            <Motion.div variants={item}>
              < SpendingChart data={trendData} />
            </Motion.div>
            
            {/* Recent Performance Note */}
            <Motion.div 
              variants={item}
              whileHover={{ y: -5 }}
              className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-dark-card dark:to-dark-bg rounded-[3rem] p-10 text-white group border border-white/5 dark:border-dark-border"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full translate-x-20 translate-y-[-20px] blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-pink-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Efficiency</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter">Pulse Check</h4>
                <AnimatePresence mode="wait">
                  <Motion.p 
                    key={getPulseMessage()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-400 dark:text-dark-muted font-medium mb-8 leading-relaxed max-w-xl"
                  >
                    You've managed a total flow of <span className="text-white font-bold text-lg">₱{summary.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> in expenses. 
                    {" "}{getPulseMessage()}
                  </Motion.p>
                </AnimatePresence>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   <Motion.div 
                     whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                     className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
                   >
                     <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Savings Rate</p>
                     <p className="text-2xl font-black">{savingsRate}{savingsRate !== "N/A" && "%"}</p>
                   </Motion.div>
                   <Motion.div 
                     whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                     className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
                   >
                     <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Burn Rate</p>
                     <p className="text-2xl font-black">{burnRate}{burnRate !== "N/A" && "%"}</p>
                   </Motion.div>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </Motion.div>
    </Layout>
  );
}
