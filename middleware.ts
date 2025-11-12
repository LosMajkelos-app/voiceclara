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
  // - Auth routes (/auth/*)
  // - Feedback share links (/feedback/*)
  // - _next (Next.js internals)
  // - Static files (with file extensions)
  matcher: [
    '/',
    '/(en|pl)/:path*',
    '/((?!api|auth|feedback|_next|_static|.*\\..*).*)'
  ]
};
