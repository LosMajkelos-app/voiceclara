"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

/**
 * Analytics Component
 *
 * GTM loads immediately with default consent denied
 * Other analytics load after user accepts cookies
 */

export function Analytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem("cookie-consent")
    const consentAccepted = consent === "accepted"
    setHasConsent(consentAccepted)

    // Update Google Consent Mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': consentAccepted ? 'granted' : 'denied',
        'ad_storage': consentAccepted ? 'granted' : 'denied',
      })
    }
  }, [])

  // Get analytics IDs from environment variables
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <>
      {/* Google Tag Manager - loads immediately with consent mode */}
      {GTM_ID && (
        <>
          <Script id="gtm-consent-default" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'wait_for_update': 500
              });
            `}
          </Script>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics (GA4) - only loads after consent */}
      {GA_MEASUREMENT_ID && hasConsent && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel (Facebook) - only loads after consent */}
      {META_PIXEL_ID && hasConsent && (
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
