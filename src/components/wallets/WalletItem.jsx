import React from 'react'
import Icon from '../Icon'

export default function WalletItem({ wallet, onEdit, onDelete }) {
  const bgColor = wallet.color || '#FFB6C1'
  
  return (
    <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-pink-50 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
      <div 
        className="relative h-48 rounded-[2rem] p-6 text-white overflow-hidden shadow-lg mb-4"
        style={{ 
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}DD)`,
          boxShadow: `0 10px 20px -5px ${bgColor}66`
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
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 p-2">
              <Icon name={wallet.wallet_type === 'cash' ? 'cash' : 'wallet'} color="white" />
            </div>
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
      </div>
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onEdit(wallet)}
            className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
            title="Edit Wallet"
          >
            <Icon name="edit" color="currentColor" className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(wallet.id)}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Delete Wallet"
          >
            <Icon name="delete" color="currentColor" className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: wallet.is_active !== false ? '#10B981' : '#EF4444' }}></div>
      </div>
    </div>
  )
}
