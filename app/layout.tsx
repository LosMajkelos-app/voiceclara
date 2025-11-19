import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { OrganizationProvider } from "@/lib/organization-context";
import { Analytics } from "@/app/components/analytics";
import { CookieConsent } from "@/app/components/cookie-consent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VoiceClara - Anonymous Feedback Platform with AI Insights",
    template: "%s | VoiceClara"
  },
  description: "Get honest, anonymous feedback from your team with AI-powered insights. VoiceClara helps you identify blind spots, analyze sentiment, and grow professionally.",
  keywords: ["feedback", "anonymous feedback", "360 review", "AI analysis", "sentiment analysis", "professional growth", "team feedback"],
  authors: [{ name: "VoiceClara" }],
  creator: "VoiceClara",
  metadataBase: new URL('https://voiceclara.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voiceclara.com",
    title: "VoiceClara - Anonymous Feedback Platform with AI Insights",
    description: "Get honest, anonymous feedback with AI-powered insights",
    siteName: "VoiceClara",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceClara - Anonymous Feedback Platform",
    description: "Get honest, anonymous feedback with AI-powered insights",
    creator: "@voiceclara",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P7HS683L';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Consent Mode - must load BEFORE GTM */}
        <Script id="gtm-consent-default" strategy="beforeInteractive">
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

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <AuthProvider>
          <OrganizationProvider>
            {children}
            <Toaster position="top-center" />
            <Analytics />
            <CookieConsent />
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
