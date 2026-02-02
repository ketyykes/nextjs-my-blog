import { allArticles, Article } from 'content-collections'
import { kebabCase } from 'lodash-es'

/**
 * 檢查字串是否包含非 ASCII 字元（如中文）
 */
function containsNonAscii(str: string): boolean {
  return /[^\x00-\x7F]/.test(str)
}

/**
 * 將標籤轉換為 URL-safe 的 slug
 * - 純英文：使用 kebabCase
 * - 包含中文：使用 encodeURIComponent
 */
export function tagToSlug(tag: string): string {
  if (containsNonAscii(tag)) {
    return encodeURIComponent(tag)
  }
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
 * 根據 slug 找到原始標籤名稱
 * 支援 kebabCase 和 URL 編碼兩種格式
 */
export function findOriginalTag(slug: string): string | undefined {
  const tags = getAllUniqueTags()

  // 先嘗試解碼 URL 編碼的標籤
  try {
    const decoded = decodeURIComponent(slug)
    const exactMatch = tags.find((tag) => tag === decoded)
    if (exactMatch) return exactMatch
  } catch {
    // 解碼失敗，繼續嘗試 kebabCase 匹配
  }

  // 嘗試 kebabCase 匹配（英文標籤）
  return tags.find((tag) => kebabCase(tag) === slug)
}

/**
 * 取得該標籤的所有文章，依日期排序（新到舊）
 */
export function getArticlesByTag(tag: string): Article[] {
  return allArticles
    .filter((article) => article.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
