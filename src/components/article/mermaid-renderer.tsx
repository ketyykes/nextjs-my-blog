'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidRendererProps {
  content: string
}

interface RenderError {
  id: string
  message: string
}

export function MermaidRenderer({ content }: MermaidRendererProps) {
  const initialized = useRef(false)
  const [errors, setErrors] = useState<RenderError[]>([])

  useEffect(() => {
    const renderMermaid = async () => {
      if (initialized.current) return
      initialized.current = true

      const mermaid = (await import('mermaid')).default

      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'strict',
      })

      const codeBlocks = document.querySelectorAll('code.language-mermaid')
      const newErrors: RenderError[] = []

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
          // 記錄錯誤但保留原始程式碼區塊
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          console.error('Mermaid rendering failed:', errorMessage)

          // 建立錯誤提示元素
          const errorContainer = document.createElement('div')
          errorContainer.className =
            'my-4 rounded-md border border-destructive/50 bg-destructive/10 p-4'
          const titleEl = document.createElement('p')
          titleEl.className = 'text-sm font-medium text-destructive'
          titleEl.textContent = 'Mermaid 圖表渲染失敗'

          const messageEl = document.createElement('p')
          messageEl.className = 'mt-1 text-xs text-muted-foreground'
          messageEl.textContent = errorMessage

          errorContainer.appendChild(titleEl)
          errorContainer.appendChild(messageEl)

          // 在原始程式碼區塊後插入錯誤提示
          parent.insertAdjacentElement('afterend', errorContainer)

          newErrors.push({ id, message: errorMessage })
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors)
      }
    }

    renderMermaid()
  }, [content])

  // 元件不渲染任何內容，僅處理 DOM
  return errors.length > 0 ? (
    <div className="sr-only" role="alert" aria-live="polite">
      {errors.length} 個 Mermaid 圖表渲染失敗
    </div>
  ) : null
}
