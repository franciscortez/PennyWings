import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useBudgetStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['budget_stats', user?.id],
    queryFn: async () => {
      const now = new Date();
      const firstDay = format(startOfMonth(now), 'yyyy-MM-dd');
      const lastDay = format(endOfMonth(now), 'yyyy-MM-dd');

      // Fetch all expense transactions for the current month
      const { data, error } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('transaction_date', firstDay)
        .lte('transaction_date', lastDay);

      if (error) throw error;

      // Group by category_id and sum amounts
      const stats = (data || []).reduce((acc, tx) => {
        acc[tx.category_id] = (acc[tx.category_id] || 0) + Number(tx.amount);
        return acc;
      }, {});

      return stats;
    },
    enabled: !!user,
  });
};
