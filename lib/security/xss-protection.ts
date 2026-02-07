/**
 * Enterprise XSS Protection
 * DOMPurify integration for Next.js 16
 */

import DOMPurify from 'dompurify'

export interface XSSProtectionOptions {
  ALLOWED_TAGS?: string[]
  ALLOWED_ATTR?: string[]
  ALLOW_DATA_ATTR?: boolean
  FORBID_TAGS?: string[]
  FORBID_ATTR?: string[]
}

const defaultOptions: XSSProtectionOptions = {
  ALLOWED_TAGS: [
    'b',
    'i',
    'em',
    'strong',
    'a',
    'p',
    'br',
    'span',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'class'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string, options: XSSProtectionOptions = {}): string {
  const config = {
    ...defaultOptions,
    ...options,
    ALLOWED_TAGS: [...(defaultOptions.ALLOWED_TAGS || []), ...(options.ALLOWED_TAGS || [])],
    ALLOWED_ATTR: [...(defaultOptions.ALLOWED_ATTR || []), ...(options.ALLOWED_ATTR || [])],
    FORBID_TAGS: [...(defaultOptions.FORBID_TAGS || []), ...(options.FORBID_TAGS || [])],
    FORBID_ATTR: [...(defaultOptions.FORBID_ATTR || []), ...(options.FORBID_ATTR || [])],
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: config.ALLOWED_TAGS,
    ALLOWED_ATTR: config.ALLOWED_ATTR,
    ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR,
    FORBID_TAGS: config.FORBID_TAGS,
    FORBID_ATTR: config.FORBID_ATTR,
    KEEP_CONTENT: false,
  })
}

/**
 * Sanitize text content (remove all HTML)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Validate URL safety
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(
      url,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    )

    // Only allow http, https, and relative protocols
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return '#'
    }

    // Prevent javascript: and data: URLs
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return '#'
    }

    return parsed.toString()
  } catch {
    return '#'
  }
}

/**
 * Create safe HTML attributes
 */
export function createSafeAttributes(attributes: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {}

  for (const [key, value] of Object.entries(attributes)) {
    // Remove event handlers and dangerous attributes
    if (!key.startsWith('on') && !key.includes('script')) {
      safe[key] = sanitizeText(value)
    }
  }

  return safe
}

/**
 * React Hook for XSS protection
 */
export function useXSSProtection() {
  return {
    sanitizeHtml,
    sanitizeText,
    sanitizeUrl,
    createSafeAttributes,
  }
}
