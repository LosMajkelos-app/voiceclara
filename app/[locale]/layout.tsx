import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      default: locale === 'pl'
        ? "VoiceClara - Platforma Anonimowych Opinii z Analizą AI"
        : "VoiceClara - Anonymous Feedback Platform with AI Insights",
      template: "%s | VoiceClara"
    },
    description: locale === 'pl'
      ? "Otrzymuj szczere, anonimowe opinie od swojego zespołu dzięki analizie AI. VoiceClara pomaga identyfikować ślepe punkty, analizować sentyment i rozwijać się zawodowo."
      : "Get honest, anonymous feedback from your team with AI-powered insights. VoiceClara helps you identify blind spots, analyze sentiment, and grow professionally.",
    keywords: ["feedback", "anonymous feedback", "360 review", "AI analysis", "sentiment analysis", "professional growth", "team feedback"],
    authors: [{ name: "VoiceClara" }],
    creator: "VoiceClara",
    metadataBase: new URL('https://voiceclara.com'),
    openGraph: {
      type: "website",
      locale: locale === 'pl' ? "pl_PL" : "en_US",
      url: "https://voiceclara.com",
      title: locale === 'pl'
        ? "VoiceClara - Platforma Anonimowych Opinii z Analizą AI"
        : "VoiceClara - Anonymous Feedback Platform with AI Insights",
      description: locale === 'pl'
        ? "Otrzymuj szczere, anonimowe opinie dzięki analizie AI"
        : "Get honest, anonymous feedback with AI-powered insights",
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
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
