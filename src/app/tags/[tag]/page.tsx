import { notFound } from 'next/navigation'
import { allArticles } from 'content-collections'
import { kebabCase } from 'lodash-es'
import { ArticleCard } from '@/components/article'

interface PageProps {
  params: Promise<{ tag: string }>
}

// 取得所有唯一標籤
function getAllTags() {
  const tags = new Set<string>()
  allArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
}

// 根據 kebabCase 標籤找到原始標籤名稱
function findOriginalTag(kebabTag: string) {
  const tags = getAllTags()
  return tags.find((tag) => kebabCase(tag) === kebabTag)
}

// 取得該標籤的所有文章
function getArticlesByTag(tag: string) {
  return allArticles
    .filter((article) => article.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: kebabCase(tag),
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
