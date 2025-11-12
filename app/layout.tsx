import "./globals.css"

// Root layout for Next.js with next-intl
// This is a pass-through layout that allows nested layouts
// in [locale] and other routes to define their own html/body structure
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
