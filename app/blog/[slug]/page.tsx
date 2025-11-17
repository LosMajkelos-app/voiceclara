import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/blog'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} - VoiceClara Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {post.image && (
            <div className="h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-8">
              <span className="text-white text-8xl">📝</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="prose prose-lg prose-indigo max-w-none">
            <Markdown
              options={{
                overrides: {
                  a: {
                    props: {
                      className: 'text-indigo-600 hover:text-indigo-700 underline',
                    },
                  },
                  h1: {
                    props: {
                      className: 'text-4xl font-bold text-gray-900 mt-8 mb-4',
                    },
                  },
                  h2: {
                    props: {
                      className: 'text-3xl font-bold text-gray-900 mt-8 mb-4',
                    },
                  },
                  h3: {
                    props: {
                      className: 'text-2xl font-bold text-gray-900 mt-6 mb-3',
                    },
                  },
                  p: {
                    props: {
                      className: 'text-gray-700 mb-4 leading-relaxed',
                    },
                  },
                  ul: {
                    props: {
                      className: 'list-disc pl-6 text-gray-700 mb-4 space-y-2',
                    },
                  },
                  ol: {
                    props: {
                      className: 'list-decimal pl-6 text-gray-700 mb-4 space-y-2',
                    },
                  },
                  li: {
                    props: {
                      className: 'text-gray-700',
                    },
                  },
                  blockquote: {
                    props: {
                      className: 'border-l-4 border-indigo-500 pl-4 italic text-gray-600 my-4',
                    },
                  },
                  code: {
                    props: {
                      className: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono text-indigo-600',
                    },
                  },
                  pre: {
                    props: {
                      className: 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4',
                    },
                  },
                },
              }}
            >
              {post.content}
            </Markdown>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
