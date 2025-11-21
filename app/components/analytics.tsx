"use client"

import Script from "next/script"

/**
 * Analytics Component
 *
 * GTM and GA4 are loaded in layout.tsx via environment variables:
 * - NEXT_PUBLIC_GTM_ID: Google Tag Manager (includes Cookiebot via CMP tag)
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID: Google Analytics 4
 *
 * This component handles additional analytics like Meta Pixel
 *
 * NOTE: Consent Mode temporarily disabled for Google verification
 */

export function Analytics() {
  // Get analytics IDs from environment variables
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

  return (
    <>
      {/* Meta Pixel (Facebook) */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
