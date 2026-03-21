import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const BUDGET_SELECT = `
  id, user_id, category_id, limit_amount, period, created_at, updated_at,
  category:categories(name, icon, color)
`;

export const useBudgets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const budgetsQuery = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select(BUDGET_SELECT)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["budgets", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["dashboard_budgets", user?.id] });
  }, [queryClient, user?.id]);

  const addBudgetMutation = useMutation({
    mutationFn: async (budgetData) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert([{ ...budgetData, user_id: user.id }])
        .select(BUDGET_SELECT)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select(BUDGET_SELECT)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateAll();
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("budgets")
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
        .channel("budgets_changes")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "budgets", filter: `user_id=eq.${user.id}` },
          () => invalidateAll()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user, invalidateAll]);

  return {
    budgets: budgetsQuery.data || [],
    loading: budgetsQuery.isLoading || addBudgetMutation.isPending || updateBudgetMutation.isPending || deleteBudgetMutation.isPending,
    error: budgetsQuery.error || addBudgetMutation.error || updateBudgetMutation.error || deleteBudgetMutation.error,
    addBudget: addBudgetMutation.mutateAsync,
    updateBudget: (id, updates) => updateBudgetMutation.mutateAsync({ id, updates }),
    deleteBudget: deleteBudgetMutation.mutateAsync,
    refreshBudgets: () => queryClient.invalidateQueries({ queryKey: ["budgets", user?.id] }),
  };
};
