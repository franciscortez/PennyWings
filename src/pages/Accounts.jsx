import React, { useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import Layout from '../components/Layout'
import TotalBalance from '../components/accounts/TotalBalance'
import { useBankCards } from '../hooks/useBankCards'
import { useEWallets } from '../hooks/useEWallets'
import CardList from '../components/cards/CardList'
import WalletList from '../components/wallets/WalletList'
import AccountWizard from '../components/accounts/AccountWizard'
import EditAccountModal from '../components/accounts/EditAccountModal'
import Icon from '../components/Icon'

export default function Accounts() {
  const { cards, loading: loadingCards, addCard, updateCard, deleteCard } = useBankCards()
  const { wallets, loading: loadingWallets, addWallet, updateWallet, deleteWallet } = useEWallets()
  
  const [activeTab, setActiveTab] = useState('cards')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editTarget, setEditTarget] = useState(null) // { account, type: 'card' | 'wallet' }

  const filteredCards = useMemo(() => {
    return cards.filter(card => 
      card.card_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.card_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cards, searchQuery])

  const filteredWallets = useMemo(() => {
    if (activeTab === 'cash') {
      return wallets.filter(wallet => 
        wallet.wallet_type === 'cash' &&
        (wallet.wallet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (wallet.wallet_type || '').toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Regular e-wallets
    return wallets.filter(wallet => 
      wallet.wallet_type !== 'cash' &&
      (wallet.wallet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (wallet.wallet_type || '').toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [wallets, searchQuery, activeTab])

  const totalBalance = useMemo(() => {
    const cardTotal = cards.reduce((sum, card) => sum + Number(card.balance || 0), 0)
    const walletTotal = wallets.reduce((sum, wallet) => sum + Number(wallet.balance || 0), 0)
    return cardTotal + walletTotal
  }, [cards, wallets])

  const handleAddAccount = () => {
    setIsWizardOpen(true)
  }

  const handleEditCard = (card) => {
    setEditTarget({ account: card, type: 'card' })
  }

  const handleEditWallet = (wallet) => {
    setEditTarget({ account: wallet, type: 'wallet' })
  }

  const handleSaveEdit = async (id, updates) => {
    if (editTarget?.type === 'card') {
      return await updateCard(id, updates)
    } else {
      return await updateWallet(id, updates)
    }
  }

  const handleDeleteCard = async (id) => {
    Swal.fire({
      title: 'Delete Card?',
      text: "Every penny counts! This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F43F5E', // rose-500
      cancelButtonColor: '#94A3B8', // slate-400
      confirmButtonText: 'Yes, Delete It',
      customClass: {
        popup: 'rounded-[2.5rem] p-8 font-bold',
        confirmButton: 'rounded-2xl px-6 py-3',
        cancelButton: 'rounded-2xl px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await deleteCard(id)
        if (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            confirmButtonColor: '#EC4899',
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your card has been removed.',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-[2.5rem] p-8'
            }
          })
        }
      }
    })
  }

  const handleDeleteWallet = async (id) => {
    Swal.fire({
      title: 'Delete Wallet?',
      text: "One less place for pennies to fly? This cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F43F5E',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete It',
      customClass: {
        popup: 'rounded-[2.5rem] p-8 font-bold',
        confirmButton: 'rounded-2xl px-6 py-3',
        cancelButton: 'rounded-2xl px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await deleteWallet(id)
        if (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            confirmButtonColor: '#EC4899',
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your wallet has been removed.',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-[2.5rem] p-8'
            }
          })
        }
      }
    })
  }

  const handleWizardSubmit = async (type, data) => {
    if (type === 'ewallet') {
      const { error } = await addWallet(data)
      if (error) throw error
    } else {
      const { error } = await addCard(data)
      if (error) throw error
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Accounts</h1>
        <p className="text-gray-500">Manage your bank cards and digital wallets in one place.</p>
      </div>

      <TotalBalance 
        total={totalBalance} 
        onAddClick={handleAddAccount} 
      />

      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="flex gap-2 p-1.5 bg-pink-100/30 backdrop-blur-md rounded-[2rem] border border-pink-100 w-full overflow-x-auto no-scrollbar md:w-fit whitespace-nowrap snap-x">
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center justify-center flex-1 md:flex-none gap-2 px-6 py-3 rounded-[1.2rem] font-bold transition-all snap-center ${
              activeTab === 'cards'
                ? 'bg-white text-pink-600 shadow-xl shadow-pink-200/50 scale-105'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Icon name="card" color="currentColor" className="w-5 h-5" />
            Bank Cards
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'cards' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {filteredCards.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex items-center justify-center flex-1 md:flex-none gap-2 px-6 py-3 rounded-[1.2rem] font-bold transition-all snap-center ${
              activeTab === 'wallets'
                ? 'bg-white text-pink-600 shadow-xl shadow-pink-200/50 scale-105'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Icon name="wallet" color="currentColor" className="w-5 h-5" />
            E-Wallets
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'wallets' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {wallets.filter(w => w.wallet_type !== 'cash').length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex items-center justify-center flex-1 md:flex-none gap-2 px-6 py-3 rounded-[1.2rem] font-bold transition-all snap-center ${
              activeTab === 'cash'
                ? 'bg-white text-pink-600 shadow-xl shadow-pink-200/50 scale-105'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Icon name="cash" color="currentColor" className="w-5 h-5" />
            Cash
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === 'cash' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {wallets.filter(w => w.wallet_type === 'cash').length}
            </span>
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-pink-100 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="pb-20">
        {activeTab === 'cards' ? (
          <CardList 
            cards={filteredCards} 
            loading={loadingCards} 
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
          />
        ) : (
          <WalletList 
            wallets={filteredWallets} 
            loading={loadingWallets} 
            onEdit={handleEditWallet}
            onDelete={handleDeleteWallet}
          />
        )}
      </div>

      {/* Unified Wizard */}
      <AccountWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        hasCashAccount={wallets.some(w => w.wallet_type === 'cash')}
      />

      <EditAccountModal
        isOpen={!!editTarget}
        account={editTarget?.account}
        type={editTarget?.type}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />
    </Layout>
  )
}
