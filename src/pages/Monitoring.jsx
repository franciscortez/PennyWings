import React, { useState } from "react";
import Layout from "../components/Layout";
import BudgetList from "../components/budgets/BudgetList";
import BudgetForm from "../components/budgets/BudgetForm";
import GoalList from "../components/goals/GoalList";
import GoalForm from "../components/goals/GoalForm";
import { useBudgets } from "../hooks/useBudgets";
import { useBudgetStats } from "../hooks/useBudgetStats";
import { useGoals } from "../hooks/useGoals";
import { getToast } from "../utils/toast";
import { getConfirm, confirmPresets } from "../utils/confirm";
import { useTheme } from "../contexts/ThemeContext";
import { motion as Motion, AnimatePresence } from "motion/react";
import AnimatedPage from "../components/common/AnimatedPage";
import Icon from "../components/Icon";

import { useSearchParams } from "react-router-dom";

export default function Monitoring() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'goals';
  
  // Tab State
  const [activeTab, setActiveTab] = useState(initialTab); // 'goals' or 'budgets'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Budgets State & Logic
  const { budgets, loading: budgetsLoading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { data: budgetStats = {}, isLoading: statsLoading } = useBudgetStats();
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);

  // Goals State & Logic
  const { goals, loading: goalsLoading, addGoal, updateGoal, deleteGoal } = useGoals();
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);



  // Budget Handlers
  const handleBudgetSubmit = async (formData) => {
    setIsSubmittingBudget(true);
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, formData);
        getToast(theme).fire({ icon: 'success', title: 'Budget updated' });
      } else {
        await addBudget(formData);
        getToast(theme).fire({ icon: 'success', title: 'Budget created' });
      }
      setIsBudgetFormOpen(false);
    } catch (error) {
      getToast(theme).fire({ icon: 'error', title: error.message });
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  const handleBudgetDelete = async (id) => {
    const result = await getConfirm(theme).fire(confirmPresets.deleteItem('Budget'));
    if (result.isConfirmed) {
      try {
        await deleteBudget(id);
        getToast(theme).fire({ icon: 'success', title: 'Deleted' });
      } catch (error) {
        getToast(theme).fire({ icon: 'error', title: 'Failed' });
      }
    }
  };


  // Goal Handlers
  const handleGoalSubmit = async (formData) => {
    setIsSubmittingGoal(true);
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, formData);
        getToast(theme).fire({ icon: 'success', title: 'Goal updated' });
      } else {
        await addGoal(formData);
        getToast(theme).fire({ icon: 'success', title: 'Goal launched!' });
      }
      setIsGoalFormOpen(false);
    } catch (error) {
      getToast(theme).fire({ icon: 'error', title: error.message });
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleGoalDelete = async (id) => {
    const result = await getConfirm(theme).fire(confirmPresets.deleteItem('Goal'));
    if (result.isConfirmed) {
      try {
        await deleteGoal(id);
        getToast(theme).fire({ icon: 'success', title: 'Deleted' });
      } catch (error) {
        getToast(theme).fire({ icon: 'error', title: 'Failed' });
      }
    }
  };


  return (
    <Layout>
      <AnimatedPage>
        <div className="space-y-10 pb-20">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-dark-text tracking-tight mb-2">
                Monitoring
              </h1>
              <p className="text-sm sm:text-base text-gray-400 dark:text-dark-muted font-medium italic">
                Plan your future, one penny at a time.
              </p>
            </div>

            {/* Tab Switched */}
            <div className="flex bg-white dark:bg-dark-card p-1.5 rounded-[1.5rem] border border-pink-50 dark:border-dark-border shadow-sm self-start">
              <button
                onClick={() => handleTabChange('goals')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'goals' 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-none scale-105' 
                    : 'text-gray-400 dark:text-dark-muted hover:text-pink-500'
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => handleTabChange('budgets')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'budgets' 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-none scale-105' 
                    : 'text-gray-400 dark:text-dark-muted hover:text-pink-500'
                }`}
              >
                Budgets
              </button>
            </div>

          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'goals' ? (
              <Motion.div
                key="goals"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GoalList 
                  goals={goals} 
                  loading={goalsLoading}
                  onEdit={(g) => { setEditingGoal(g); setIsGoalFormOpen(true); }}
                  onDelete={handleGoalDelete}
                  onAdd={() => { setEditingGoal(null); setIsGoalFormOpen(true); }}
                />
              </Motion.div>
            ) : (
              <Motion.div
                key="budgets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BudgetList 
                  budgets={budgets} 
                  stats={budgetStats} 
                  loading={budgetsLoading || statsLoading}
                  onEdit={(b) => { setEditingBudget(b); setIsBudgetFormOpen(true); }}
                  onDelete={handleBudgetDelete}
                  onAdd={() => { setEditingBudget(null); setIsBudgetFormOpen(true); }}
                />
              </Motion.div>
            )}
          </AnimatePresence>

        </div>
      </AnimatedPage>

      {/* Forms */}
      <AnimatePresence>
        {isBudgetFormOpen && (
          <BudgetForm
            budget={editingBudget}
            onSubmit={handleBudgetSubmit}
            onCancel={() => setIsBudgetFormOpen(false)}
            loading={isSubmittingBudget}
          />
        )}
        {isGoalFormOpen && (
          <GoalForm
            goal={editingGoal}
            onSubmit={handleGoalSubmit}
            onCancel={() => setIsGoalFormOpen(false)}
            loading={isSubmittingGoal}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
