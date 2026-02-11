'use client'

import { Suspense, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'

const Scene3D = dynamic(() => import('./scene-3d'), { ssr: false })

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const handleScrollDown = useCallback(() => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }, [])

  return (
    <section className="relative -mt-16 h-screen w-full overflow-hidden">
      {/* 3D 星空背景 */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div
              className={`h-full w-full ${isDark ? 'bg-[#0a0a1a]' : 'bg-gradient-to-b from-blue-50 to-sky-100'}`}
            />
          }
        >
          <Scene3D />
        </Suspense>
      </div>

      {/* 漸層遮罩（確保文字可讀） */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-transparent via-transparent to-background'
            : 'bg-gradient-to-b from-transparent via-transparent to-background/80'
        }`}
      />

      {/* 文字疊層 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl ${
            isDark
              ? 'text-white drop-shadow-[0_0_30px_rgba(200,180,140,0.3)]'
              : 'text-slate-800 drop-shadow-[0_0_20px_rgba(100,150,200,0.2)]'
          }`}
        >
          水土曜來了
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className={`mt-4 text-lg tracking-widest md:text-xl ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          前端開發 ・ 技術筆記 ・ 攝影記錄
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          onClick={handleScrollDown}
          className={`mt-10 rounded-full border px-8 py-3 text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
            isDark
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              : 'border-slate-300/50 bg-white/30 text-slate-700 hover:bg-white/50'
          }`}
        >
          開始探索
        </motion.button>
      </div>

      {/* 滾動提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown
            className={`h-6 w-6 ${isDark ? 'text-white/50' : 'text-slate-400'}`}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
