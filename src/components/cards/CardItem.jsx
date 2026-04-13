import React from 'react'
import Icon from '../Icon'
import { motion as Motion } from 'motion/react'
import { useTheme } from '../../contexts/ThemeContext'
import CardChip from './CardChip'

export default function CardItem({ card, onEdit, onDelete }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bgColor = card.color || '#F472B6' // Default pink-400

  return (
    <Motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-dark-card p-6 rounded-[2.5rem] border border-pink-50 dark:border-dark-border relative overflow-hidden group transition-all duration-300 flex flex-col"
    >
      <Motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative h-48 rounded-[2rem] p-6 overflow-hidden mb-4 cursor-pointer"
        style={{ 
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
          color: card.text_color || '#FFFFFF'
        }}
      >
        {/* Card Pattern/Decoration - More professional SVG pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '16px 16px' }}></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full translate-x-10 translate-y-[-20px] blur-3xl"></div>
        
        <div className="absolute top-4 right-6 opacity-30">
          <Icon name="bank" color="currentColor" className="w-10 h-10" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{card.card_type === 'credit' ? 'Premium Credit' : 'Bank Debit'}</p>
              <h3 className="text-xl font-bold tracking-tight truncate max-w-[140px]">
                {card.card_name}
              </h3>
            </div>
            
            {/* Real Card Chip */}
            <CardChip className="w-10 h-8 mt-1" />
          </div>
          
          <div className="mt-auto">
            <p className="text-sm font-mono tracking-[0.3em] mb-2 opacity-80">•••• •••• •••• {card.last_four || '0000'}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest mb-1">Balance</p>
                <p className="text-2xl font-black tracking-tight">
                  ₱{Number(card.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Icon name="card" color="currentColor" className="w-8 h-8 opacity-20 mb-1" />
                <span className="opacity-60 text-[8px] font-black uppercase tracking-widest">VISA / MC</span>
              </div>
            </div>
          </div>
        </div>
      </Motion.div>
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onEdit(card)}
            className="p-3 text-gray-400 dark:text-dark-muted hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-all active:scale-95"
            title="Edit Card"
          >
            <Icon name="edit" color="currentColor" className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(card.id)}
            className="p-3 text-gray-400 dark:text-dark-muted hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-95"
            title="Delete Card"
          >
            <Icon name="delete" color="currentColor" className="w-5 h-5" />
          </button>
        </div>
        
        <div 
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: card.is_active !== false ? '#10B981' : '#EF4444' }}
        ></div>
      </div>
    </Motion.div>
  )
}
