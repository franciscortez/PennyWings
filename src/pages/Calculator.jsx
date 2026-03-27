import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { motion as Motion, AnimatePresence } from 'motion/react';
import Icon from '../components/Icon';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevVal, setPrevVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  const calculate = (a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return b;
    switch (op) {
      case '+': return (numA + numB).toString();
      case '-': return (numA - numB).toString();
      case '×': return (numA * numB).toString();
      case '÷': return numB === 0 ? 'Error' : (numA / numB).toString();
      default: return b;
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
    setPrevVal(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleDelete = () => {
    if (waitingForNewValue) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    setDisplay((val / 100).toString());
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    setDisplay((val * -1).toString());
  };

  const inputDigit = useCallback((digit) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + (display.includes('.') && digit === '.' ? '' : digit));
    }
  }, [display, waitingForNewValue]);

  const inputDot = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForNewValue]);

  const handleOperator = useCallback((nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(display);
      setEquation(`${display} ${nextOperator}`);
    } else if (operator) {
      const currentValue = prevVal || 0;
      const newValue = calculate(currentValue, display, operator);
      setDisplay(String(newValue));
      setPrevVal(String(newValue));
      setEquation(`${newValue} ${nextOperator}`);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  }, [display, prevVal, operator]);

  const handleEqual = useCallback(() => {
    if (!operator || prevVal === null) return;
    const newValue = calculate(prevVal, display, operator);
    setDisplay(String(newValue));
    if (newValue !== 'Error') {
      setEquation(`${prevVal} ${operator} ${display} =`);
    } else {
      setEquation('');
    }
    setPrevVal(null);
    setOperator(null);
    setWaitingForNewValue(true);
  }, [operator, prevVal, display]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default for calculator keys
      if (/^[0-9+\-*/=.%]$/.test(e.key) || ['Enter', 'Escape', 'Backspace', 'Delete'].includes(e.key)) {
        e.preventDefault();
      }

      // Visual feedback
      const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '-', '*': '×', '/': '÷',
        'Enter': '=', '=': '=', '.': '.',
        'Escape': 'AC', 'Backspace': 'DEL', 'Delete': 'DEL',
        '%': '%'
      };
      
      const mappedKey = keyMap[e.key];
      if (mappedKey) {
        setActiveKey(mappedKey);
        setTimeout(() => setActiveKey(null), 150);
      }

      // Handle number inputs
      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      }
      // Handle decimal point
      else if (e.key === '.') {
        inputDot();
      }
      // Handle operators
      else if (e.key === '+') {
        handleOperator('+');
      }
      else if (e.key === '-') {
        handleOperator('-');
      }
      else if (e.key === '*') {
        handleOperator('×');
      }
      else if (e.key === '/') {
        handleOperator('÷');
      }
      // Handle equals
      else if (e.key === 'Enter' || e.key === '=') {
        handleEqual();
      }
      // Handle clear
      else if (e.key === 'Escape') {
        clearAll();
      }
      // Handle backspace/delete
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      }
      // Handle percent
      else if (e.key === '%') {
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDot, handleOperator, handleEqual]);

  const Button = ({ label, icon, onClick, variant = 'default', className = '', keyboardKey = null }) => {
    const baseStyle = "relative overflow-hidden flex items-center justify-center text-xl md:text-2xl font-black rounded-2xl md:rounded-[1.5rem] transition-all h-16 sm:h-[4.5rem] md:h-20 select-none";
    
    let variants = {
      default: "bg-white dark:bg-dark-card text-gray-800 dark:text-white border border-pink-100 dark:border-dark-border hover:bg-pink-50 dark:hover:bg-dark-card/80",
      primary: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 border-none",
      secondary: "bg-pink-100 dark:bg-dark-bg text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-dark-border hover:bg-pink-200 dark:hover:bg-dark-border",
      danger: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-200 dark:hover:bg-rose-900/50"
    };

    const isActive = activeKey === (keyboardKey || label);

    return (
      <Motion.button 
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05, y: -2 }}
        animate={isActive ? { scale: 0.92 } : { scale: 1 }}
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className} ${isActive ? 'ring-4 ring-pink-400/50' : ''}`}
      >
        {icon ? <Icon name={icon} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" /> : label}
      </Motion.button>
    );
  };

  return (
    <Layout>
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center md:text-left"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Calculator</h1>
        <p className="text-gray-500 dark:text-dark-muted">Quick calculations for your budgets and expenses.</p>
      </Motion.div>

      <div className="max-w-md mx-auto w-full px-2 sm:px-0 pb-20">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-4 sm:p-5 md:p-6 border border-pink-100 dark:border-dark-border shadow-2xl shadow-pink-500/10"
        >
          {/* Display Area */}
          <div className="bg-pink-50/50 dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-3xl md:rounded-[2rem] p-5 md:p-6 mb-4 sm:mb-6 flex flex-col items-end justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
              <Motion.div 
                key={equation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-pink-400/80 dark:text-dark-muted text-sm font-bold tracking-wider mb-2 h-5"
              >
                {equation}
              </Motion.div>
            </AnimatePresence>
            
            <Motion.div 
              key={display}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`font-black text-gray-800 dark:text-white tracking-tighter w-full text-right overflow-hidden overflow-ellipsis ${display.length > 9 ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-7xl'}`}
            >
              {display}
            </Motion.div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <Button label="AC" onClick={clearAll} variant="danger" keyboardKey="AC" />
            <Button icon="delete" onClick={handleDelete} variant="secondary" keyboardKey="DEL" />
            <Button label="%" onClick={handlePercent} variant="secondary" />
            <Button label="÷" onClick={() => handleOperator('÷')} variant="primary" />

            <Button label="7" onClick={() => inputDigit('7')} />
            <Button label="8" onClick={() => inputDigit('8')} />
            <Button label="9" onClick={() => inputDigit('9')} />
            <Button label="×" onClick={() => handleOperator('×')} variant="primary" />

            <Button label="4" onClick={() => inputDigit('4')} />
            <Button label="5" onClick={() => inputDigit('5')} />
            <Button label="6" onClick={() => inputDigit('6')} />
            <Button label="-" onClick={() => handleOperator('-')} variant="primary" />

            <Button label="1" onClick={() => inputDigit('1')} />
            <Button label="2" onClick={() => inputDigit('2')} />
            <Button label="3" onClick={() => inputDigit('3')} />
            <Button label="+" onClick={() => handleOperator('+')} variant="primary" />

            <Button label="0" onClick={() => inputDigit('0')} className="col-span-2" />
            <Button label="." onClick={inputDot} />
            <Button label="=" onClick={handleEqual} variant="primary" />
          </div>
        </Motion.div>
      </div>
    </Layout>
  );
}
