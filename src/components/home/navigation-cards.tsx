'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Briefcase, Camera, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavCard {
  href: string
  label: string
  description: string
  icon: LucideIcon
  gradient: string
}

const navCards: NavCard[] = [
  {
    href: '/tech-page',
    label: '技術文章',
    description: '120+ 篇前端、React、TypeScript 技術筆記',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    href: '/portfolio',
    label: '作品集',
    description: 'Side projects 與實作作品展示',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    href: '/photo',
    label: '攝影集',
    description: '街拍、旅行、日常攝影記錄',
    icon: Camera,
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    href: '/about',
    label: '關於我',
    description: '自我介紹與聯絡方式',
    icon: User,
    gradient: 'from-emerald-500 to-teal-400',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export function NavigationCards() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
        >
          探索更多
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {navCards.map((card) => (
            <motion.div key={card.href} variants={cardVariants}>
              <Link href={card.href} className="group block">
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  {/* 漸層圖示 */}
                  <div
                    className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${card.gradient} p-3`}
                  >
                    <card.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                    {card.label}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>

                  {/* 懸浮光暈 */}
                  <div
                    className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
