export interface ContextImage {
  id: number
  src: string
  alt: string
  keywords: string[]
}

export const contextImages: ContextImage[] = [
  {
    id: 1,
    src: '/images/context/writing.jpg',
    alt: 'Person writing thoughtful feedback',
    keywords: ['improve', 'better', 'change', 'stop', 'feedback']
  },
  {
    id: 2,
    src: '/images/context/discussion.jpg',
    alt: 'Team having open discussion',
    keywords: ['well', 'strength', 'continue', 'good', 'doing']
  },
  {
    id: 3,
    src: '/images/context/reflection.jpg',
    alt: 'Person in thoughtful reflection',
    keywords: ['blind spot', 'aware', 'see', 'notice', 'perspective']
  },
  {
    id: 4,
    src: '/images/context/growth.jpg',
    alt: 'Growing plant symbolizing development',
    keywords: ['start', 'begin', 'develop', 'learn', 'grow']
  },
  {
    id: 5,
    src: '/images/context/collaboration.jpg',
    alt: 'People collaborating effectively',
    keywords: ['team', 'together', 'communicate', 'collaborate']
  }
]

// Helper function to get relevant image based on question
export function getContextImage(question: string): ContextImage {
  const lowerQuestion = question.toLowerCase()
  
  // Find image with matching keywords
  const matchedImage = contextImages.find(img =>
    img.keywords.some(keyword => lowerQuestion.includes(keyword))
  )
  
  // Return matched image or random one
  if (matchedImage) return matchedImage
  
  const randomIndex = Math.floor(Math.random() * contextImages.length)
  return contextImages[randomIndex]
}