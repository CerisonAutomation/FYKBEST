# KING SOCIAL - App Router Routes

Complete routing structure for the Next.js App Router implementation.

## Route Groups

### `(marketing)` - Public Marketing Pages
Accessible without authentication.

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page (redirects to /browse if authenticated) |
| `/about` | `app/(marketing)/about/page.tsx` | About us page |
| `/contact` | `app/(marketing)/contact/page.tsx` | Contact form |
| `/terms` | `app/(marketing)/terms/page.tsx` | Terms of service |
| `/privacy` | `app/(marketing)/privacy/page.tsx` | Privacy policy |

### `(auth)` - Authentication Pages
Redirects to `/browse` if already authenticated.

| Route | File | Description |
|-------|------|-------------|
| `/login` | `app/(auth)/login/page.tsx` | Login form |
| `/signup` | `app/(auth)/signup/page.tsx` | Registration form |
| `/magic-link` | `app/(auth)/magic-link/page.tsx` | Passwordless login |
| `/verification` | `app/(auth)/verification/page.tsx` | Email verification |
| `/onboarding` | `app/(auth)/onboarding/page.tsx` | New user onboarding |
| `/role` | `app/(auth)/role/page.tsx` | Role selection (seeker/provider) |

### `(app)` - Authenticated Application
Requires authentication. Redirects to `/login` if not authenticated.

#### Main Navigation
| Route | File | Description |
|-------|------|-------------|
| `/browse` | `app/(app)/browse/page.tsx` | Main browse/discovery page |
| `/explore` | `app/(app)/explore/page.tsx` | Explore new content |
| `/messages` | `app/(app)/messages/page.tsx` | Chat and messaging |
| `/bookings` | `app/(app)/bookings/page.tsx` | Bookings and appointments |
| `/favorites` | `app/(app)/favorites/page.tsx` | Favorited profiles |

#### Events & Parties
| Route | File | Description |
|-------|------|-------------|
| `/events` | `app/(app)/events/page.tsx` | Events listing |
| `/events/create` | `app/(app)/events/create/page.tsx` | Create new event |

#### Special Features
| Route | File | Description |
|-------|------|-------------|
| `/right-now` | `app/(app)/right-now/page.tsx` | Available right now |
| `/subscription` | `app/(app)/subscription/page.tsx` | Subscription management |
| `/ai-settings` | `app/(app)/ai-settings/page.tsx` | AI assistant settings |

#### Profile
| Route | File | Description |
|-------|------|-------------|
| `/me` | `app/(app)/me/page.tsx` | My own profile |
| `/profile/[username]` | `app/(app)/profile/[username]/page.tsx` | Public profile view |
| `/edit-profile` | `app/(app)/edit-profile/page.tsx` | Edit profile form |

#### Settings
| Route | File | Description |
|-------|------|-------------|
| `/settings` | `app/(app)/settings/page.tsx` | Main settings page |
| `/settings/photos` | `app/(app)/settings/photos/page.tsx` | Photo management |
| `/settings/location` | `app/(app)/settings/location/page.tsx` | Location settings |
| `/settings/notifications` | `app/(app)/settings/notifications/page.tsx` | Notification preferences |
| `/settings/privacy` | `app/(app)/settings/privacy/page.tsx` | Privacy settings |

### API Routes

| Route | File | Description |
|-------|------|-------------|
| `/api/auth/callback` | `app/api/auth/callback/route.ts` | OAuth callback |
| `/api/profiles` | `app/api/profiles/route.ts` | Profile CRUD operations |
| `/api/profiles/[username]` | `app/api/profiles/[username]/route.ts` | Individual profile API |
| `/api/webhooks/stripe` | `app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `/api/subscriptions/*` | `app/api/subscriptions/*/route.ts` | Subscription APIs |
| `/api/storage/sign` | `app/api/storage/sign/route.ts` | Storage upload signing |
| `/api/compliance/dsar` | `app/api/compliance/dsar/route.ts` | Data subject access request |

## File Conventions Used

### Special Files
- `layout.tsx` - Shared UI wrapper for route segments
- `page.tsx` - Page UI for a route
- `loading.tsx` - Loading UI (automatic Suspense boundary)
- `error.tsx` - Error boundary UI
- `not-found.tsx` - 404 UI

### Metadata Files
- `opengraph-image.tsx` - Dynamic OG image generation
- `icon.tsx` - Dynamic favicon
- `apple-icon.tsx` - Apple touch icon
- `robots.ts` - robots.txt generation
- `sitemap.ts` - sitemap.xml generation

## Route Protection

### Public Routes (no auth required)
```
/, /about, /contact, /terms, /privacy, /login, /signup, /magic-link
```

### Auth Routes (redirect if authenticated)
```
/login, /signup, /magic-link, /verification, /onboarding, /role
```

### Protected Routes (require auth)
```
/browse, /messages, /bookings, /favorites, /events/*, /settings/*, /me
```

## Navigation Structure

### Bottom Navigation (Mobile)
- Browse (`/browse`)
- Explore (`/explore`)
- Messages (`/messages`)
- Events (`/events`)
- Profile (`/me`)

### Header Navigation
- Left sidebar toggle
- Search
- Right sidebar toggle (notifications)

### Left Sidebar
- Browse
- Messages
- Bookings
- Favorites
- Events
- Right Now
- Settings

## Middleware Configuration

The middleware (`middleware.ts`) handles:
1. **Rate limiting** - API route protection
2. **CSRF protection** - State-changing requests
3. **Session management** - Auth state refresh
4. **Route protection** - Redirects based on auth status
5. **Security headers** - HSTS, X-Frame-Options, etc.

## Migration from SPA-style Navigation

Previously, the app used a `stage` state in Zustand for navigation:
```typescript
// Old approach
setStage('browse')
setStage('messages')
```

Now uses proper Next.js routing:
```typescript
// New approach
router.push('/browse')
router.push('/messages')
```

The `MainApp` component's screen rendering has been replaced by individual page files in the App Router structure.
