import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from './Icon'
import Swal from 'sweetalert2'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'bank' },
  { name: 'Accounts', href: '/accounts', icon: 'card' },
  { name: 'Transactions', href: '/transactions', icon: 'clock' },
]

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    Swal.fire({
      title: 'Wait! Leaving?',
      text: "Are you sure you want to sign out? Your pennies will miss you!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EC4899', // pink-500
      cancelButtonColor: '#94A3B8', // slate-400
      confirmButtonText: 'Yes, Log Me Out',
      cancelButtonText: 'Cancel',
      background: '#fff',
      borderRadius: '2rem',
      customClass: {
        popup: 'rounded-[2.5rem] p-8 font-bold',
        title: 'text-2xl font-black text-gray-900',
        confirmButton: 'rounded-2xl px-8 py-4 px-10 font-black tracking-tight',
        cancelButton: 'rounded-2xl px-8 py-4 font-black tracking-tight'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        signOut()
      }
    })
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-pink-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 tracking-tight">PennyWings</span>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/profile"
            className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors"
          >
            <Icon name="user" className="w-5 h-5" />
          </Link>
          <button 
            onClick={handleLogout}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            title="Sign Out"
          >
            <Icon name="logout" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-pink-100 h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
              PennyWings
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-pink-50 text-pink-600 shadow-sm shadow-pink-100' 
                    : 'text-gray-500 hover:bg-pink-50/50 hover:text-pink-500'
                }`}
              >
                <Icon name={item.icon} color="currentColor" className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-pink-50">
          <Link 
            to="/profile"
            className="block bg-pink-50 rounded-2xl p-4 mb-4 hover:bg-pink-100 transition-all border border-transparent hover:border-pink-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-2 text-pink-500 shadow-sm group-hover:scale-110 transition-transform">
                <Icon name="user" color="currentColor" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {profile?.full_name || 'Set your name'}
                </p>
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest truncate">
                  View Profile
                </p>
              </div>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium"
          >
            <Icon name="logout" className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex justify-around p-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isActive ? 'text-pink-600' : 'text-gray-400'
              }`}
            >
              <Icon name={item.icon} color="currentColor" className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
