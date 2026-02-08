import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Internal Server Error',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ServerErrorPage() {
  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Something went wrong</h2>

      <p className="text-slate-400 max-w-md mb-6">
        We apologize for the inconvenience. Our team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </a>

        <a
          href="/"
          className="px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go Home
        </a>
      </div>
    </div>
  )
}
