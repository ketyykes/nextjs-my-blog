'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

/** 土星光環 */
function SaturnRing({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null)

  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createLinearGradient(0, 0, 512, 0)
    if (isDark) {
      gradient.addColorStop(0, 'rgba(180, 160, 120, 0)')
      gradient.addColorStop(0.1, 'rgba(180, 160, 120, 0.6)')
      gradient.addColorStop(0.3, 'rgba(200, 180, 140, 0.8)')
      gradient.addColorStop(0.5, 'rgba(160, 140, 100, 0.3)')
      gradient.addColorStop(0.6, 'rgba(200, 180, 140, 0.7)')
      gradient.addColorStop(0.8, 'rgba(180, 160, 120, 0.5)')
      gradient.addColorStop(1, 'rgba(180, 160, 120, 0)')
    } else {
      gradient.addColorStop(0, 'rgba(200, 180, 140, 0)')
      gradient.addColorStop(0.1, 'rgba(200, 180, 140, 0.4)')
      gradient.addColorStop(0.3, 'rgba(220, 200, 160, 0.6)')
      gradient.addColorStop(0.5, 'rgba(180, 160, 120, 0.2)')
      gradient.addColorStop(0.6, 'rgba(220, 200, 160, 0.5)')
      gradient.addColorStop(0.8, 'rgba(200, 180, 140, 0.3)')
      gradient.addColorStop(1, 'rgba(200, 180, 140, 0)')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.ClampToEdgeWrapping
    return texture
  }, [isDark])

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[2.2, 3.5, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={isDark ? 0.8 : 0.5}
      />
    </mesh>
  )
}

/** 土星球體 */
function SaturnSphere({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null)

  const surfaceTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    // 建立土星表面的帶狀紋理
    for (let y = 0; y < 256; y++) {
      const t = y / 256
      const noise = Math.sin(t * 30) * 0.05 + Math.sin(t * 60) * 0.02

      if (isDark) {
        const r = Math.floor(180 + noise * 200 + Math.sin(t * 15) * 20)
        const g = Math.floor(160 + noise * 180 + Math.sin(t * 15) * 15)
        const b = Math.floor(100 + noise * 100 + Math.sin(t * 15) * 10)
        ctx.fillStyle = `rgb(${r},${g},${b})`
      } else {
        const r = Math.floor(220 + noise * 100 + Math.sin(t * 15) * 15)
        const g = Math.floor(200 + noise * 100 + Math.sin(t * 15) * 12)
        const b = Math.floor(160 + noise * 80 + Math.sin(t * 15) * 8)
        ctx.fillStyle = `rgb(${r},${g},${b})`
      }
      ctx.fillRect(0, y, 256, 1)
    }

    return new THREE.CanvasTexture(canvas)
  }, [isDark])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        map={surfaceTexture}
        roughness={isDark ? 0.7 : 0.9}
        metalness={isDark ? 0.1 : 0}
      />
    </mesh>
  )
}

/** 土星完整模型 */
export function SaturnModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.1) * 0.05 + 0.15
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[5, 1, -8]} rotation={[0.2, -0.3, 0.15]}>
        <SaturnSphere isDark={isDark} />
        <SaturnRing isDark={isDark} />

        {/* 土星發光效果（暗色模式） */}
        {isDark && (
          <pointLight
            position={[0, 0, 0]}
            intensity={0.5}
            distance={8}
            color="#c9a84c"
          />
        )}
      </group>
    </Float>
  )
}
