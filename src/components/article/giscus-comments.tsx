'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function GiscusComments() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="mt-12 border-t pt-8">
      <Giscus
        id="comments"
        repo="ketyykes/react-my-blog"
        repoId="R_kgDOG8KeJw"
        category="Announcements"
        categoryId="DIC_kwDOG8KeJ84CdyXw"
        mapping="og:title"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-TW"
        loading="lazy"
      />
    </div>
  )
}
