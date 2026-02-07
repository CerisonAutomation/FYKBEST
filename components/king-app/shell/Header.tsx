'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Settings, User, X } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const vibrate = useVibrate()
  const { leftMenuOpen, setLeftMenuOpen, rightMenuOpen, setRightMenuOpen, notifications, user } =
    useAppStore()

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <header className="h-16 sm:h-20 bg-black/70 backdrop-blur-2xl border-b border-slate-800 fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <button
        onClick={() => {
          vibrate([15, 8])
          setLeftMenuOpen(!leftMenuOpen)
          setRightMenuOpen(false)
        }}
        className="p-2 hover:bg-slate-900/50 rounded-lg transition-all duration-200 active:scale-95"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {leftMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <Link href="/browse" className="text-lg sm:text-2xl font-black tracking-tight select-none">
        <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent uppercase">
          King
        </span>
        <span className="text-white mx-1"></span>
        <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent uppercase">
          Social
        </span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="p-2 hover:bg-slate-900/50 rounded-lg transition-all duration-200 relative active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          {unreadNotifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1"
            >
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </motion.span>
          )}
        </button>

        {user && (
          <Link
            href="/me"
            className="hidden sm:flex p-2 hover:bg-slate-900/50 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="Profile"
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </Link>
        )}

        <button
          onClick={() => {
            vibrate([15, 8])
            setRightMenuOpen(!rightMenuOpen)
            setLeftMenuOpen(false)
          }}
          className="p-2 hover:bg-slate-900/50 rounded-lg transition-all duration-200 active:scale-95"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </header>
  )
}
