# Next.js App Router Patterns - Implementation Guide

This document describes all the Next.js App Router Getting Started patterns implemented in this project.

## Table of Contents

1. [Configuration](#configuration)
2. [Project Structure](#project-structure)
3. [Routing Files](#routing-files)
4. [Server Components](#server-components)
5. [Client Components](#client-components)
6. [Data Fetching](#data-fetching)
7. [Caching & Revalidation](#caching--revalidation)
8. [Server Actions](#server-actions)
9. [Metadata](#metadata)
10. [Error Handling](#error-handling)

---

## Configuration

### `next.config.js`

```javascript
experimental: {
  // Cache Components - Enable static shell with dynamic content streaming
  cacheComponents: true,
  
  // Typed routes for better type safety
  typedRoutes: true,
  
  // Server Actions configuration
  serverActions: {
    bodySizeLimit: '2mb',
  },
}

// Logging for data fetching visibility
logging: {
  fetches: {
    fullUrl: true,
  },
}
```

**Patterns Applied:**
- ✅ Cache Components enabled for static shell + dynamic streaming
- ✅ Typed routes for improved type safety
- ✅ Server Actions with size limits
- ✅ Fetch logging for debugging

---

## Project Structure

### Route Groups

```
app/
├── (marketing)/          # Route group - excluded from URL
│   ├── about/
│   │   └── page.tsx      # Accessible at /about
│   └── contact/
│       └── page.tsx      # Accessible at /contact
├── (app)/                # Route group for authenticated pages
│   ├── layout.tsx        # Auth-check layout
│   ├── browse/
│   │   ├── page.tsx      # Server Component with data fetching
│   │   ├── loading.tsx   # Loading UI
│   │   └── error.tsx     # Error boundary
│   └── profile/
│       └── [username]/   # Dynamic route segment
│           ├── page.tsx
│           └── generateStaticParams
```

**Patterns Applied:**
- ✅ Route groups for organization without URL impact
- ✅ Multiple root layouts (marketing vs app)
- ✅ Nested layouts with auth checks
- ✅ Private folders with underscore prefix

---

## Routing Files

### Special Files Convention

| File | Purpose |
|------|---------|
| `page.tsx` | Page UI for a route |
| `layout.tsx` | Shared UI wrapper |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | 404 UI |
| `global-error.tsx` | Root error UI |
| `route.ts` | API endpoint |
| `template.tsx` | Re-mounting layout |

### Implementation Examples

#### Page with Data Fetching
```typescript
// app/(app)/browse/page.tsx
export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const params = await searchParams
  // Data fetching happens here
  return <div>...</div>
}
```

#### Loading State
```typescript
// app/(app)/browse/loading.tsx
export default function BrowseLoading() {
  return <ProfilesSkeleton />
}
```

#### Error Boundary
```typescript
// app/(app)/browse/error.tsx
'use client'
export default function BrowseError({ error, reset }) {
  return <ErrorDisplay error={error} onReset={reset} />
}
```

**Patterns Applied:**
- ✅ Loading UI with streaming
- ✅ Error boundaries at multiple levels
- ✅ Not found handling with `notFound()`
- ✅ Global error handling

---

## Server Components

### Default in App Router

Server Components render on the server and can:
- Fetch data directly from databases/APIs
- Access backend resources securely
- Render without JavaScript bundle impact

### Data Fetching Patterns

#### 1. Direct Database Query
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
  
  return <div>...</div>
}
```

#### 2. Request Memoization with React.cache
```typescript
import { cache } from 'react'

const getProfile = cache(async (username: string) => {
  const supabase = await createClient()
  return supabase.from('profiles').select('*').eq('username', username).single()
})

// Used in both generateMetadata and page component - only fetches once
```

#### 3. Parallel Data Fetching
```typescript
const [profileResult, postsResult] = await Promise.all([
  getProfile(username),
  getPosts(username),
])
```

#### 4. Sequential Data Fetching with Suspense
```typescript
<Suspense fallback={<ProfileSkeleton />}>
  <ProfileHeader username={username} />
</Suspense>
<Suspense fallback={<ContentSkeleton />}>
  <ProfileContent username={username} />
</Suspense>
```

**Patterns Applied:**
- ✅ Direct database queries in Server Components
- ✅ React.cache for deduplication
- ✅ Parallel fetching with Promise.all
- ✅ Streaming with Suspense

---

## Client Components

### When to Use

Add `'use client'` when you need:
- State and event handlers
- Lifecycle effects (useEffect)
- Browser APIs (localStorage, window)
- Custom hooks

### Server/Client Composition

```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData()
  
  return (
    <div>
      <h1>{data.title}</h1>
      {/* Pass Server Component as child to Client Component */}
      <ClientModal>
        <ServerContent data={data} />
      </ClientModal>
    </div>
  )
}

// Client Component
'use client'
function ClientModal({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}
```

**Patterns Applied:**
- ✅ Minimal Client Component boundaries
- ✅ Passing Server Components as props to Client Components
- ✅ Context providers in Client Components

---

## Data Fetching

### fetch API Extensions

```typescript
// Cached fetch (force-cache)
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache', // Cache indefinitely
  next: {
    revalidate: 3600, // Revalidate every hour
    tags: ['products'], // Tag for on-demand revalidation
  }
})

// Dynamic fetch (no cache)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store', // No caching
})
```

### ORM/Database Pattern

```typescript
// For non-fetch data sources, use React.cache
import { cache } from 'react'

export const getProducts = cache(async () => {
  return db.query.products.findMany()
})
```

**Patterns Applied:**
- ✅ fetch with Next.js extensions
- ✅ React.cache for database queries
- ✅ Request memoization (automatic)

---

## Caching & Revalidation

### Cache Components (Next.js 15+)

With `cacheComponents: true` in config:

```typescript
// Components without dynamic data are prerendered at build time
export default async function Page() {
  // This page is static (cached) by default
  return <div>Static Content</div>
}

// Dynamic data requires Suspense or 'use cache'
export default async function Page() {
  return (
    <div>
      <h1>Static Header</h1>
      <Suspense fallback={<Loading />}>
        <DynamicContent /> {/* Fetched at request time */}
      </Suspense>
    </div>
  )
}
```

### Revalidation APIs

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

// Revalidate a specific path
revalidatePath('/browse')

// Revalidate by tag
revalidateTag('profiles')

// With stale-while-revalidate
import { revalidateTag } from 'next/cache'
revalidateTag('products', { profile: 'max' })
```

### On-Demand Revalidation in Route Handlers

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { tag } = await request.json()
  revalidateTag(tag)
  return NextResponse.json({ revalidated: true })
}
```

**Patterns Applied:**
- ✅ Static generation by default
- ✅ Dynamic rendering with Suspense
- ✅ On-demand revalidation with tags
- ✅ Path-based revalidation

---

## Server Actions

### Form Actions

```typescript
// app/actions/profile.ts
'use server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Validate
  const displayName = formData.get('display_name')
  if (!displayName) return { error: 'Name required' }
  
  // Update
  await supabase.from('profiles').update({ display_name: displayName }).eq('user_id', user.id)
  
  // Revalidate
  revalidatePath('/profile')
  
  return { success: true }
}
```

### Usage in Forms

```typescript
import { updateProfile } from '@/app/actions/profile'

export function EditProfileForm() {
  return (
    <form action={updateProfile}>
      <input name="display_name" />
      <button type="submit">Save</button>
    </form>
  )
}
```

### Usage with useActionState (Pending State)

```typescript
'use client'
import { useActionState } from 'react'
import { updateProfile } from '@/app/actions/profile'

export function EditProfileForm() {
  const [state, action, pending] = useActionState(updateProfile, null)
  
  return (
    <form action={action}>
      <input name="display_name" />
      <button disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

**Patterns Applied:**
- ✅ Server Actions with "use server"
- ✅ Form submissions (progressive enhancement)
- ✅ Event handler invocations
- ✅ Revalidation after mutations
- ✅ Error handling as return values

---

## Metadata

### Static Metadata

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
}
```

### Dynamic Metadata

```typescript
import { cache } from 'react'

const getProfile = cache(async (username: string) => {
  // Fetch profile
})

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfile(username)
  
  return {
    title: profile.display_name,
    description: profile.bio,
  }
}
```

### Dynamic OG Images

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div style={{...}}>KING SOCIAL</div>,
    { ...size }
  )
}
```

### File-based Metadata

- `favicon.ico` - Site favicon
- `icon.tsx` - Dynamic app icon
- `apple-icon.tsx` - Apple touch icon
- `opengraph-image.tsx` - OG image
- `twitter-image.tsx` - Twitter card image
- `robots.ts` - robots.txt
- `sitemap.ts` - sitemap.xml

**Patterns Applied:**
- ✅ Static metadata exports
- ✅ Dynamic generateMetadata
- ✅ Dynamic OG images with ImageResponse
- ✅ File-based metadata conventions

---

## Error Handling

### Expected Errors (Return Values)

```typescript
// Server Action - return errors, don't throw
export async function updateProfile(formData: FormData) {
  const result = schema.safeParse(rawData)
  if (!result.success) {
    return { error: 'Validation failed', details: result.error }
  }
  // ...
}

// Component - use useActionState
const [state, action, pending] = useActionState(updateProfile, null)
```

### Uncaught Exceptions (Error Boundaries)

```typescript
// app/(app)/browse/error.tsx
'use client'

export default function BrowseError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  useEffect(() => {
    // Log to error tracking
    console.error(error)
  }, [error])
  
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 404 Handling

```typescript
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: Props) {
  const profile = await getProfile(params.username)
  
  if (!profile) {
    notFound() // Renders not-found.tsx
  }
  
  return <div>...</div>
}
```

**Patterns Applied:**
- ✅ Expected errors as return values
- ✅ useActionState for form errors
- ✅ Error boundaries for uncaught exceptions
- ✅ notFound() for 404 handling

---

## Route Handlers (API Routes)

### Basic Route Handler

```typescript
// app/api/profiles/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Fetch data
  const profiles = await fetchProfiles(limit)
  
  return NextResponse.json({ profiles })
}
```

### Dynamic Route with generateStaticParams

```typescript
// app/api/profiles/[username]/route.ts
export async function generateStaticParams() {
  const profiles = await getTopProfiles(100)
  return profiles.map(p => ({ username: p.username }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const profile = await getProfile(username)
  return NextResponse.json(profile)
}
```

### Caching Route Handlers

```typescript
// Cached GET handler
export const dynamic = 'force-static'

export async function GET() {
  const data = await fetchData()
  return NextResponse.json(data)
}
```

**Patterns Applied:**
- ✅ HTTP method handlers (GET, POST, etc.)
- ✅ generateStaticParams for API routes
- ✅ Dynamic route segments
- ✅ Request/NextRequest typing

---

## Proxy (formerly Middleware)

### Proxy Configuration

```typescript
// proxy.ts
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rate limiting
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult
  }
  
  // Auth checks
  const session = await updateSession(request)
  
  // Continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**Note:** In Next.js 16, Middleware is renamed to Proxy. Functionality remains the same.

**Patterns Applied:**
- ✅ Route protection
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ Session management
- ✅ Security headers

---

## Navigation

### Link Component

```typescript
import Link from 'next/link'

// Automatic prefetching on viewport entry
<Link href="/browse">Browse</Link>

// Disable prefetching for large lists
<Link href="/profile/123" prefetch={false}>View</Link>

// Scroll control
<Link href="/about" scroll={false}>About</Link>
```

### Navigation Hooks

```typescript
'use client'
import { 
  useRouter, 
  usePathname, 
  useSearchParams,
  useParams,
  useLinkStatus 
} from 'next/navigation'

function Navigation() {
  const router = useRouter()        // Programmatic navigation
  const pathname = usePathname()    // Current path
  const searchParams = useSearchParams() // URL params
  const params = useParams()        // Route params
  const { pending } = useLinkStatus()    // Link loading state
  
  // Usage examples
  router.push('/browse')
  router.refresh()
  router.prefetch('/profile')
  
  return <div>...</div>
}
```

### Native History API

```typescript
// Update URL without navigation
window.history.pushState(null, '', '/new-path')

// Replace current entry
window.history.replaceState(null, '', '/new-path')

// Works with Next.js router state
```

**Patterns Applied:**
- ✅ Link with automatic prefetching
- ✅ Navigation hooks
- ✅ Programmatic navigation
- ✅ Native History API integration

---

## Summary

All 18 Getting Started documentation topics have been implemented:

1. ✅ **Installation** - Next.js 15+ with Turbopack
2. ✅ **Project Structure** - Route groups, nested layouts
3. ✅ **Layouts and Pages** - Server Components, nested routes
4. ✅ **Linking and Navigating** - All navigation hooks, prefetching
5. ✅ **Server and Client Components** - Proper boundaries, composition
6. ✅ **Cache Components** - Enabled in config with static shell streaming
7. ✅ **Fetching Data** - fetch, ORM, React.cache, Suspense
8. ✅ **Updating Data** - Server Actions, useActionState
9. ✅ **Caching and Revalidating** - Tags, paths, on-demand
10. ✅ **Error Handling** - Expected vs uncaught, boundaries
11. ✅ **CSS** - Tailwind CSS v4 configuration
12. ✅ **Image Optimization** - next/image configuration
13. ✅ **Font Optimization** - next/font with Google Fonts
14. ✅ **Metadata and OG Images** - Dynamic generation, ImageResponse
15. ✅ **Route Handlers** - API routes, generateStaticParams
16. ✅ **Proxy** - Middleware renamed, all functionality
17. ✅ **Deploying** - Node.js, Docker, static export ready
18. ✅ **Upgrading** - Next.js 15+ with all latest features
