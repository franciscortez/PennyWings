import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// strict brand colors: Rose, Pink, Soft Pink, Emerald(Income/Positive), Amber(Warning), Purple(Neutral), Violet(Neutral2)
const COLORS = ['#e85d7a', '#ff7a93', '#ff9ead', '#fbbf24', '#34d399', '#a78bfa', '#c084fc'];

export default function AllocationChart({ data = [] }) {
  const hasData = data.length > 0;
  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-pink-50 shadow-sm h-[450px] flex flex-col group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
      {/* Subtle background blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="mb-8 relative z-10 text-center">
        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">Wealth Distribution</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">By Sector</p>
      </div>

      <div className="flex-1 w-full relative z-10">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            < PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                ))}
              </ Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '16px',
                  fontWeight: 800
                }}
              />
            </ PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="font-bold">No expenses yet!</p>
          </div>
        )}
        
        {hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total</p>
            <p className="text-xl font-black text-gray-900 tracking-tighter">₱{totalSpent.toLocaleString()}</p>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-8 grid grid-cols-2 gap-3 relative z-10">
          {data.slice(0, 4).map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="text-[10px] font-bold text-gray-600 truncate uppercase mt-0.5">{entry.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
