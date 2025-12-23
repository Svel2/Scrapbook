'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
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

// Page data - each page has an image
// Replace these with your actual image paths
const pagesData = [
    // Cover
    {
        type: 'cover',
        title: 'Scrapbook Birthday for My Best Friend',
        subtitle: ''
    },
    // Image pages - replace src with your PNG/image paths
    {
        type: 'image',
        src: '/images/page1.gif', // Put your images in public/images/
        alt: 'Page 1'
    },
    {
        type: 'image',
        src: '/images/page 3.gif',
        alt: 'Page 2'
    },
    {
        type: 'image',
        src: '/images/page2.gif',
        alt: 'Page 3'
    },
    {
        type: 'image',
        src: '/images/page1.gif',
        alt: 'Page 4'
    },
    {
        type: 'image',
        src: '/images/page2.gif',
        alt: 'Page 5'
    },
    {
        type: 'image',
        src: '/images/page 3.gif',
        alt: 'Page 6'
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
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const totalPages = pagesData.length

    // Detect screen size for responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth
            // Single page mode ONLY for phone screens <= 768px
            setIsMobile(width <= 768)
            // Tablet size for screens between 768px and 1024px (uses double-page spread)
            setIsTablet(width > 768 && width <= 1024)
        }

        // Check on mount
        checkScreenSize()

        // Add resize listener
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

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


            {/* Book Container */}
            <div className="book-container">
                {/* @ts-ignore - react-pageflip types issue */}
                <HTMLFlipBook
                    ref={bookRef}
                    width={isTablet ? 300 : isMobile ? 280 : 365}
                    height={isTablet ? 400 : isMobile ? 420 : 475}
                    size="stretch"
                    minWidth={isTablet ? 250 : isMobile ? 250 : 150}
                    maxWidth={isTablet ? 380 : isMobile ? 350 : 480}
                    minHeight={isTablet ? 340 : isMobile ? 375 : 200}
                    maxHeight={isTablet ? 500 : isMobile ? 550 : 620}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="flipbook"
                    style={{}}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={600}
                    usePortrait={isMobile}
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={0.5}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    swipeDistance={30}
                    clickEventForward={true}
                    useMouseEvents={true}
                >
                    {pagesData.map((page, index) => (
                        <Page
                            key={index}
                            className={
                                page.type === 'cover' || page.type === 'back-cover'
                                    ? 'cover-page'
                                    : 'image-page'
                            }
                        >
                            {/* Cover Page */}
                            {page.type === 'cover' && (
                                <div className="cover-content">
                                    <div className="cover-decoration">✨</div>
                                    <h1 className="cover-title">{page.title}</h1>
                                    <p className="cover-subtitle">{page.subtitle}</p>
                                    <div className="cover-decoration bottom">❤️</div>
                                </div>
                            )}

                            {/* Back Cover */}
                            {page.type === 'back-cover' && (
                                <div className="cover-content back">
                                    <h1 className="cover-title">{page.title}</h1>
                                    <p className="cover-subtitle">{page.subtitle}</p>
                                </div>
                            )}

                            {/* Image Page */}
                            {page.type === 'image' && (
                                <div className="image-page-content">
                                    <img
                                        src={page.src}
                                        alt={page.alt}
                                        className="page-image"
                                        onError={(e) => {
                                            // Show placeholder if image not found
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                            target.parentElement!.classList.add('no-image')
                                        }}
                                    />
                                    <div className="image-placeholder">
                                        <span className="placeholder-icon">🖼️</span>
                                        <span className="placeholder-text">Add your image</span>
                                        <span className="placeholder-path">{page.src}</span>
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
