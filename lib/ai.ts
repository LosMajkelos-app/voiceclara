import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Response {
  answers: Array<{
    question: string
    answer: string
  }>
}

export async function analyzeThemes(responses: Response[]) {
  // Prepare all responses as text
  const allText = responses
    .map((r, idx) => {
      return `Response ${idx + 1}:\n${r.answers
        .map(a => `Q: ${a.question}\nA: ${a.answer}`)
        .join('\n\n')}`
    })
    .join('\n\n---\n\n')

  const prompt = `You are an expert at analyzing feedback and identifying common themes.

Below are ${responses.length} anonymous feedback responses. Analyze them and identify the top 3-5 recurring themes.

For each theme:
1. Give it a clear, concise name (1-3 words)
2. Count how many responses mention this theme
3. Provide a brief explanation (1 sentence)
4. Include 2-3 example quotes (short excerpts)

Format your response as JSON:
{
  "themes": [
    {
      "name": "Theme Name",
      "count": 8,
      "description": "Brief explanation",
      "quotes": ["quote 1", "quote 2", "quote 3"]
    }
  ]
}

Feedback responses:
${allText}

Return ONLY valid JSON, no other text.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert feedback analyst. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const analysis = JSON.parse(content)

    return {
      themes: analysis.themes || [],
      tokensUsed: completion.usage?.total_tokens || 0,
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    throw new Error('Failed to analyze themes')
  }
}

export async function analyzeSentiment(responses: Response[]) {
  const allText = responses
    .map(r => r.answers.map(a => a.answer).join(' '))
    .join(' ')

  const prompt = `Analyze the overall sentiment of this feedback.

Categorize as:
- "positive" (encouraging, praising, supportive)
- "constructive" (helpful criticism, suggestions for improvement)
- "neutral" (factual observations, mixed feedback)
- "concerned" (worried, critical, highlighting problems)

Also provide:
- Confidence score (0-100)
- Brief explanation (1 sentence)

Feedback: ${allText.substring(0, 3000)}

Return as JSON:
{
  "sentiment": "constructive",
  "confidence": 85,
  "explanation": "Brief explanation here"
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return {
      sentiment: 'neutral',
      confidence: 0,
      explanation: 'Could not analyze sentiment',
    }
  }
}

export async function generateSummary(responses: Response[], themes: any[]) {
  const themesText = themes.map(t => `- ${t.name} (${t.count} mentions)`).join('\n')

  const prompt = `You are an executive coach analyzing feedback for a professional.

Based on these ${responses.length} responses and identified themes:

${themesText}

Write a concise, actionable summary (2-3 paragraphs) that:
1. Highlights key strengths
2. Identifies 2-3 priority areas for growth
3. Provides 3 specific, actionable recommendations

Be encouraging but honest. Focus on growth mindset.

Return as JSON:
{
  "summary": "Full summary text here...",
  "strengths": ["Strength 1", "Strength 2"],
  "growthAreas": ["Area 1", "Area 2"],
  "recommendations": ["Action 1", "Action 2", "Action 3"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced executive coach. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('Summary generation error:', error)
    throw new Error('Failed to generate summary')
  }
}