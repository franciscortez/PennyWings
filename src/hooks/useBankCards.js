import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export const useBankCards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const cardsQuery = useQuery({
    queryKey: ["bank_cards", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bank_cards")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const invalidateAccounts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bank_cards", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions", user?.id] });
  }, [queryClient, user?.id]);

  const addMutation = useMutation({
    mutationFn: async (cardData) => {
      const { data, error } = await supabase
        .from("bank_cards")
        .insert([{ ...cardData, user_id: user?.id }])
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
        .from("bank_cards")
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
      const { error } = await supabase.from("bank_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAccounts();
    },
  });

  // Real-time subscription removed (now handled by useRealtimeSync in Layout)

  return {
    cards: cardsQuery.data || [],
    loading: cardsQuery.isLoading || addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: cardsQuery.error || addMutation.error || updateMutation.error || deleteMutation.error,
    addCard: addMutation.mutateAsync,
    updateCard: (id, updates) => updateMutation.mutateAsync({ id, updates }),
    deleteCard: deleteMutation.mutateAsync,
    refreshCards: () => queryClient.invalidateQueries({ queryKey: ["bank_cards", user?.id] }),
  };
};
