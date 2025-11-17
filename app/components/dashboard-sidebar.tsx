"use client"

import { useState } from "react"
import { Home, Plus, Users, Building2, User, LogOut, Menu, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  user: any
  onAccountSettingsClick?: () => void
}

export default function DashboardSidebar({ user, onAccountSettingsClick }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        href="/dashboard"
        onClick={() => mobile && setMobileMenuOpen(false)}
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
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
          isActive('/create')
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Plus className="h-4 w-4" />
        Create Request
      </Link>

      <Link
        href="/dashboard/organization"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
          isActive('/dashboard/organization')
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Building2 className="h-4 w-4" />
        Organization
      </Link>

      <Link
        href="/dashboard/team"
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
          isActive('/dashboard/team')
            ? 'text-indigo-600 bg-indigo-50'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Users className="h-4 w-4" />
        Team Management
      </Link>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-4 pb-6">
          {/* Logo */}
          <Link href="/dashboard" className="px-3 mb-4" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-10 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <span className="text-white font-bold text-lg">VoiceClara</span>
            </div>
          </Link>

          {/* Plan Badge */}
          <div className="px-3 mb-4">
            <div className="px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-900">Free Plan</p>
              <p className="text-xs text-indigo-600">Unlimited Feedback</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            <NavLinks mobile={true} />
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 pt-4 mt-4 border-t border-gray-200 space-y-1">
            <button
              onClick={() => {
                onAccountSettingsClick?.()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:h-screen bg-white border-r border-gray-200">
        <div className="flex flex-col h-full pt-4 pb-20">
          {/* Logo */}
          <Link href="/dashboard" className="px-3 mb-4 flex-shrink-0">
            <div className="h-10 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              <span className="text-white font-bold text-lg">VoiceClara</span>
            </div>
          </Link>

          {/* Plan Badge */}
          <div className="px-3 mb-4 flex-shrink-0">
            <div className="px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-900">Free Plan</p>
              <p className="text-xs text-indigo-600">Unlimited Feedback</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 pt-4 mt-4 border-t border-gray-200 space-y-1 flex-shrink-0">
            <button
              onClick={onAccountSettingsClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
