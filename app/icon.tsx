/**
 * Dynamic App Icon
 *
 * Generates the app icon dynamically.
 * Supports multiple sizes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from 'next/og'

// Icon metadata
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

// Generate different sizes
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: '#f59e0b',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontWeight: 900,
        borderRadius: '8px',
      }}
    >
      K
    </div>,
    {
      ...size,
    }
  )
}
