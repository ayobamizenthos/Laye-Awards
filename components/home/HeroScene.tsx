'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Float } from '@react-three/drei'
import * as THREE from 'three'

function AwardStar({ animate }: { animate: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!animate) return
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [animate])

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const outer = 1
    const inner = 0.4
    const points = 5
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outer : inner
      const angle = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.11,
      bevelSegments: 6,
      curveSegments: 24,
    })
    geo.center()
    return geo
  }, [])

  useFrame((_, delta) => {
    const node = mesh.current
    if (!node || !animate) return

    node.rotation.z += delta * 0.16
    node.rotation.x += (pointer.current.y * 0.26 - node.rotation.x) * 0.05
    node.rotation.y += (pointer.current.x * 0.32 - node.rotation.y) * 0.05
  })

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[0.04, 0.12, 0]} scale={0.92}>
      <meshStandardMaterial
        color="#d8b65a"
        metalness={1}
        roughness={0.2}
        envMapIntensity={2}
        emissive="#5a3f12"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

export default function HeroScene({ animate = true }: { animate?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: 42 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#6e2e88" />

      <Float
        speed={animate ? 1.5 : 0}
        rotationIntensity={animate ? 0.35 : 0}
        floatIntensity={animate ? 0.55 : 0}
      >
        <AwardStar animate={animate} />
      </Float>

      <Environment resolution={256}>
        <Lightformer intensity={3.4} position={[0, 2, 4]} scale={[9, 9, 1]} />
        <Lightformer intensity={2.6} color="#f1d588" position={[-4, -1, 3]} scale={[6, 6, 1]} />
        <Lightformer intensity={2} color="#cba94e" position={[4, 1, 2]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.3} color="#9a52b6" position={[0, -3, -2]} scale={[6, 6, 1]} />
      </Environment>
    </Canvas>
  )
}
