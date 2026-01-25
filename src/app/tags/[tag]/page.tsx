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

/**
 * 將標籤轉換為 URL-safe 的 slug
 * 使用 kebabCase 處理後，再進行 URL 編碼以確保中文字元正確處理
 */
function tagToSlug(tag: string): string {
  const kebab = kebabCase(tag)
  // 如果包含非 ASCII 字元，進行 URL 編碼
  if (/[^\x00-\x7F]/.test(kebab)) {
    return encodeURIComponent(kebab)
  }
  return kebab
}

/**
 * 將 URL slug 還原為可比對的格式
 */
function slugToComparable(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

// 根據 kebabCase 標籤找到原始標籤名稱
function findOriginalTag(kebabTag: string) {
  const tags = getAllTags()
  const decodedTag = slugToComparable(kebabTag)
  return tags.find((tag) => kebabCase(tag) === decodedTag)
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
