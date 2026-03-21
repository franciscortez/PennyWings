import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { useCategories } from '../../hooks/useCategories';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { getToast } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

const BudgetForm = ({ budget, onSubmit, onCancel, loading }) => {
  const { categories } = useCategories();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    category_id: '',
    limit_amount: '',
    period: 'monthly'
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category_id: budget.category_id || '',
        limit_amount: budget.limit_amount || '',
        period: budget.period || 'monthly'
      });
    }
  }, [budget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.limit_amount) {
      getToast(theme).fire({
        icon: 'warning',
        title: 'Fill in all required fields'
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <Motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-dark-card w-full md:max-w-lg rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-pink-50 dark:border-dark-border flex flex-col max-h-[95vh] md:max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-dark-text tracking-tight">
                {budget ? 'Edit Budget' : 'New Budget'}
              </h2>
              <p className="text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest mt-1">Set your spending limits</p>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 bg-gray-50 dark:bg-dark-bg hover:bg-pink-50 hover:text-pink-500 rounded-full text-gray-400 dark:text-dark-muted transition-colors active:scale-90"
            >
              <Icon name="x" className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em] ml-2">Select Category</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-500 transition-colors">
                  <Icon name="reports" className="w-5 h-5" />
                </div>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-pink-50/30 dark:bg-dark-bg border-2 border-pink-50/50 dark:border-dark-border rounded-[2rem] text-sm font-bold text-gray-700 dark:text-dark-text outline-none focus:border-pink-500 focus:bg-white dark:focus:bg-dark-card transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose a category...</option>
                  {categories.filter(c => c.type === 'expense').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Icon name="chevronDown" className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.2em] ml-2">Monthly Limit (₱)</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-500 transition-colors">
                  <Icon name="cash" className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.limit_amount}
                  onChange={e => setFormData({ ...formData, limit_amount: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-pink-50/30 dark:bg-dark-bg border-2 border-pink-50/50 dark:border-dark-border rounded-[2rem] text-lg font-black text-gray-900 dark:text-dark-text outline-none focus:border-pink-500 focus:bg-white dark:focus:bg-dark-card transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-5 bg-gray-50 dark:bg-dark-bg text-gray-500 text-sm font-black rounded-3xl hover:bg-gray-100 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black rounded-3xl transition-all active:scale-95 shadow-xl shadow-pink-200 dark:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default BudgetForm;
