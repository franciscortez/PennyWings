import React, { useState, useEffect } from 'react'
import Icon from '../Icon'
import { useBankCards } from '../../hooks/useBankCards'
import { useEWallets } from '../../hooks/useEWallets'
import { useCategories } from '../../hooks/useCategories'

export default function TransactionForm({ isOpen, onClose, onSubmit }) {
  const { cards } = useBankCards()
  const { wallets } = useEWallets()
  const { categories } = useCategories()

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    payment_method: 'cash',
    card_id: '',
    wallet_id: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'expense',
        amount: '',
        category_id: '',
        payment_method: 'cash',
        card_id: '',
        wallet_id: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredCategories = categories.filter(c => c.type === (formData.type === 'withdrawal' ? 'expense' : formData.type))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cashWallet = wallets.find(w => w.wallet_type === 'cash')
      const data = {
        ...formData,
        amount: Number(formData.amount),
        card_id: formData.payment_method === 'card' ? formData.card_id : null,
        wallet_id: formData.payment_method === 'ewallet' ? formData.wallet_id : 
                   (formData.payment_method === 'cash' && cashWallet ? cashWallet.id : null)
      }
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error('Error submitting transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">New Transaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-pink-50 rounded-full text-gray-400 transition-colors">
              <Icon name="x" color="currentColor" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Toggle */}
            <div className="flex p-1 bg-pink-50 rounded-2xl">
              {['income', 'expense', 'withdrawal'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    formData.type === t
                      ? 'bg-white text-pink-600 shadow-sm scale-105'
                      : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="text-center">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 text-left">How much?</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-pink-300">₱</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-pink-50/50 border-2 border-pink-100 rounded-2xl focus:border-pink-500 outline-none transition-all text-2xl font-black text-gray-800"
                />
              </div>
            </div>

            {/* Account & Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value, card_id: '', wallet_id: '' })}
                  className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Bank Card</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Account</label>
                {formData.payment_method === 'card' ? (
                  <select
                    required
                    value={formData.card_id}
                    onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                    className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
                  >
                    <option value="">Select Card</option>
                    {cards.map(c => <option key={c.id} value={c.id}>{c.card_name}</option>)}
                  </select>
                ) : formData.payment_method === 'ewallet' ? (
                  <select
                    required
                    value={formData.wallet_id}
                    onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                    className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
                  >
                    <option value="">Select Wallet</option>
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.wallet_name}</option>)}
                  </select>
                ) : (
                  <div className={`px-4 py-3 border rounded-xl text-sm font-bold ${
                    wallets.some(w => w.wallet_type === 'cash') 
                      ? 'bg-pink-50/50 text-gray-700 border-pink-100' 
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {wallets.some(w => w.wallet_type === 'cash') ? 'Cash on Hand Account' : 'Not tracked in accounts'}
                  </div>
                )}
              </div>
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
                >
                  <option value="">Choose Box...</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-pink-200 hover:shadow-2xl hover:translate-y-[-4px] transition-all disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Save Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
