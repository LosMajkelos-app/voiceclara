"use client"

import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'
import { useRouter, usePathname } from '@/lib/i18n-navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Use i18n-aware router to switch locale
    // The router automatically handles locale prefixing
    router.replace(pathname, { locale: newLocale })
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
