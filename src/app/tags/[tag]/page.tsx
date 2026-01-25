import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/article'
import {
  getAllUniqueTags,
  tagToSlug,
  findOriginalTag,
  getArticlesByTag,
} from '@/lib/tags'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllUniqueTags()
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { tag: kebabTag } = await params
  const originalTag = findOriginalTag(kebabTag)

  if (!originalTag) {
    return { title: '標籤不存在' }
  }

  return {
    title: originalTag,
    description: `標籤「${originalTag}」的所有文章`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag: kebabTag } = await params
  const originalTag = findOriginalTag(kebabTag)

  if (!originalTag) {
    notFound()
  }

  const articles = getArticlesByTag(originalTag)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">標籤：{originalTag}</h1>
      <p className="mb-8 text-muted-foreground">共 {articles.length} 篇文章</p>
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article._meta.path}
            title={article.title}
            date={article.date}
            slug={article.slug}
          />
        ))}
      </div>
    </div>
  )
}
