"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/app/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react"
import { toast } from "sonner"

function ContactForm() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject')

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: subjectParam || "general",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const subjects = [
    { value: "general", label: "General Inquiry" },
    { value: "business", label: "Business/Enterprise" },
    { value: "support", label: "Technical Support" },
    { value: "feedback", label: "Product Feedback" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "bug", label: "Report a Bug" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    setSubmitting(true)

    // TODO: In production, send to actual backend/email service
    // For now, just simulate success
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon. ✉️")
      setFormData({
        name: "",
        email: "",
        subject: "general",
        message: "",
      })
      setSubmitting(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">We'll respond within 24h</p>
                  </div>
                </div>
                <a
                  href="mailto:hello@voiceclara.com"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  hello@voiceclara.com
                </a>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Start a conversation →
                </button>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">Enterprise customers</p>
                  </div>
                </div>
                <p className="text-green-600 font-medium">+1 (555) 123-4567</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-sm text-gray-600">Visit us in person</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  123 Feedback Street<br />
                  San Francisco, CA 94102<br />
                  United States
                </p>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By submitting this form, you agree to our{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </Card>

          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Quick Answers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What's your response time?
                </h3>
                <p className="text-gray-600 text-sm">
                  We typically respond to all inquiries within 24 hours during business days.
                  Enterprise customers get priority support with 4-hour response time.
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you offer demos?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer personalized demos for teams and businesses.
                  Book a demo by selecting "Business/Enterprise" as your subject.
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Need technical support?
                </h3>
                <p className="text-gray-600 text-sm">
                  Check our{" "}
                  <Link href="/docs" className="text-indigo-600 hover:underline">
                    documentation
                  </Link>{" "}
                  first. For urgent issues, paid customers can use priority support.
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Looking to partner?
                </h3>
                <p className="text-gray-600 text-sm">
                  We're always interested in partnerships! Select "Partnership Opportunity"
                  and tell us about your proposal.
                </p>
              </Card>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>🤖 Powered by AI</span>
                <span className="hidden sm:inline">•</span>
                <span>🔒 100% Anonymous</span>
              </div>
              <div>
                © 2025 <a href="/" className="text-indigo-600 hover:underline font-semibold">VoiceClara</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <ContactForm />
      </Suspense>
    </>
  )
}
