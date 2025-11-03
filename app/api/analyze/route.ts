import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeThemes, analyzeSentiment, generateSummary } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { feedbackRequestId } = await request.json()

    if (!feedbackRequestId) {
      return NextResponse.json(
        { error: 'feedbackRequestId is required' },
        { status: 400 }
      )
    }

    // Fetch all responses
    const { data: responses, error } = await supabase
      .from('responses')
      .select('*')
      .eq('feedback_request_id', feedbackRequestId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses found' },
        { status: 404 }
      )
    }

    // Run AI analysis
    console.log(`Analyzing ${responses.length} responses...`)

    const [themesResult, sentiment] = await Promise.all([
      analyzeThemes(responses),
      analyzeSentiment(responses),
    ])

    const summary = await generateSummary(responses, themesResult.themes)

    // Save to database
    const { error: saveError } = await supabase
      .from('ai_analysis')
      .upsert({
        feedback_request_id: feedbackRequestId,
        themes: themesResult.themes,
        sentiment: sentiment,
        summary: summary,
        analyzed_at: new Date().toISOString(),
      })

    if (saveError) {
      console.error('Error saving analysis:', saveError)
    }

    return NextResponse.json({
      themes: themesResult.themes,
      sentiment: sentiment,
      summary: summary,
      tokensUsed: themesResult.tokensUsed,
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}