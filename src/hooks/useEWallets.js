import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export const useEWallets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const walletsQuery = useQuery({
    queryKey: ["e_wallets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_wallets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const invalidateAccounts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["e_wallets", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions", user?.id] });
  }, [queryClient, user?.id]);

  const addMutation = useMutation({
    mutationFn: async (walletData) => {
      const { data, error } = await supabase
        .from("e_wallets")
        .insert([{ ...walletData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAccounts();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("e_wallets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAccounts();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("e_wallets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAccounts();
    },
  });

  // Real-time subscription removed (now handled by useRealtimeSync in Layout)

  return {
    wallets: walletsQuery.data || [],
    loading: walletsQuery.isLoading || addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: walletsQuery.error || addMutation.error || updateMutation.error || deleteMutation.error,
    addWallet: addMutation.mutateAsync,
    updateWallet: (id, updates) => updateMutation.mutateAsync({ id, updates }),
    deleteWallet: deleteMutation.mutateAsync,
    refreshWallets: () => queryClient.invalidateQueries({ queryKey: ["e_wallets", user?.id] }),
  };
};
