import { notFound } from 'next/navigation'
import { allArticles } from 'content-collections'
import { ArticleCard, Pager, ArticleContent, GiscusComments } from '@/components/article'
import dayjs from 'dayjs'

const PER_PAGE = 10

interface PageProps {
  params: Promise<{ slug: string }>
}

// 判斷是否為純數字（分頁）
function isPageNumber(slug: string): boolean {
  return /^\d+$/.test(slug)
}

// 取得文章
function getArticleBySlug(slug: string) {
  return allArticles.find((article) => article.slug === slug)
}

// 取得排序後的文章
function getSortedArticles() {
  return [...allArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function generateStaticParams() {
  const sortedArticles = getSortedArticles()
  const totalPages = Math.ceil(sortedArticles.length / PER_PAGE)

  // 生成分頁路徑（從第 2 頁開始）
  const pageParams = Array.from({ length: totalPages - 1 }, (_, i) => ({
    slug: String(i + 2),
  }))

  // 生成文章路徑
  const articleParams = allArticles.map((article) => ({
    slug: article.slug,
  }))

  return [...pageParams, ...articleParams]
}

export default async function TechPageDynamic({ params }: PageProps) {
  const { slug } = await params

  // 如果是分頁
  if (isPageNumber(slug)) {
    const currentPage = parseInt(slug, 10)

    if (currentPage < 2) {
      notFound()
    }

    const sortedArticles = getSortedArticles()
    const totalPages = Math.ceil(sortedArticles.length / PER_PAGE)

    if (currentPage > totalPages) {
      notFound()
    }

    const startIndex = (currentPage - 1) * PER_PAGE
    const paginatedArticles = sortedArticles.slice(
      startIndex,
      startIndex + PER_PAGE
    )

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
        <Pager currentPage={currentPage} totalPages={totalPages} />
      </div>
    )
  }

  // 如果是文章
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = dayjs(article.date).format('YYYY-MM-DD ddd')

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>{article.title}</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
        <ArticleContent html={article.html} />
      </article>
      <div className="mx-auto max-w-3xl">
        <GiscusComments />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  // 如果是分頁
  if (isPageNumber(slug)) {
    return {
      title: `技術文章 - 第 ${slug} 頁`,
      description: `水土曜來了技術文章列表 - 第 ${slug} 頁`,
    }
  }

  // 如果是文章
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: '文章不存在' }
  }

  return {
    title: article.title,
    description: article.content.slice(0, 160),
  }
}
