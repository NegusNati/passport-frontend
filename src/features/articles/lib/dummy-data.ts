import { Article } from '../schemas/article'

const now = new Date('2025-08-24T10:00:00Z')

const toIso = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString()

const makeTaxonomy = (id: number, name: string) => ({
  id,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
})

const sampleCategories = [
  makeTaxonomy(1, 'Passport'),
  makeTaxonomy(2, 'Documentation'),
  makeTaxonomy(3, 'Travel Tips'),
]

const sampleTags = [
  makeTaxonomy(11, 'renewal'),
  makeTaxonomy(12, 'urgent'),
  makeTaxonomy(13, 'processing-time'),
  makeTaxonomy(14, 'international'),
]

export const DUMMY_ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'collect-ethiopian-passport',
    title: "How to Collect Your Ethiopian Passport Once It's Ready",
    excerpt:
      'A comprehensive guide on the process of collecting your Ethiopian passport after it has been processed.',
    content: '<p>Detailed guide on passport collection process...</p>',
    featured_image_url: '/api/placeholder/400/240',
    canonical_url: null,
    meta_title: 'Collect your Ethiopian passport',
    meta_description: 'Steps to collect your passport when it is ready.',
    og_image_url: null,
    status: 'published',
    published_at: toIso(60 * 24),
    reading_time: 5,
    word_count: 1200,
    author: { id: 100, name: 'Passport Team' },
    tags: [sampleTags[0], sampleTags[2]],
    categories: [sampleCategories[0]],
    created_at: toIso(60 * 24 * 2),
    updated_at: toIso(60 * 24),
  },
  {
    id: 2,
    slug: 'urgent-vs-regular-passport-applications',
    title: 'Urgent vs. Regular Passport Applications: What You Need to Know',
    excerpt:
      'Understanding the differences between urgent and regular passport applications and when to choose each option.',
    content: '<p>Comparison of urgent vs regular applications...</p>',
    featured_image_url: '/api/placeholder/400/240',
    canonical_url: null,
    meta_title: 'Urgent vs regular passport applications',
    meta_description: 'When to choose urgent or regular processing.',
    og_image_url: null,
    status: 'published',
    published_at: toIso(60 * 12),
    reading_time: 7,
    word_count: 1500,
    author: { id: 101, name: 'Admin Team' },
    tags: [sampleTags[1], sampleTags[2]],
    categories: [sampleCategories[1]],
    created_at: toIso(60 * 24),
    updated_at: toIso(60 * 12),
  },
  {
    id: 3,
    slug: 'mistakes-to-avoid-when-applying-passport',
    title: 'Top 5 Mistakes to Avoid When Applying for Your Passport',
    excerpt: 'Common mistakes that can delay your passport application and how to avoid them.',
    content: '<p>Top mistakes and how to avoid them...</p>',
    featured_image_url: '/api/placeholder/400/240',
    canonical_url: null,
    meta_title: 'Mistakes to avoid when applying for a passport',
    meta_description: 'Avoid delays in your passport process.',
    og_image_url: null,
    status: 'published',
    published_at: toIso(60 * 6),
    reading_time: 6,
    word_count: 1100,
    author: { id: 102, name: 'Passport Experts' },
    tags: [sampleTags[0], sampleTags[3]],
    categories: [sampleCategories[2]],
    created_at: toIso(60 * 20),
    updated_at: toIso(60 * 6),
  },
]

export const SAMPLE_CATEGORIES = ['all', ...sampleCategories.map((c) => c.slug)] as const
export const SAMPLE_TAGS = ['all', ...sampleTags.map((t) => t.slug)] as const

export function filterArticlesByCategory(articles: Article[], category: string): Article[] {
  if (category === 'all') return articles
  return articles.filter((article) => article.categories.some((cat) => cat.slug === category))
}

export function filterArticlesByTag(articles: Article[], tag: string): Article[] {
  if (tag === 'all') return articles
  return articles.filter((article) => article.tags.some((t) => t.slug === tag))
}

export function searchArticles(articles: Article[], query: string): Article[] {
  if (!query.trim()) return articles
  const lowerQuery = query.toLowerCase()
  return articles.filter((article) => {
    const excerpt = article.excerpt ?? ''
    const tags = article.tags.map((t) => t.name).join(' ')
    const categories = article.categories.map((c) => c.name).join(' ')
    return (
      article.title.toLowerCase().includes(lowerQuery) ||
      excerpt.toLowerCase().includes(lowerQuery) ||
      tags.toLowerCase().includes(lowerQuery) ||
      categories.toLowerCase().includes(lowerQuery)
    )
  })
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
