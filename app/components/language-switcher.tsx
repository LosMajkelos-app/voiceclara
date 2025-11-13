"use client"

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`)
  }

  return (
    <button
      onClick={() => switchLocale(locale === 'en' ? 'pl' : 'en')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-semibold text-sm">{locale}</span>
    </button>
  )
}
