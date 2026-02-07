'use client'

import { useVibrate } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Calendar, LayoutGrid, MessageCircle, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: 'browse', label: 'Grid', icon: LayoutGrid, href: '/browse' },
  { id: 'right-now', label: 'Right Now', icon: Zap, href: '/right-now' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/messages' },
  { id: 'events', label: 'Events', icon: Calendar, href: '/events' },
  { id: 'me', label: 'Me', icon: User, href: '/me' },
]

export function BottomNav() {
  const vibrate = useVibrate()
  const pathname = usePathname()
  const { unreadCounts } = useAppStore()

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 bg-black/90 backdrop-blur-2xl border-t border-slate-800 flex items-center justify-around px-2 sm:px-4 z-30 lg:hidden safe-area-pb"
    >
      {navItems.map((item) => {
        const isActive = pathname
          ? pathname === item.href || pathname.startsWith(`${item.href}/`)
          : false
        const unreadCount = item.id === 'messages' ? totalUnread : 0

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => vibrate([15, 8])}
            className={`
              flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 relative min-w-[56px]
              ${isActive ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-amber-400' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium ${isActive ? 'text-amber-400' : ''}`}
            >
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-full"
              />
            )}
          </Link>
        )
      })}
    </motion.div>
  )
}
