"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import LanguageSwitcher from "@/app/components/language-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export default function Navbar({ showLanguageSwitcher = false }: { showLanguageSwitcher?: boolean }) {
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors">
          VoiceClara
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-3">
          {showLanguageSwitcher && <LanguageSwitcher />}
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="ghost" size="sm">Pricing</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="ghost" size="sm">Contact</Button>
                  </Link>
                  <Link href="/create">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Create Request
                    </Button>
                  </Link>

                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5 text-sm">
                        <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">My Requests</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-red-600">
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button variant="ghost" size="sm">Pricing</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="ghost" size="sm">Contact</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/create-auth">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

      </div>
    </nav>
  )
}