import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { analyzeThemes, analyzeSentiment, generateSummary, filterLowQualityResponses } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feedbackRequestId } = await request.json()

    if (!feedbackRequestId) {
      return NextResponse.json(
        { error: 'feedbackRequestId is required' },
        { status: 400 }
      )
    }

    // Verify ownership of the feedback request
    const { data: feedbackRequest, error: requestError } = await supabase
      .from('feedback_requests')
      .select('user_id')
      .eq('id', feedbackRequestId)
      .single()

    if (requestError || !feedbackRequest) {
      return NextResponse.json({ error: 'Feedback request not found' }, { status: 404 })
    }

    if (feedbackRequest.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
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

    // Filter out low-quality and test responses
    const qualityCheck = filterLowQualityResponses(responses, 40)

    console.log(`Total responses: ${responses.length}`)
    console.log(`Valid responses: ${qualityCheck.validResponses.length}`)
    console.log(`Filtered (low quality): ${qualityCheck.filteredCount}`)
    console.log(`Average quality: ${qualityCheck.averageQuality.toFixed(1)}`)

    // Check if we have enough valid responses
    if (qualityCheck.validResponses.length === 0) {
      return NextResponse.json(
        {
          error: 'All responses appear to be test/spam responses',
          warning: 'No valid responses to analyze. All detected responses were low-quality (e.g., "asdasd", "test", single words).',
          details: {
            totalResponses: responses.length,
            validResponses: 0,
            filteredCount: qualityCheck.filteredCount,
            averageQuality: qualityCheck.averageQuality,
          }
        },
        { status: 400 }
      )
    }

    if (qualityCheck.validResponses.length < 3) {
      return NextResponse.json(
        {
          error: 'Not enough valid responses for analysis',
          warning: `Only ${qualityCheck.validResponses.length} valid response(s) found. ${qualityCheck.filteredCount} response(s) filtered as test/spam. Need at least 3 quality responses for meaningful AI analysis.`,
          details: {
            totalResponses: responses.length,
            validResponses: qualityCheck.validResponses.length,
            filteredCount: qualityCheck.filteredCount,
            averageQuality: qualityCheck.averageQuality,
          }
        },
        { status: 400 }
      )
    }

    // Run AI analysis on valid responses only
    console.log(`Analyzing ${qualityCheck.validResponses.length} valid responses...`)

    const [themesResult, sentiment] = await Promise.all([
      analyzeThemes(qualityCheck.validResponses),
      analyzeSentiment(qualityCheck.validResponses),
    ])

    const summary = await generateSummary(qualityCheck.validResponses, themesResult.themes)

    // Save to database
    const { error: saveError } = await supabase
      .from('ai_analysis')
      .upsert({
        feedback_request_id: feedbackRequestId,
        themes: themesResult.themes,
        sentiment: sentiment,
        summary: summary,
        analyzed_at: new Date().toISOString(),
        response_count_at_analysis: responses.length,
      })

    if (saveError) {
      console.error('Error saving analysis:', saveError)
    }

    // Build response with quality warnings if needed
    const response: any = {
      themes: themesResult.themes,
      sentiment: sentiment,
      summary: summary,
      tokensUsed: themesResult.tokensUsed,
      quality: {
        totalResponses: responses.length,
        validResponses: qualityCheck.validResponses.length,
        filteredResponses: qualityCheck.filteredCount,
        averageQuality: Math.round(qualityCheck.averageQuality),
      }
    }

    // Add warning if some responses were filtered
    if (qualityCheck.filteredCount > 0) {
      response.warning = `${qualityCheck.filteredCount} of ${responses.length} response(s) were filtered out as test/spam responses. Analysis based on ${qualityCheck.validResponses.length} valid response(s).`
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}