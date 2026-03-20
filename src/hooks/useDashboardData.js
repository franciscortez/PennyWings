import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export const useDashboardData = (txLimit = 5) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 1. Fetch Cards
  const cardsQuery = useQuery({
    queryKey: ['bank_cards', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_cards')
        .select('id, card_name, card_type, balance, color, text_color')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!user,
  })

  // 2. Fetch Wallets
  const walletsQuery = useQuery({
    queryKey: ['e_wallets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('e_wallets')
        .select('id, wallet_name, wallet_type, balance, color, text_color')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!user,
  })

  // 3. Fetch Recent Transactions
  const transactionsQuery = useQuery({
    queryKey: ['recent_transactions', user?.id, txLimit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, type, amount, description, transaction_date,
          to_card_id, to_wallet_id,
          category:categories(name, icon, color),
          card:bank_cards!transactions_card_id_fkey(card_name, color),
          wallet:e_wallets!transactions_wallet_id_fkey(wallet_name, color),
          to_card:bank_cards!transactions_to_card_id_fkey(card_name, color),
          to_wallet:e_wallets!transactions_to_wallet_id_fkey(wallet_name, color)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(txLimit)
      if (error) throw error
      return data || []
    },
    enabled: !!user,
  })

  // 4. Fetch Monthly Stats
  const statsQuery = useQuery({
    queryKey: ['monthly_stats', user?.id],
    queryFn: async () => {
      const now = new Date()
      const padZero = (num) => num.toString().padStart(2, '0')
      const firstDay = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-01`
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const lastDayStr = `${lastDay.getFullYear()}-${padZero(lastDay.getMonth() + 1)}-${padZero(lastDay.getDate())}`

      const { data, error } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .gte('transaction_date', firstDay)
        .lte('transaction_date', lastDayStr)
      if (error) throw error

      return (data || []).reduce((acc, tx) => {
        const amount = Number(tx.amount || 0)
        if (tx.type === 'income') acc.income += amount
        else if (tx.type === 'expense') acc.expenses += amount
        return acc
      }, { income: 0, expenses: 0 })
    },
    enabled: !!user,
  })

  // Set up real-time subscriptions for cache invalidation
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('dashboard_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_cards', filter: `user_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ['bank_cards', user.id] })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'e_wallets', filter: `user_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ['e_wallets', user.id] })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ['recent_transactions', user.id] })
          queryClient.invalidateQueries({ queryKey: ['monthly_stats', user.id] })
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      }
    }
  }, [user, queryClient])

  return {
    cards: cardsQuery.data || [],
    wallets: walletsQuery.data || [],
    transactions: transactionsQuery.data || [],
    monthlyStats: statsQuery.data || { income: 0, expenses: 0 },
    loading: cardsQuery.isLoading || walletsQuery.isLoading || transactionsQuery.isLoading || statsQuery.isLoading,
    error: cardsQuery.error || walletsQuery.error || transactionsQuery.error || statsQuery.error,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ['bank_cards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['e_wallets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['recent_transactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['monthly_stats', user?.id] });
    }
  }
}
