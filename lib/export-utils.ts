import jsPDF from 'jspdf'
import { format } from 'date-fns'

interface Response {
  id: string
  answers: Array<{ question: string; answer: string }>
  submitted_at: string
}

interface FeedbackRequest {
  id: string
  title: string
  questions: string[]
  creator_name: string
  created_at: string
}

interface ExportOptions {
  request: FeedbackRequest
  responses: Response[]
  aiAnalysis?: any
}

/**
 * Export feedback data to enhanced CSV with AI analysis
 */
export function exportToEnhancedCSV({ request, responses, aiAnalysis }: ExportOptions) {
  const csvRows = []

  // Header
  csvRows.push(['VoiceClara Feedback Export'])
  csvRows.push([`Title: ${request.title}`])
  csvRows.push([`Created by: ${request.creator_name}`])
  csvRows.push([`Created: ${format(new Date(request.created_at), 'PPP')}`])
  csvRows.push([`Total Responses: ${responses.length}`])
  csvRows.push([`Export Date: ${format(new Date(), 'PPP pp')}`])
  csvRows.push([]) // Empty line

  // AI Analysis Summary (if available)
  if (aiAnalysis) {
    csvRows.push(['=== AI ANALYSIS SUMMARY ==='])
    csvRows.push([])

    if (aiAnalysis.summary) {
      csvRows.push(['Summary:', `"${aiAnalysis.summary.summary || 'N/A'}"`])
      csvRows.push([])

      if (aiAnalysis.summary.strengths && aiAnalysis.summary.strengths.length > 0) {
        csvRows.push(['Strengths:'])
        aiAnalysis.summary.strengths.forEach((strength: string) => {
          csvRows.push(['', `"${strength}"`])
        })
        csvRows.push([])
      }

      if (aiAnalysis.summary.growthAreas && aiAnalysis.summary.growthAreas.length > 0) {
        csvRows.push(['Growth Areas:'])
        aiAnalysis.summary.growthAreas.forEach((area: string) => {
          csvRows.push(['', `"${area}"`])
        })
        csvRows.push([])
      }

      if (aiAnalysis.summary.recommendations && aiAnalysis.summary.recommendations.length > 0) {
        csvRows.push(['Recommendations:'])
        aiAnalysis.summary.recommendations.forEach((rec: string) => {
          csvRows.push(['', `"${rec}"`])
        })
        csvRows.push([])
      }
    }

    if (aiAnalysis.sentiment) {
      csvRows.push(['Sentiment:', aiAnalysis.sentiment.sentiment])
      csvRows.push(['Confidence:', `${aiAnalysis.sentiment.confidence}%`])
      csvRows.push([])
    }

    if (aiAnalysis.themes && aiAnalysis.themes.length > 0) {
      csvRows.push(['Key Themes:'])
      aiAnalysis.themes.forEach((theme: any) => {
        csvRows.push(['', theme.name, `Count: ${theme.count}`, `"${theme.description}"`])
      })
      csvRows.push([])
    }

    csvRows.push([]) // Empty line separator
  }

  // Responses Header
  csvRows.push(['=== DETAILED RESPONSES ==='])
  csvRows.push([])
  csvRows.push(['Response #', 'Date', 'Time', 'Question', 'Answer'])

  // Response Data
  responses.forEach((response, index) => {
    const date = new Date(response.submitted_at)
    response.answers.forEach((answer, qIndex) => {
      csvRows.push([
        qIndex === 0 ? `#${index + 1}` : '',
        qIndex === 0 ? format(date, 'PP') : '',
        qIndex === 0 ? format(date, 'p') : '',
        `"${answer.question.replace(/"/g, '""')}"`,
        `"${answer.answer.replace(/"/g, '""')}"`,
      ])
    })
    csvRows.push([]) // Empty line between responses
  })

  const csvContent = csvRows.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${request.title.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
}

/**
 * Export feedback data to PDF
 */
export function exportToPDF({ request, responses, aiAnalysis }: ExportOptions) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin
  let yPos = margin

  // Helper to check if we need a new page
  const checkPageBreak = (neededSpace: number = 10) => {
    if (yPos + neededSpace > pageHeight - margin) {
      doc.addPage()
      yPos = margin
      return true
    }
    return false
  }

  // Helper to add text with word wrap
  const addText = (text: string, fontSize: number = 10, style: 'normal' | 'bold' = 'normal', maxWidth?: number) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    const lines = doc.splitTextToSize(text, maxWidth || contentWidth)

    lines.forEach((line: string) => {
      checkPageBreak()
      doc.text(line, margin, yPos)
      yPos += fontSize * 0.5
    })
    yPos += 2
  }

  // Title Page
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('VoiceClara', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  doc.setFontSize(18)
  doc.text('Feedback Report', pageWidth / 2, yPos, { align: 'center' })
  yPos += 20

  // Request Details Box
  doc.setDrawColor(99, 102, 241) // indigo
  doc.setLineWidth(0.5)
  doc.rect(margin, yPos, contentWidth, 40)
  yPos += 8

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(request.title, margin + 5, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Created by: ${request.creator_name}`, margin + 5, yPos)
  yPos += 6
  doc.text(`Created: ${format(new Date(request.created_at), 'PPP')}`, margin + 5, yPos)
  yPos += 6
  doc.text(`Total Responses: ${responses.length}`, margin + 5, yPos)
  yPos += 6
  doc.text(`Generated: ${format(new Date(), 'PPP pp')}`, margin + 5, yPos)
  yPos += 15

  // AI Analysis Section
  if (aiAnalysis) {
    checkPageBreak(20)

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(139, 92, 246) // purple
    doc.text('AI Analysis', margin, yPos)
    yPos += 10
    doc.setTextColor(0, 0, 0)

    // Summary
    if (aiAnalysis.summary) {
      checkPageBreak(15)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary', margin, yPos)
      yPos += 7

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      addText(aiAnalysis.summary.summary || 'No summary available')

      // Strengths
      if (aiAnalysis.summary.strengths && aiAnalysis.summary.strengths.length > 0) {
        checkPageBreak(15)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(16, 185, 129) // green
        doc.text('Strengths', margin, yPos)
        yPos += 7
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        aiAnalysis.summary.strengths.forEach((strength: string) => {
          checkPageBreak()
          addText(`• ${strength}`)
        })
        yPos += 3
      }

      // Growth Areas
      if (aiAnalysis.summary.growthAreas && aiAnalysis.summary.growthAreas.length > 0) {
        checkPageBreak(15)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(249, 115, 22) // orange
        doc.text('Growth Areas', margin, yPos)
        yPos += 7
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        aiAnalysis.summary.growthAreas.forEach((area: string) => {
          checkPageBreak()
          addText(`• ${area}`)
        })
        yPos += 3
      }

      // Recommendations
      if (aiAnalysis.summary.recommendations && aiAnalysis.summary.recommendations.length > 0) {
        checkPageBreak(15)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(99, 102, 241) // indigo
        doc.text('Recommendations', margin, yPos)
        yPos += 7
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        aiAnalysis.summary.recommendations.forEach((rec: string) => {
          checkPageBreak()
          addText(`• ${rec}`)
        })
        yPos += 3
      }
    }

    // Sentiment
    if (aiAnalysis.sentiment) {
      checkPageBreak(15)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Overall Sentiment', margin, yPos)
      yPos += 7

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`${aiAnalysis.sentiment.sentiment} (${aiAnalysis.sentiment.confidence}% confidence)`, margin, yPos)
      yPos += 10
    }

    // Themes
    if (aiAnalysis.themes && aiAnalysis.themes.length > 0) {
      checkPageBreak(15)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Key Themes', margin, yPos)
      yPos += 7

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)

      aiAnalysis.themes.forEach((theme: any) => {
        checkPageBreak(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${theme.name} (${theme.count} mentions)`, margin, yPos)
        yPos += 5
        doc.setFont('helvetica', 'normal')
        addText(theme.description)
        yPos += 2
      })
    }

    yPos += 10
  }

  // Questions Section
  checkPageBreak(20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(99, 102, 241)
  doc.text('Questions', margin, yPos)
  yPos += 10
  doc.setTextColor(0, 0, 0)

  request.questions.forEach((question, index) => {
    checkPageBreak(10)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}.`, margin, yPos)
    doc.setFont('helvetica', 'normal')
    addText(question, 10, 'normal', contentWidth - 10)
  })

  // Responses Section
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(99, 102, 241)
  doc.text('Detailed Responses', margin, yPos)
  yPos += 12
  doc.setTextColor(0, 0, 0)

  responses.forEach((response, index) => {
    checkPageBreak(25)

    // Response header
    doc.setFillColor(249, 250, 251) // gray-50
    doc.rect(margin, yPos - 5, contentWidth, 10, 'F')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`Response #${index + 1}`, margin + 3, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(format(new Date(response.submitted_at), 'PPP p'), pageWidth - margin - 50, yPos)
    yPos += 10

    // Answers
    response.answers.forEach((answer, qIndex) => {
      checkPageBreak(20)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(99, 102, 241)
      doc.text(`Q${qIndex + 1}:`, margin, yPos)
      yPos += 5
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'italic')
      addText(answer.question, 9, 'normal')

      yPos += 2
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      addText(answer.answer, 9, 'normal')
      yPos += 5
    })

    yPos += 5
  })

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `VoiceClara - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save
  doc.save(`${request.title.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}
