'use client'

import { useRef, useEffect } from 'react'
import { Group } from 'three'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import Decoration from './Decorations'

interface PageProps {
  position: [number, number, number]
  rotation: [number, number, number]
  content: {
    front: { title: string; subtitle?: string; message: string }
    back: { title: string; message: string }
  }
  theme: 'default' | 'birthday' | 'postcard' | 'night'
  isFlipped: boolean
  onFlip: () => void
  pageIndex: number
}

const themeColors = {
  default: '#F8F9FA',
  birthday: '#A2D2FF',
  postcard: '#FFF8E7',
  night: '#1B263B'
}

const textColors = {
  default: '#2D3250',
  birthday: '#1B263B',
  postcard: '#2D3250',
  night: '#F8F9FA'
}

export default function Page({ 
  position, 
  rotation, 
  content, 
  theme, 
  isFlipped, 
  onFlip,
  pageIndex 
}: PageProps) {
  const pageRef = useRef<Group>(null)
  const backContentRef = useRef<Group>(null)
  
  useEffect(() => {
    if (pageRef.current) {
      gsap.to(pageRef.current.rotation, {
        y: isFlipped ? Math.PI : 0,
        duration: 0.8,
        ease: "power2.inOut"
      })
    }
    
    if (backContentRef.current) {
      gsap.to(backContentRef.current.rotation, {
        y: isFlipped ? 0 : Math.PI,
        duration: 0.8,
        ease: "power2.inOut"
      })
    }
  }, [isFlipped])

  const handleClick = (event: any) => {
    event.stopPropagation()
    onFlip()
  }

  // Generate decorations based on page index
  const generateDecorations = (side: 'front' | 'back') => {
    const decorations = []
    const seed = pageIndex * 10 + (side === 'front' ? 0 : 5)
    
    // Add stickers
    decorations.push(
      <Decoration
        key={`${side}-sticker-1`}
        type="sticker"
        position={[-1.2 + (seed % 3) * 0.5, 1.2 - (seed % 2) * 0.5, 0.011]}
        color={seed % 2 === 0 ? '#FFC8DD' : '#EF233C'}
        text="♥"
        size={[0.3, 0.3, 0.01]}
      />
    )
    
    // Add washi tape
    decorations.push(
      <Decoration
        key={`${side}-washi-1`}
        type="washi"
        position={[1.3, 0.5, 0.011]}
        color={theme === 'birthday' ? '#FFC8DD' : '#A2D2FF'}
        size={[0.8, 0.15, 0.001]}
        rotation={[0, 0, Math.PI / 6]}
      />
    )
    
    // Add photo for certain pages
    if (pageIndex === 1 || pageIndex === 2) {
      decorations.push(
        <Decoration
          key={`${side}-photo-1`}
          type="photo"
          position={[0, -1.5, 0.011]}
          size={[1.2, 0.8, 0.01]}
        />
      )
    }
    
    return decorations
  }

  return (
    <group position={position} rotation={rotation}>
      <group ref={pageRef} onClick={handleClick}>
        <mesh>
          <boxGeometry args={[3.8, 4.8, 0.02]} />
          <meshStandardMaterial color={themeColors[theme]} />
        </mesh>
        
        {/* Front Content - Child of rotating mesh */}
        <group position={[0, 0, 0.011]} rotation={[0, 0, 0]}>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color={textColors[theme]}
            anchorX="center"
            anchorY="middle"
          >
            {content.front.title}
          </Text>
          {content.front.subtitle && (
            <Text
              position={[0, 1, 0]}
              fontSize={0.25}
              color="#EF233C"
              anchorX="center"
              anchorY="middle"
            >
              {content.front.subtitle}
            </Text>
          )}
          <Text
            position={[0, -1, 0]}
            fontSize={0.2}
            color={textColors[theme]}
            anchorX="center"
            anchorY="middle"
          >
            {content.front.message}
          </Text>
          {/* Front Decorations */}
          {generateDecorations('front')}
        </group>
      </group>
      
      {/* Back Content - Separate group with counter-rotation */}
      <group ref={backContentRef}>
        <group position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color={textColors[theme]}
            anchorX="center"
            anchorY="middle"
          >
            {content.back.title}
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color={textColors[theme]}
            anchorX="center"
            anchorY="middle"
          >
            {content.back.message}
          </Text>
          {/* Back Decorations */}
          {generateDecorations('back')}
        </group>
      </group>
    </group>
  )
}
