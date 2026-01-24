'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidRendererProps {
  content: string
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const initialized = useRef(false)

  useEffect(() => {
    const renderMermaid = async () => {
      if (initialized.current) return
      initialized.current = true

      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      })

      // 找到所有 mermaid code block 並渲染
      const codeBlocks = document.querySelectorAll('code.language-mermaid')

      for (const block of codeBlocks) {
        const parent = block.parentElement
        if (!parent) continue

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
        const container = document.createElement('div')
        container.id = id
        container.className = 'mermaid my-4'

        try {
          const { svg } = await mermaid.render(id, block.textContent || '')
          container.innerHTML = svg
          parent.replaceWith(container)
        } catch (error) {
          console.error('Mermaid rendering failed:', error)
        }
      }
    }

    renderMermaid()
  }, [content])

  return null
}
