import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Centralized real-time subscription hook
 * Prevents duplicate channels across multiple hooks
 */
export const useRealtimeSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('global_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bank_cards', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['bank_cards', user.id] });
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'e_wallets', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['e_wallets', user.id] });
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['transactions', user.id] });
        queryClient.invalidateQueries({ queryKey: ['recent_transactions', user.id] });
        queryClient.invalidateQueries({ queryKey: ['monthly_stats', user.id] });
        queryClient.invalidateQueries({ queryKey: ['report_transactions', user.id] });
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'budgets', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['budgets', user.id] });
        queryClient.invalidateQueries({ queryKey: ['budget_stats', user.id] });
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'goals', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['goals', user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
};
