import { Article, ARTICLE_CATEGORIES, ARTICLE_TAGS } from '../schemas/article'

// Sample article data based on the Figma design
export const DUMMY_ARTICLES: Article[] = [
  {
    id: '1',
    title: "How to Collect Your Ethiopian Passport Once It's Ready",
    excerpt:
      'A comprehensive guide on the process of collecting your Ethiopian passport after it has been processed.',
    author: 'Passport Team',
    publishedDate: 'Aug 24, 2025',
    category: 'Passport',
    tags: ['collection', 'ready', 'requirements'],
    readTime: 5,
    imageUrl: '/api/placeholder/400/240',
    featured: true,
    content: 'Detailed guide on passport collection process...',
  },
  {
    id: '2',
    title: 'Urgent vs. Regular Passport Applications: What You Need to Know',
    excerpt:
      'Understanding the differences between urgent and regular passport applications and when to choose each option.',
    author: 'Admin Team',
    publishedDate: 'Aug 24, 2025',
    category: 'Documentation',
    tags: ['urgent', 'processing-time', 'fees'],
    readTime: 7,
    imageUrl: '/api/placeholder/400/240',
    featured: true,
    content: 'Comparison of urgent vs regular applications...',
  },
  {
    id: '3',
    title: 'Top 5 Mistakes to Avoid When Applying for Your Passport',
    excerpt: 'Common mistakes that can delay your passport application and how to avoid them.',
    author: 'Passport Experts',
    publishedDate: 'Aug 24, 2025',
    category: 'Tips',
    tags: ['first-time', 'requirements', 'documents'],
    readTime: 6,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Top mistakes and how to avoid them...',
  },
  {
    id: '4',
    title: 'Travel Tips: What to Do If Your Passport is Delayed',
    excerpt:
      'Practical advice for travelers facing passport delays and how to manage your travel plans.',
    author: 'Travel Guide',
    publishedDate: 'Aug 24, 2025',
    category: 'Travel',
    tags: ['processing-time', 'international', 'tips'],
    readTime: 8,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Managing delayed passport situations...',
  },
  {
    id: '5',
    title: 'Understanding Visa Requirements for Ethiopian Passport Holders',
    excerpt:
      'A complete guide to visa requirements and travel restrictions for Ethiopian passport holders.',
    author: 'Immigration Team',
    publishedDate: 'Aug 23, 2025',
    category: 'Visa',
    tags: ['international', 'requirements', 'travel'],
    readTime: 12,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Comprehensive visa requirements guide...',
  },
  {
    id: '6',
    title: 'Passport Renewal Process: Step by Step Guide',
    excerpt:
      'Everything you need to know about renewing your Ethiopian passport, from documents to processing time.',
    author: 'Renewal Team',
    publishedDate: 'Aug 23, 2025',
    category: 'Passport',
    tags: ['renewal', 'documents', 'processing-time'],
    readTime: 9,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Step-by-step renewal guide...',
  },
  {
    id: '7',
    title: 'Required Documents for First-Time Passport Applications',
    excerpt:
      'Complete checklist of documents needed for your first Ethiopian passport application.',
    author: 'Documentation Team',
    publishedDate: 'Aug 22, 2025',
    category: 'Documentation',
    tags: ['first-time', 'documents', 'requirements'],
    readTime: 4,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'First-time application requirements...',
  },
  {
    id: '8',
    title: 'How to Schedule Your Passport Application Appointment',
    excerpt: 'Guide to booking and preparing for your passport application appointment.',
    author: 'Appointment Team',
    publishedDate: 'Aug 22, 2025',
    category: 'Tips',
    tags: ['appointment', 'scheduling', 'preparation'],
    readTime: 5,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Appointment scheduling guide...',
  },
  {
    id: '9',
    title: 'Immigration Tips for Ethiopian Citizens Living Abroad',
    excerpt:
      'Essential information for Ethiopian citizens residing in other countries regarding passport services.',
    author: 'Immigration Experts',
    publishedDate: 'Aug 21, 2025',
    category: 'Immigration',
    tags: ['international', 'abroad', 'services'],
    readTime: 10,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Guide for citizens abroad...',
  },
  {
    id: '10',
    title: 'Understanding Passport Processing Fees and Payment Methods',
    excerpt: 'Detailed breakdown of passport fees and available payment options.',
    author: 'Finance Team',
    publishedDate: 'Aug 21, 2025',
    category: 'Documentation',
    tags: ['fees', 'payment', 'cost'],
    readTime: 6,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Fees and payment information...',
  },
  {
    id: '11',
    title: 'Domestic vs International Passport: Which Do You Need?',
    excerpt:
      'Understanding the differences between domestic and international Ethiopian passports.',
    author: 'Passport Advisory',
    publishedDate: 'Aug 20, 2025',
    category: 'Passport',
    tags: ['domestic', 'international', 'types'],
    readTime: 7,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Passport type comparison...',
  },
  {
    id: '12',
    title: 'Emergency Passport Services: When and How to Apply',
    excerpt: 'Information about emergency passport services for urgent travel situations.',
    author: 'Emergency Services',
    publishedDate: 'Aug 20, 2025',
    category: 'Travel',
    tags: ['urgent', 'emergency', 'travel'],
    readTime: 8,
    imageUrl: '/api/placeholder/400/240',
    featured: false,
    content: 'Emergency passport procedures...',
  },
]

// Sample filter options
export const SAMPLE_CATEGORIES = ['all', ...ARTICLE_CATEGORIES]
export const SAMPLE_TAGS = ['all', ...ARTICLE_TAGS.slice(0, 8)] // Show first 8 tags

// Helper functions for filtering
export function filterArticlesByCategory(articles: Article[], category: string): Article[] {
  if (category === 'all') return articles
  return articles.filter((article) => article.category === category)
}

export function filterArticlesByTag(articles: Article[], tag: string): Article[] {
  if (tag === 'all') return articles
  return articles.filter((article) => article.tags.includes(tag))
}

export function searchArticles(articles: Article[], query: string): Article[] {
  if (!query.trim()) return articles
  const lowerQuery = query.toLowerCase()
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      article.category.toLowerCase().includes(lowerQuery),
  )
}

export function paginateArticles(articles: Article[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedArticles = articles.slice(start, end)
  const totalPages = Math.ceil(articles.length / pageSize)

  return {
    articles: paginatedArticles,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    totalItems: articles.length,
  }
}
