import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import { useRealtimeSync } from "../hooks/useRealtimeSync";
import { queryClient } from "../lib/queryClient";
import { startOfMonth, endOfMonth, format } from "date-fns";
import Icon from "./Icon";
import { getConfirm, confirmPresets } from "../utils/confirm";
import AnimatedPage from "./common/AnimatedPage";
import { motion as Motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "bank", showInMobile: true },
  { name: "Accounts", href: "/accounts", icon: "card", showInMobile: true },
  { 
    name: "Transactions", 
    href: "/transactions", 
    icon: "history",
    showInMobile: true,
    prefetch: () => {
      // Prefetch Component
      import("../pages/Transactions");
      // Prefetch Data (Page 1, all types)
      const userId = queryClient.getQueryData(['auth'])?.user?.id;
      if (userId) {
        queryClient.prefetchQuery({
          queryKey: ['transactions', userId, 1, 10, '', 'all'],
          staleTime: 1000 * 60 * 5,
        });
      }
    }
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: "reports",
    showInMobile: true,
    prefetch: () => {
      // Prefetch Component
      import("../pages/Reports");
      // Prefetch Data (This Month)
      const userId = queryClient.getQueryData(['auth'])?.user?.id;
      if (userId) {
        const now = new Date();
        const start = format(startOfMonth(now), 'yyyy-MM-dd');
        const end = format(endOfMonth(now), 'yyyy-MM-dd');
        queryClient.prefetchQuery({
          queryKey: ['report_transactions', userId, start, end],
          staleTime: 1000 * 60 * 5,
        });
      }
    }
  },
  { name: "Monitoring", href: "/monitoring", icon: "wallet", showInMobile: false },
  { name: "Calculator", href: "/calculator", icon: "calculator", showInMobile: false },
  { name: "Settings", href: "/profile", icon: "settings", showInMobile: false },
];



import AIFloatingButton from "./ai/AIFloatingButton";

export default function Layout({ children }) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Centralized real-time sync (replaces individual hook subscriptions)
  useRealtimeSync();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? saved === "true" : false;
  });
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarOpen", String(next));
      return next;
    });
  };

  const handleLogout = () => {
    getConfirm(theme).fire(confirmPresets.logout).then((result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-dark-bg flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-dark-card px-4 py-3 flex items-center justify-between border-b border-pink-100 dark:border-dark-border transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
              <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
              <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
              <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
              <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor" />
              <circle cx="50" cy="18" r="4" fill="currentColor" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 dark:text-dark-text tracking-tight">
            PennyWings
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 bg-pink-50 dark:bg-dark-border rounded-full flex items-center justify-center text-pink-500 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
          </Motion.button>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-dark-card border-r border-pink-100 dark:border-dark-border h-screen fixed top-0 left-0 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className={`p-6 flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M 48 20 C 40 10 30 15 35 20" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M 52 20 C 60 10 70 15 65 20" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M 48 30 C 20 -5 0 20 15 45 C 0 65 20 95 48 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
                  <path d="M 52 30 C 80 -5 100 20 85 45 C 100 65 80 95 52 65 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="25" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="75" cy="30" r="3" fill="currentColor" fillOpacity="0.2" />
                  <rect x="47" y="20" width="6" height="45" rx="3" fill="currentColor" />
                  <circle cx="50" cy="18" r="4" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 dark:from-pink-400 dark:to-pink-500 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                PennyWings
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 text-gray-400 dark:text-dark-muted hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-dark-border rounded-lg transition-colors ${!isSidebarOpen ? "mt-2" : ""}`}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Icon name={isSidebarOpen ? "arrowLeft" : "menu"} className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onMouseEnter={() => item.prefetch?.()}
                className={`flex items-center ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                    : "text-gray-500 dark:text-dark-muted hover:bg-pink-50/50 dark:hover:bg-dark-border hover:text-pink-500 dark:hover:text-pink-400"
                }`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <Icon
                  name={item.icon}
                  color="currentColor"
                  className="shrink-0 transition-all w-6 h-6"
                />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-pink-50 dark:border-dark-border space-y-2">
          <Motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`w-full flex items-center ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"} py-2 text-gray-400 dark:text-dark-muted hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-dark-border rounded-lg transition-colors text-sm font-black italic`}
            title={!isSidebarOpen ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : undefined}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>}
          </Motion.button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"} py-2 text-gray-400 dark:text-dark-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors text-sm font-black italic`}
            title={!isSidebarOpen ? "Sign Out" : undefined}
          >
            <Icon name="logout" className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 w-full relative transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <AnimatedPage className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </AnimatedPage>

        {/* AI Floating Button */}
        {profile && <AIFloatingButton />}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-pink-100 dark:border-dark-border z-50 transition-colors">
        <div className="flex items-center justify-around p-2">
          {navigation.filter(item => item.showInMobile).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onMouseEnter={() => item.prefetch?.()}
                className={`flex flex-col items-center justify-center flex-1 px-2 py-2.5 rounded-xl transition-all ${
                  isActive ? "text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-dark-border/30" : "text-gray-400 dark:text-dark-muted"
                }`}
              >
                <Icon name={item.icon} color="currentColor" className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-extrabold uppercase tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          {/* More Menu Button */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center flex-1 px-2 py-2.5 rounded-xl transition-all ${
              isMoreMenuOpen ? "text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-dark-border/30" : "text-gray-400 dark:text-dark-muted"
            }`}
          >
            <Icon name="menu" color="currentColor" className="w-6 h-6 mb-1" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight">
              More
            </span>
          </button>
        </div>

        {/* More Menu Dropdown */}
        <AnimatePresence>
          {isMoreMenuOpen && (
            <>
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMoreMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              />
              <Motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-white dark:bg-dark-card rounded-3xl border border-pink-100 dark:border-dark-border shadow-2xl overflow-hidden z-50"
              >
                <div className="p-2 space-y-1">
                  {/* Other Navigation Items */}
                  {navigation.filter(item => !item.showInMobile).map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                          isActive 
                            ? "bg-pink-50 dark:bg-dark-border text-pink-600 dark:text-pink-400" 
                            : "text-gray-700 dark:text-dark-text hover:bg-pink-50/50 dark:hover:bg-dark-border/50"
                        }`}
                      >
                        <Icon name={item.icon} color="currentColor" className="w-6 h-6" />
                        <span className="text-sm font-bold">{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Divider */}
                  <div className="h-px bg-pink-100 dark:bg-dark-border my-2"></div>
                  
                  {/* Theme Toggle in More Menu */}
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-gray-700 dark:text-dark-text hover:bg-pink-50/50 dark:hover:bg-dark-border/50"
                  >
                    <Icon name={theme === 'light' ? 'moon' : 'sun'} color="currentColor" className="w-6 h-6" />
                    <span className="text-sm font-bold">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                  </button>
                  
                  {/* Logout in More Menu */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20"
                  >
                    <Icon name="logout" color="currentColor" className="w-6 h-6" />
                    <span className="text-sm font-bold">Sign Out</span>
                  </button>
                </div>
              </Motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
