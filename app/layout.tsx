import { Toaster } from "sonner"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}  {/* ← BEZ <Navbar /> tutaj! */}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}