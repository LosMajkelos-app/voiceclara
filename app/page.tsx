"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Shield, TrendingUp, MessageSquare, ArrowRight, Check, Heart, Users, Zap, BarChart3 } from "lucide-react"
import Navbar from "@/app/components/navbar"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg animate-pulse">
              <Check className="h-4 w-4" />
              Free. Always. No Credit Card.
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hear Your Team.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                For Real.
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              VoiceClara helps you collect honest, anonymous feedback—without stress, without filters.
              Get AI-powered insights that show what truly matters to your people.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={user ? "/create" : "/create-auth"}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                  💬 Try VoiceClara for Free
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="bg-white border-2 border-gray-300 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 font-semibold px-6 py-3 rounded-xl transition-all">
                  See How It Works
                </button>
              </Link>
            </div>

            <p className="text-sm text-gray-600 mt-3 font-medium">
              No credit card • Setup in 5 minutes
            </p>
          </div>

          {/* Hero Image / Demo */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-base font-semibold text-gray-700">
                    Product Demo Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Don't People Say What They Really Feel?
            </h2>
            <p className="text-base text-gray-600 mb-8">
              Sometimes they're afraid of consequences. Sometimes they just don't trust surveys.
              <br />
              With VoiceClara, you can finally hear their real voice—safely, anonymously, and effortlessly.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 border-2 border-indigo-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Full Anonymity</h3>
                <p className="text-sm text-gray-600">No logins, no tracking. Your team speaks freely without fear.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-sm text-gray-600">Summarize moods, uncover recurring themes, spot blind spots.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Quick Setup</h3>
                <p className="text-sm text-gray-600">Create a survey in minutes, no training needed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Simple Process. Real Insights.
            </h2>
            <p className="text-base text-gray-600">
              From question to actionable insight in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Ask a Question</h3>
              <p className="text-sm text-gray-600">
                "What could help us work better together?" Create custom questions or use our templates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Gather Anonymous Answers</h3>
              <p className="text-sm text-gray-600">
                People speak freely because no one knows who said what. Get honest, unfiltered feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-3">AI Analyzes Everything</h3>
              <p className="text-sm text-gray-600">
                Get clear summaries, emotions, and key themes to act on. No manual analysis needed.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-2">
              🔍 See a sample report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Why VoiceClara?
            </h2>
            <p className="text-base text-gray-600">
              The only feedback tool that combines beauty, AI, and psychology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Get sentiment analysis, theme detection, and blind spot identification 
                automatically with 3+ responses.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Real-time quality scoring
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Automatic theme clustering
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Blind spot detection
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Psychological Safety
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                100% anonymous feedback with real-time trust indicators.
                People feel safe to be honest.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Anonymous by default
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  No tracking or analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Anonymity score widget
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Beautiful Design
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Typeform-level UX that people actually want to use.
                Beautiful tools get used, ugly tools get ignored.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  One question at a time
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Smooth animations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Mobile-first design
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">74%</div>
              <p className="text-sm text-gray-600">More honest feedback vs traditional surveys</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">3x</div>
              <p className="text-sm text-gray-600">Higher response rates</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
              <p className="text-sm text-gray-600">HR teams using VoiceClara</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">98%</div>
              <p className="text-sm text-gray-600">Would recommend to peers</p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Built for HR Professionals
            </h2>
            <p className="text-base text-gray-600">
              Perfect for any feedback scenario in your organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 transition-all">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-gray-900 mb-1">360° Reviews</h3>
              <p className="text-xs text-gray-600">Comprehensive peer and manager feedback with guaranteed anonymity</p>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 transition-all">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-bold text-gray-900 mb-1">Pulse Surveys</h3>
              <p className="text-xs text-gray-600">Quick team health checks with AI-powered sentiment analysis</p>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 transition-all">
              <div className="text-2xl mb-2">👋</div>
              <h3 className="font-bold text-gray-900 mb-1">Exit Interviews</h3>
              <p className="text-xs text-gray-600">Get brutally honest feedback from departing employees</p>
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-300 transition-all">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-gray-900 mb-1">Team Feedback</h3>
              <p className="text-xs text-gray-600">Foster psychological safety in team retrospectives</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by HR Leaders
            </h2>
            <p className="text-base text-gray-600">
              See what HR professionals are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-sm">Sarah Mitchell</div>
                  <div className="text-xs text-gray-600">VP of People, TechCorp</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">
                "For the first time, people actually enjoy giving feedback. The answers are honest and help me have better conversations with managers."
              </p>
              <div className="mt-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  JC
                </div>
                <div>
                  <div className="font-semibold text-sm">James Chen</div>
                  <div className="text-xs text-gray-600">CHRO, GlobalRetail</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">
                "VoiceClara helped me see that the team wasn't unmotivated—they were just tired of unclear communication. Now I can address the real issues."
              </p>
              <div className="mt-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                  EP
                </div>
                <div>
                  <div className="font-semibold text-sm">Emily Parker</div>
                  <div className="text-xs text-gray-600">Director of HR, HealthPlus</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">
                "I finally understand what my team actually needs. VoiceClara shows me the patterns I was missing in one-on-ones."
              </p>
              <div className="mt-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who Is It For Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Who Is VoiceClara For?
            </h2>
            <p className="text-base text-gray-600 mb-8">
              Built for people who care about creating psychologically safe workplaces
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">HR Managers</h3>
              <p className="text-sm text-gray-600">Who want to hear the truth and build trust within their teams.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Founders & Leaders</h3>
              <p className="text-sm text-gray-600">Who care about company culture and want real feedback, not filtered opinions.</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Teams</h3>
              <p className="text-sm text-gray-600">That value honest, pressure-free conversations and psychological safety.</p>
            </div>
          </div>
        </section>

        {/* Result Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Understand. Act. Build a Culture of Trust.
            </h2>
            <p className="text-base text-gray-600 mb-8">
              VoiceClara doesn't stop at collecting answers—it helps you act on them.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-900 mb-2">Team Sentiment Trends</h3>
                <p className="text-sm text-gray-600">See how emotions shift over time and identify patterns.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-bold text-gray-900 mb-2">What People Appreciate</h3>
                <p className="text-sm text-gray-600">Discover what's working well and double down on it.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white">
                <div className="text-3xl mb-3">⚠️</div>
                <h3 className="font-bold text-gray-900 mb-2">Engagement Drop Signals</h3>
                <p className="text-sm text-gray-600">Catch issues early before they become bigger problems.</p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-2">
                📈 View a sample VoiceClara report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">
              Take the First Step Toward a More Honest Workplace Culture
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Your team has a voice. Are you ready to truly hear it?
            </p>
            <Link href={user ? "/create" : "/create-auth"}>
              <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                ✨ Try VoiceClara for Free
              </button>
            </Link>
            <p className="text-sm mt-4 opacity-90">
              Your data is safe. And so is your team's voice.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Powered by AI
                </span>
                <span>•</span>
                <span>🔒 100% Anonymous</span>
              </div>
              <div>
                © 2025 <span className="font-semibold text-indigo-600">VoiceClara</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}