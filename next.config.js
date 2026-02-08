/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Turbopack for dev (already enabled via --turbo flag)
  // Production optimizations
  trailingSlash: false,
  reactStrictMode: true,

  // Output configuration
  output: 'export',

  // Skip static generation for error pages that use client-side features
  output: 'standalone',

  // Dist directory
  distDir: '.next',

  // Next.js 15+ Features
  // Enable typed routes for better type safety (moved from experimental)
  typedRoutes: true,

  experimental: {
    // React Compiler for automatic memoization
    reactCompiler: true,

    // Optimize package imports for common libraries
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-icons',
      'date-fns',
      'zod',
      '@tanstack/react-query',
    ],

    // Server Actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },

    // Static generation optimization
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 8,
  },

  // Image optimization
  // @see https://nextjs.org/docs/app/getting-started/image-optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // Performance headers
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Bundle optimization with webpack
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // React and core libraries
            reactCore: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react-core',
              chunks: 'all',
              priority: 40,
            },
            // UI Components (Radix, etc)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              priority: 30,
            },
            // Supabase
            supabase: {
              test: /[\\/]node_modules[\\/](@supabase|supabase)[\\/]/,
              name: 'supabase',
              chunks: 'all',
              priority: 20,
            },
            // Icons
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 10,
            },
            // Vendor bundle for everything else
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              priority: 1,
            },
          },
        },
      }
    }
    return config
  },

  // Headers for security and caching
  // @see https://nextjs.org/docs/app/getting-started/caching-and-revalidating
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*).(jpg|jpeg|png|webp|avif|svg|gif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      // Security headers
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(self)',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/login',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'authorization',
            value: undefined,
          },
        ],
      },
      {
        source: '/app',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Rewrites (if needed)
  async rewrites() {
    return []
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Logging configuration for data fetching
  // @see https://nextjs.org/docs/app/getting-started/fetching-data
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
