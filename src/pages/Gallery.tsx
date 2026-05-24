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

const PAGE_SIZE = 15

export const Gallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryImages().then(imgs => {
      setAllImages(imgs)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, allImages.length))
        }
      },
      { threshold: 0.1 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loading, allImages.length])

  useEffect(() => {
    if (loading) return
    anime.timeline({ easing: 'easeOutExpo', duration: 1000 }).add({
      targets: galleryRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 300,
    })
  }, [loading])

  const visibleImages = allImages.slice(0, visibleCount)

  if (loading) return <LoadingFramework />

  return (
    <div ref={galleryRef} className="max-w-full px-8 pt-24 pb-10 opacity-0">
      {allImages.length === 0 ? (
        <NoPhoto />
      ) : (
        <>
          <Masonry
            columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
            gutter={16}
            items={visibleImages.map((img, index) => ({
              key: `item-${index}`,
              data: img,
            }))}
            itemRender={({ data }) => <GalleryItem data={data} />}
          />
          {visibleCount < allImages.length && (
            <div ref={sentinelRef} className="h-16" />
          )}
          {visibleCount === allImages.length && allImages.length > 0 && (
            <p className="mt-14 text-center text-base font-medium text-neutral-500">
              到底啦😁
            </p>
          )}
        </>
      )}
    </div>
  )
}

//加载骨架屏
const LoadingFramework = () => {
  return (
    <div className="max-w-full px-8 pt-24 pb-12">
      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
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
