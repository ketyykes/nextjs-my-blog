import Link from 'next/link'
import { Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAllTagsWithCount, tagToSlug } from '@/lib/tags'

export const metadata = {
  title: '標籤',
  description: '所有文章標籤總覽',
}

export default function TagsPage() {
  const tags = getAllTagsWithCount()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">標籤總覽</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${tagToSlug(tag)}`}>
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
