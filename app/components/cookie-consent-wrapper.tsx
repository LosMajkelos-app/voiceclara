"use client"

import { CookieConsent } from "./cookie-consent"

/**
 * Client wrapper for CookieConsent component
 * Use this in Server Components that need cookie consent banner
 */
export function CookieConsentWrapper() {
  return <CookieConsent />
}
