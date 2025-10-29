import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors">
          VoiceClara
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/create">
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
              Create Request
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}