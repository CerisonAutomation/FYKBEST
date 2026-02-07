import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { ServiceWorkerCleanup } from '@/components/ServiceWorkerCleanup'
import { AuthProvider } from '@/lib/auth'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Font optimization with display: swap for performance
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false, // Disable preload to fix 404 errors
  fallback: ['system-ui', 'sans-serif'],
})

// Viewport configuration - PWA optimized
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
}

// Comprehensive metadata for SEO and social sharing
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kingsocial.com'),
  title: {
    default: 'KING SOCIAL | Premium Social Network',
    template: '%s | KING SOCIAL',
  },
  description:
    'Elite social marketplace for discerning individuals. Connect with verified companions, discover exclusive events, and experience premium social networking.',
  keywords: [
    'social network',
    'premium',
    'exclusive',
    'events',
    'companions',
    'luxury',
    'dating',
    'verified profiles',
    'elite network',
  ],
  authors: [{ name: 'King Social Team', url: 'https://kingsocial.com' }],
  creator: 'King Social',
  publisher: 'King Social',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'KING SOCIAL',
    title: 'KING SOCIAL | Premium Social Network',
    description:
      'Elite social marketplace for discerning individuals. Connect with verified companions, discover exclusive events.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KING SOCIAL - Premium Social Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KING SOCIAL | Premium Social Network',
    description: 'Elite social marketplace for discerning individuals.',
    images: ['/og-image.jpg'],
    creator: '@kingsocial',
    site: '@kingsocial',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KING SOCIAL',
    startupImage: [
      {
        url: '/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  category: 'social',
  classification: 'Social Networking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://*.supabase.co" />

        {/* Only preload fonts if they exist */}
        {process.env.NODE_ENV === 'production' && (
          <link
            rel="preload"
            href="/fonts/inter-var.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className="bg-black text-white antialiased selection:bg-amber-500/30 selection:text-white"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ServiceWorkerCleanup />
          {children}
          <AnalyticsProvider />
        </AuthProvider>
      </body>
    </html>
  )
}
