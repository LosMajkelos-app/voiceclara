import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service",
  description: "VoiceClara Terms of Service and Usage Agreement"
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

          {/* Beta Notice */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <span> </span> Beta Version Notice
            </h3>
            <p className="text-amber-900 text-sm">
              VoiceClara is currently in <strong>Beta</strong>. The service is provided "as is" and may contain bugs or limitations.
              We're actively improving the platform based on your feedback. By using VoiceClara during Beta, you acknowledge that some features may change or be discontinued.
            </p>
          </div>

          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using VoiceClara ("the Service"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                VoiceClara is an anonymous feedback platform that enables organizations and teams to collect honest,
                anonymous feedback from their members. The Service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Creation and management of feedback requests</li>
                <li>Anonymous feedback submission</li>
                <li>AI-powered analysis and insights (using OpenAI GPT models)</li>
                <li>Email invitations and notifications</li>
                <li>Data export and reporting features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To create feedback requests, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Anonymous Feedback</h3>
              <p className="text-gray-700 mb-4">
                Users can provide feedback anonymously without creating an account. Anonymous feedback cannot be traced back to the submitter.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-3">You agree NOT to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Harass, abuse, or harm others</li>
                <li>Submit false, misleading, or malicious content</li>
                <li>Attempt to identify anonymous feedback submitters</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Scrape, crawl, or reverse-engineer the Service</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service for spam or unsolicited communications</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Violate intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of all content you submit (feedback, questions, responses). By submitting content, you grant us a license to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Store, process, and display your content</li>
                <li>Analyze your content using AI (OpenAI)</li>
                <li>Generate insights and reports based on your content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Our Content</h3>
              <p className="text-gray-700 mb-4">
                VoiceClara and its original content, features, and functionality are owned by us and are protected by
                international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI Processing and Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                VoiceClara uses <strong>OpenAI's GPT models</strong> to analyze feedback and generate insights. By using the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>You consent to your feedback being processed by OpenAI</li>
                <li>You acknowledge that AI-generated insights may not be 100% accurate</li>
                <li>You understand that OpenAI's terms and privacy policy also apply</li>
                <li>You agree not to submit sensitive personal information in feedback</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Pricing and Payments</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Beta Pricing</h3>
              <p className="text-gray-700 mb-4">
                During the Beta period, VoiceClara is <strong>free to use</strong>. We reserve the right to introduce paid plans in the future.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Future Pricing</h3>
              <p className="text-gray-700 mb-4">
                If we introduce paid plans:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>We will provide at least 30 days notice before charging</li>
                <li>Early beta users may receive special pricing or lifetime benefits</li>
                <li>A free tier will remain available</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 font-semibold uppercase text-sm">
                  Important Legal Notice
                </p>
                <p className="text-gray-700 mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                  INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 mb-4">
                  We do not warrant that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>The Service will be uninterrupted, secure, or error-free</li>
                  <li>AI-generated insights will be accurate or complete</li>
                  <li>Defects will be corrected</li>
                  <li>The Service is free from viruses or harmful components</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY,
                  OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount you paid us in the 12 months prior to the event giving rise to the claim,
                  or $100 USD, whichever is greater.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless VoiceClara and its officers, directors, employees, and agents from any claims,
                liabilities, damages, losses, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content or feedback submissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of the Service is also governed by our{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline font-semibold">
                  Privacy Policy
                </Link>
                . Please review it to understand our data practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 By You</h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time by contacting us or deleting your account through the platform.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 By Us</h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your access to the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>If you violate these Terms</li>
                <li>If your account is inactive for an extended period</li>
                <li>For any other reason with or without notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.3 Effect of Termination</h3>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the Service will immediately cease. We may delete your data in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of material changes via:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Email to your registered address</li>
                <li>A notice on the platform</li>
                <li>Updating the "Last updated" date at the top of this page</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law and Disputes</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Poland, without regard to conflict of law principles.
              </p>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or your use of the Service shall be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Good faith negotiation first</li>
                <li>Mediation if negotiation fails</li>
                <li>Courts in Warsaw, Poland as a last resort</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Miscellaneous</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">15.1 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and VoiceClara.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">15.2 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">15.3 Waiver</h3>
              <p className="text-gray-700 mb-4">
                No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">15.4 Assignment</h3>
              <p className="text-gray-700 mb-4">
                You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@voiceclara.com" className="text-indigo-600 hover:text-indigo-700 underline">
                    legal@voiceclara.com
                  </a>
                </li>
                <li>
                  <strong>Support:</strong>{" "}
                  <a href="mailto:support@voiceclara.com" className="text-indigo-600 hover:text-indigo-700 underline">
                    support@voiceclara.com
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a href="https://voiceclara.com" className="text-indigo-600 hover:text-indigo-700 underline">
                    voiceclara.com
                  </a>
                </li>
              </ul>
            </section>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mt-8">
              <p className="text-indigo-900 text-sm">
                <strong>Thank you for using VoiceClara!</strong> We're committed to building a platform that helps teams communicate honestly and safely.
                Your feedback during this Beta period is invaluable in shaping the future of VoiceClara.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
