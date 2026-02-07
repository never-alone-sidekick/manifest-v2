import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Ring } from '@react-three/drei'
import * as THREE from 'three'

const PLANET_COLORS = ['#4A6FA5', '#6B5B95', '#2E8B8B', '#8B6B4A', '#5B7B5B', '#7B5B8B', '#4A7B7B', '#8B7B5B']

export default function Planet({ post, index, starPosition = [0, 0, 0], onHover, onUnhover, onClick }) {
  const groupRef = useRef()
  const meshRef = useRef()

  const orbitRadius = 4 + index * 2.5
  const orbitSpeed = 0.15 + (index * 0.05)
  const orbitTilt = (index % 3 - 1) * 0.3
  const planetSize = 0.3 + Math.log2(1 + (post.commentCount || 0)) * 0.15
  const color = PLANET_COLORS[index % PLANET_COLORS.length]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const angle = t * orbitSpeed + index * Math.PI * 0.6

    if (groupRef.current) {
      groupRef.current.position.x = starPosition[0] + Math.cos(angle) * orbitRadius
      groupRef.current.position.y = starPosition[1] + Math.sin(orbitTilt) * Math.sin(angle) * orbitRadius * 0.3
      groupRef.current.position.z = starPosition[2] + Math.sin(angle) * orbitRadius
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5
    }
  })

  return (
    <>
      <group position={starPosition} rotation={[orbitTilt, 0, 0]}>
        <Ring args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]}>
          <meshBasicMaterial color="white" transparent opacity={0.04} side={THREE.DoubleSide} />
        </Ring>
      </group>

      <group ref={groupRef}>
        <Sphere
          ref={meshRef}
          args={[planetSize, 16, 16]}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
            onHover?.(post, e)
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = 'auto'
            onUnhover?.()
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.(post)
          }}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.2}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </Sphere>
      </group>
    </>
  )
}