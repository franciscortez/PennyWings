import React, { useState, useEffect } from 'react'
import Icon from '../Icon'

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
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setError(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
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
          text_color: formData.text_color
        }
      } else if (isEWallet) {
        finalData = {
          wallet_name: formData.account_name || formData.provider,
          wallet_type: formData.provider,
          balance: Number(formData.balance) || 0,
          account_identifier: formData.account_identifier,
          color: formData.color,
          text_color: formData.text_color
        }
      } else {
        finalData = {
          card_name: formData.account_name || formData.provider,
          card_type: formData.type === 'traditional' ? 'savings' : 'debit',
          balance: Number(formData.balance) || 0,
          last_four: formData.last_four,
          color: formData.color,
          text_color: formData.text_color
        }
      }
      const submitType = isCash ? 'ewallet' : formData.type
      await onSubmit(submitType, finalData)
      onClose()
    } catch (err) {
      console.error('Error creating account:', err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-pink-50 rounded-full text-gray-400 transition-colors">
                  <Icon name="arrowLeft" color="currentColor" className="w-5 h-5" /> 
                </button>
              )}
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {formData.type === 'cash' ? 'Cash on Hand' : `Step ${step} of 3`}
          </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-pink-50 rounded-full text-gray-400 transition-colors">
              <Icon name="x" color="currentColor" className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  (formData.type === 'cash' ? s <= 3 : s <= step) ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'bg-pink-100'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">What kind of account?</label>
                <div className="grid grid-cols-2 gap-4">
                  {ACCOUNT_TYPES.filter(type => !(type.id === 'cash' && hasCashAccount)).map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleSelectType(type.id)}
                      className={`flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-[2rem] transition-all group text-center ${
                        formData.type === type.id
                          ? 'border-pink-500 bg-pink-50 shadow-md scale-[1.02]'
                          : 'border-transparent bg-pink-50/50 hover:border-pink-200 hover:bg-white hover:scale-[1.02]'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform ${
                        formData.type === type.id ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'
                      }`}>
                        <Icon name={type.icon} color="currentColor" />
                      </div>
                      <span className={`text-sm md:text-base font-bold ${
                        formData.type === type.id ? 'text-pink-700' : 'text-gray-700'
                      }`}>{type.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleStep1Next}
                  disabled={!formData.type}
                  className="w-full py-4 mt-2 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all disabled:opacity-30"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Select Provider</label>
                  <select
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
                  >
                    <option value="">Choose a bank/wallet...</option>
                    {PROVIDERS[formData.type]?.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Custom Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. My Savings"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
                  />
                </div>
                {formData.type !== 'ewallet' ? (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Last 4 Digits</label>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="0000"
                      value={formData.last_four}
                      onChange={(e) => setFormData({ ...formData, last_four: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-center tracking-[0.5em]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Phone / Email</label>
                    <input
                      type="text"
                      placeholder="0917..."
                      value={formData.account_identifier}
                      onChange={(e) => setFormData({ ...formData, account_identifier: e.target.value })}
                      className="w-full px-5 py-4 bg-pink-50/50 border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.provider}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all disabled:opacity-30"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Initial Balance</label>
                  <div className="relative inline-block w-full">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-pink-300">₱</span>
                    <input
                      autoFocus
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                      className="w-full pl-16 pr-6 py-8 bg-pink-50/50 border-2 border-pink-100 rounded-[2.5rem] focus:border-pink-500 outline-none transition-all text-4xl font-black text-gray-800 text-center placeholder:text-pink-100"
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
                            formData.color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110' : 'hover:scale-105 border border-gray-200'
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
                            formData.text_color === c ? 'ring-2 ring-offset-2 ring-pink-500 scale-110 border-transparent' : 'hover:scale-105 border-gray-300'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shadow-md font-bold text-lg"
                  style={{ background: `linear-gradient(135deg, ${formData.color}, ${formData.color}DD)`, color: formData.text_color }}
                >
                  Preview Card
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-pink-200 hover:shadow-2xl hover:translate-y-[-4px] transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Finalize Account'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
