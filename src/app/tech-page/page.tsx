import { allArticles } from 'content-collections'
import { ArticleCard, Pager } from '@/components/article'

const PER_PAGE = 10

export default function TechPage() {
  // 依日期排序（新到舊）
  const sortedArticles = [...allArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalPages = Math.ceil(sortedArticles.length / PER_PAGE)
  const paginatedArticles = sortedArticles.slice(0, PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">技術文章</h1>
      <div className="space-y-4">
        {paginatedArticles.map((article) => (
          <ArticleCard
            key={article._meta.path}
            title={article.title}
            date={article.date}
            slug={article.slug}
          />
        ))}
      </div>
      <Pager currentPage={1} totalPages={totalPages} />
    </div>
  )
}

export const metadata = {
  title: '技術文章',
  description: '水土曜來了技術文章列表',
}
