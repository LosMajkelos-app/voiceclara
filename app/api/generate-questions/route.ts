import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Malicious prompt detection
const BLOCKED_KEYWORDS = [
  'hack', 'exploit', 'virus', 'malware', 'illegal', 'drugs', 
  'violence', 'harm', 'suicide', 'weapon', 'bomb'
]

function isPromptSafe(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase()
  return !BLOCKED_KEYWORDS.some(keyword => lowerPrompt.includes(keyword))
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // Validate prompt
    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed description" },
        { status: 400 }
      )
    }

    // Check for malicious content
    if (!isPromptSafe(prompt)) {
      return NextResponse.json(
        { error: "Your request contains inappropriate content. Please try again with a professional feedback topic." },
        { status: 400 }
      )
    }

    // Generate with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional feedback form generator. Create 5-7 thoughtful, open-ended questions based on the user's needs. Questions should encourage honest, constructive feedback. Return JSON format: {title: string, questions: string[]}"
        },
        {
          role: "user",
          content: `Generate feedback questions for: ${prompt}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    // Validate result
    if (!result.questions || result.questions.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate questions. Please try a different description." },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Question generation error:', error)
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    )
  }
}