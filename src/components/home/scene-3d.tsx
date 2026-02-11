'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useTheme } from 'next-themes'
import { StarField } from './star-field'
import { SaturnModel } from './saturn-model'

export default function Scene3D() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: isDark ? '#0a0a1a' : undefined }}
    >
      {isDark ? (
        <color attach="background" args={['#0a0a1a']} />
      ) : (
        <color attach="background" args={['#e8f0fe']} />
      )}

      <StarField />
      <SaturnModel />

      {/* Bloom 後處理（暗色模式發光更強） */}
      <EffectComposer>
        <Bloom
          intensity={isDark ? 1.2 : 0.3}
          luminanceThreshold={isDark ? 0.6 : 0.9}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
