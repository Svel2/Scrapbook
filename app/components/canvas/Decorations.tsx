'use client'

import { useRef } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface DecorationProps {
  type: 'sticker' | 'washi' | 'photo' | 'stamp' | 'postmark' | 'vintagePhone' | 'letterSticker' | 'postcardBorder'
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number, number]
  color?: string
  text?: string
  letter?: string
}

export default function Decoration({
  type,
  position,
  rotation = [0, 0, 0],
  size = [0.5, 0.5, 0.01],
  color = '#FFC8DD',
  text,
  letter
}: DecorationProps) {
  const decorationRef = useRef<THREE.Mesh>(null)

  // Add slight random rotation for manual effect
  const randomZRotation = (Math.random() - 0.5) * 0.15

  switch (type) {
    case 'sticker':
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation]}>
          <mesh ref={decorationRef}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
          </mesh>
          {text && (
            <Text
              position={[0, 0, 0.006]}
              fontSize={0.15}
              color="#2D3250"
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </Text>
          )}
        </group>
      )

    case 'washi':
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation]}>
          <mesh ref={decorationRef}>
            <boxGeometry args={[size[0], size[1], 0.001]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.7}
              roughness={0.5}
            />
          </mesh>
        </group>
      )

    case 'photo':
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation]}>
          <mesh ref={decorationRef}>
            <boxGeometry args={size} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Photo frame */}
          <mesh position={[0, 0, -0.006]}>
            <boxGeometry args={[size[0] + 0.02, size[1] + 0.02, 0.01]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
        </group>
      )

    case 'stamp':
      // Vintage stamp with perforated edges look
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation * 0.5]}>
          {/* Outer perforated edge */}
          <mesh position={[0, 0, -0.001]}>
            <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.005]} />
            <meshStandardMaterial color="#E8DDD0" />
          </mesh>
          {/* Main stamp background */}
          <mesh ref={decorationRef}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color || '#E6C9D8'} />
          </mesh>
          {/* Stamp illustration area */}
          <mesh position={[0, 0, 0.003]}>
            <boxGeometry args={[size[0] * 0.7, size[1] * 0.6, 0.002]} />
            <meshStandardMaterial color="#F5EEF2" />
          </mesh>
          {/* Small decorative element */}
          <Text
            position={[0, 0, 0.006]}
            fontSize={0.08}
            color="#8B6B7B"
            anchorX="center"
            anchorY="middle"
          >
            ✿
          </Text>
        </group>
      )

    case 'postmark':
      // Simplified postmark using boxes instead of ring geometry
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + 0.15]}>
          {/* Circle represented with a bordered box */}
          <mesh ref={decorationRef}>
            <boxGeometry args={[size[0] * 0.8, size[1] * 0.8, 0.002]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.3} />
          </mesh>
          {/* Border lines */}
          <mesh position={[0, size[1] * 0.35, 0.001]}>
            <boxGeometry args={[size[0] * 0.7, 0.02, 0.001]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, -size[1] * 0.35, 0.001]}>
            <boxGeometry args={[size[0] * 0.7, 0.02, 0.001]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.6} />
          </mesh>
          {/* Horizontal lines through postmark */}
          <mesh position={[size[0] * 0.5, 0, 0.001]}>
            <boxGeometry args={[size[0] * 0.4, 0.015, 0.001]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.6} />
          </mesh>
          <mesh position={[size[0] * 0.5, 0.04, 0.001]}>
            <boxGeometry args={[size[0] * 0.35, 0.01, 0.001]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.6} />
          </mesh>
          <mesh position={[size[0] * 0.5, -0.04, 0.001]}>
            <boxGeometry args={[size[0] * 0.35, 0.01, 0.001]} />
            <meshStandardMaterial color="#8B7355" transparent opacity={0.6} />
          </mesh>
        </group>
      )

    case 'vintagePhone':
      // Pink vintage flip phone with question marks
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation * 0.3]}>
          {/* Phone body */}
          <mesh ref={decorationRef}>
            <boxGeometry args={[size[0], size[1], 0.02]} />
            <meshStandardMaterial color="#DDA0DD" />
          </mesh>
          {/* Screen area */}
          <mesh position={[0, size[1] * 0.15, 0.011]}>
            <boxGeometry args={[size[0] * 0.7, size[1] * 0.35, 0.005]} />
            <meshStandardMaterial color="#B8A9C9" />
          </mesh>
          {/* Question marks */}
          <Text
            position={[-size[0] * 0.15, size[1] * 0.35, 0.015]}
            fontSize={0.12}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            ?
          </Text>
          <Text
            position={[size[0] * 0.15, size[1] * 0.35, 0.015]}
            fontSize={0.12}
            color="#4169E1"
            anchorX="center"
            anchorY="middle"
          >
            ?
          </Text>
          {/* Dial/wheel in middle - using box instead of circle */}
          <mesh position={[0, size[1] * 0.15, 0.015]}>
            <boxGeometry args={[size[0] * 0.25, size[0] * 0.25, 0.005]} />
            <meshStandardMaterial color="#A9A9A9" />
          </mesh>
          {/* Buttons area */}
          <mesh position={[0, -size[1] * 0.25, 0.011]}>
            <boxGeometry args={[size[0] * 0.6, size[1] * 0.2, 0.005]} />
            <meshStandardMaterial color="#C8B8D8" />
          </mesh>
          {/* MENU and HOME labels */}
          <Text
            position={[-size[0] * 0.2, -size[1] * 0.15, 0.015]}
            fontSize={0.04}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            MENU
          </Text>
          <Text
            position={[size[0] * 0.2, -size[1] * 0.15, 0.015]}
            fontSize={0.04}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            HOME
          </Text>
        </group>
      )

    case 'letterSticker':
      // Cute letter sticker
      return (
        <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + randomZRotation]}>
          {/* Sticker background */}
          <mesh ref={decorationRef}>
            <boxGeometry args={[size[0], size[1], 0.008]} />
            <meshStandardMaterial color={color || '#F5DEB3'} />
          </mesh>
          {/* Letter */}
          <Text
            position={[0, 0, 0.01]}
            fontSize={size[0] * 0.6}
            color="#8B4513"
            anchorX="center"
            anchorY="middle"
          >
            {letter || 'h'}
          </Text>
        </group>
      )

    case 'postcardBorder':
      // Red and white striped border (corner piece)
      const stripeCount = 5
      const stripeWidth = size[0] / stripeCount
      return (
        <group position={position} rotation={rotation}>
          {Array.from({ length: stripeCount }).map((_, i) => (
            <mesh key={i} position={[(i - stripeCount / 2 + 0.5) * stripeWidth, 0, 0]}>
              <boxGeometry args={[stripeWidth * 0.9, size[1], 0.002]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#C41E3A' : '#FFFFFF'} />
            </mesh>
          ))}
        </group>
      )

    default:
      return null
  }
}
