import React, { lazy, Suspense, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import anime from 'animejs'
import { scheduleHeicDecode } from '../../lib/heicDecodeQueue'
import type { GalleryImage } from '../../pages/Gallery'

const LivePhotoPlayer = lazy(() =>
  import('./LivePhotoPlayer').then(({ LivePhotoPlayer }) => ({
    default: LivePhotoPlayer,
  }))
)

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const GalleryItem = ({ data }: { data: GalleryImage }) => {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const blobUrlRef = useRef<string | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [conversionError, setConversionError] = useState(false)

  const filename = data.url.split('photograph/')[1] ?? ''
  const alt = decodeURIComponent(filename.replace(/\.[^.]+$/, ''))

  const [photoSrc, setPhotoSrc] = useState<string | null>(
    data.isLivePhoto ? (isSafari ? data.url : null) : null
  )
  const [aspectRatio, setAspectRatio] = useState<string>('3/4')

  useEffect(() => {
    if (!data.isLivePhoto || !previewRef.current) return
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(previewRef.current)
    return () => observer.disconnect()
  }, [data.url, data.isLivePhoto])

  useEffect(() => {
    if (!data.isLivePhoto || !isNearViewport) return

    if (isSafari) {
      const img = new Image()
      img.onload = () =>
        setAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`)
      img.src = data.url
      return () => {
        img.onload = null
        img.src = ''
      }
    }

    const controller = new AbortController()
    const { signal } = controller
    setConversionError(false)

    scheduleHeicDecode(async () => {
      const photoUrl = new URL(data.url)
      const storageOrigin = new URL(import.meta.env.VITE_SUPABASE_URL).origin
      if (
        photoUrl.origin !== storageOrigin ||
        !photoUrl.pathname.startsWith('/storage/v1/object/public/photograph/')
      ) {
        throw new Error('无效的照片地址')
      }
      const response = await fetch(photoUrl, { signal })
      if (!response.ok) throw new Error(`下载失败: ${response.status}`)
      const buffer = await response.arrayBuffer()
      if (!buffer.byteLength) throw new Error('HEIC 文件为空')
      if (signal.aborted) return

      const { default: libheif } = await import('libheif-js/wasm-bundle')
      if (signal.aborted) return
      const images = new libheif.HeifDecoder().decode(new Uint8Array(buffer))
      if (!images.length) throw new Error('HEIC 解码失败：未找到图片数据')

      const image = images[0]
      const width = image.get_width()
      const height = image.get_height()
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('无法创建 Canvas 上下文')
      const imageData = ctx.createImageData(width, height)
      await new Promise<void>((resolve, reject) => {
        image.display(imageData, (displayData: ImageData | null) => {
          if (!displayData) return reject(new Error('HEIF 渲染失败'))
          resolve()
        })
      })
      if (signal.aborted) return
      ctx.putImageData(imageData, 0, 0)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          b => (b ? resolve(b) : reject(new Error('Canvas 导出失败'))),
          'image/jpeg',
          0.9
        )
      })
      if (signal.aborted) return
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      setAspectRatio(`${width}/${height}`)
      setPhotoSrc(url)
    }, signal).catch(err => {
      if (signal.aborted) return
      console.error('HEIC 转换失败:', err)
      setConversionError(true)
    })

    return () => {
      controller.abort()
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [data.url, data.isLivePhoto, isNearViewport])

  useEffect(() => {
    if (open && overlayRef.current) {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 200,
        easing: 'easeOutExpo',
      })
      if (imgRef.current) {
        anime({
          targets: imgRef.current,
          scale: [0.95, 1],
          duration: 300,
          easing: 'easeOutExpo',
        })
      }
    }
  }, [open])

  // 非实况照片：保持现有逻辑
  if (!data.isLivePhoto) {
    return (
      <>
        <div
          className="cursor-pointer rounded-lg border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:scale-101"
          onClick={() => setOpen(true)}
        >
          <img
            src={data.url}
            alt={alt}
            loading="lazy"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
        {open &&
          createPortal(
            <div
              ref={overlayRef}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                opacity: 0,
                pointerEvents: 'auto',
              }}
              onClick={() => setOpen(false)}
            >
              <button
                className="absolute top-4 right-4 z-10 text-3xl leading-none text-white"
                onClick={() => setOpen(false)}
                aria-label="关闭"
              >
                ×
              </button>
              <img
                ref={imgRef}
                src={data.url}
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

  // 实况照片
  return (
    <>
      <div
        ref={previewRef}
        className="cursor-pointer rounded-lg border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:scale-101"
        onClick={() => {
          if (photoSrc) setOpen(true)
        }}
      >
        {photoSrc && isNearViewport ? (
          <Suspense
            fallback={
              <div
                className="animate-pulse bg-neutral-800"
                style={{ aspectRatio }}
              />
            }
          >
            <LivePhotoPlayer
              photoUrl={photoSrc}
              videoUrl={data.videoUrl!}
              style={{
                width: '100%',
                aspectRatio,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            />
          </Suspense>
        ) : (
          <div
            className="animate-pulse"
            style={{
              width: '100%',
              aspectRatio,
              borderRadius: '8px',
              background:
                'linear-gradient(110deg, #1a1a1a 30%, #2a2a2a 50%, #1a1a1a 70%)',
              backgroundSize: '200% 100%',
            }}
          >
            {conversionError && (
              <span className="text-white">照片加载失败</span>
            )}
          </div>
        )}
      </div>
      {open &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              opacity: 0,
              pointerEvents: 'auto',
            }}
            onClick={() => setOpen(false)}
          >
            <button
              className="absolute top-4 right-4 z-10 text-3xl leading-none text-white"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              ×
            </button>
            <div
              onClick={e => e.stopPropagation()}
              style={{
                height: '95vh',
                maxWidth: '90vw',
                aspectRatio,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {photoSrc && (
                <Suspense
                  fallback={
                    <div className="h-full w-full animate-pulse bg-neutral-800" />
                  }
                >
                  <LivePhotoPlayer
                    photoUrl={photoSrc}
                    videoUrl={data.videoUrl!}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
