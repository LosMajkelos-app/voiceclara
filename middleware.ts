import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Only match public pages: home, contact, pricing
  // Exclude: dashboard, create, results, auth, api, feedback, static files
  matcher: [
    '/',
    '/(en|pl)/:path(contact|pricing)?'
  ]
};
