import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { z } from 'zod'
import dayjs from 'dayjs'

// 追蹤已使用的 slug，用於處理重複日期
const usedSlugs = new Map<string, number>()

/**
 * 生成唯一的 slug，重複時自動加上遞增後綴
 * 例如: 2022-02-06-0555, 2022-02-06-0555-1, 2022-02-06-0555-2
 */
function getUniqueSlug(baseSlug: string): string {
  const count = usedSlugs.get(baseSlug) || 0
  usedSlugs.set(baseSlug, count + 1)

  if (count === 0) {
    return baseSlug
  }
  return `${baseSlug}-${count}`
}

/**
 * 將 frontmatter 的 slug（日期時間格式）轉換為 URL-safe slug
 * 例如: 2022-02-06T05:55:00.000Z → 2022-02-06-0555
 */
function formatDateSlug(dateString: string): string {
  const date = dayjs(dateString)
  if (!date.isValid()) {
    return dateString // 如果不是有效日期，返回原值
  }
  return date.format('YYYY-MM-DD-HHmm')
}

const articles = defineCollection({
  name: 'articles',
  directory: 'content/articles',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [
          rehypePrettyCode,
          {
            theme: 'one-dark-pro',
            keepBackground: true,
            defaultLang: 'plaintext',
          },
        ],
      ],
    })

    // 優先使用 frontmatter 的 slug（轉換日期格式），否則使用文章日期作為流水號
    // 重複的 slug 會自動加上遞增後綴
    const baseSlug = document.slug
      ? formatDateSlug(document.slug)
      : formatDateSlug(document.date)
    const slug = getUniqueSlug(baseSlug)

    return {
      ...document,
      html,
      slug,
      url: `/tech-page/${slug}`,
    }
  },
})

export default defineConfig({
  collections: [articles],
})
