/**
 * Navigation Hooks Examples
 *
 * Demonstrates all Next.js App Router navigation hooks:
 * - useRouter for programmatic navigation
 * - usePathname for current path
 * - useSearchParams for URL params
 * - useParams for dynamic route params
 * - useLinkStatus for loading feedback
 *
 * @see https://nextjs.org/docs/app/getting-started/linking-and-navigating
 */

'use client'

// useLinkStatus available in Next.js 15.3+
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

// ============================================
// Example 1: useRouter for programmatic navigation
// ============================================

export function NavigationControls() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleNavigate = useCallback(() => {
    // Programmatic navigation
    router.push('/browse')
  }, [router])

  const handleReplace = useCallback(() => {
    // Replace current history entry
    router.replace('/login')
  }, [router])

  const handleBack = useCallback(() => {
    // Go back
    router.back()
  }, [router])

  const handleRefresh = useCallback(() => {
    // Refresh current route
    startTransition(() => {
      router.refresh()
    })
  }, [router])

  const handlePrefetch = useCallback(() => {
    // Prefetch a route
    router.prefetch('/profile/example')
  }, [router])

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-white">useRouter Controls</h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={handleNavigate} className="px-4 py-2 bg-amber-500 text-black rounded">
          Push /browse
        </button>
        <button onClick={handleReplace} className="px-4 py-2 bg-slate-700 text-white rounded">
          Replace /login
        </button>
        <button onClick={handleBack} className="px-4 py-2 bg-slate-700 text-white rounded">
          Back
        </button>
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
        >
          {isPending ? 'Refreshing...' : 'Refresh'}
        </button>
        <button onClick={handlePrefetch} className="px-4 py-2 bg-slate-700 text-white rounded">
          Prefetch Profile
        </button>
      </div>
    </div>
  )
}

// ============================================
// Example 2: usePathname for current path
// ============================================

export function CurrentPathDisplay() {
  const pathname = usePathname()

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="font-bold text-white mb-2">usePathname</h3>
      <p className="text-slate-400">
        Current path: <code className="text-amber-500">{pathname}</code>
      </p>
    </div>
  )
}

// ============================================
// Example 3: useSearchParams for URL params
// ============================================

export function SearchParamsDisplay() {
  const searchParams = useSearchParams()

  // Get individual params
  const search = searchParams?.get('search')
  const tier = searchParams?.get('tier')

  // Get all params as object
  const allParams: Record<string, string> = {}
  searchParams?.forEach((value, key) => {
    allParams[key] = value
  })

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="font-bold text-white mb-2">useSearchParams</h3>
      <div className="space-y-1 text-sm">
        <p className="text-slate-400">
          Search: <code className="text-amber-500">{search || 'null'}</code>
        </p>
        <p className="text-slate-400">
          Tier: <code className="text-amber-500">{tier || 'null'}</code>
        </p>
        <p className="text-slate-400">
          All params: <code className="text-amber-500">{JSON.stringify(allParams)}</code>
        </p>
      </div>
    </div>
  )
}

// ============================================
// Example 4: useParams for dynamic route params
// ============================================

export function RouteParamsDisplay() {
  const params = useParams()

  // For /profile/[username], params would be { username: 'value' }
  // For /shop/[category]/[product], params would be { category: '...', product: '...' }

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="font-bold text-white mb-2">useParams</h3>
      <p className="text-slate-400 text-sm">
        Route params: <code className="text-amber-500">{JSON.stringify(params)}</code>
      </p>
    </div>
  )
}

// ============================================
// Example 5: Loading feedback (Next.js 15.3+)
// ============================================
// useLinkStatus hook available in Next.js 15.3+
// Tracks pending state of <Link> components

export function LinksWithStatus() {
  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="font-bold text-white mb-2">useLinkStatus (Next.js 15.3+)</h3>
      <p className="text-slate-400 text-sm mb-3">
        New hook to track Link pending state for loading indicators
      </p>
      <div className="flex gap-4">
        <Link href="/browse" className="text-amber-500 hover:text-amber-400">
          Browse
        </Link>
        <Link href="/about" className="text-amber-500 hover:text-amber-400">
          About
        </Link>
        <Link href="/contact" className="text-amber-500 hover:text-amber-400">
          Contact
        </Link>
      </div>
    </div>
  )
}

// ============================================
// Example 6: Native History API integration
// ============================================

export function HistoryApiExample() {
  const [sort, setSort] = useState('newest')

  // Sync with URL using native History API
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('sort', sort)
    window.history.replaceState(null, '', url.toString())
  }, [sort])

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="font-bold text-white mb-2">Native History API</h3>
      <p className="text-slate-400 text-sm mb-3">
        Updates URL without navigation (for filters, etc.)
      </p>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-slate-800 text-white px-3 py-2 rounded"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Popular</option>
      </select>
    </div>
  )
}

// ============================================
// Example 7: Complete navigation example
// ============================================

export function CompleteNavigationExample() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold text-white">Navigation Hooks Examples</h2>
      <NavigationControls />
      <CurrentPathDisplay />
      <SearchParamsDisplay />
      <RouteParamsDisplay />
      <LinksWithStatus />
      <HistoryApiExample />
    </div>
  )
}
