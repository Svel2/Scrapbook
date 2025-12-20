'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, SoftShadows } from '@react-three/drei'
import { Suspense } from 'react'
import Book from './Book'

export default function Experience() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0, 6],
        fov: 45
      }}
      gl={{
        antialias: true,
        toneMappingExposure: 1.1
      }}
    >
      <Suspense fallback={null}>
        {/* Soft, warm lighting for vintage feel */}
        <ambientLight intensity={0.6} color="#FFF8E7" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          color="#FFFAF0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <spotLight
          position={[-5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.4}
          color="#FFE4C4"
          castShadow
        />
        <pointLight position={[0, 3, 2]} intensity={0.25} color="#FFF5E6" />

        {/* Subtle fill light from below */}
        <pointLight position={[0, -2, 3]} intensity={0.15} color="#E6D5C3" />

        {/* Soft Shadows for realistic depth */}
        <SoftShadows size={15} samples={10} focus={0.5} />

        {/* Environment for subtle reflections */}
        <Environment preset="apartment" />

        {/* Main Book Component */}
        <Book />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  )
}
