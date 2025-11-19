import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl animate-bounce">
            🤔
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group">
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <Link href="/create">
            <Button variant="outline" className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group">
              <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Create Feedback
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <p className="mt-8 text-xs text-gray-400">
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  )
}
