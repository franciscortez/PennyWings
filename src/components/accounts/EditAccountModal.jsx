import React, { useState, useEffect } from 'react'
import Icon from '../Icon'
import Swal from 'sweetalert2'
import { useTheme } from '../../contexts/ThemeContext'
import { getToast } from '../../utils/toast'

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

/**
 * EditAccountModal
 * Works for both bank_cards and e_wallets (including cash accounts).
 * Props:
 *   account    – the account object to edit
 *   type       – 'card' | 'wallet'
 *   isOpen     – boolean
 *   onClose    – () => void
 *   onSave     – (id, updates) => Promise<{ error }>
 */
export default function EditAccountModal({ account, type, isOpen, onClose, onSave }) {
  const isCard = type === 'card'
  const isCash = !isCard && account?.wallet_type === 'cash'

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && account) {
      if (isCard) {
        setFormData({
          card_name: account.card_name || '',
          card_type: account.card_type || 'savings',
          balance: account.balance ?? '',
          last_four: account.last_four || '',
          color: account.color || '#F472B6',
          text_color: account.text_color || '#FFFFFF',
        })
      } else {
        setFormData({
          wallet_name: account.wallet_name || '',
          wallet_type: account.wallet_type || '',
          balance: account.balance ?? '',
          account_identifier: account.account_identifier || '',
          color: account.color || '#FFB6C1',
          text_color: account.text_color || '#FFFFFF',
        })
      }
    }
  }, [isOpen, account, isCard])

  if (!isOpen || !account) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updates = isCard
        ? {
          card_name: formData.card_name,
          card_type: formData.card_type,
          balance: Number(formData.balance),
          last_four: formData.last_four,
          color: formData.color,
          text_color: formData.text_color,
        }
        : {
          wallet_name: formData.wallet_name,
          wallet_type: formData.wallet_type,
          balance: Number(formData.balance),
          account_identifier: formData.account_identifier,
          color: formData.color,
          text_color: formData.text_color,
        }
      const { error } = await onSave(account.id, updates)
      if (error) throw new Error(error)
      onClose()
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.message || 'Failed to save'
      });
    } finally {
      setLoading(false)
    }
  }

  const title = isCash ? 'Edit Cash Account' : isCard ? 'Edit Bank Card' : 'Edit E-Wallet'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-[2.5rem] border border-pink-100 dark:border-dark-border overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh] md:max-h-[90vh]">
        <div className="p-6 sm:p-8 pb-4 flex justify-between items-center border-b border-pink-50 dark:border-dark-border">
          <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-pink-50 dark:hover:bg-dark-bg rounded-full text-gray-400 dark:text-dark-muted transition-colors">
            <Icon name="x" color="currentColor" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 pt-4 overflow-y-auto flex-1 custom-scrollbar">

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">
                {isCash ? 'Label' : isCard ? 'Card Name' : 'Wallet Name'}
              </label>
              <input
                required
                type="text"
                value={isCard ? formData.card_name : formData.wallet_name}
                onChange={(e) =>
                  setFormData({ ...formData, [isCard ? 'card_name' : 'wallet_name']: e.target.value })
                }
                className="w-full px-5 py-4 bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-white"
              />
            </div>

            {/* Card-specific: type & last 4 digits */}
            {isCard && (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Card Type</label>
                  <select
                    value={formData.card_type}
                    onChange={(e) => setFormData({ ...formData, card_type: e.target.value })}
                    className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
                  >
                    <option value="savings">Savings</option>
                    <option value="checking">Checking</option>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="0000"
                    value={formData.last_four}
                    onChange={(e) =>
                      setFormData({ ...formData, last_four: e.target.value.replace(/\D/g, '') })
                    }
                    className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-center tracking-[0.5em]"
                  />
                </div>
              </>
            )}

            {/* Wallet-specific: phone/email (hide for cash) */}
            {!isCard && !isCash && (
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Phone / Email</label>
                <input
                  type="text"
                  placeholder="0917..."
                  value={formData.account_identifier}
                  onChange={(e) => setFormData({ ...formData, account_identifier: e.target.value })}
                  className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
                />
              </div>
            )}

            {/* Balance */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Current Balance</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-pink-300 dark:text-pink-900/50">₱</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full pl-10 pr-6 py-4 bg-pink-50/50 dark:bg-dark-bg border-2 border-pink-100 dark:border-dark-border rounded-2xl focus:border-pink-500 outline-none transition-all text-lg sm:text-xl font-black text-gray-800 dark:text-white placeholder:text-pink-300 dark:placeholder:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Card Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-8 h-8 rounded-xl transition-all ${formData.color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110' : 'hover:scale-105 border border-gray-200 dark:border-dark-border'
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest ml-1">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {TEXT_COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, text_color: c })}
                      className={`w-8 h-8 rounded-xl transition-all border ${formData.text_color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110 border-transparent' : 'hover:scale-105 border-gray-300 dark:border-dark-border'
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 border border-pink-100 dark:border-dark-border font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${formData.color}, ${formData.color}DD)`, color: formData.text_color }}
            >
              Preview Card
            </div>            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-3xl font-black text-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
