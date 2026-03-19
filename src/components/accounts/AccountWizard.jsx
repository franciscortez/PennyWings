import React, { useState, useEffect } from 'react'
import Icon from '../Icon'
import { motion as Motion, AnimatePresence } from 'motion/react'
import Swal from 'sweetalert2'
import { useTheme } from '../../contexts/ThemeContext'
import { getToast } from '../../utils/toast'

const ACCOUNT_TYPES = [
  { id: 'traditional', label: 'Traditional Bank', icon: 'traditional' },
  { id: 'digital', label: 'Digital Bank', icon: 'digital' },
  { id: 'ewallet', label: 'E-Wallet', icon: 'ewallet' },
  { id: 'cash', label: 'Cash on Hand', icon: 'cash' },
]

const PROVIDERS = {
  digital: ['Maya', 'Gotyme', 'Seabank', 'Tonik', 'CIMB', 'Uno Bank', 'Others'],
  ewallet: ['GCash', 'Maya', 'GrabPay', 'PayPal'],
  traditional: ['BDO', 'BPI', 'Metrobank', 'Unionbank', 'Security Bank', 'PNB', 'Landbank', 'Others']
}

const COLOR_OPTIONS = [
  '#F472B6', '#EC4899', '#DB2777',
  '#60A5FA', '#3B82F6', '#2563EB',
  '#34D399', '#10B981', '#059669',
  '#A78BFA', '#8B5CF6', '#7C3AED',
  '#FBBF24', '#F59E0B', '#D97706',
  '#F87171', '#EF4444', '#DC2626',
]

const TEXT_COLOR_OPTIONS = [
  '#FFFFFF', '#F8FAFC', '#F1F5F9',
  '#000000', '#0F172A', '#1E293B',
  '#FCE7F3', '#FBCFE8', '#FEE2E2'
]

const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export default function AccountWizard({ isOpen, onClose, onSubmit, hasCashAccount }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    provider: '',
    account_name: '',
    balance: '',
    last_four: '', // for banks
    account_identifier: '', // for ewallets
    color: '#F472B6',
    text_color: '#FFFFFF'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData({
        type: '',
        provider: '',
        account_name: '',
        balance: '',
        last_four: '',
        account_identifier: '',
        color: '#F472B6',
        text_color: '#FFFFFF'
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)
  const handleSelectType = (typeId) => {
    setFormData({ ...formData, type: typeId })
  }

  const handleStep1Next = () => {
    if (formData.type === 'cash') {
      setStep(3) // skip provider step for cash
    } else {
      setStep(2)
    }
  }

  const handleSubmitInternal = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const isCash = formData.type === 'cash'
      const isEWallet = formData.type === 'ewallet'
      let finalData
      
      if (isCash) {
        finalData = {
          wallet_name: 'Cash on Hand',
          wallet_type: 'cash',
          balance: Number(formData.balance) || 0,
          color: formData.color,
          text_color: formData.text_color,
          is_active: true
        }
      } else if (isEWallet) {
        finalData = {
          wallet_name: formData.account_name || formData.provider,
          wallet_type: formData.provider,
          balance: Number(formData.balance) || 0,
          account_identifier: formData.account_identifier,
          color: formData.color,
          text_color: formData.text_color,
          is_active: true
        }
      } else {
        finalData = {
          card_name: formData.account_name || formData.provider,
          card_type: formData.type === 'traditional' ? 'savings' : 'debit',
          balance: Number(formData.balance) || 0,
          last_four: formData.last_four,
          color: formData.color,
          text_color: formData.text_color,
          is_active: true
        }
      }
      const submitType = isCash ? 'ewallet' : formData.type === 'traditional' || formData.type === 'digital' ? 'card' : 'ewallet'
      
      await onSubmit(submitType, finalData)
      onClose()
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.message || 'Failed to create account'
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <Motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-pink-900/20 backdrop-blur-sm"
        />
        <Motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-dark-card w-full max-w-md rounded-[2.5rem] border border-pink-100 dark:border-dark-border overflow-hidden relative z-10 flex flex-col max-h-[95vh] md:max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 flex justify-between items-center border-b border-pink-50 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {step > 1 && (
                  <Motion.button 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={handleBack} 
                    className="p-2 hover:bg-pink-50 dark:hover:bg-dark-bg rounded-full text-gray-400 dark:text-dark-muted transition-colors"
                  >
                    <Icon name="arrowLeft" color="currentColor" className="w-5 h-5" /> 
                  </Motion.button>
                )}
              </AnimatePresence>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                {formData.type === 'cash' ? 'Cash on Hand' : `Step ${step} of 3`}
              </h2>
            </div>
            <Motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 hover:bg-pink-50 rounded-full text-gray-400 transition-colors"
            >
              <Icon name="x" color="currentColor" className="w-6 h-6" />
            </Motion.button>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 sm:p-8 pt-4 overflow-y-auto flex-1 custom-scrollbar">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className="h-2 flex-1 rounded-full bg-pink-100 dark:bg-dark-bg relative overflow-hidden"
                >
                  <Motion.div 
                    initial={false}
                    animate={{ 
                      width: (formData.type === 'cash' ? s <= 3 : s <= step) ? "100%" : "0%" 
                    }}
                    className="absolute inset-0 bg-pink-500"
                  />
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitInternal} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <Motion.div 
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">What kind of account?</label>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {ACCOUNT_TYPES.filter(type => !(type.id === 'cash' && hasCashAccount)).map((type) => (
                        <Motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={type.id}
                          type="button"
                          onClick={() => handleSelectType(type.id)}
                          className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 border-2 rounded-[2rem] transition-all group text-center ${
                            formData.type === type.id
                              ? 'border-pink-500 bg-pink-50 dark:bg-dark-bg scale-[1.02]'
                              : 'border-transparent bg-pink-50/50 dark:bg-dark-bg/50 hover:border-pink-200 dark:hover:border-dark-border hover:bg-white dark:hover:bg-dark-bg hover:scale-[1.02]'
                          }`}
                        >
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform ${
                            formData.type === type.id ? 'bg-pink-500 text-white' : 'bg-white dark:bg-dark-card text-pink-500'
                          }`}>
                            <Icon name={type.icon === 'traditional' ? 'card' : type.icon} color="currentColor" className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                          <span className={`text-xs sm:text-base font-bold ${
                            formData.type === type.id ? 'text-pink-700' : 'text-gray-700'
                          }`}>{type.label}</span>
                        </Motion.button>
                      ))}
                    </div>
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleStep1Next}
                      disabled={!formData.type}
                      className="w-full py-4 mt-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-black text-lg hover:translate-y-[-2px] transition-all disabled:opacity-30"
                    >
                      Continue
                    </Motion.button>
                  </Motion.div>
                )}

                {step === 2 && (
                  <Motion.div 
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-3 ml-1">Select Provider</label>
                      <select
                        required
                        value={formData.provider}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                        className="w-full px-5 py-4 bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white"
                      >
                        <option value="">Choose a bank/wallet...</option>
                        {PROVIDERS[formData.type === 'traditional' ? 'traditional' : formData.type === 'digital' ? 'digital' : 'ewallet']?.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-3 ml-1">Custom Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. My Savings"
                        value={formData.account_name}
                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                        className="w-full px-5 py-4 bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white"
                      />
                    </div>
                    {formData.type !== 'ewallet' ? (
                      <div>
                        <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-3 ml-1">Last 4 Digits</label>
                        <input
                          type="text"
                          maxLength="4"
                          placeholder="0000"
                          value={formData.last_four}
                          onChange={(e) => setFormData({ ...formData, last_four: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-5 py-4 bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white text-center tracking-[0.5em]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-3 ml-1">Phone / Email</label>
                        <input
                          type="text"
                          placeholder="0917..."
                          value={formData.account_identifier}
                          onChange={(e) => setFormData({ ...formData, account_identifier: e.target.value })}
                          className="w-full px-5 py-4 bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white"
                        />
                      </div>
                    )}
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.provider}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-black text-lg hover:translate-y-[-2px] transition-all disabled:opacity-30"
                    >
                      Continue
                    </Motion.button>
                  </Motion.div>
                )}

                {step === 3 && (
                  <Motion.div 
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-[0.2em] mb-4">Initial Balance</label>
                      <div className="relative inline-block w-full">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl sm:text-4xl font-black text-pink-300">₱</span>
                        <input
                          autoFocus
                          required
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.balance}
                          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                           className="w-full pl-14 sm:pl-16 pr-6 py-6 sm:py-8 bg-pink-50/50 dark:bg-dark-bg border-2 border-pink-100 dark:border-dark-border rounded-[2.5rem] focus:border-pink-500 outline-none transition-all text-3xl sm:text-4xl font-black text-gray-800 dark:text-white text-center placeholder:text-pink-300 dark:placeholder:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Card Color</label>
                        <div className="flex flex-wrap gap-2">
                          {COLOR_OPTIONS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: c })}
                              className={`w-8 h-8 rounded-xl transition-all ${
                                formData.color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110' : 'hover:scale-105 border border-gray-200 dark:border-dark-border'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Text Color</label>
                        <div className="flex flex-wrap gap-2">
                          {TEXT_COLOR_OPTIONS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, text_color: c })}
                              className={`w-8 h-8 rounded-xl transition-all border ${
                                formData.text_color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110 border-transparent' : 'hover:scale-105 border-gray-300 dark:border-dark-border'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className="h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 font-bold text-lg border border-pink-100 dark:border-dark-border"
                      style={{ background: `linear-gradient(135deg, ${formData.color}, ${formData.color}DD)`, color: formData.text_color }}
                    >
                      Preview Card
                    </div>

                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      type="submit"
                      className="w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-3xl font-black text-xl hover:translate-y-[-4px] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Finalize Account'}
                    </Motion.button>
                  </Motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  )
}
