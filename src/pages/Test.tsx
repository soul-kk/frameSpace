import React, { useEffect, useRef } from 'react'
import * as LivePhotosKitNS from 'livephotoskit'

// Handles Vite CJS/ESM interop: esbuild may wrap module.exports as .default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LivePhotosKit: typeof LivePhotosKitNS =
  (LivePhotosKitNS as any).default ?? LivePhotosKitNS

const photoUrl =
  'https://baoljxfavlevbrrsrues.supabase.co/storage/v1/object/public/photograph/IMG_2074.HEIC'
// 'https://baoljxfavlevbrrsrues.supabase.co/storage/v1/object/public/photograph/176460308000-886.WEBP'

const videoUrl =
  'https://baoljxfavlevbrrsrues.supabase.co/storage/v1/object/public/photograph/IMG_2074.MOV'

export default function Test() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ReturnType<typeof LivePhotosKit.Player> | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const player = LivePhotosKit.Player(containerRef.current)
    player.photoSrc = photoUrl
    player.videoSrc = videoUrl
    player.showsNativeControls = true
    player.playbackStyle = LivePhotosKit.PlaybackStyle.FULL
    playerRef.current = player
  }, [])

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      playerRef.current?.play()
    }, 200)
  }

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playerRef.current?.stop()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
      <div
        className="relative cursor-pointer select-none"
        style={{ width: 320, height: 426 }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          ref={containerRef}
          className="h-full w-full overflow-hidden rounded-2xl"
        />
      </div>
    </div>
  )
}
