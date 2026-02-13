'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, Cloud } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

/** 流星效果 */
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)
  const speed = useRef(0)
  const startPosition = useRef(new THREE.Vector3())

  const resetStar = () => {
    if (!ref.current || !trailRef.current) return
    startPosition.current.set(
      (Math.random() - 0.5) * 40,
      Math.random() * 15 + 10,
      (Math.random() - 0.5) * 20 - 10
    )
    ref.current.position.copy(startPosition.current)
    trailRef.current.position.copy(startPosition.current)
    speed.current = Math.random() * 0.8 + 0.4
  }

  useFrame(() => {
    if (!ref.current || !trailRef.current) return
    if (speed.current === 0) {
      if (Math.random() < 0.002) resetStar()
      return
    }
    ref.current.position.x += speed.current * 0.6
    ref.current.position.y -= speed.current
    trailRef.current.position.lerp(ref.current.position, 0.3)

    if (ref.current.position.y < -15) {
      speed.current = 0
      ref.current.position.set(0, 100, -50)
      trailRef.current.position.set(0, 100, -50)
    }
  })

  return (
    <group>
      <mesh ref={ref} position={[0, 100, -50]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={trailRef} position={[0, 100, -50]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/** 滑鼠視差相機控制 */
function MouseParallax() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.08 - target.current.x) * 0.05
    target.current.y += (mouse.current.y * 0.05 - target.current.y) * 0.05

    camera.rotation.y = -target.current.x
    camera.rotation.x = -target.current.y
  })

  return null
}

/** 自訂閃爍星星粒子 */
function TwinklingParticles({
  count = 300,
  isDark,
}: {
  count?: number
  isDark: boolean
}) {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const op = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80
      sz[i] = Math.random() * 2 + 0.5
      op[i] = Math.random()
    }
    return { positions: pos, sizes: sz, opacities: op }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const time = clock.getElapsedTime()
    const sizeAttr = ref.current.geometry.attributes.size
    if (!sizeAttr) return
    const sizeArray = sizeAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      sizeArray[i] =
        sizes[i] * (0.8 + 0.4 * Math.sin(time * (0.5 + opacities[i]) + i))
    }
    sizeAttr.needsUpdate = true
  })

  const color = isDark ? '#ffffff' : '#c9a84c'

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={isDark ? 0.9 : 0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** 星空場景主元件 */
export function StarField() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <MouseParallax />
      <ambientLight intensity={isDark ? 0.1 : 0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={isDark ? 0.3 : 0.8}
      />

      {/* 背景星星（drei 內建） */}
      <Stars
        radius={100}
        depth={60}
        count={isDark ? 5000 : 2000}
        factor={isDark ? 4 : 2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* 自訂閃爍粒子 */}
      <TwinklingParticles isDark={isDark} />

      {/* 星雲效果 */}
      <Cloud
        position={[-15, 5, -20]}
        speed={0.1}
        opacity={isDark ? 0.15 : 0.3}
        color={isDark ? '#4a3a8a' : '#e8e0f0'}
        segments={20}
      />
      <Cloud
        position={[15, -3, -25]}
        speed={0.08}
        opacity={isDark ? 0.1 : 0.25}
        color={isDark ? '#2a4a7a' : '#d0e0f0'}
        segments={15}
      />

      {/* 流星 */}
      <ShootingStar />
      <ShootingStar />
      <ShootingStar />
    </>
  )
}
