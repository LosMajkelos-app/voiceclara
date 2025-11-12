"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, Zap, FileText, BarChart3, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardSidebarProps {
  user: any
  onAccountSettingsClick?: () => void
}

export default function DashboardSidebar({ user, onAccountSettingsClick }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-56 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
        {/* Logo Placeholder */}
        <div className="px-3 mb-4">
          <div className="h-10 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
            <span className="text-white font-bold text-lg">VoiceClara</span>
          </div>
        </div>

        {/* Package Level */}
        <div className="px-3 mb-4">
          <div className="px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-900">Free Plan</p>
            <p className="text-xs text-indigo-600">Unlimited feedback</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/dashboard') && !pathname?.includes('/results') && !pathname?.includes('/create')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/create"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/create')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            Create Request
          </Link>

          {/* Account Settings */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <User className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'}
                  </p>
                </div>
              </button>

              {showAccountMenu && (
                <div className="absolute left-0 right-0 mt-1 mx-3 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      setShowAccountMenu(false)
                      onAccountSettingsClick?.()
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Account Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Coming Soon</p>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title="Coming soon">
              <Users className="h-4 w-4" />
              Teams
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title="Coming soon">
              <Zap className="h-4 w-4" />
              Integrations
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title="Coming soon">
              <BarChart3 className="h-4 w-4" />
              Advanced Analytics
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title="Coming soon">
              <FileText className="h-4 w-4" />
              Custom Reports
            </button>
          </div>
        </nav>
      </div>
    </aside>
  )
}
