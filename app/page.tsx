"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Shield, TrendingUp, MessageSquare, ArrowRight, Check, CheckCircle, Star, Brain, Lock, FileText, ArrowUpRight, Quote, Heart, Users, Zap, BarChart3 } from "lucide-react"
import Navbar from "@/app/components/navbar"
import { Analytics } from "@/app/components/analytics"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <>
      <Analytics />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="text-center mb-10">
            {/* Beta Testing Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-3 shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="h-4 w-4 animate-pulse" />
              BETA - Join Our Testing Community
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
              <Check className="h-4 w-4" />
              Free. Always. No Credit Card.
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Hear Your Team.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                For Real.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              VoiceClara helps you collect honest, anonymous feedback—without stress, without filters.
              Get AI-powered insights that show what truly matters to your people.
            </p>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 max-w-2xl mx-auto mb-6">
              <p className="text-sm text-indigo-900 font-medium">
                🚀 We're actively testing and improving VoiceClara. Your feedback shapes the future of anonymous workplace communication.
                <span className="font-bold"> Join us in building something special!</span>
              </p>
            </div>

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
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 overflow-hidden">
              <div className="aspect-video relative rounded-xl overflow-hidden">
                <Image
                  src="/images/hero-bg.png"
                  alt="VoiceClara - Anonymous Feedback Platform"
                  fill
                  className="object-cover"
                  priority
                />
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
                <p className="text-sm text-gray-600">Summarize moods, uncover themes, spot blind spots. Works in 14+ languages.</p>
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

       {/* Simple Process Section with Infographic */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700">
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Question to Insight in 3 Steps
            </h2>
            <p className="text-xl text-gray-600">
              No complex setup. No training needed. Just beautiful feedback.
            </p>
          </div>
          
          {/* Visual Process Flow */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300"></div>
            
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Badge className="bg-indigo-600 text-white">Step 1</Badge>
                    <span className="text-sm text-gray-500">30 seconds</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Survey</h3>
                  <p className="text-gray-600">
                    Use AI to generate questions or choose from templates. Add your personal touch.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-600 text-white">Step 2</Badge>
                    <span className="text-sm text-gray-500">2 minutes</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Share & Collect</h3>
                  <p className="text-gray-600">
                    Send one link. Team members give honest feedback with guaranteed anonymity.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Badge className="bg-green-600 text-white">Step 3</Badge>
                    <span className="text-sm text-gray-500">Instant</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Get AI Insights</h3>
                  <p className="text-gray-600">
                    AI analyzes patterns, themes, and blind spots. Get actionable insights instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/create">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Try It Now - Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why VoiceClara Section - Enhanced */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">
              Why Choose VoiceClara?
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Not Just Another Feedback Tool
            </h2>
            <p className="text-xl text-gray-600">
              We combine what others can't: Beautiful design, AI intelligence, and real trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Typeform-Beautiful UX
              </h3>
              <p className="text-gray-600 mb-3">
                People complete beautiful surveys. Our response rates are 3x higher than traditional tools.
              </p>
              <Link href="/create">
              <div className="text-sm text-indigo-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
            
            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI That Actually Helps
              </h3>
              <p className="text-gray-600 mb-3">
                Not just analysis after. AI coaches during writing, detects patterns, and finds blind spots.
              </p>
              <Link href="/create">
              <div className="text-sm text-purple-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
            
            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Visible Trust Building
              </h3>
              <p className="text-gray-600 mb-3">
                Real-time anonymity score shows safety level. People see "15 responded, you're safe."
              </p>
              <Link href="/create">
              <div className="text-sm text-green-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
            
            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3-Minute Setup
              </h3>
              <p className="text-gray-600 mb-3">
                No training. No onboarding. Share a link and start collecting feedback immediately.
              </p>
              <Link href="/create">
              <div className="text-sm text-orange-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
            
            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-pink-200">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600 mb-3">
                See how feedback evolves over time. Measure psychological safety improvements.
              </p>
              <Link href="/create">
              <div className="text-sm text-pink-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
            
            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-gray-600 mb-3">
                GDPR compliant, encrypted data, no tracking. Your feedback stays yours.
              </p>
              <Link href="/create">
              <div className="text-sm text-blue-600 font-medium flex items-center">
                Try for free
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Built for HR Professionals - Updated */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Built for HR Teams
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Designed for People Operations
            </h2>
            <p className="text-xl text-white/90">
              Everything HR professionals need to build a feedback culture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all">
              <BarChart3 className="h-10 w-10 mb-3 text-white/80" />
              <h3 className="font-bold mb-2">Team Analytics</h3>
              <p className="text-sm text-white/80">
                Track engagement, response rates, and sentiment trends across teams
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all">
              <Sparkles className="h-10 w-10 mb-3 text-white/80" />
              <h3 className="font-bold mb-2">AI Form Builder</h3>
              <p className="text-sm text-white/80">
                Generate entire feedback forms with AI. Just describe what you need.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all">
              <Users className="h-10 w-10 mb-3 text-white/80" />
              <h3 className="font-bold mb-2">360° Reviews</h3>
              <p className="text-sm text-white/80">
                Peer, manager, and self assessments in one beautiful flow
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all">
              <Shield className="h-10 w-10 mb-3 text-white/80" />
              <h3 className="font-bold mb-2">Compliance Ready</h3>
              <p className="text-sm text-white/80">
                GDPR compliant with audit logs and data retention controls
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Book a Demo for HR Teams
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Real Beta Testers */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700">
              Beta Feedback
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Early Adopters Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from our beta testing program
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-indigo-200 mb-3" />
              <p className="text-gray-700 mb-4">
                "Finally, a feedback tool that people actually want to use. The UI is gorgeous and the AI insights are surprisingly accurate. We replaced Culture Amp with this."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  KR
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Katarzyna R.</p>
                  <p className="text-sm text-gray-600">Head of People, Tech Startup (Warsaw)</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-indigo-200 mb-3" />
              <p className="text-gray-700 mb-4">
                "The anonymity score feature is genius. People finally trust giving real feedback. Response rate went from 30% to 85% in our team."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marcin P.</p>
                  <p className="text-sm text-gray-600">Engineering Manager, SaaS Company</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-indigo-200 mb-3" />
              <p className="text-gray-700 mb-4">
                "Setup took literally 3 minutes. The AI form builder created perfect questions for our use case. This is what feedback tools should have been all along."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Anna K.</p>
                  <p className="text-sm text-gray-600">HR Director, Remote-First Company</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Join 50+ teams already using VoiceClara in beta</p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">92%</div>
                <p className="text-sm text-gray-600">User Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3.2x</div>
                <p className="text-sm text-gray-600">Higher Response Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">5 min</div>
                <p className="text-sm text-gray-600">Average Setup Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-700">
              Comparison
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              VoiceClara vs. Others
            </h2>
            <p className="text-xl text-gray-600">
              See why teams switch to VoiceClara
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-indigo-600">VoiceClara</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Culture Amp</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Typeform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-gray-700">Beautiful UX</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">AI Insights</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700">Visible Anonymity Score</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">AI Form Builder</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                  <td className="px-6 py-4 text-center text-gray-400">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700">Setup Time</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">3 min</td>
                  <td className="px-6 py-4 text-center text-gray-600">2+ weeks</td>
                  <td className="px-6 py-4 text-center text-gray-600">10 min</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">Price (50 users)</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">$49/mo</td>
                  <td className="px-6 py-4 text-center text-gray-600">$500+/mo</td>
                  <td className="px-6 py-4 text-center text-gray-600">$83/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

        {/* CTA Section - Beta Testing Focus */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Sparkles className="h-4 w-4" />
                Beta Testers Wanted
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Help Us Build the Future of Workplace Feedback
              </h2>
              <p className="text-lg md:text-xl mb-3 opacity-95 max-w-2xl mx-auto">
                Your team has a voice. Are you ready to truly hear it?
              </p>
              <p className="text-base mb-6 opacity-90 max-w-2xl mx-auto">
                Join our testing community and get lifetime early adopter benefits.
                Shape how teams communicate honestly.
              </p>

              <Link href={user ? "/create" : "/create-auth"}>
                <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  Start Testing - It's Free
                </button>
              </Link>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm opacity-90">🔒 Your data is safe</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm opacity-90">💬 Direct feedback channel</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm opacity-90">🎁 Early adopter perks</div>
                </div>
              </div>
            </div>
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
              <div className="flex items-center gap-3">
                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
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
