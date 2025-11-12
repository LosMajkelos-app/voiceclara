"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'
import { locales } from '@/i18n'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')

    // Navigate to the same page with new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => switchLocale(locale === 'en' ? 'pl' : 'en')}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        title={locale === 'en' ? 'Switch to Polish' : 'Przełącz na angielski'}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase font-semibold">{locale}</span>
      </button>
    </div>
  )
}
