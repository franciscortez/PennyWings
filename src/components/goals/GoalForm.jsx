import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { getToast } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';
import { useBankCards } from '../../hooks/useBankCards';
import { useEWallets } from '../../hooks/useEWallets';

const GoalForm = ({ goal, onSubmit, onCancel, loading }) => {
  const { theme } = useTheme();
  const { cards } = useBankCards();
  const { wallets } = useEWallets();

  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    target_date: '',
    link_type: 'card',
    linked_card_id: '',
    linked_wallet_id: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        target_amount: goal.target_amount || '',
        target_date: goal.target_date || '',
        link_type: goal.linked_wallet_id ? 'ewallet' : 'card',
        linked_card_id: goal.linked_card_id || '',
        linked_wallet_id: goal.linked_wallet_id || ''
      });
    }
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) {
      getToast(theme).fire({
        icon: 'warning',
        title: 'Please fill in Name and Target Amount'
      });
      return;
    }

    if (formData.link_type === 'card' && !formData.linked_card_id) {
      getToast(theme).fire({ icon: 'warning', title: 'Please select a Bank Card' });
      return;
    }
    if (formData.link_type === 'ewallet' && !formData.linked_wallet_id) {
      getToast(theme).fire({ icon: 'warning', title: 'Please select an E-Wallet' });
      return;
    }
    
    const submitData = { ...formData };
    if (submitData.link_type === 'card') {
      submitData.linked_wallet_id = null;
    } else if (submitData.link_type === 'ewallet') {
      submitData.linked_card_id = null;
    }
    
    submitData.current_amount = 0;
    delete submitData.link_type;
    onSubmit(submitData);
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md"
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
                {goal ? 'Edit Goal' : 'New Goal'}
              </h2>
              <p className="text-[10px] md:text-[11px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-widest mt-1">Make your dreams a reality</p>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 bg-pink-50 dark:bg-dark-bg hover:bg-pink-100 dark:hover:bg-gray-800 hover:text-pink-500 rounded-full text-pink-400 transition-colors active:scale-90"
            >
              <Icon name="x" className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.25em] ml-2">Goal Name</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g., New MacBook, Emergency Fund..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-pink-50/20 dark:bg-dark-bg border-2 border-pink-50/50 dark:border-dark-border rounded-[1.5rem] sm:rounded-[2rem] text-sm sm:text-base font-bold text-gray-800 dark:text-dark-text outline-none focus:border-pink-500 focus:bg-white dark:focus:bg-dark-card transition-all"
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 gap-4 sm:gap-6`}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.25em] ml-2">Target (₱)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.target_amount}
                  onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-pink-50/20 dark:bg-dark-bg border-2 border-pink-50/50 dark:border-dark-border rounded-[1.5rem] sm:rounded-[2rem] text-base sm:text-lg font-black text-gray-900 dark:text-dark-text outline-none focus:border-pink-500 focus:bg-white dark:focus:bg-dark-card transition-all"
                />
              </div>
            </div>

            {/* Account Link Selector */}
            <div className="bg-pink-50/30 dark:bg-dark-bg/30 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-pink-50 dark:border-dark-border space-y-4">
               <div>
                 <p className="text-[10px] font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1 mb-3">Linked Account</p>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <select
                     value={formData.link_type}
                     onChange={e => setFormData({...formData, link_type: e.target.value, linked_card_id: '', linked_wallet_id: ''})}
                     className="flex-1 px-4 py-3 sm:py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white text-xs"
                   >
                     <option value="card">Bank Card</option>
                     <option value="ewallet">E-Wallet</option>
                   </select>
                   
                   {formData.link_type === 'card' && (
                     <select
                       required
                       value={formData.linked_card_id}
                       onChange={e => setFormData({...formData, linked_card_id: e.target.value})}
                       className="flex-1 px-4 py-3 sm:py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white text-xs"
                     >
                       <option value="">Select Card</option>
                       {cards.map(c => <option key={c.id} value={c.id}>{c.card_name}</option>)}
                     </select>
                   )}
                   
                   {formData.link_type === 'ewallet' && (
                     <select
                       required
                       value={formData.linked_wallet_id}
                       onChange={e => setFormData({...formData, linked_wallet_id: e.target.value})}
                       className="flex-1 px-4 py-3 sm:py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white text-xs"
                     >
                       <option value="">Select Wallet</option>
                       {wallets.filter(w => w.wallet_type !== 'cash').map(w => <option key={w.id} value={w.id}>{w.wallet_name}</option>)}
                     </select>
                   )}
                 </div>
               </div>
               
               <p className="text-[10px] text-pink-500 dark:text-pink-400 font-bold ml-1 flex items-center gap-1.5 leading-tight">
                 <Icon name="info" className="w-4 h-4 shrink-0" />
                 The Goal's current amount will automatically mirror this account's live balance.
               </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.25em] ml-2">Target Date</label>
              <div className="relative group">
                <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none z-10">
                  <Icon name="calendar" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                  className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-pink-50/20 dark:bg-dark-bg border-2 border-pink-50/50 dark:border-dark-border rounded-[1.25rem] sm:rounded-[2rem] text-sm sm:text-base font-bold text-gray-800 dark:text-dark-text outline-none focus:border-pink-500 focus:bg-white dark:focus:bg-dark-card transition-all appearance-none min-h-[56px] sm:min-h-0"
                />
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 sm:py-5 bg-gray-50 dark:bg-dark-bg text-gray-500 text-[10px] sm:text-sm font-black rounded-[1.5rem] sm:rounded-[2rem] hover:bg-gray-100 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 sm:py-5 bg-pink-500 hover:bg-pink-600 text-white text-[10px] sm:text-sm font-black rounded-[1.5rem] sm:rounded-[2rem] transition-all active:scale-95 shadow-xl shadow-pink-200 dark:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Saving...' : goal ? 'Update Goal' : 'Launch Goal'}
              </button>
            </div>
          </form>
        </div>
      </Motion.div>
    </Motion.div>

  );
};

export default GoalForm;
