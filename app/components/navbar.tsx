"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors">
            VoiceClara
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
            {!loading && (
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Create Request
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        My Requests
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Pricing
                      </Button>
                    </Link>
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/create-auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}