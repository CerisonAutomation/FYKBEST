import type { MetadataRoute } from 'next'

/**
 * Robots.txt Generation
 *
 * Controls web crawler access to your site.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '/settings/',
        '/messages/',
        '/bookings/',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kingsocial.com'}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_APP_URL || 'https://kingsocial.com',
  }
}
