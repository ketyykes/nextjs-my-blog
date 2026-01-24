import Link from 'next/link'
import { allArticles } from 'content-collections'
import { kebabCase } from 'lodash-es'
import { Badge } from '@/components/ui/badge'
import { Tag } from 'lucide-react'

// 取得所有標籤及其文章數量
function getAllTags() {
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

export const metadata = {
  title: '標籤',
  description: '所有文章標籤總覽',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">標籤總覽</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${kebabCase(tag)}`}>
            <Badge
              variant="secondary"
              className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Tag className="mr-2 h-4 w-4" />
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
