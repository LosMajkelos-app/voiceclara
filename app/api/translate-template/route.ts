import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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
    const { questions, language = 'en' } = await request.json()

    // Validate input
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Invalid questions array" },
        { status: 400 }
      )
    }

    if (language === 'en') {
      // No translation needed
      return NextResponse.json({ questions })
    }

    const languageName = LANGUAGE_NAMES[language] || 'English'

    // Translate with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator specializing in business and feedback contexts. Translate the provided questions accurately to ${languageName}, maintaining their professional tone and intent. Return ONLY a JSON object with format: {questions: string[]}`
        },
        {
          role: "user",
          content: `Translate these feedback questions to ${languageName}:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    // Validate result
    if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
      return NextResponse.json(
        { error: "Translation failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ questions: result.questions })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 }
    )
  }
}
