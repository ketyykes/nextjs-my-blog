import { allArticles, Article } from 'content-collections'
import { kebabCase } from 'lodash-es'

/**
 * 將標籤轉換為 URL-safe 的 slug
 * 使用 kebabCase 處理，Next.js 會自動處理 URL 編碼
 */
export function tagToSlug(tag: string): string {
  return kebabCase(tag)
}

/**
 * 取得所有唯一標籤
 */
export function getAllUniqueTags(): string[] {
  const tags = new Set<string>()
  allArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
}

/**
 * 取得所有標籤及其文章數量，依數量排序
 */
export function getAllTagsWithCount(): Array<{ tag: string; count: number }> {
  const tagCount: Record<string, number> = {}

  allArticles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 根據 kebabCase 標籤找到原始標籤名稱
 */
export function findOriginalTag(kebabTag: string): string | undefined {
  const tags = getAllUniqueTags()
  return tags.find((tag) => kebabCase(tag) === kebabTag)
}

/**
 * 取得該標籤的所有文章，依日期排序（新到舊）
 */
export function getArticlesByTag(tag: string): Article[] {
  return allArticles
    .filter((article) => article.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
