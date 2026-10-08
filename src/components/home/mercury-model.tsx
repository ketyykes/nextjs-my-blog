'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

/** 水星球體 */
function MercurySphere({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null)

  const surfaceTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    // 水星基底色：灰色調
    const baseR = isDark ? 140 : 170
    const baseG = isDark ? 135 : 165
    const baseB = isDark ? 130 : 160

    // 繪製基底
    ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`
    ctx.fillRect(0, 0, 256, 256)

    // 加入表面紋理變化（模擬隕石坑地形）
    const rng = (seed: number) => {
      const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    for (let i = 0; i < 80; i++) {
      const cx = rng(i * 3.1) * 256
      const cy = rng(i * 7.3) * 256
      const radius = rng(i * 13.7) * 12 + 3
      const shade = isDark
        ? Math.floor(rng(i * 17.9) * 40 - 20)
        : Math.floor(rng(i * 17.9) * 30 - 15)

      // 隕石坑陰影
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        radius,
      )
      gradient.addColorStop(
        0,
        `rgb(${baseR + shade - 15},${baseG + shade - 15},${baseB + shade - 15})`,
      )
      gradient.addColorStop(
        0.6,
        `rgb(${baseR + shade + 10},${baseG + shade + 10},${baseB + shade + 10})`,
      )
      gradient.addColorStop(
        1,
        `rgba(${baseR},${baseG},${baseB},0)`,
      )
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }, [isDark])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        map={surfaceTexture}
        roughness={isDark ? 0.85 : 0.95}
        metalness={isDark ? 0.05 : 0}
      />
    </mesh>
  )
}

/** 水星完整模型 */
export function MercuryModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(Date.now() * 0.00015) * 0.03
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={groupRef} position={[-5, -1.5, -5]} rotation={[0.1, 0.4, 0]}>
        <MercurySphere isDark={isDark} />

        {/* 水星微光效果（暗色模式） */}
        {isDark && (
          <pointLight
            position={[0, 0, 0]}
            intensity={0.3}
            distance={5}
            color="#a8a0b0"
          />
        )}
      </group>
    </Float>
  )
}
