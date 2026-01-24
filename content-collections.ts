import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import dayjs from 'dayjs'
import { z } from 'zod'

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

    // slug 格式：YYYY-MM-DD-ddd（用連字號取代空格）
    const slug = dayjs(document.date).format('YYYY-MM-DD-ddd')

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
