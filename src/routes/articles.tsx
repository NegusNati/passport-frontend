import { createFileRoute } from '@tanstack/react-router'
import { ArticlesPage } from '@/features/articles'

export const Route = createFileRoute('/articles')({
  component: ArticlesPageComponent,
})

function ArticlesPageComponent() {
  return <ArticlesPage />
}