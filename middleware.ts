import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix in URLs (e.g., /en, /pl)
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/*)
  // - _next (Next.js internals)
  // - Static files (with file extensions)
  // - Supabase auth callback
  matcher: [
    '/',
    '/(en|pl)/:path*',
    '/((?!api|_next|_static|.*\\..*).*)'
  ]
};
