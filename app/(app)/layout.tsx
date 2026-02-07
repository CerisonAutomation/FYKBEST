import { createServerAuthClient } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * App Layout (Authenticated)
 *
 * Protected layout for all authenticated app pages.
 */

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  // Server-side auth check
  const supabase = await createServerAuthClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user || error) {
    redirect('/login?redirectTo=/browse')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* App Shell - Simple version without external components */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">
          <div className="p-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-amber-500">KING SOCIAL</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a
              href="/browse"
              className="block px-4 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white"
            >
              Browse
            </a>
            <a
              href="/messages"
              className="block px-4 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white"
            >
              Messages
            </a>
            <a
              href="/bookings"
              className="block px-4 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white"
            >
              Bookings
            </a>
            <a
              href="/profile"
              className="block px-4 py-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white"
            >
              Profile
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <header className="md:hidden h-16 border-b border-slate-800 flex items-center px-4 bg-slate-950">
            <h1 className="text-lg font-bold text-amber-500">KING SOCIAL</h1>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
