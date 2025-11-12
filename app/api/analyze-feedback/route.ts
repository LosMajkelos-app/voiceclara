import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json()

    const prompt = `You are an expert feedback quality analyzer. Analyze these responses and score them 0-100 based on:

SPECIFICITY (0-100):
- 0-30: Vague, generic responses ("good", "ok", "fine")
- 40-60: Some specific points but lacking detail
- 70-85: Concrete examples and specific observations
- 90-100: Detailed, specific, actionable feedback with examples

CONSTRUCTIVENESS (0-100):
- 0-30: Only negative or only praise, no balance
- 40-60: Some constructive elements but could be more actionable
- 70-85: Balanced positive and constructive with suggestions
- 90-100: Thoughtful, actionable suggestions for improvement

CLARITY (0-100):
- 0-30: Unclear, confusing, hard to understand ("sdsdsds", random text)
- 40-60: Understandable but could be clearer
- 70-85: Clear, well-structured thoughts
- 90-100: Crystal clear, professional communication

OVERALL (0-100): Average of the three scores

QUALITY LABEL:
- 0-40: "Poor" - Needs significant improvement
- 41-60: "Fair" - Basic feedback, could be better
- 61-75: "Good" - Solid, helpful feedback
- 76-85: "Very Good" - High quality, specific feedback
- 86-100: "Excellent" - Outstanding, actionable insights

BE STRICT. Random text like "asdasd" or "sdfgsdfg" should score 0-10 in all categories.

Responses to analyze:
${answers.map((a: any, i: number) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Return ONLY valid JSON with:
1. Overall scores with quality label
2. General suggestions for improvement
3. Per-answer detailed feedback with specific tips

{
  "overall": number,
  "qualityLabel": "Poor|Fair|Good|Very Good|Excellent",
  "qualityDescription": "Brief description of overall quality",
  "specificity": number,
  "constructiveness": number,
  "clarity": number,
  "suggestions": ["general suggestion 1", "general suggestion 2", "general suggestion 3"],
  "per_answer_feedback": [
    {
      "question": "question text",
      "score": number (0-100),
      "feedback": "specific feedback for this answer",
      "tips": ["tip 1", "tip 2"]
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