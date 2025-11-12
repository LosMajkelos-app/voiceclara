import { Link } from "@/lib/i18n-navigation"
import type { Metadata } from "next"
import Navbar from "@/app/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Sparkles, Zap, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your feedback needs. Free forever plan available. Unlock AI-powered insights with Pro and Business plans starting at $29/month.",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      icon: Sparkles,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      features: [
        "Up to 10 feedback requests/month",
        "Unlimited responses per request",
        "AI-powered quality scoring",
        "Basic sentiment analysis",
        "Anonymous feedback collection",
        "Email notifications",
      ],
      cta: "Get Started Free",
      ctaLink: "/auth/signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professionals who want more",
      icon: Zap,
      iconColor: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
      features: [
        "Everything in Free",
        "Unlimited feedback requests",
        "Advanced AI analysis (themes, blind spots)",
        "Priority AI processing",
        "Custom branding",
        "Export to PDF/CSV",
        "Priority email support",
        "Team collaboration (up to 5 members)",
      ],
      cta: "Start Pro Trial",
      ctaLink: "/auth/signup?plan=pro",
      popular: true,
    },
    {
      name: "Business",
      price: "$99",
      period: "/month",
      description: "For teams and organizations",
      icon: Building2,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "SSO/SAML authentication",
        "Advanced analytics dashboard",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom AI training",
      ],
      cta: "Contact Sales",
      ctaLink: "/contact?subject=business",
      popular: false,
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you. Always honest feedback, always transparent pricing.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Check className="h-4 w-4" />
              No credit card required • Cancel anytime
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative p-6 ${
                  plan.popular
                    ? 'border-4 border-purple-500 shadow-2xl scale-105'
                    : 'border-2 border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg ${plan.bgColor} mb-3`}>
                  <plan.icon className={`h-7 w-7 ${plan.iconColor}`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>

                {/* CTA Button */}
                <Link href={plan.ctaLink}>
                  <Button
                    className={`w-full mb-4 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade, downgrade, or cancel your plan at any time.
                  Changes take effect immediately, and we'll prorate any charges.
                </p>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use industry-standard encryption and never share your data.
                  All feedback is anonymous by default, and we're SOC 2 compliant.
                </p>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you offer discounts for non-profits?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer 50% off Pro and Business plans for registered non-profits and educational institutions.
                  Contact us for details.
                </p>
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfers for Business plans.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h2 className="text-2xl font-bold mb-3">
                Still have questions?
              </h2>
              <p className="text-base mb-4 opacity-90">
                Our team is here to help you find the perfect plan
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                    Contact Sales
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </Card>
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
    </>
  )
}
