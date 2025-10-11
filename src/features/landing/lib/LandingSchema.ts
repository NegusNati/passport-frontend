/**
 * Landing feature schema re-exports.
 * Keep the landing feature decoupled while relying on the validated
 * article schemas from the articles feature.
 */
export {
  ArticleApiItem,
  ArticleListResponse,
  type ArticleApiItem as LandingArticleItem,
} from '@/features/articles/lib/ArticlesSchema'
