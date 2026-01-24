'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { LoadingProgress } from '@/components/shared'
import { cn } from '@/lib/utils'

const IMAGE_AMOUNT = 97
const CLOUDINARY_BASE = 'https://res.cloudinary.com/deqqrzo3t/image/upload'

export function PhotoAlbum() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const loadedCount = useRef(0)

  const handleImageLoad = () => {
    loadedCount.current += 1
    const newProgress = (loadedCount.current / IMAGE_AMOUNT) * 100
    setProgress(newProgress)

    if (loadedCount.current >= IMAGE_AMOUNT) {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingProgress value={progress} />
        </div>
      )}

      <div
        className={cn(
          'columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4',
          loading && 'invisible h-0 overflow-hidden'
        )}
      >
        {Array.from({ length: IMAGE_AMOUNT }).map((_, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <Image
              src={`${CLOUDINARY_BASE}/v1678350386/my-blog/instagram_post/igpo-${index + 1}.jpg`}
              alt={`Instagram post ${index + 1}`}
              width={400}
              height={500}
              className="w-full rounded-2xl"
              onLoad={handleImageLoad}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}
