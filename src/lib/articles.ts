import { allArticles, Article } from 'content-collections'

/**
 * 依日期排序文章（新到舊）
 */
export function getSortedArticles(): Article[] {
  return [...allArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * 根據 slug 取得文章
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((article) => article.slug === slug)
}

/**
 * 判斷是否為純數字（用於分頁判斷）
 */
export function isPageNumber(slug: string): boolean {
  return /^\d+$/.test(slug)
}
