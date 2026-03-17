import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useBankCards = () => {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCards = useCallback(async (background = false) => {
    try {
      if (!background) setLoading(true)
      const { data, error } = await supabase
        .from('bank_cards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      if (!background) setLoading(false)
    }
  }, [user?.id])

  const addCard = async (cardData) => {
    try {
      const { data, error } = await supabase
        .from('bank_cards')
        .insert([{ ...cardData, user_id: user?.id }])
        .select()

      if (error) throw error
      if (data) setCards(prev => [data[0], ...prev])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  const updateCard = async (id, updates) => {
    try {
      setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
      const { data, error } = await supabase
        .from('bank_cards')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      fetchCards(true) // Revert on error
      return { data: null, error: err.message }
    }
  }

  const deleteCard = async (id) => {
    try {
      setCards(prev => prev.filter(c => c.id !== id))
      const { error } = await supabase
        .from('bank_cards')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      fetchCards(true) // Revert on error
      return { error: err.message }
    }
  }

  useEffect(() => {
    if (user) {
      fetchCards()

      // Real-time subscription
      const subscription = supabase
        .channel('bank_cards_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bank_cards', filter: `user_id=eq.${user.id}` }, 
          () => {
            fetchCards(true)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [user, fetchCards])

  return {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    refreshCards: fetchCards
  }
}
