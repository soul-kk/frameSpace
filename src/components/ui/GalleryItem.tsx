import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export const GalleryItem = ({ data }: { data: string }) => {
  const [open, setOpen] = useState(false)
  const alt = decodeURIComponent(data.split('photograph/')[1].split('.JPG')[0])

  return (
    <>
      <div
        className="cursor-pointer rounded-lg border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:scale-101"
        onClick={() => setOpen(true)}
      >
        <img src={data} alt={alt} style={{ width: '100%', borderRadius: '8px' }} />
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(false)}
          >
            <img
              src={data}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </>
  )
}
