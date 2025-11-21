import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - VoiceClara | Anonymous Feedback Tips & Insights',
  description: 'Learn about anonymous feedback, professional growth, and AI-powered insights. Discover best practices for collecting honest team feedback.',
  openGraph: {
    title: 'VoiceClara Blog - Feedback & Growth Insights',
    description: 'Learn about anonymous feedback, professional growth, and AI-powered insights',
    type: 'website',
    url: 'https://voiceclara.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceClara Blog - Feedback & Growth Insights',
    description: 'Learn about anonymous feedback, professional growth, and AI-powered insights',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
              📝 VoiceClara Insights
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & Resources
            </h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              Learn about anonymous feedback, professional growth, and AI-powered insights.
              Discover best practices for building psychologically safe workplaces.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">

        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No posts yet</h2>
            <p className="text-lg text-gray-600 mb-6">We're working on bringing you valuable content about feedback and workplace culture.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
              Explore VoiceClara
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Post (if available) */}
            {posts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
                >
                  {/* Image/Header */}
                  <div className="relative h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    <span className="relative text-white text-7xl group-hover:scale-110 transition-transform duration-300">📝</span>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-indigo-500" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Read article</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
