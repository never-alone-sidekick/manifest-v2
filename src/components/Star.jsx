import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export default function Star({ position = [0, 0, 0], size = 3, color = '#FFD080', glowColor = '#FF6B35' }) {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 1.5) * 0.08
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(pulse * 1.2)
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.05
    }
  })

  const glowMaterial = useMemo(() => new THREE.SpriteMaterial({
    map: createGlowTexture(color, glowColor),
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [color, glowColor])

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[size * 0.3, 16, 16]}>
        <meshBasicMaterial color={color} />
      </Sphere>

      <sprite ref={glowRef} scale={[size * 4, size * 4, 1]} material={glowMaterial} />

      <pointLight color={color} intensity={2} distance={30} decay={2} />
    </group>
  )
}

function createGlowTexture(coreColor, outerColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, coreColor)
  gradient.addColorStop(0.3, outerColor)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}