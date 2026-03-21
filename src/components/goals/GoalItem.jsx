import React from 'react';
import Icon from '../Icon';
import ProgressBar from '../common/ProgressBar';
import { motion as Motion } from 'motion/react';
import { format, differenceInDays } from 'date-fns';

const GoalItem = ({ goal, onEdit, onDelete }) => {
  const percentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const isCompleted = goal.current_amount >= goal.target_amount;
  const daysLeft = goal.target_date ? differenceInDays(new Date(goal.target_date), new Date()) : null;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-card rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-pink-50 dark:border-dark-border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >

      {isCompleted && (
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-200">
            <Icon name="plus" className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h4 className="text-xl font-black text-gray-900 dark:text-dark-text tracking-tight mb-1 flex items-center gap-2">
            {goal.name}
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em]">
              Savings Goal
            </p>
            {goal.linked_account_name && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-pink-500 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                🔗 Linked: {goal.linked_account_name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(goal)}
            className="p-2 sm:p-3 bg-pink-50 dark:bg-dark-bg rounded-xl sm:rounded-2xl text-pink-500 hover:bg-pink-100 transition-colors shadow-sm"
          >
            <Icon name="edit" className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(goal.id)}
            className="p-2 sm:p-3 bg-rose-50 dark:bg-dark-bg rounded-xl sm:rounded-2xl text-rose-500 hover:bg-rose-100 transition-colors shadow-sm"
          >
            <Icon name="delete" className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-3xl font-black text-gray-900 dark:text-dark-text tracking-tighter">
              ₱{Number(goal.current_amount).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-gray-400 dark:text-dark-muted tracking-wide">
              TARGET: ₱{Number(goal.target_amount).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
             <p className={`text-sm font-black tracking-tight ${isCompleted ? 'text-emerald-500' : 'text-pink-500'}`}>
              {Math.round(percentage)}%
            </p>
            <p className="text-[9px] font-black text-gray-300 dark:text-dark-muted/50 uppercase tracking-widest">
              Progress
            </p>
          </div>
        </div>

        <ProgressBar 
          progress={percentage} 
          color={isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-pink-400 to-pink-600'} 
          height="h-4"
        />

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest">
            <Icon name="calendar" className="w-3.5 h-3.5" />
            {goal.target_date ? format(new Date(goal.target_date), 'MMM d, yyyy') : 'No Target Date'}
          </div>
          {daysLeft !== null && !isCompleted && (
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${daysLeft < 7 ? 'bg-rose-50 text-rose-500' : 'bg-pink-50 text-pink-500'}`}>
              {daysLeft < 0 ? 'Overdue' : `${daysLeft} days left`}
            </span>
          )}
          {isCompleted && (
            <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full uppercase tracking-tighter">
              Goal Reached!
            </span>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default GoalItem;
