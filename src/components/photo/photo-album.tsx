'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { LoadingProgress } from '@/components/shared'
import {
  CLOUDINARY_BASE_URL,
  PHOTO_ALBUM_IMAGE_COUNT,
} from '@/lib/constants'

export function PhotoAlbum() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const loadedCount = useRef(0)

  const handleImageLoad = useCallback(() => {
    loadedCount.current += 1
    const newProgress = (loadedCount.current / PHOTO_ALBUM_IMAGE_COUNT) * 100
    setProgress(newProgress)

    if (loadedCount.current >= PHOTO_ALBUM_IMAGE_COUNT) {
      setLoading(false)
    }
  }, [])

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
        {Array.from({ length: PHOTO_ALBUM_IMAGE_COUNT }).map((_, index) => (
          <div key={`photo-${index + 1}`} className="mb-4 break-inside-avoid">
            <Image
              src={`${CLOUDINARY_BASE_URL}/v1678350386/my-blog/instagram_post/igpo-${index + 1}.jpg`}
              alt={`Instagram post ${index + 1}`}
              width={400}
              height={500}
              className="w-full rounded-2xl"
              onLoad={handleImageLoad}
              loading="eager"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}
