import React from 'react';

export default function CardChip({ className = "w-12 h-10" }) {
  return (
    <div className={`${className} bg-amber-400/80 rounded-lg relative overflow-hidden ring-1 ring-amber-300 shadow-inner`}>
      {/* Etched Pattern Lines */}
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
      >
        <path d="M0 20 H100" stroke="black" strokeWidth="1" />
        <path d="M0 40 H100" stroke="black" strokeWidth="1" />
        <path d="M0 60 H100" stroke="black" strokeWidth="1" />
        <path d="M33 0 V80" stroke="black" strokeWidth="1" />
        <path d="M66 0 V80" stroke="black" strokeWidth="1" />
        <rect x="33" y="20" width="34" height="40" stroke="black" strokeWidth="1" />
      </svg>
      
      {/* Shine Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
    </div>
  );
}
