import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useTransactions = (limit = 10) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async (background = false) => {
    try {
      if (!background) setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(name, icon, color),
          card:bank_cards(card_name, color),
          wallet:e_wallets(wallet_name, color)
        `)
        .eq('user_id', user?.id)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      if (!background) setLoading(false)
    }
  }, [user?.id, limit])

  useEffect(() => {
    if (user) {
      fetchTransactions()

      const subscription = supabase
        .channel('transactions_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
          () => fetchTransactions(true)
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [user, fetchTransactions])

  const addTransaction = async (transactionData) => {
    try {
      const tempId = 'temp-' + Date.now();
      const optimisticTx = {
        ...transactionData,
        id: tempId,
        user_id: user?.id,
        category: {},
        card: {},
        wallet: {}
      }
      setTransactions(prev => [optimisticTx, ...prev].slice(0, limit))

      // 1. Insert Transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([{ ...transactionData, user_id: user?.id }])
        .select()
        .single()

      if (txError) throw txError
      
      setTransactions(prev => prev.map(t => t.id === tempId ? { ...transaction, category: {}, card: {}, wallet: {} } : t))

      // 2. Update Balance if card_id or wallet_id is provided
      const amount = Number(transaction.amount)
      const isIncome = transaction.type === 'income'
      
      if (transaction.card_id) {
        const { data: card } = await supabase
          .from('bank_cards')
          .select('balance')
          .eq('id', transaction.card_id)
          .single()

        if (card) {
          const newBalance = isIncome 
            ? Number(card.balance) + amount 
            : Number(card.balance) - amount
            
          await supabase
            .from('bank_cards')
            .update({ balance: newBalance })
            .eq('id', transaction.card_id)
        }
      } else if (transaction.wallet_id) {
        const { data: wallet } = await supabase
          .from('e_wallets')
          .select('balance')
          .eq('id', transaction.wallet_id)
          .single()

        if (wallet) {
          const newBalance = isIncome 
            ? Number(wallet.balance) + amount 
            : Number(wallet.balance) - amount
            
          await supabase
            .from('e_wallets')
            .update({ balance: newBalance })
            .eq('id', transaction.wallet_id)
        }
      }

      return { data: transaction, error: null }
    } catch (err) {
      console.error('Error adding transaction:', err)
      fetchTransactions(true)
      return { data: null, error: err.message }
    }
  }

  const deleteTransaction = async (transaction) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== transaction.id))
      
      // 1. Delete Transaction
      const { error: delError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id)

      if (delError) throw delError

      // 2. Revert Balance
      const amount = Number(transaction.amount)
      const isIncome = transaction.type === 'income'
      
      if (transaction.card_id) {
        const { data: card } = await supabase
          .from('bank_cards')
          .select('balance')
          .eq('id', transaction.card_id)
          .single()

        if (card) {
          const newBalance = isIncome 
            ? Number(card.balance) - amount 
            : Number(card.balance) + amount
            
          await supabase
            .from('bank_cards')
            .update({ balance: newBalance })
            .eq('id', transaction.card_id)
        }
      } else if (transaction.wallet_id) {
        const { data: wallet } = await supabase
          .from('e_wallets')
          .select('balance')
          .eq('id', transaction.wallet_id)
          .single()

        if (wallet) {
          const newBalance = isIncome 
            ? Number(wallet.balance) - amount 
            : Number(wallet.balance) + amount
            
          await supabase
            .from('e_wallets')
            .update({ balance: newBalance })
            .eq('id', transaction.wallet_id)
        }
      }

      return { error: null }
    } catch (err) {
      console.error('Error deleting transaction:', err)
      fetchTransactions(true)
      return { error: err.message }
    }
  }

  const updateTransaction = async (id, updates, oldTransaction) => {
    try {
      // For simplicity in MVP, we delete and re-add or just revert and apply
      // Revert old
      await deleteTransaction(oldTransaction)
      // Add new
      return await addTransaction({ ...oldTransaction, ...updates })
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions
  }
}
