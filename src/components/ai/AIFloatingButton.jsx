import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Icon from '../Icon';
import AIChatWindow from './AIChatWindow';

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AIChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="hidden md:flex fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-pink-600 via-pink-500 to-rose-400 rounded-full items-center justify-center text-white z-[70] border border-white/30 backdrop-blur-xl group overflow-hidden"
            title="Chat with Penny AI"
          >
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center justify-center">
              <Icon name="user" color="white" className="w-9 h-9 drop-shadow-lg" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
