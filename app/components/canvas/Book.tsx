'use client'

import { useState } from 'react'
import Page from './Page'
import PostcardPage from './PostcardPage'
import Decoration from './Decorations'

// Enhanced pages data with postcard styling
const pagesData = [
  {
    type: 'cover' as const,
    front: {
      title: 'Welcome to',
      subtitle: 'My Scrapbook',
      message: 'Click to flip the page'
    },
    back: {
      title: 'Page 1',
      message: 'This is the back of the first page'
    }
  },
  {
    type: 'postcard' as const,
    title: 'I Text a postcard',
    sentMessage: 'to long randa',
    toField: 'your tenna',
    fromField: ''
  },
  {
    type: 'regular' as const,
    front: {
      title: 'Birthday',
      subtitle: 'Celebration',
      message: 'Happy memories'
    },
    back: {
      title: 'Wishes',
      message: 'May all your dreams come true'
    }
  },
  {
    type: 'regular' as const,
    front: {
      title: 'Night',
      subtitle: 'Reflections',
      message: 'Under the stars'
    },
    back: {
      title: 'Dreams',
      message: 'The world is quiet here'
    }
  }
]

const themes: Array<'default' | 'birthday' | 'postcard' | 'night'> = [
  'default', 'birthday', 'postcard', 'night'
]

// Background cards for stacked effect (decorative)
const stackedCards = [
  { color: '#3B5998', offset: [-0.4, 0.3], rotation: -0.15, scale: 0.95 }, // Blue card (left back)
  { color: '#E8E0D5', offset: [0.35, 0.2], rotation: 0.12, scale: 0.97 }, // Cream card (right back)
  { color: '#F5F0E6', offset: [-0.2, 0.15], rotation: -0.08, scale: 0.98 }, // Light cream (middle back)
]

export default function Book() {
  const [flippedPages, setFlippedPages] = useState<boolean[]>(new Array(pagesData.length).fill(false))
  const [currentPage, setCurrentPage] = useState(0)

  const handlePageFlip = (pageIndex: number) => {
    const newFlippedPages = [...flippedPages]
    newFlippedPages[pageIndex] = !newFlippedPages[pageIndex]
    setFlippedPages(newFlippedPages)

    // Update current page based on flip
    if (newFlippedPages[pageIndex] && pageIndex === currentPage) {
      setCurrentPage(Math.min(currentPage + 1, pagesData.length - 1))
    } else if (!newFlippedPages[pageIndex] && pageIndex < currentPage) {
      setCurrentPage(pageIndex)
    }
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Stacked background cards for depth effect */}
      {stackedCards.map((card, index) => (
        <mesh
          key={`bg-card-${index}`}
          position={[card.offset[0], card.offset[1], -0.8 - index * 0.15]}
          rotation={[0, 0, card.rotation]}
          scale={card.scale}
        >
          <boxGeometry args={[3.8, 4.8, 0.02]} />
          <meshStandardMaterial color={card.color} roughness={0.9} />
        </mesh>
      ))}

      {/* Book Base - Soft vintage brown */}
      <mesh position={[0, 0, -0.5]} receiveShadow>
        <boxGeometry args={[4.2, 5.2, 0.3]} />
        <meshStandardMaterial color="#A67B5B" roughness={0.8} />
      </mesh>

      {/* Book Spine */}
      <mesh position={[-2.1, 0, -0.35]} receiveShadow>
        <boxGeometry args={[0.2, 5.2, 0.6]} />
        <meshStandardMaterial color="#8B6B4F" roughness={0.8} />
      </mesh>

      {/* Decorative stickers on the side */}
      <Decoration
        type="vintagePhone"
        position={[2.3, -0.5, 0.1]}
        size={[0.7, 1.0, 0.02]}
        rotation={[0, 0, 0.1]}
      />

      <Decoration
        type="letterSticker"
        position={[2.0, -1.8, 0.05]}
        size={[0.35, 0.35, 0.008]}
        color="#E8D4B8"
        letter="h"
        rotation={[0, 0, -0.15]}
      />

      {/* Pages */}
      {pagesData.map((page, index) => {
        if (page.type === 'postcard') {
          return (
            <PostcardPage
              key={index}
              position={[0, 0, -0.3 + index * 0.02]}
              rotation={[0, 0, 0]}
              isFlipped={flippedPages[index]}
              onFlip={() => handlePageFlip(index)}
              pageIndex={index}
              title={page.title}
              sentMessage={page.sentMessage}
              toField={page.toField}
              fromField={page.fromField}
            />
          )
        }

        return (
          <Page
            key={index}
            position={[0, 0, -0.3 + index * 0.02]}
            rotation={[0, 0, 0]}
            content={{
              front: page.front!,
              back: page.back!
            }}
            theme={themes[index % themes.length]}
            isFlipped={flippedPages[index]}
            onFlip={() => handlePageFlip(index)}
            pageIndex={index}
          />
        )
      })}
    </group>
  )
}
