import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Star from './Star'
import Planet from './Planet'
import Starfield from './Starfield'

export default function Scene({ user, posts, onPlanetHover, onPlanetUnhover, onPlanetClick }) {
  const starPosition = [0, 0, 0]

  return (
    <Canvas
      camera={{ position: [0, 8, 20], fov: 60, near: 0.1, far: 500 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <color attach="background" args={['#0a0612']} />
      <fog attach="fog" args={['#0a0612', 50, 200]} />

      <ambientLight intensity={0.15} />

      <Star position={starPosition} size={3} color="#FFD080" glowColor="#FF6B35" />

      {posts.map((post, i) => (
        <Planet
          key={post.objectId}
          post={post}
          index={i}
          starPosition={starPosition}
          onHover={onPlanetHover}
          onUnhover={onPlanetUnhover}
          onClick={onPlanetClick}
        />
      ))}

      <Starfield count={2000} radius={150} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={80}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}