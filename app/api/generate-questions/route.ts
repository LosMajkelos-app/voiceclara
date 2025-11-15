import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
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

const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'it': 'Italian',
  'nl': 'Dutch',
  'cs': 'Czech',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian'
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, language = 'en' } = await request.json()

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

    const languageName = LANGUAGE_NAMES[language] || 'English'

    // Generate with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional feedback form generator. Create 5-7 thoughtful, open-ended questions based on the user's needs. Questions should encourage honest, constructive feedback.

IMPORTANT: Generate questions in ${languageName}. All questions must be written in ${languageName}.

Return JSON format: {title: string, questions: string[]}`
        },
        {
          role: "user",
          content: `Generate feedback questions in ${languageName} for: ${prompt}`
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