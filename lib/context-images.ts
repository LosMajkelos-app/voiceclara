export interface ContextImage {
  id: number
  src: string
  alt: string
  keywords: string[]
}

export const contextImages: ContextImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    alt: 'Person writing thoughtful feedback',
    keywords: ['improve', 'better', 'change', 'stop', 'feedback']
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    alt: 'Team having open discussion',
    keywords: ['well', 'strength', 'continue', 'good', 'doing']
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    alt: 'Person in thoughtful reflection',
    keywords: ['blind spot', 'aware', 'see', 'notice', 'perspective']
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    alt: 'Growing plant symbolizing development',
    keywords: ['start', 'begin', 'develop', 'learn', 'grow']
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    alt: 'People collaborating effectively',
    keywords: ['team', 'together', 'communicate', 'collaborate']
  }
]

export function getContextImage(question: string): ContextImage {
  const lowerQuestion = question.toLowerCase()
  
  const matchedImage = contextImages.find(img =>
    img.keywords.some(keyword => lowerQuestion.includes(keyword))
  )
  
  if (matchedImage) return matchedImage
  
  const randomIndex = Math.floor(Math.random() * contextImages.length)
  return contextImages[randomIndex]
}