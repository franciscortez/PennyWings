import React, { useState, useMemo, useEffect } from 'react'
import { getConfirm, confirmPresets } from '../utils/confirm'
import { useTheme } from '../contexts/ThemeContext'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import TotalBalance from '../components/accounts/TotalBalance'
import { useBankCards } from '../hooks/useBankCards'
import { useEWallets } from '../hooks/useEWallets'
import CardList from '../components/cards/CardList'
import WalletList from '../components/wallets/WalletList'
import AccountWizard from '../components/accounts/AccountWizard'
import EditAccountModal from '../components/accounts/EditAccountModal'
import Icon from '../components/Icon'
import { motion as Motion, AnimatePresence } from 'motion/react'

export default function Accounts() {
  const { theme } = useTheme()
  const { cards, loading: loadingCards, addCard, updateCard, deleteCard } = useBankCards()
  const { wallets, loading: loadingWallets, addWallet, updateWallet, deleteWallet } = useEWallets()

  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'all'
  const [activeTab, setActiveTab] = useState(
    ['all', 'cards', 'wallets', 'cash'].includes(tabFromUrl) ? tabFromUrl : 'all'
  )
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editTarget, setEditTarget] = useState(null) // { account, type: 'card' | 'wallet' }

  // Sync URL → state on navigation / back-button
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['all', 'cards', 'wallets', 'cash'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      card.card_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.card_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cards, searchQuery])

  const filteredWallets = useMemo(() => {
    if (activeTab === 'cash') {
      return wallets.filter(wallet =>
        (wallet.wallet_type || '').toLowerCase() === 'cash' &&
        (wallet.wallet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (wallet.wallet_type || '').toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Regular e-wallets (exclude cash)
    return wallets.filter(wallet =>
      (wallet.wallet_type || '').toLowerCase() !== 'cash' &&
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
    getConfirm(theme).fire(confirmPresets.deleteItem('Card')).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await deleteCard(id)
        if (error) {
          getConfirm(theme).fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
        } else {
          getConfirm(theme).fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your card has been removed.',
            timer: 1500,
            showConfirmButton: false,
          })
        }
      }
    })
  }

  const handleDeleteWallet = async (id) => {
    getConfirm(theme).fire(confirmPresets.deleteItem('Wallet')).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await deleteWallet(id)
        if (error) {
          getConfirm(theme).fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
        } else {
          getConfirm(theme).fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your wallet has been removed.',
            timer: 1500,
            showConfirmButton: false,
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
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight mb-2">My Accounts</h1>
        <p className="text-gray-500 dark:text-dark-muted">Manage your bank cards and digital wallets in one place.</p>
      </Motion.div>

      <TotalBalance
        total={totalBalance}
        onAddClick={handleAddAccount}
      />

      {/* Search & Tabs */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between"
      >
        <div className="flex gap-2 p-1.5 bg-pink-100/30 dark:bg-dark-card/30 backdrop-blur-md rounded-[2rem] border border-pink-100 dark:border-dark-border w-full overflow-x-auto no-scrollbar md:w-fit whitespace-nowrap snap-x">
          {['all', 'cards', 'wallets', 'cash'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center justify-center flex-1 md:flex-none gap-2 px-6 py-3 rounded-[1.2rem] font-bold transition-all snap-center ${activeTab === tab
                  ? 'bg-white dark:bg-dark-card text-pink-600 dark:text-pink-400 scale-105'
                  : 'text-gray-400 dark:text-dark-muted hover:text-pink-400'
                }`}
            >
              <Icon name={tab === 'all' ? 'grid' : tab === 'cards' ? 'card' : tab === 'wallets' ? 'wallet' : 'cash'} color="currentColor" className="w-5 h-5" />
              {tab === 'all' ? 'All' : tab === 'cards' ? 'Cards' : tab === 'wallets' ? 'E-Wallet' : 'Cash'}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-pink-100 dark:bg-dark-border text-pink-600 dark:text-pink-400' : 'bg-gray-100 dark:bg-dark-bg text-gray-400 dark:text-dark-muted'
                }`}>
                {tab === 'all' ? filteredCards.length + wallets.length :
                  tab === 'cards' ? filteredCards.length :
                    tab === 'wallets' ? wallets.filter(w => (w.wallet_type || '').toLowerCase() !== 'cash').length :
                      wallets.filter(w => (w.wallet_type || '').toLowerCase() === 'cash').length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 bg-white dark:bg-dark-card border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-gray-700 dark:text-dark-text text-sm"
          />
        </div>
      </Motion.div>

      {/* Content Area */}
      <div className="pb-20">
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'all' ? (
              <div className="space-y-12">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-dark-border flex items-center justify-center text-pink-600 dark:text-pink-400">
                      <Icon name="card" className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">Bank Cards</h3>
                  </div>
                  <CardList
                    cards={filteredCards}
                    loading={loadingCards}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                  />
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-dark-border flex items-center justify-center text-pink-600 dark:text-pink-400">
                      <Icon name="wallet" className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">Digital Wallets & Cash</h3>
                  </div>
                  <WalletList
                    wallets={wallets.filter(w =>
                      w.wallet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (w.wallet_type || '').toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    loading={loadingWallets}
                    onEdit={handleEditWallet}
                    onDelete={handleDeleteWallet}
                  />
                </section>
              </div>
            ) : activeTab === 'cards' ? (
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
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* Unified Wizard */}
      <AccountWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleWizardSubmit}
        hasCashAccount={wallets.some(w => (w.wallet_type || '').toLowerCase() === 'cash')}
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
