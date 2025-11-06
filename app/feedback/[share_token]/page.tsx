"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function FeedbackFormPage() {
  const params = useParams()
  const shareToken = params.share_token as string
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequest() {
      console.log("🔍 Token:", shareToken)
      
      const { data, error } = await supabase
        .from("feedback_requests")
        .select("*")
        .eq("share_token", shareToken)
        .single()

      console.log("📊 Data:", data)
      console.log("❌ Error:", error)

      if (data) {
        setRequest(data)
      }
      setLoading(false)
    }

    fetchRequest()
  }, [shareToken])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!request) {
    return <div className="p-8">Not found</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{request.title}</h1>
      <p className="mb-8">For: {request.creator_name}</p>
      
      <div className="space-y-4">
        {request.questions?.map((question: string, index: number) => (
          <div key={index} className="border p-4 rounded">
            <p className="font-medium mb-2">{question}</p>
            <textarea 
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Your answer..."
            />
          </div>
        ))}
      </div>

      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded">
        Submit
      </button>
    </div>
  )
}