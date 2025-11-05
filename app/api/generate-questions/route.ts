import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 500 characters)' },
        { status: 400 }
      )
    }

    console.log('🤖 Generating questions for:', prompt)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in workplace feedback and performance reviews. Your job is to generate thoughtful, open-ended questions that will help people get honest, actionable feedback.

Rules:
1. Generate exactly 5 questions
2. Questions must be clear and specific
3. Encourage constructive feedback
4. Create psychological safety
5. Mix positive and growth-focused questions
6. NO yes/no questions
7. Questions should be relevant to the user's request
8. Use professional but friendly tone

Return ONLY a JSON array of 5 questions, nothing else. No markdown, no explanations.

Example format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`
        },
        {
          role: 'user',
          content: `Generate 5 feedback questions about: "${prompt}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    let questions: string[]
    try {
      questions = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response)
      throw new Error('Invalid response format from AI')
    }

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error('AI did not return exactly 5 questions')
    }

    questions = questions.map(q => q.trim().replace(/^["']|["']$/g, ''))

    console.log('✅ Generated questions:', questions)

    return NextResponse.json({
      success: true,
      questions,
      prompt
    })

  } catch (error: any) {
    console.error('❌ Generate questions error:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate questions',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'