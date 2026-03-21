import React from 'react';
import Icon from '../Icon';
import ProgressBar from '../common/ProgressBar';
import { motion as Motion } from 'motion/react';

const BudgetItem = ({ budget, spent = 0, onEdit, onDelete }) => {
  const percentage = budget.limit_amount > 0 ? (spent / budget.limit_amount) * 100 : 0;
  const isOverBudget = spent > budget.limit_amount;
  const remaining = budget.limit_amount - spent;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-dark-card rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 border border-pink-50 dark:border-dark-border shadow-sm hover:shadow-md transition-all group"
    >

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div>
            <h4 className="text-lg font-black text-gray-900 dark:text-dark-text tracking-tight">
              {budget.category?.name || 'Uncategorized'}
            </h4>
            <p className="text-xs font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest">
              {budget.period || 'Monthly'} Budget
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">

          <button 
            onClick={() => onEdit(budget)}
            className="p-2 hover:bg-pink-50 dark:hover:bg-dark-bg rounded-lg text-gray-400 hover:text-pink-500 transition-colors"
          >
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(budget.id)}
            className="p-2 hover:bg-rose-50 dark:hover:bg-dark-bg rounded-lg text-gray-400 hover:text-rose-500 transition-colors"
          >
            <Icon name="delete" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-dark-text tracking-tighter">
              ₱{spent.toLocaleString()}
              <span className="text-sm font-bold text-gray-400 dark:text-dark-muted tracking-normal ml-1">
                / ₱{Number(budget.limit_amount).toLocaleString()}
              </span>
            </p>
          </div>
          <p className={`text-xs font-black uppercase tracking-widest ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isOverBudget ? 'Over Budget' : 'On Track'}
          </p>
        </div>

        <ProgressBar 
          progress={percentage} 
          color={isOverBudget ? 'bg-rose-500' : 'bg-pink-500'} 
        />

        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em]">
          <span className="text-gray-400">{Math.round(percentage)}% USED</span>
          <span className={isOverBudget ? 'text-rose-400' : 'text-gray-400'}>
            {isOverBudget ? `Exceeded by ₱${Math.abs(remaining).toLocaleString()}` : `₱${remaining.toLocaleString()} left`}
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

export default BudgetItem;
