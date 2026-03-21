import { useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useBankCards } from "./useBankCards";
import { useEWallets } from "./useEWallets";

export const useGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { cards } = useBankCards();
  const { wallets } = useEWallets();

  const goalsQuery = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["goals", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["dashboard_goals", user?.id] });
  }, [queryClient, user?.id]);

  const addGoalMutation = useMutation({
    mutationFn: async (goalData) => {
      const { data, error } = await supabase
        .from("goals")
        .insert([{ ...goalData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel("goals_changes")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "goals", filter: `user_id=eq.${user.id}` },
          () => invalidateAll()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user, invalidateAll]);

  const rawGoals = goalsQuery.data || [];
  const computedGoals = useMemo(() => {
    return rawGoals.map((goal) => {
      let current_amount = Number(goal.current_amount) || 0;
      let linked_account_name = null;
      let linked_account_type = null;

      if (goal.linked_card_id && cards) {
        const card = cards.find((c) => c.id === goal.linked_card_id);
        if (card) {
          current_amount = Number(card.balance) || 0;
          linked_account_name = card.card_name;
          linked_account_type = "card";
        }
      } else if (goal.linked_wallet_id && wallets) {
        const wallet = wallets.find((w) => w.id === goal.linked_wallet_id);
        if (wallet) {
          current_amount = Number(wallet.balance) || 0;
          linked_account_name = wallet.wallet_name;
          linked_account_type = "ewallet";
        }
      }

      return {
        ...goal,
        current_amount,
        linked_account_name,
        linked_account_type,
      };
    });
  }, [rawGoals, cards, wallets]);

  return {
    goals: computedGoals,
    loading: goalsQuery.isLoading || addGoalMutation.isPending || updateGoalMutation.isPending || deleteGoalMutation.isPending,
    error: goalsQuery.error || addGoalMutation.error || updateGoalMutation.error || deleteGoalMutation.error,
    addGoal: addGoalMutation.mutateAsync,
    updateGoal: (id, updates) => updateGoalMutation.mutateAsync({ id, updates }),
    deleteGoal: deleteGoalMutation.mutateAsync,
    refreshGoals: () => queryClient.invalidateQueries({ queryKey: ["goals", user?.id] }),
  };
};
