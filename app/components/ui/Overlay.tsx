'use client'

import { MoreHorizontal, Share2, Trash2, Plus } from 'lucide-react'

export default function Overlay() {
  const handleMore = () => {
    console.log('More options')
  }

  const handleShare = () => {
    console.log('Share scrapbook')
  }

  const handleDelete = () => {
    console.log('Delete page')
  }

  const handleAdd = () => {
    console.log('Add new page')
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 flex flex-col items-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-handwriting)' }}>
          hbd boyy 🤍
        </h1>
        <p className="text-sm text-white/80">11 Pages</p>
      </header>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            <button
              onClick={handleMore}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={handleAdd}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Add"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
