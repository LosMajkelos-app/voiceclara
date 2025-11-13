"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

interface Response {
  id: string
  answers: Array<{ question: string; answer: string }>
  submitted_at: string
}

interface AnalyticsChartsProps {
  responses: Response[]
  aiAnalysis: any
}

export default function AnalyticsCharts({ responses, aiAnalysis }: AnalyticsChartsProps) {
  // Prepare data for response timeline
  const timelineData = responses.reduce((acc: any[], response) => {
    const date = format(parseISO(response.submitted_at), 'MMM dd')
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.responses += 1
    } else {
      acc.push({ date, responses: 1 })
    }
    return acc
  }, [])

  // Prepare data for sentiment distribution
  const sentimentData = [
    { name: 'Positive', value: 0, color: '#10b981' },
    { name: 'Neutral', value: 0, color: '#6b7280' },
    { name: 'Negative', value: 0, color: '#ef4444' }
  ]

  // Mock sentiment data (would come from AI analysis in production)
  if (aiAnalysis?.sentiment) {
    const sentiment = aiAnalysis.sentiment.sentiment
    if (sentiment === 'positive') sentimentData[0].value = 60
    else if (sentiment === 'constructive') {
      sentimentData[0].value = 40
      sentimentData[1].value = 40
    }
    else if (sentiment === 'neutral') sentimentData[1].value = 70
    else sentimentData[2].value = 50

    // Fill remaining
    const total = sentimentData.reduce((sum, item) => sum + item.value, 0)
    if (total < 100) {
      sentimentData[1].value += (100 - total)
    }
  } else {
    // Default distribution
    sentimentData[0].value = 40
    sentimentData[1].value = 50
    sentimentData[2].value = 10
  }

  // Prepare data for theme frequency
  const themeData = aiAnalysis?.themes?.map((theme: any) => ({
    name: theme.name.length > 20 ? theme.name.substring(0, 20) + '...' : theme.name,
    count: theme.count
  })) || []

  // Response length analysis
  const responseLengthData = responses.map((response, index) => {
    const totalLength = response.answers.reduce((sum, answer) => sum + answer.answer.length, 0)
    const avgLength = Math.round(totalLength / response.answers.length)
    return {
      name: `R${index + 1}`,
      length: avgLength
    }
  })

  return (
    <div className="space-y-4">
      {/* Response Timeline */}
      <Card className="p-4 bg-white">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Response Timeline</h3>
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="responses"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-gray-500 text-center py-8">No data to display</p>
        )}
      </Card>

      {/* Sentiment Distribution */}
      {aiAnalysis && (
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Theme Frequency */}
      {themeData.length > 0 && (
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Theme Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={themeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Response Length Analysis */}
      {responseLengthData.length > 0 && (
        <Card className="p-4 bg-white">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Average Response Length</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseLengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                label={{ value: 'Characters', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(value: number) => [`${value} chars`, 'Avg Length']}
              />
              <Bar dataKey="length" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
