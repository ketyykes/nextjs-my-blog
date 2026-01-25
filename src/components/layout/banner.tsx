'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

const PATHS_WITH_BANNER = ['/', '/photo', '/tags']

export function Banner() {
  const pathname = usePathname()

  if (!PATHS_WITH_BANNER.includes(pathname)) {
    return null
  }

  return (
    <div className="relative h-[60vh] min-h-100 w-full">
      <Image
        src="/images/banner-night.jpg"
        alt="Banner"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1 className="text-4xl font-bold text-white md:text-6xl">
          水土曜來了
        </h1>
      </div>
    </div>
  )
}
