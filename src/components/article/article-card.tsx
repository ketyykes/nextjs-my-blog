import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import dayjs from 'dayjs'

interface ArticleCardProps {
  title: string
  date: string
  slug: string
}

export function ArticleCard({ title, date, slug }: ArticleCardProps) {
  const formattedDate = dayjs(date).format('YYYY-MM-DD ddd')

  return (
    <Link href={`/tech-page/${slug}`} className="block">
      <Card className="transition-colors hover:bg-accent">
        <CardContent className="p-4">
          <h3 className="font-semibold hover:text-primary">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{formattedDate}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
