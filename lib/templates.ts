export interface FeedbackTemplate {
  id: string
  name: string
  icon: string
  description: string
  category: string
  questions: string[]
  color: string
}

export const FEEDBACK_TEMPLATES: FeedbackTemplate[] = [
  {
    id: 'leadership',
    name: 'Leadership Feedback',
    icon: '👔',
    description: 'Get honest feedback on your leadership style and impact',
    category: 'Management',
    color: 'from-blue-500 to-indigo-600',
    questions: [
      'What leadership qualities do you see in me?',
      'Where could I improve as a leader?',
      'How well do I support your growth and development?',
      'What should I start doing, stop doing, or continue doing?',
      'How can I create better psychological safety for the team?'
    ]
  },
  {
    id: 'retrospective',
    name: 'Project Retrospective',
    icon: '🚀',
    description: 'Reflect on what went well and what to improve',
    category: 'Projects',
    color: 'from-purple-500 to-pink-600',
    questions: [
      'What went well in this project?',
      'What could we have done better?',
      'What surprised you (positively or negatively)?',
      'What should we do differently next time?',
      'What lessons did you learn from this project?'
    ]
  },
  {
    id: 'one-on-one',
    name: '1-on-1 Preparation',
    icon: '💬',
    description: 'Prepare for meaningful one-on-one conversations',
    category: 'Management',
    color: 'from-green-500 to-teal-600',
    questions: [
      'What\'s going well for you right now?',
      'What challenges are you currently facing?',
      'What support or resources do you need from me?',
      'Are there any blockers I should know about?',
      'What career growth topics should we discuss?'
    ]
  },
  {
    id: '360-review',
    name: '360 Review',
    icon: '🔄',
    description: 'Comprehensive feedback from peers and colleagues',
    category: 'Performance',
    color: 'from-orange-500 to-red-600',
    questions: [
      'What are my biggest strengths?',
      'What areas do I need to improve?',
      'How effective is my communication?',
      'How well do I collaborate with others?',
      'What\'s my biggest blind spot that I should be aware of?'
    ]
  },
  {
    id: 'team-health',
    name: 'Team Health Check',
    icon: '💚',
    description: 'Regular pulse check on team wellbeing and dynamics',
    category: 'Team',
    color: 'from-emerald-500 to-green-600',
    questions: [
      'On a scale of 1-10, how satisfied are you with our team?',
      'What\'s working well on our team right now?',
      'What\'s not working well?',
      'Do you feel psychologically safe to share ideas and concerns?',
      'What would make this team even better?'
    ]
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    icon: '✨',
    description: 'Create your own custom feedback request',
    category: 'Custom',
    color: 'from-gray-500 to-slate-600',
    questions: [
      'What am I doing well?',
      'What could I improve?',
      'What\'s my biggest blind spot?',
      'What should I start doing?',
      'Any other thoughts or suggestions?'
    ]
  }
]

export function getTemplateById(id: string): FeedbackTemplate | undefined {
  return FEEDBACK_TEMPLATES.find(t => t.id === id)
}