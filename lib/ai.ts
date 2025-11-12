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

// Test/spam response detection patterns
const TEST_PATTERNS = [
  /^(test|testing|test123|asdf|qwerty|abc|123|aaa+|zzz+|xxx+)$/i,
  /^(.)\1{4,}$/,  // Same character repeated 5+ times (aaaaa, 11111)
  /^(asdasd|qweqwe|asdfasdf|testtest)/i,  // Repeated patterns
  /^(lol|haha|jaja|hehe){3,}/i,  // Repeated laughter
  /^[.,;!?\s]+$/,  // Only punctuation/whitespace
  /^[0-9]+$/,  // Only numbers
  /^[a-z]{1,3}$/i,  // Single letter or 2-3 letters only
]

/**
 * Detects if a single answer is a test/spam response
 */
export function isTestResponse(answer: string): boolean {
  if (!answer || typeof answer !== 'string') return true

  const trimmed = answer.trim()

  // Too short (less than 10 characters)
  if (trimmed.length < 10) return true

  // Check against test patterns
  for (const pattern of TEST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true
    }
  }

  // Check for keyboard mashing (random adjacent keys)
  const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const lowerTrimmed = trimmed.toLowerCase()
  for (const row of keyboardRows) {
    // Check if answer is just mashing keys in sequence
    if (lowerTrimmed.length >= 5 && row.includes(lowerTrimmed.slice(0, 5))) {
      return true
    }
  }

  // Check for very low word count (less than 3 words)
  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 3) return true

  // Check for repetitive words (same word 3+ times)
  const words = trimmed.toLowerCase().split(/\s+/)
  const wordFreq: { [key: string]: number } = {}
  for (const word of words) {
    if (word.length > 2) {  // Only count words longer than 2 chars
      wordFreq[word] = (wordFreq[word] || 0) + 1
      if (wordFreq[word] >= 3) return true
    }
  }

  return false
}

/**
 * Calculates quality score for a response (0-100)
 * Higher score = better quality
 */
export function calculateResponseQuality(response: Response): number {
  let score = 100
  let totalCharacters = 0
  let totalWords = 0
  let testAnswers = 0

  for (const answer of response.answers) {
    const text = answer.answer?.trim() || ''
    totalCharacters += text.length
    const words = text.split(/\s+/).filter(w => w.length > 0)
    totalWords += words.length

    if (isTestResponse(text)) {
      testAnswers++
      score -= 40  // Heavy penalty for test answers
    }
  }

  const avgCharsPerAnswer = totalCharacters / response.answers.length
  const avgWordsPerAnswer = totalWords / response.answers.length

  // Penalize very short responses
  if (avgCharsPerAnswer < 50) score -= 20
  if (avgWordsPerAnswer < 10) score -= 15

  // Reward longer, thoughtful responses
  if (avgCharsPerAnswer > 100) score += 10
  if (avgWordsPerAnswer > 20) score += 10

  return Math.max(0, Math.min(100, score))
}

/**
 * Filters out low-quality and test responses
 * Returns filtered responses and metadata
 */
export function filterLowQualityResponses(responses: Response[], minQualityScore: number = 40) {
  const filtered = responses.map(r => ({
    response: r,
    quality: calculateResponseQuality(r),
  }))

  const highQuality = filtered.filter(f => f.quality >= minQualityScore)
  const lowQuality = filtered.filter(f => f.quality < minQualityScore)

  return {
    validResponses: highQuality.map(f => f.response),
    invalidResponses: lowQuality.map(f => f.response),
    qualityScores: filtered.map(f => f.quality),
    averageQuality: filtered.reduce((sum, f) => sum + f.quality, 0) / filtered.length,
    filteredCount: lowQuality.length,
  }
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