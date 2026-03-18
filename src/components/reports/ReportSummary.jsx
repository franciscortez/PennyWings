import React from "react";
import Icon from "../Icon";

export default function ReportSummary({
  summary = { income: 0, expense: 0, net: 0 },
}) {
  const stats = [
    {
      label: "Total Income",
      value: summary.income,
      icon: "income",
      color: "text-emerald-500",
      gradient: "from-emerald-50 to-white",
      iconBg: "bg-emerald-500",
      blob: "bg-emerald-200/30",
    },
    {
      label: "Total Expense",
      value: summary.expense,
      icon: "expense",
      color: "text-rose-500",
      gradient: "from-rose-50 to-white",
      iconBg: "bg-rose-500",
      blob: "bg-rose-200/30",
    },
    {
      label: "Net Cash Flow",
      value: summary.net,
      icon: "bank",
      color: "text-pink-500",
      gradient: "from-pink-50 to-white",
      iconBg: "bg-pink-500",
      blob: "bg-pink-200/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} p-8 rounded-[2.5rem] border border-pink-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500`}
        >
          {/* Background Blob */}
          <div
            className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.blob} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
          ></div>

          <div
            className={`${stat.iconBg} text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center p-4 shadow-lg group-hover:rotate-12 transition-transform duration-500 z-10`}
          >
            <Icon name={stat.icon} color="white" className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">
              {stat.label}
            </p>
            <p
              className={`text-3xl font-black ${stat.color} leading-none tracking-tighter`}
            >
              ₱
              {stat.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
