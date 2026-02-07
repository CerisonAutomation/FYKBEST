/**
 * Global Loading UI
 *
 * This component is automatically shown when navigating between pages
 * while the new page's data is being fetched.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/loading-ui
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 animate-pulse" />
          <div className="absolute inset-1 rounded-lg bg-black flex items-center justify-center">
            <span className="text-2xl font-black text-amber-500">K</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
              style={{
                animation: 'slide 1s ease-in-out infinite',
              }}
            />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
