'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            準備好探索了嗎？
          </h2>
          <p className="mt-4 text-muted-foreground">
            瀏覽技術文章，或欣賞攝影作品
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/tech-page">閱讀技術文章</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/photo">瀏覽攝影集</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
