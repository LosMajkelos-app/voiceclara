import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy",
  description: "VoiceClara Privacy Policy and Data Protection Information"
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                VoiceClara ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our anonymous feedback platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-3">We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Email address and password (for account creation)</li>
                <li>Full name (optional)</li>
                <li>Business information (for Business accounts): company name, tax ID (NIP), address</li>
                <li>Feedback requests and responses</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>IP address and browser type</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your feedback requests and responses</li>
                <li>Send you technical notices and support messages</li>
                <li>Generate AI-powered insights and analysis</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Anonymity and Feedback</h2>
              <p className="text-gray-700 mb-4">
                <strong>Anonymous Feedback:</strong> When users provide feedback anonymously, we do not collect or store any personally identifiable information that would reveal their identity. Anonymous responses are completely dissociated from user accounts.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>AI Processing:</strong> Feedback text is processed by OpenAI's API for sentiment analysis and theme detection. This processing is done in accordance with OpenAI's data usage policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-3">We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., Supabase for database, OpenAI for AI analysis, Resend for emails)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure authentication and password hashing</li>
                <li>Row-level security policies in our database</li>
                <li>Regular security audits and updates</li>
                <li>Rate limiting to prevent abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights (GDPR)</h2>
              <p className="text-gray-700 mb-3">If you are in the European Economic Area, you have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@voiceclara.com" className="text-indigo-600 hover:text-indigo-700 underline">
                  privacy@voiceclara.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Anonymous feedback responses may be retained indefinitely for statistical and improvement purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@voiceclara.com" className="text-indigo-600 hover:text-indigo-700 underline">
                    privacy@voiceclara.com
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a href="https://voiceclara.com/contact" className="text-indigo-600 hover:text-indigo-700 underline">
                    voiceclara.com/contact
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
