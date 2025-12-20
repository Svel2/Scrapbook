'use client'

import { useRef, useState, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

// Individual page component - must use forwardRef for react-pageflip
const Page = React.forwardRef<HTMLDivElement, {
    children: React.ReactNode
    className?: string
}>(({ children, className = '' }, ref) => {
    return (
        <div ref={ref} className={`page ${className}`}>
            {children}
        </div>
    )
})
Page.displayName = 'Page'

// Page content data
const pagesContent = [
    // Cover
    {
        type: 'cover',
        title: 'My Scrapbook',
        subtitle: '2024 Memories'
    },
    // Page 1
    {
        type: 'content',
        header: 'SKETCH',
        title: 'Your Visual Library',
        content: 'A collection of moments, ideas, and memories gathered through time.',
        notes: [
            { color: 'yellow', text: 'Remember this!', style: { top: '50%', left: '10%' } },
            { color: 'green', text: 'Ideas ✨', style: { top: '65%', right: '15%' } }
        ]
    },
    // Page 2
    {
        type: 'content',
        header: 'PAGE 01',
        title: 'Getting Started',
        content: 'Every journey begins with a single page. This scrapbook holds your precious memories.',
        notes: []
    },
    // Page 3
    {
        type: 'content',
        header: 'MEMORIES',
        title: 'Birthday Celebration',
        content: 'Another year, another adventure. Celebrating life with those who matter most.',
        notes: [
            { color: 'blue', text: '🎂 Party!', style: { top: '55%', right: '10%' } }
        ]
    },
    // Page 4
    {
        type: 'content',
        header: 'PAGE 02',
        title: 'Special Moments',
        content: 'The best things in life are the people we love, the places we\'ve been, and the memories we\'ve made.',
        notes: []
    },
    // Page 5
    {
        type: 'content',
        header: 'NOTES',
        title: 'Dreams & Goals',
        content: 'Write down your dreams. They become goals. Goals become plans. Plans become reality.',
        notes: [
            { color: 'green', text: '2024 Goals', style: { top: '55%', left: '15%' } }
        ]
    },
    // Page 6
    {
        type: 'content',
        header: 'PAGE 03',
        title: 'Reflections',
        content: 'Take time to reflect on how far you\'ve come. Every step matters.',
        notes: [
            { color: 'yellow', text: '★ ★ ★', style: { bottom: '20%', left: '20%' } }
        ]
    },
    // Back Cover
    {
        type: 'back-cover',
        title: 'The End',
        subtitle: 'More memories to come...'
    }
]

export default function Scrapbook() {
    const bookRef = useRef<any>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const totalPages = pagesContent.length

    const onFlip = useCallback((e: any) => {
        setCurrentPage(e.data)
    }, [])

    const goToPrevious = () => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipPrev()
        }
    }

    const goToNext = () => {
        if (bookRef.current) {
            bookRef.current.pageFlip().flipNext()
        }
    }

    return (
        <div className="app-container">
            {/* Journal Info */}
            <div className="journal-info">
                <h1 className="journal-title">Scrapbook</h1>
                <p className="journal-pages">
                    <span>📖</span>
                    {totalPages} Pages
                </p>
            </div>

            {/* Book Container */}
            <div className="book-container">
                {/* @ts-ignore - react-pageflip types issue */}
                <HTMLFlipBook
                    ref={bookRef}
                    width={320}
                    height={450}
                    size="stretch"
                    minWidth={150}
                    maxWidth={400}
                    minHeight={200}
                    maxHeight={550}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="flipbook"
                    style={{}}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={600}
                    usePortrait={false}
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={0.5}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    swipeDistance={30}
                    clickEventForward={true}
                    useMouseEvents={true}
                >
                    {pagesContent.map((page, index) => (
                        <Page key={index} className={page.type === 'cover' || page.type === 'back-cover' ? 'cover-page' : 'content-page'}>
                            {page.type === 'cover' && (
                                <div className="cover-content">
                                    <div className="cover-decoration">✨</div>
                                    <h1 className="cover-title">{page.title}</h1>
                                    <p className="cover-subtitle">{page.subtitle}</p>
                                    <div className="cover-decoration bottom">📖</div>
                                </div>
                            )}

                            {page.type === 'back-cover' && (
                                <div className="cover-content back">
                                    <h1 className="cover-title">{page.title}</h1>
                                    <p className="cover-subtitle">{page.subtitle}</p>
                                </div>
                            )}

                            {page.type === 'content' && (
                                <div className="page-content lined-paper">
                                    <span className="page-header">{page.header}</span>
                                    <h2 className="page-title">{page.title}</h2>
                                    <p className="page-text">{page.content}</p>

                                    {page.notes?.map((note, i) => (
                                        <div
                                            key={i}
                                            className={`sticky-note ${note.color}`}
                                            style={note.style as React.CSSProperties}
                                        >
                                            {note.text}
                                        </div>
                                    ))}

                                    <div className="page-decoration">
                                        <div className="page-dot"></div>
                                        <div className="page-dot"></div>
                                        <div className="page-dot"></div>
                                    </div>
                                </div>
                            )}
                        </Page>
                    ))}
                </HTMLFlipBook>
            </div>

            {/* Navigation */}
            <div className="nav-controls">
                <button
                    className="nav-btn"
                    onClick={goToPrevious}
                    disabled={currentPage === 0}
                >
                    <ChevronLeft size={18} />
                    Previous
                </button>
                <span className="page-indicator">
                    {currentPage + 1} / {totalPages}
                </span>
                <button
                    className="nav-btn"
                    onClick={goToNext}
                    disabled={currentPage >= totalPages - 1}
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
