"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie, X } from "lucide-react"
import Link from "next/link"

/**
 * Cookie Consent Banner
 *
 * GDPR/CCPA compliant cookie consent banner
 * Stores user preference in localStorage
 * Shows on first visit or if no preference is set
 */

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a small delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
    // Reload page to activate analytics
    window.location.reload()
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowBanner(false)
  }

  // Don't render on server or if banner shouldn't show
  if (!isClient || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-5xl mx-auto p-6 shadow-2xl border-2 border-gray-200 bg-white">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Cookie className="h-6 w-6 text-indigo-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🍪 We Value Your Privacy
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              By clicking "Accept", you consent to our use of cookies.{" "}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline font-medium">
                Learn more
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAccept}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                ✓ Accept All Cookies
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400"
              >
                Decline Non-Essential
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Essential cookies are always enabled to ensure the website functions properly.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </Card>
    </div>
  )
}

/**
 * Check if analytics cookies are accepted
 * Use this to conditionally load analytics scripts
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("cookie-consent") === "accepted"
}
