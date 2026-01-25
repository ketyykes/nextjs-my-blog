import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { z } from 'zod'

/**
 * 將檔名轉換為 URL-safe slug
 * 保留中文，將空格和特殊字元轉換為連字號
 */
function slugify(filename: string): string {
  return filename
    .replace(/\.md$/, '') // 移除 .md 副檔名
    .replace(/[、。，！？：；（）【】「」『』]/g, '-') // 中文標點轉連字號
    .replace(/[—–]/g, '-') // em dash 和 en dash 轉連字號
    .replace(/\s+/g, '-') // 空白轉連字號
    .replace(/[^\w\u4e00-\u9fff-]/g, '-') // 非字母數字中文轉連字號
    .replace(/-+/g, '-') // 連續連字號合併
    .replace(/^-|-$/g, '') // 移除首尾連字號
    .toLowerCase()
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

    // 使用檔名生成 slug
    const slug = slugify(document._meta.path)

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
