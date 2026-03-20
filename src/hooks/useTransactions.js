import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const TX_SELECT = `
  id, type, payment_method, amount, description, transaction_date, card_id, wallet_id, category_id,
  to_card_id, to_wallet_id,
  category:categories(name, icon, color),
  card:bank_cards!transactions_card_id_fkey(card_name, color),
  wallet:e_wallets!transactions_wallet_id_fkey(wallet_name, color),
  to_card:bank_cards!transactions_to_card_id_fkey(card_name, color),
  to_wallet:e_wallets!transactions_to_wallet_id_fkey(wallet_name, color)
`;

// Helper: Get Cash Wallet ID (needed for withdrawal special case if still handled on client, 
// but we moved cash logic to RPC, so this is now redundant for balance updates but might be useful for other things)
const getCashWalletId = async (userId) => {
  const { data, error } = await supabase
    .from("e_wallets")
    .select("id")
    .eq("user_id", userId)
    .eq("wallet_type", "cash")
    .single();

  if (error) return null;
  return data.id;
};

const getAccountBalance = async (cardId, walletId) => {
  if (cardId) {
    const { data } = await supabase.from("bank_cards").select("balance").eq("id", cardId).single();
    return data?.balance || 0;
  }
  if (walletId) {
    const { data } = await supabase.from("e_wallets").select("balance").eq("id", walletId).single();
    return data?.balance || 0;
  }
  return 0;
};

export const useTransactions = ({ page = 1, pageSize = 10, search = '', type = 'all' } = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions", user?.id, page, pageSize, search, type],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // First query: Get exact count without joins to avoid PostgREST parsing errors
      let countQuery = supabase
        .from("transactions")
        .select('*', { count: 'exact', head: true })
        .eq("user_id", user?.id);

      if (type !== 'all') countQuery = countQuery.eq('type', type);
      if (search) countQuery = countQuery.ilike('description', `%${search}%`);

      const { count, error: countError } = await countQuery;
      if (countError) throw countError;

      // Second query: Fetch paginated data with explicit joins
      let dataQuery = supabase
        .from("transactions")
        .select(TX_SELECT)
        .eq("user_id", user?.id)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (type !== 'all') dataQuery = dataQuery.eq('type', type);
      if (search) dataQuery = dataQuery.ilike('description', `%${search}%`);

      const { data, error: dataError } = await dataQuery;
      if (dataError) throw dataError;

      return {
        data: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
    enabled: !!user,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["monthly_stats", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["bank_cards", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["e_wallets", user?.id] });
  }, [queryClient, user?.id]);

  const addMutation = useMutation({
    mutationFn: async (transactionData) => {
      const amount = Number(transactionData.amount);
      const isDeduction = transactionData.type === "expense" || transactionData.type === "withdrawal" || transactionData.type === "transfer";

      // Validate balance for deductions (Client-side fast fail)
      if (isDeduction) {
        const currentBalance = await getAccountBalance(transactionData.card_id, transactionData.wallet_id);
        if (amount > currentBalance) {
          throw new Error("Insufficient balance");
        }
      }

      const { data, error } = await supabase.rpc("process_transaction", {
        p_type: transactionData.type,
        p_amount: amount,
        p_description: transactionData.description,
        p_transaction_date: transactionData.transaction_date,
        p_category_id: transactionData.category_id,
        p_payment_method: transactionData.payment_method,
        p_card_id: transactionData.card_id,
        p_wallet_id: transactionData.wallet_id,
        p_to_card_id: transactionData.to_card_id,
        p_to_wallet_id: transactionData.to_wallet_id
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (transaction) => {
      const { error } = await supabase.rpc("delete_transaction", {
        p_id: transaction.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      // Safety check: ensure all required fields are present to avoid overwriting with NULL
      const requiredFields = ['type', 'amount', 'transaction_date', 'category_id', 'payment_method'];
      const missing = requiredFields.filter(f => updates[f] === undefined);
      if (missing.length > 0) {
        throw new Error(`Missing required fields for update: ${missing.join(', ')}`);
      }

      const { error } = await supabase.rpc("update_transaction", {
        p_id: id,
        p_type: updates.type,
        p_amount: Number(updates.amount),
        p_description: updates.description,
        p_transaction_date: updates.transaction_date,
        p_category_id: updates.category_id,
        p_payment_method: updates.payment_method,
        p_card_id: updates.card_id,
        p_wallet_id: updates.wallet_id,
        p_to_card_id: updates.to_card_id,
        p_to_wallet_id: updates.to_wallet_id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel("transactions_changes")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` },
          () => invalidateAll()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user, queryClient, invalidateAll]);

  const queryResult = transactionsQuery.data || { data: [], totalCount: 0, totalPages: 0 };

  return {
    transactions: queryResult.data,
    totalCount: queryResult.totalCount,
    totalPages: queryResult.totalPages,
    loading: transactionsQuery.isLoading || addMutation.isPending || deleteMutation.isPending || updateMutation.isPending,
    error: transactionsQuery.error || addMutation.error || deleteMutation.error || updateMutation.error,
    addTransaction: addMutation.mutateAsync,
    updateTransaction: (id, updates) => updateMutation.mutateAsync({ id, updates }),
    deleteTransaction: deleteMutation.mutateAsync,
    refreshTransactions: () => queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] }),
  };
};
