"use client"

import { Analytics } from "./analytics"

/**
 * Client wrapper for Analytics component
 * Use this in Server Components that need analytics tracking
 */
export function AnalyticsWrapper() {
  return <Analytics />
}
