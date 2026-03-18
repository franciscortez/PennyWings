import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, startOfYear, startOfWeek, subDays, subMonths } from 'date-fns';
import { getCategoryData, getTrendData, getReportSummary } from '../utils/reportUtils';
import Layout from '../components/Layout';
import ReportSummary from '../components/reports/ReportSummary';
import SpendingChart from '../components/reports/SpendingChart';
import AllocationChart from '../components/reports/AllocationChart';
import Icon from '../components/Icon';
import Swal from 'sweetalert2';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  
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
      case 'lastMonth':
        const lastM = subMonths(today, 1);
        return { start: startOfMonth(lastM), end: endOfMonth(lastM) };
      case 'year':
        return { start: startOfYear(today), end: today };
      case 'month':
      default:
        return { start: startOfMonth(today), end: endOfMonth(today) };
    }
  }, [timeframe]);


  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name
          ),
          bank_cards (
            id, card_name
          ),
          e_wallets (
            id, wallet_name
          )
        `)
        .eq('user_id', user.id)
        .gte('transaction_date', format(dateRange.start, 'yyyy-MM-dd'))
        .lte('transaction_date', format(dateRange.end, 'yyyy-MM-dd'))
        .order('transaction_date', { ascending: true });

      if (error) throw error;
      setAllTransactions(data || []);
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load report data. Please try again.',
        confirmButtonColor: '#EC4899',
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && allTransactions.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
                 <Icon name="reports" color="white" className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Financial Insights</h1>
            </div>
            <p className="text-gray-500 font-medium italic">
              "Every penny tells a story. Let's see yours."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Provider Filter */}
            {availableProviders.length > 0 && (
              <div className="relative">
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-5 pr-12 py-3 bg-white/80 backdrop-blur-xl border border-pink-100 rounded-[2rem] text-sm font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all cursor-pointer hover:shadow-md"
                >
                  <option value="all">All Accounts</option>
                  {availableProviders.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                  <Icon name="chevronDown" className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Timeframe Filter */}
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-5 pr-10 py-3 bg-white/80 backdrop-blur-xl border border-pink-100 rounded-[2rem] text-sm font-bold text-pink-600 shadow-lg shadow-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-300 transition-all cursor-pointer hover:scale-105"
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
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Summary & Allocation */}
          <div className="lg:col-span-1 space-y-8">
            <ReportSummary summary={summary} />
            <AllocationChart data={categoryData} />
          </div>

          {/* Right Column: Trends */}
          <div className="lg:col-span-2 space-y-8">
            < SpendingChart data={trendData} />
            
            {/* Recent Performance Note */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-10 text-white shadow-2xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full translate-x-20 translate-y-[-20px] blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-pink-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Efficiency</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter">Pulse Check</h4>
                <p className="text-gray-400 font-medium mb-8 leading-relaxed max-w-xl">
                  You've managed a total flow of <span className="text-white font-bold text-lg">₱{summary.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> in expenses. 
                   {" "}{getPulseMessage()}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Savings Rate</p>
                     <p className="text-2xl font-black">{savingsRate}{savingsRate !== "N/A" && "%"}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Burn Rate</p>
                     <p className="text-2xl font-black">{burnRate}{burnRate !== "N/A" && "%"}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
