import { getSortedArticles } from '@/lib/articles'
import {
  HeroSection,
  NavigationCards,
  FeaturedArticles,
  CtaSection,
} from '@/components/home'

const FEATURED_COUNT = 6

export default function Home() {
  const articles = getSortedArticles()
    .slice(0, FEATURED_COUNT)
    .map((article) => ({
      title: article.title,
      date: article.date,
      slug: article.slug,
      tags: article.tags,
    }))

  return (
    <>
      <HeroSection />
      <NavigationCards />
      <FeaturedArticles articles={articles} />
      <CtaSection />
    </>
  )
}
