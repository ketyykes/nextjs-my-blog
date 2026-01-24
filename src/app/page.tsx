import { allArticles } from 'content-collections'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Content Collections 測試</h1>
      <p className="mb-4">文章數量: {allArticles.length}</p>
      <ul className="space-y-4">
        {allArticles.map((article) => (
          <li key={article._meta.path} className="rounded border p-4">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">
              {article.slug} | Tags: {article.tags.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
