import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      {/* Header with back button */}
      <div className="max-w-3xl mx-auto pt-8 pb-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            ← Back to home
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Create Feedback Request
            </h1>
            <p className="text-gray-600">
              Get honest feedback from your team in 3 simple steps
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {/* Step 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Your name (optional)
              </label>
              <Input 
                placeholder="e.g. John Doe" 
                className="max-w-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps people know who's asking for feedback
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Your email (optional)
              </label>
              <Input 
                type="email"
                placeholder="e.g. john@company.com" 
                className="max-w-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll send you a link to view responses
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. What feedback do you need?
              </label>
              <Input 
                placeholder="e.g. Feedback on my presentation skills" 
                className="max-w-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be the title of your feedback request
              </p>
            </div>

            {/* Questions preview */}
            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-3">
                Default questions (you can customize later):
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• What am I doing well?</li>
                <li>• What could I improve?</li>
                <li>• What's my biggest blind spot?</li>
                <li>• What should I start/stop/continue?</li>
                <li>• Any other thoughts?</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Button 
                size="lg" 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Generate Feedback Link →
              </Button>
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-900">
              🛡️ <strong>100% anonymous:</strong> Responses are fully anonymous. 
              We don't track IPs or any identifying information.
            </p>
          </div>

        </Card>
      </div>

    </div>
  );
}