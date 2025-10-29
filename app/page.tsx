import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      
      <Card className="max-w-2xl w-full p-12 bg-white/80 backdrop-blur-sm shadow-2xl">
        
        {/* Logo/Name */}
        <h1 className="text-6xl font-bold text-indigo-900 mb-4 text-center">
          VoiceClara
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl text-indigo-700 mb-6 text-center">
          The beautiful way to get honest feedback
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-700 mb-10 text-center max-w-xl mx-auto">
          We help teams speak truth without fear. 
          Beautiful surveys, AI-powered insights, and real psychological safety.
        </p>
        
        {/* CTA Button - SHADCN! */}
        <div className="flex justify-center mb-10">
          <Link href="/create">
  <Button 
    size="lg" 
    className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700"
  >
    Create Free Feedback Request →
  </Button>
</Link>
          

        </div>
        
        {/* Feature Badges - SHADCN! */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            ✨ Typeform-beautiful UX
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            🤖 AI-powered insights
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            🛡️ True anonymity
          </Badge>
        </div>
        
        {/* Stats Section - NEW! */}
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">3 min</div>
            <div className="text-sm text-gray-600 mt-1">Setup time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">100%</div>
            <div className="text-sm text-gray-600 mt-1">Anonymous</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">AI</div>
            <div className="text-sm text-gray-600 mt-1">Powered</div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-sm text-gray-500 mt-10 text-center">
          Coming soon • Built with 💪 on macOS
        </p>
        
      </Card>
      
    </div>
  );
}