import { createLazyFileRoute } from '@tanstack/react-router'

import { ArticlesPage } from '@/features/articles'

export const Route = createLazyFileRoute('/articles/')({
  component: ArticlesPage,
})
