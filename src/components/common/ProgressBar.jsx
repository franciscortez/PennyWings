import React from 'react';
import { motion as Motion } from 'motion/react';

const ProgressBar = ({ progress, color = 'bg-pink-500', height = 'h-3', className = '' }) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden border border-pink-50 dark:border-dark-border ${height} ${className}`}>
      <Motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      ></Motion.div>
    </div>
  );
};

export default ProgressBar;
