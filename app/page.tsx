export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        
        {/* Logo/Name */}
        <h1 className="text-6xl font-bold text-indigo-900 mb-4">
          VoiceClara
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl text-indigo-700 mb-8">
          The beautiful way to get honest feedback
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto">
          We help teams speak truth without fear. 
          Beautiful surveys, AI-powered insights, and real psychological safety.
        </p>
        
        {/* CTA Button */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
          Create Free Feedback Request →
        </button>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-12">
          <span className="px-4 py-2 bg-white rounded-full text-sm text-indigo-600 shadow-sm">
            ✨ Typeform-beautiful UX
          </span>
          <span className="px-4 py-2 bg-white rounded-full text-sm text-indigo-600 shadow-sm">
            🤖 AI-powered insights
          </span>
          <span className="px-4 py-2 bg-white rounded-full text-sm text-indigo-600 shadow-sm">
            🛡️ True anonymity
          </span>
        </div>
        
        {/* Footer */}
        <p className="text-sm text-gray-500 mt-16">
  Coming soon • Built with 💪 on macOS
</p>
        
      </div>
    </div>
  );
}