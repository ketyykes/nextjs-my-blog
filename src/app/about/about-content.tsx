'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const AVATAR_URL = '/images/avatar-about.jpg'

export function AboutContent() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-[700px] rounded-2xl bg-white p-8 dark:bg-card md:p-12">
        <div className="relative mb-8 overflow-hidden rounded">
          {loading && <Skeleton className="aspect-[4/3] w-full rounded" />}
          <Image
            src={AVATAR_URL}
            alt="作者頭像"
            width={700}
            height={525}
            className={`w-full rounded transition-all duration-500 ease-out hover:scale-105 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setLoading(false)}
          />
        </div>
        <h1 className="mb-6 text-center text-4xl font-bold md:text-5xl">
          關於我
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
          在日語當中，水曜日和土曜日分別代表星期三和星期六的意思，另外也分別代表水星和土星之意，在占星學當中水星象徵個人的心智活動及邏輯思維，土星則有隱含著困難、壓力、磨練等等的意思，而這個技術部落格呼應的就是邏輯思考，筆記這些過程也間接表示遇到程式上面的
          BUG。
        </p>
      </div>
    </div>
  )
}
