'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const AVATAR_URL = '/images/avatar-about.jpg'

export function AboutContent() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex justify-center">
          {loading && (
            <Skeleton className="h-100 w-full max-w-100 rounded-2xl" />
          )}
          <Image
            src={AVATAR_URL}
            alt="作者頭像"
            width={400}
            height={400}
            className={`rounded-2xl ${loading ? 'hidden' : 'block'}`}
            onLoad={() => setLoading(false)}
            unoptimized
          />
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold">關於我</h1>
        <p className="text-muted-foreground leading-relaxed">
          在日語當中，水曜日和土曜日分別代表星期三和星期六的意思，另外也分別代表水星和土星之意，在占星學當中水星象徵個人的心智活動及邏輯思維，土星則有隱含著困難、壓力、磨練等等的意思，而這個技術部落格呼應的就是邏輯思考，筆記這些過程也間接表示遇到程式上面的
          BUG。
        </p>
      </div>
    </div>
  )
}
