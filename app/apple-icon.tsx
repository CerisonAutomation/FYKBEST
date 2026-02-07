/**
 * Apple Touch Icon
 *
 * Generates the Apple touch icon for iOS devices.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontWeight: 900,
        borderRadius: '40px',
      }}
    >
      K
    </div>,
    {
      ...size,
    }
  )
}
