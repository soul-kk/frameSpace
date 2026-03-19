import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import anime from 'animejs'
import libheif from 'libheif-js/wasm-bundle'
import { LivePhotoPlayer } from './LivePhotoPlayer'
import type { GalleryImage } from '../../pages/Gallery'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const GalleryItem = ({ data }: { data: GalleryImage }) => {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const blobUrlRef = useRef<string | null>(null)

  const filename = data.url.split('photograph/')[1] ?? ''
  const alt = decodeURIComponent(filename.replace(/\.[^.]+$/, ''))

  const [photoSrc, setPhotoSrc] = useState<string | null>(
    data.isLivePhoto ? (isSafari ? data.url : null) : null
  )
  const [aspectRatio, setAspectRatio] = useState<string>('3/4')

  useEffect(() => {
    if (!data.isLivePhoto) return

    if (isSafari) {
      const img = new Image()
      img.onload = () =>
        setAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`)
      img.src = data.url
      return
    }

    let cancelled = false

    const convert = async () => {
      const response = await fetch(data.url)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`下载失败: ${response.status} - ${errorText}`)
      }

      const buffer = await response.arrayBuffer()
      if (buffer.byteLength === 0) {
        throw new Error(
          '下载的文件内容无效，请检查 Supabase 权限或链接是否失效'
        )
      }

      const decoder = new libheif.HeifDecoder()
      const images = decoder.decode(new Uint8Array(buffer))
      if (!images.length) throw new Error('HEIC 解码失败：未找到图片数据')

      const image = images[0]
      const width = image.get_width()
      const height = image.get_height()

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      const imageData = ctx.createImageData(width, height)

      await new Promise<void>((resolve, reject) => {
        image.display(imageData, (displayData: ImageData | null) => {
          if (!displayData) return reject(new Error('HEIF 渲染失败'))
          resolve()
        })
      })

      ctx.putImageData(imageData, 0, 0)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          b => (b ? resolve(b) : reject(new Error('Canvas 导出失败'))),
          'image/jpeg',
          0.9
        )
      })

      if (cancelled) return
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      setAspectRatio(`${width}/${height}`)
      setPhotoSrc(url)
    }

    convert().catch(err => console.error('HEIC 转换失败:', err))

    return () => {
      cancelled = true
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [data.url, data.isLivePhoto])

  useEffect(() => {
    if (open && overlayRef.current) {
      anime({
        targets: overlayRef.current,
        opacity: [0.3, 1],
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
              }}
              onClick={() => setOpen(false)}
            >
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
        className="cursor-pointer rounded-lg border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:scale-101"
        onClick={() => setOpen(true)}
      >
        {photoSrc ? (
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
          />
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
            }}
            onClick={() => setOpen(false)}
          >
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
                <LivePhotoPlayer
                  photoUrl={photoSrc}
                  videoUrl={data.videoUrl!}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
