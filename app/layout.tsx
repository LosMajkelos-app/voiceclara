import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
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
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
