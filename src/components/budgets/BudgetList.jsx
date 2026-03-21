import React from 'react';
import BudgetItem from './BudgetItem';
import { motion as Motion, AnimatePresence } from 'motion/react';
import Icon from '../Icon';

const BudgetList = ({ budgets, stats, loading, onEdit, onDelete, onAdd }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-white dark:bg-dark-card rounded-[2rem] animate-pulse border border-pink-50 dark:border-dark-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900 dark:text-dark-text tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
          Active Budgets
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-pink-200 dark:shadow-none"
        >
          <Icon name="plus" className="w-4 h-4" />
          NEW BUDGET
        </button>
      </div>

      {budgets.length > 0 ? (
        <Motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {budgets.map(budget => (
              <BudgetItem
                key={budget.id}
                budget={budget}
                spent={stats[budget.category_id] || 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="py-20 text-center bg-pink-50/30 dark:bg-dark-bg/30 rounded-[3rem] border-2 border-dashed border-pink-100 dark:border-dark-border">
          <div className="w-16 h-16 bg-pink-100 dark:bg-dark-bg rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon name="reports" className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-500 dark:text-dark-muted font-black uppercase tracking-widest mb-2">No Budgets Set</p>
          <p className="text-sm text-gray-400 dark:text-dark-muted/80 max-w-xs mx-auto">
            Plan your spending by creating monthly budgets for your favorite categories.
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetList;
