"use client"

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Users, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

interface WelcomeModalProps {
  userName?: string
}

export default function WelcomeModal({ userName }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')

    if (!hasSeenWelcome) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose()
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <DialogTitle className="text-2xl">
              Welcome to VoiceClara{userName ? `, ${userName}` : ''}!
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600">
            Get honest, anonymous feedback from your team with AI-powered insights
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Anonymous Feedback Requests</h4>
                <p className="text-sm text-gray-600">
                  Send feedback forms to colleagues, team members, or clients without revealing who said what
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AI-Powered Analysis</h4>
                <p className="text-sm text-gray-600">
                  Get sentiment analysis, identify patterns, and receive actionable suggestions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Your Organization</h4>
                <p className="text-sm text-gray-600">
                  Build team hierarchies, assign managers, and organize departments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">100% Anonymous & Secure</h4>
                <p className="text-sm text-gray-600">
                  No tracking, no IP logging - your respondents' identities are protected
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">🚀 Quick Start</h3>
            <ol className="text-sm text-indigo-800 space-y-1.5">
              <li>1. Click <strong>"New Request"</strong> to create your first feedback request</li>
              <li>2. Choose your questions or let AI generate them</li>
              <li>3. Send the link to people you want feedback from</li>
              <li>4. View AI-powered insights when responses come in</li>
            </ol>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link href="/create" className="flex-1">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleClose}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your First Request
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Explore Dashboard
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-gray-500">
            💡 Tip: You can view a demo organization with sample team data by checking the dashboard
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
