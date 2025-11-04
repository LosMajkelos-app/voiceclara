import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";  // ← ADD

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceClara - The Beautiful Way to Get Honest Feedback",
  description: "Anonymous feedback collection with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className}
        suppressHydrationWarning
      >
        <AuthProvider>  {/* ← WRAP */}
          <Navbar />
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>  {/* ← WRAP */}
      </body>
    </html>
  );
}