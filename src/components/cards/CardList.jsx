import React from 'react'
import CardItem from './CardItem'
import LoadingSpinner from '../common/LoadingSpinner'
import Icon from '../Icon'
import { useTheme } from '../../contexts/ThemeContext'
import { motion as Motion, AnimatePresence } from 'motion/react'

export default function CardList({ cards, loading, onEdit, onDelete }) {
  const { theme } = useTheme()
  
  if (loading) return <LoadingSpinner />

  if (cards.length === 0) {
    return (
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center bg-pink-50/30 dark:bg-dark-bg/30 rounded-[3rem] border-2 border-dashed border-pink-100 dark:border-dark-border"
      >
        <div className="w-20 h-20 bg-pink-100 dark:bg-dark-border rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Icon name="card" color={theme === 'dark' ? '#F472B6' : '#EC4899'} className="w-10 h-10" />
        </div>
        <p className="text-lg font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest mb-2">No Bank Cards Yet</p>
        <p className="text-sm text-gray-400 dark:text-dark-muted/80">Add your first card to start tracking your finances.</p>
      </Motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => (
          <Motion.div
            layout
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
          >
            <CardItem 
              card={card} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
