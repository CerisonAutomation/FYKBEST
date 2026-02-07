'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Globe,
  Heart,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Settings,
  Star,
  User,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { id: 'browse', label: 'DISCOVER', icon: LayoutGrid, href: '/browse' },
  { id: 'messages', label: 'MESSAGES', icon: MessageCircle, href: '/messages' },
  { id: 'explore', label: 'EXPLORE', icon: Globe, href: '/explore' },
  { id: 'bookings', label: 'MY DATES', icon: Calendar, href: '/bookings' },
  { id: 'favorites', label: 'SAVED', icon: Heart, href: '/favorites' },
  { id: 'subscription', label: 'MEMBERSHIP', icon: Star, href: '/subscription' },
  { id: 'me', label: 'PROFILE', icon: User, href: '/me' },
]

export function LeftSidebar() {
  const vibrate = useVibrate()
  const pathname = usePathname()
  const {
    leftMenuOpen,
    setLeftMenuOpen,
    user,
    setUser,
    isAiEnabled,
    setIsAiEnabled,
    unreadCounts,
  } = useAppStore()

  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0)

  const handleLogout = async () => {
    vibrate([50, 20])
    const { supabase } = await import('@/lib/supabase/client')
    await supabase.auth.signOut()
    setUser(null)
    setLeftMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <AnimatePresence>
      {leftMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-15 cursor-pointer lg:hidden"
            onClick={() => setLeftMenuOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-72 h-screen bg-black/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col z-20"
          >
            {/* Logo Section */}
            <div className="p-6 sm:p-8 border-b border-slate-800">
              <Link href="/browse" onClick={() => setLeftMenuOpen(false)}>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    King
                  </span>
                </h1>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Social
                  </span>
                </h1>
              </Link>
              <p className="text-xs tracking-[0.25em] text-slate-500 mt-3 font-light">
                PREMIUM NETWORK
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 sm:p-6 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = pathname
                  ? pathname === item.href || pathname.startsWith(`${item.href}/`)
                  : false
                const badge = item.id === 'messages' ? totalUnread : 0

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        vibrate([15, 8])
                        setLeftMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-600/20 to-amber-500/10 text-amber-400 border border-amber-600/40 shadow-lg shadow-amber-600/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : ''}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge > 0 && (
                        <span className="min-w-[20px] h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center px-1.5">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Settings Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_ITEMS.length * 0.05 }}
              >
                <Link
                  href="/settings"
                  onClick={() => {
                    vibrate([15, 8])
                    setLeftMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative
                    ${
                      pathname?.startsWith('/settings')
                        ? 'bg-gradient-to-r from-amber-600/20 to-amber-500/10 text-amber-400 border border-amber-600/40 shadow-lg shadow-amber-600/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                    }
                  `}
                >
                  <Settings
                    className={`w-5 h-5 ${pathname?.startsWith('/settings') ? 'text-amber-500' : ''}`}
                  />
                  <span className="flex-1 text-left">SETTINGS</span>
                  {pathname?.startsWith('/settings') && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full"
                    />
                  )}
                </Link>
              </motion.div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-6 border-t border-slate-800 space-y-3">
              {/* AI Quick Toggle */}
              <motion.label
                className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-900/50 transition group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`
                  w-10 h-6 rounded-full relative transition-all duration-300 
                  ${isAiEnabled ? 'bg-amber-600' : 'bg-slate-700'}
                `}
                >
                  <motion.div
                    animate={{ x: isAiEnabled ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${isAiEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span
                    className={`text-sm font-medium ${isAiEnabled ? 'text-amber-400' : 'text-slate-500'}`}
                  >
                    AI Assistant
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAiEnabled}
                  onChange={(e) => setIsAiEnabled(e.target.checked)}
                />
              </motion.label>

              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-white">
                    {user.display_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.display_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {user && (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition font-semibold text-sm border border-red-600/20 hover:border-red-600/40"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </motion.button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
