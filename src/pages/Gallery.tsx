import React, { useRef, useState } from 'react'
import { Masonry } from 'antd'
import anime from 'animejs'
import { useEffect } from 'react'
import { getGalleryImages } from '../services/api'
import { NoPhoto } from '../components/ui/NoPhoto'
import { GalleryItem } from '../components/ui/GalleryItem'

export type GalleryImage = {
  url: string
  isLivePhoto: boolean
  videoUrl?: string
}

export const Gallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [imageList, setImageList] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryImages().then(imgs => {
      setImageList(imgs)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (loading) return
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000,
    })

    timeline.add({
      targets: galleryRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 300,
    })
  }, [loading])

  if (loading) return <LoadingFramework />

  return (
    <div ref={galleryRef} className="max-w-full px-8 pt-24 pb-12 opacity-0">
      {imageList.length === 0 ? (
        <NoPhoto />
      ) : (
        <Masonry
          columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
          gutter={16}
          items={imageList.map((img, index) => ({
            key: `item-${index}`,
            data: img,
          }))}
          itemRender={({ data }) => <GalleryItem data={data} />}
        />
      )}
    </div>
  )
}

//加载骨架屏
const LoadingFramework = () => {
  return (
    <div className="max-w-full px-8 pt-24 pb-12">
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
        {[
          280, 180, 340, 220, 300, 160, 260, 320, 200, 240, 190, 310, 170, 290,
          350,
        ].map((h, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: h,
              borderRadius: '10px',
              marginBottom: '16px',
              breakInside: 'avoid',
              background:
                'linear-gradient(110deg, #1a1a1a 30%, #2a2a2a 50%, #1a1a1a 70%)',
              backgroundSize: '200% 100%',
              animation: `shimmer 1.6s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
