import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

/**
 * OptimizedImage Component
 *
 * Wrapper around Next.js Image with:
 * - Loading state with skeleton
 * - Error handling with fallback
 * - Blur placeholder support
 * - Automatic sizing
 */

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/images/placeholder.png',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate blur placeholder for external images
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    if (src.includes('images.unsplash.com')) {
      // Unsplash supports blur via query param
      return `${src}&w=10&q=10&blur=10`
    }
    return undefined
  }

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src

  return (
    <div
      className={cn('relative overflow-hidden', fill ? 'absolute inset-0' : '', containerClassName)}
    >
      {/* Loading skeleton */}
      {isLoading && <div className="absolute inset-0 bg-slate-800 animate-pulse rounded-lg" />}

      <Image
        src={imageSrc}
        alt={alt}
        {...(fill ? { fill: true } : { width: width!, height: height! })}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        {...(getBlurDataURL() ? { blurDataURL: getBlurDataURL()! } : {})}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}

/**
 * Avatar Component
 *
 * Optimized circular image for user avatars
 */
interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const dimension = sizeMap[size]

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold',
          className
        )}
        style={{ width: dimension, height: dimension }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className={cn('rounded-full object-cover', className)}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}
