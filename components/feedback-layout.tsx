"use client"

import { ReactNode } from "react"
import { Sparkles } from "lucide-react"

interface FeedbackLayoutProps {
  children: ReactNode
  rightPanel: ReactNode
  showFooter?: boolean
}

export function FeedbackLayout({ children, rightPanel, showFooter = true }: FeedbackLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      
      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Content (75%) */}
        <div className="w-full lg:w-3/4 flex items-center justify-center p-4 md:p-6 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>

        {/* RIGHT: Panel (25%) */}
        <div className="hidden lg:flex w-1/4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 flex-col justify-between text-white overflow-y-auto">
          {rightPanel}
        </div>

      </div>

      {/* FOOTER */}
      {showFooter && (
        <footer className="bg-white border-t border-gray-200 py-4 px-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Powered by AI
                </span>
                <span className="hidden sm:inline">•</span>
                <span>🔒 100% Anonymous</span>
              </div>
              <div>
                © 2025 <a href="/" className="text-indigo-600 hover:underline font-semibold">VoiceClara</a>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>
  )
}