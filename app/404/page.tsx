import { Button } from '@/components/ui/button'
import { ArrowLeft, Crown, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Search className="w-12 h-12 text-slate-600" />
        </div>
        <div className="text-8xl font-black text-slate-800 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Check the URL or try one of
          the links below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            <Link href="/browse">
              <Crown className="w-4 h-4 mr-2" />
              Browse Profiles
            </Link>
          </Button>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-4">Need help finding something?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-amber-500 hover:text-amber-400">
              About Us
            </Link>
            <Link href="/contact" className="text-amber-500 hover:text-amber-400">
              Contact Support
            </Link>
            <Link href="/help" className="text-amber-500 hover:text-amber-400">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
