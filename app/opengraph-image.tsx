/**
 * Dynamic Open Graph Image
 *
 * Automatically generates OG images for the home page.
 * Uses ImageResponse from next/og.
 *
 * @see https://nextjs.org/docs/app/getting-started/metadata-and-og-images
 */

import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        border: '8px solid #f59e0b',
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#f59e0b',
          marginBottom: 20,
        }}
      >
        KING SOCIAL
      </div>
      <div
        style={{
          fontSize: 32,
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        Elite Social Network for Discerning Individuals
      </div>
    </div>,
    {
      ...size,
    }
  )
}
