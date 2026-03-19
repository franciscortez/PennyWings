import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTheme } from "../../contexts/ThemeContext";

export default React.memo(function SpendingChart({ data = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-pink-50 dark:border-dark-border h-[450px] flex flex-col group transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
            <h3 className="text-xl font-black text-gray-900 dark:text-dark-text tracking-tight">
              Income vs. Expense
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-dark-muted italic shrink-0">
            Daily cash flow trajectory
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-400"></span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Expense</span>
          </div>
        </div>
      </div>

      <div className="w-full -ml-4 relative z-10 h-[320px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={320} minWidth={100} debounce={100}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={isDark ? 0.3 : 0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={isDark ? 0.3 : 0.1} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "#f3f4f6"}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1e1e1e" : "rgba(255, 255, 255, 0.9)",
                  borderRadius: "1rem",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f3f4f6",
                  padding: "12px",
                }}
                labelStyle={{
                  fontWeight: 900,
                  marginBottom: "4px",
                  color: isDark ? "#e2e8f0" : "#111827",
                }}
                itemStyle={{
                   color: isDark ? "#cbd5e1" : "#4b5563"
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ec4899"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-muted pl-4">
            <div className="w-16 h-16 bg-pink-50 dark:bg-dark-bg rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-pink-200 dark:text-pink-900/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="font-bold">No cash flow data for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
});
