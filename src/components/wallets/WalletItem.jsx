import React from 'react'
import Icon from '../Icon'
import { motion as Motion } from 'motion/react'
import { useTheme } from '../../contexts/ThemeContext'

export default function WalletItem({ wallet, onEdit, onDelete }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bgColor = wallet.color || '#FFB6C1'
  
  return (
    <Motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-card rounded-[2.5rem] p-6 border border-pink-50 dark:border-dark-border relative overflow-hidden group transition-all duration-300"
    >
      <Motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative h-48 rounded-[2rem] p-6 overflow-hidden mb-4 cursor-pointer"
        style={{ 
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}DD)`,
          color: wallet.text_color || '#FFFFFF'
        }}
      >
        {/* Wallet Pattern/Decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                {wallet.wallet_type || 'DIGITAL WALLET'}
              </p>
              <h3 className="text-xl font-bold tracking-tight">
                {wallet.wallet_name}
              </h3>
            </div>
            <Motion.div 
              whileHover={{ rotate: -15 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 p-2"
            >
              <Icon name={wallet.wallet_type === 'cash' ? 'cash' : 'wallet'} color="currentColor" />
            </Motion.div>
          </div>
          
          <div className="mt-auto">
            <p className="text-xs font-medium opacity-80 mb-2 truncate max-w-[150px]">
              {wallet.account_identifier || '---'}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-70 uppercase font-medium">Balance</p>
                <p className="text-2xl font-black tracking-tight">
                  ₱{Number(wallet.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Motion.div>
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onEdit(wallet)}
            className="p-2 text-gray-400 dark:text-dark-muted hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-all active:scale-95"
            title="Edit Wallet"
          >
            <Icon name="edit" color="currentColor" className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(wallet.id)}
            className="p-2 text-gray-400 dark:text-dark-muted hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-95"
            title="Delete Wallet"
          >
            <Icon name="delete" color="currentColor" className="w-5 h-5" />
          </button>
        </div>
        
        <div 
          className="h-2 w-2 rounded-full animate-pulse" 
          style={{ backgroundColor: wallet.is_active !== false ? '#10B981' : '#EF4444' }}
        ></div>
      </div>
    </Motion.div>
  )
}
