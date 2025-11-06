"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You! 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          Your feedback has been submitted successfully. Your honest input helps
          people grow and improve.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>

          <p className="text-sm text-gray-500">
            Want feedback too?{" "}
            <Link href="/create" className="text-indigo-600 hover:underline">
              Create your own request
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}