"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface FeedbackRequest {
  id: string
  title: string
  questions: string[]
  creator_name: string
}

export default function FeedbackFormPage() {
  const params = useParams()
  const router = useRouter()
  const shareToken = params.share_token as string

  const [request, setRequest] = useState<FeedbackRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequest() {
      console.log("🔍 Fetching with token:", shareToken)
      
      try {
        const { data, error } = await supabase
          .from("feedback_requests")
          .select("*")
          .eq("share_token", shareToken)
          .single()

        console.log("📊 Result:", { data, error })

        if (error || !data) {
          toast.error("Feedback request not found")
          router.push("/")
          return
        }

        setRequest(data)
        setLoading(false)
      } catch (error) {
        console.error("❌ Error:", error)
        toast.error("Failed to load")
        router.push("/")
      }
    }

    fetchRequest()
  }, [shareToken, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-8">
          <p className="text-red-600">Not found</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">{request.title}</h1>
        <p className="text-gray-600 mb-8">For {request.creator_name}</p>
        
        <div className="space-y-6">
          {request.questions.map((question, index) => (
            <div key={index}>
              <p className="font-medium mb-2">{question}</p>
              <Textarea 
                placeholder="Your answer..." 
                className="min-h-[100px]"
              />
            </div>
          ))}
        </div>

        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
          Submit Feedback
        </Button>
      </Card>
    </div>
  )
}