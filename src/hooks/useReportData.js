import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuth } from './useAuth';

export const useReportData = (dateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['report_transactions', user?.id, format(dateRange.start, 'yyyy-MM-dd'), format(dateRange.end, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, type, amount, description, transaction_date,
          category:categories (
            name
          ),
          bank_cards:bank_cards!transactions_card_id_fkey (
            id, card_name
          ),
          e_wallets:e_wallets!transactions_wallet_id_fkey (
            id, wallet_name
          )
        `)
        .eq('user_id', user?.id)
        .gte('transaction_date', format(dateRange.start, 'yyyy-MM-dd'))
        .lte('transaction_date', format(dateRange.end, 'yyyy-MM-dd'))
        .order('transaction_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!dateRange.start && !!dateRange.end,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
