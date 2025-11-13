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
    const { requestId, responses, language = 'en' } = await request.json()

    if (!responses || responses.length < 3) {
      return NextResponse.json(
        { error: "Need at least 3 responses for AI analysis" },
        { status: 400 }
      )
    }

    const languageName = LANGUAGE_NAMES[language] || 'English'

    // Format all responses for AI
    const formattedFeedback = responses.map((r: any, i: number) => {
      return `Response #${i + 1}:\n${r.answers.map((a: any) => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}`
    }).join('\n\n---\n\n')

    const prompt = `Analyze these ${responses.length} feedback responses and provide:

IMPORTANT: Provide your analysis in ${languageName}. All insights, themes, strengths, improvements, and summary should be written in ${languageName}.

1. Overall sentiment (positive/neutral/negative ratio)
2. Top 3-5 themes that appear across responses
3. Key strengths mentioned
4. Areas for improvement mentioned
5. Potential blind spots (things NOT being said)
6. Executive summary (2-3 sentences)

Feedback responses:
${formattedFeedback}

Return JSON:
{
  "sentiment": {
    "positive": percentage,
    "neutral": percentage,
    "negative": percentage
  },
  "themes": [
    {"name": "theme", "count": number, "examples": ["quote1", "quote2"]}
  ],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "blind_spots": ["blind_spot1", "blind_spot2"],
  "summary": "executive summary text"
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Results analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}