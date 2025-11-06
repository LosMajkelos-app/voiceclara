import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnswerToAnalyze {
  question: string
  answer: string
  index: number
}

export async function POST(request: NextRequest) {
  try {
    const { answers, questions } = await request.json()

    if (!answers || !questions) {
      return NextResponse.json(
        { error: 'Answers and questions are required' },
        { status: 400 }
      )
    }

    console.log('🤖 AI Coach analyzing feedback...')

    // Prepare answers for analysis
    const answersToAnalyze: AnswerToAnalyze[] = questions.map((q: string, i: number) => ({
      question: q,
      answer: answers[i] || '',
      index: i
    })).filter((a: AnswerToAnalyze) => a.answer.trim())

    if (answersToAnalyze.length === 0) {
      return NextResponse.json({
        error: 'No answers to analyze. Please write some feedback first.'
      }, { status: 400 })
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are VoiceClara AI Coach, an expert feedback advisor who helps people give better, more constructive feedback.

Your job is to analyze feedback responses and provide encouraging, actionable suggestions to improve them.

For EACH answer, analyze:
1. **Specificity**: Does it include concrete examples?
2. **Constructiveness**: Is it helpful and actionable?
3. **Tone**: Is it respectful and professional?
4. **Length**: Is it too short or too long?
5. **Balance**: Does it balance positive and critical feedback?
6. **Anonymity**: Does it accidentally reveal identity?

Provide:
- Quality score (1-10)
- What's working well
- Specific improvement suggestions
- An improved version (keep original voice!)
- Flags for: harsh_tone, too_short, too_vague, identifies_user

Also provide overall analysis:
- Total positive vs. critical ratio
- Suggestion for better balance if needed

Return ONLY valid JSON, no markdown.

Example format:
{
  "overall_score": 7,
  "overall_feedback": "Good feedback overall...",
  "balance": {
    "positive_count": 2,
    "critical_count": 3,
    "suggestion": "Consider adding more positive examples"
  },
  "suggestions": [
    {
      "question_index": 0,
      "quality_score": 8,
      "what_works": "Specific example provided",
      "improvement": "Add more context about impact",
      "improved_version": "Enhanced version here",
      "flags": ["too_short"],
      "tone": "constructive"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Analyze this feedback:

${answersToAnalyze.map(a => `
Question ${a.index + 1}: ${a.question}
Answer: ${a.answer}
`).join('\n')}

Provide structured JSON analysis with suggestions for improvement.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    let analysis
    try {
      analysis = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse AI response:', response)
      throw new Error('Invalid response format from AI')
    }

    console.log('✅ AI Coach analysis complete')

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error: any) {
    console.error('❌ AI Coach error:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze feedback',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'