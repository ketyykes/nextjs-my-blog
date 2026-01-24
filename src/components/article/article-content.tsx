'use client'

import { MermaidRenderer } from './mermaid-renderer'

interface ArticleContentProps {
  html: string
}

export function ArticleContent({ html }: ArticleContentProps) {
  return (
    <>
      <MermaidRenderer content={html} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}
