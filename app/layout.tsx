import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { OrganizationProvider } from "@/lib/organization-context";
import { Analytics } from "@/app/components/analytics";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P7HS683L');`}} />
        {/* End Google Tag Manager */}

        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5Q8TW8XNP6"></script>
        <script dangerouslySetInnerHTML={{__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-5Q8TW8XNP6');
        `}} />
        {/* End Google Analytics */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P7HS683L"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}

        <AuthProvider>
          <OrganizationProvider>
            {children}
            <Toaster position="top-center" />
            <Analytics />
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
