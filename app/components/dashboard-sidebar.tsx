"use client"

import { Home, Plus, Users, Zap, FileText, BarChart3, User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import LanguageSwitcher from "./language-switcher"
import { useTranslations } from "next-intl"
import { Link, useRouter, usePathname } from "next/link"

interface DashboardSidebarProps {
  user: any
  onAccountSettingsClick?: () => void
}

export default function DashboardSidebar({ user, onAccountSettingsClick }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('sidebar')

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
    <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-full pt-4 pb-20">
        {/* Logo - Clickable */}
        <Link href="/dashboard" className="px-3 mb-4 flex-shrink-0">
          <div className="h-10 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            <span className="text-white font-bold text-lg">VoiceClara</span>
          </div>
        </Link>

        {/* Package Level */}
        <div className="px-3 mb-4 flex-shrink-0">
          <div className="px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-900">{t('freePlan')}</p>
            <p className="text-xs text-indigo-600">{t('unlimitedFeedback')}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="px-3 mb-4 flex-shrink-0">
          <LanguageSwitcher />
        </div>

        {/* Main Navigation - Scrollable */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/dashboard') && !pathname?.includes('/results') && !pathname?.includes('/create')
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="h-4 w-4" />
            {t('dashboard')}
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
            {t('createRequest')}
          </Link>

          {/* Coming Soon Features */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('comingSoon')}</p>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title={t('comingSoon')}>
              <Users className="h-4 w-4" />
              {t('teams')}
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title={t('comingSoon')}>
              <Zap className="h-4 w-4" />
              {t('integrations')}
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title={t('comingSoon')}>
              <BarChart3 className="h-4 w-4" />
              {t('advancedAnalytics')}
            </button>
            <button disabled className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60" title={t('comingSoon')}>
              <FileText className="h-4 w-4" />
              {t('customReports')}
            </button>
          </div>
        </nav>

        {/* Bottom Section - Profile and Sign Out */}
        <div className="px-3 pt-4 mt-4 border-t border-gray-200 space-y-1 flex-shrink-0">
          <button
            onClick={onAccountSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <User className="h-4 w-4" />
            {t('profile')}
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            {t('signOut')}
          </button>
        </div>
      </div>
    </aside>
  )
}
