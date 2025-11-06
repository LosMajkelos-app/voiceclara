import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    const prompt = `You are a feedback analysis expert. Analyze these feedback responses and provide:
1. Overall quality score (0-100)
2. Specificity score (0-100)
3. Constructiveness score (0-100)
4. Clarity score (0-100)
5. 3 actionable suggestions for improvement
6. For each answer, provide:
   - A quality score
   - Specific feedback
   - An improved version

Responses:
${answers.map((a: any, i: number) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Return JSON format:
{
  "overall": number,
  "specificity": number,
  "constructiveness": number,
  "clarity": number,
  "suggestions": ["...", "...", "..."],
  "per_answer_feedback": [
    {
      "question": "...",
      "original": "...",
      "score": number,
      "feedback": "...",
      "improved": "..."
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}