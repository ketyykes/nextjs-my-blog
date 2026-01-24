import { allArticles } from 'content-collections'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">最新文章</h2>
      <p className="mb-4 text-muted-foreground">文章數量: {allArticles.length}</p>
      <ul className="space-y-4">
        {allArticles.map((article) => (
          <li
            key={article._meta.path}
            className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <h3 className="font-semibold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">
              {article.slug} | Tags: {article.tags.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
