import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { analyzeThemes, analyzeSentiment, generateSummary, generateActionableRecommendations, filterLowQualityResponses } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const body = await request.json()
    const { feedbackRequestId, resultsToken } = body

    if (!feedbackRequestId) {
      return NextResponse.json(
        { error: 'feedbackRequestId is required' },
        { status: 400 }
      )
    }

    // Verify ownership - either by auth OR by results_token
    let feedbackRequest: any = null

    // Try authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (user && !authError) {
      // User is authenticated - verify ownership
      const { data, error: requestError } = await supabase
        .from('feedback_requests')
        .select('user_id')
        .eq('id', feedbackRequestId)
        .single()

      if (requestError || !data) {
        return NextResponse.json({ error: 'Feedback request not found' }, { status: 404 })
      }

      if (data.user_id !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      feedbackRequest = data
    } else if (resultsToken) {
      // User not authenticated - verify by results_token
      const { data, error: requestError } = await supabase
        .from('feedback_requests')
        .select('user_id, results_token')
        .eq('id', feedbackRequestId)
        .single()

      if (requestError || !data) {
        return NextResponse.json({ error: 'Feedback request not found' }, { status: 404 })
      }

      if (data.results_token !== resultsToken) {
        return NextResponse.json({ error: 'Invalid results token' }, { status: 403 })
      }

      feedbackRequest = data
    } else {
      // No auth and no results token
      return NextResponse.json({ error: 'Unauthorized - login or provide results token' }, { status: 401 })
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

    // Generate actionable recommendations (AI Coach mode)
    const recommendations = await generateActionableRecommendations(
      qualityCheck.validResponses,
      themesResult.themes,
      sentiment
    )

    // Save to database using service role to bypass RLS
    // (we've already verified authorization above)
    // Use service role if available, otherwise fall back to regular client
    const supabaseForSave = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )
      : supabase

    const { error: saveError } = await supabaseForSave
      .from('ai_analysis')
      .upsert({
        feedback_request_id: feedbackRequestId,
        themes: themesResult.themes,
        sentiment: sentiment,
        summary: summary,
        recommendations: recommendations,
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
      recommendations: recommendations,
      tokensUsed: themesResult.tokensUsed,
      response_count_at_analysis: responses.length,
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