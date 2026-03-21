import React from 'react';
import GoalItem from './GoalItem';
import SkeletonLoader from '../common/SkeletonLoader';
import { motion as Motion, AnimatePresence } from 'motion/react';
import Icon from '../Icon';

const GoalList = ({ goals, loading, onEdit, onDelete, onAdd }) => {
  if (loading) {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <SkeletonLoader className="h-8 w-48" />
          <SkeletonLoader className="h-12 w-40 rounded-[1.5rem]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-pink-50 dark:border-dark-border space-y-5">
              <div className="flex items-center justify-between">
                <SkeletonLoader className="h-6 w-32" />
                <SkeletonLoader className="h-6 w-16 rounded-full" />
              </div>
              <SkeletonLoader className="h-4 w-2/3" />
              <SkeletonLoader className="h-4 w-full rounded-full" />
              <div className="flex justify-between">
                <SkeletonLoader className="h-4 w-24" />
                <SkeletonLoader className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
          Financial Goals
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black rounded-[1.5rem] transition-all active:scale-95 shadow-xl shadow-pink-200 dark:shadow-none uppercase tracking-widest"
        >
          <Icon name="plus" className="w-5 h-5" />
          Add New Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <Motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {goals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="py-24 text-center bg-pink-50/30 dark:bg-dark-bg/30 rounded-[3.5rem] border-2 border-dashed border-pink-100 dark:border-dark-border">
          <div className="w-20 h-20 bg-white dark:bg-dark-bg rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-100/50 dark:shadow-none">
            <Icon name="plus" className="w-10 h-10 text-pink-500" />
          </div>
          <p className="text-xl font-black text-gray-900 dark:text-dark-text uppercase tracking-tight mb-2">Dream Big!</p>
          <p className="text-sm text-gray-400 dark:text-dark-muted/80 max-w-sm mx-auto font-medium">
            Whether it's a new car, a vacation, or an emergency fund—define your goals and keep track of your progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalList;
