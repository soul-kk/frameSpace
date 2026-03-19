import React, { useEffect, useRef, useCallback } from 'react'
import * as LivePhotosKitNS from 'livephotoskit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LivePhotosKit: typeof LivePhotosKitNS =
  (LivePhotosKitNS as any).default ?? LivePhotosKitNS

type LivePhotoPlayerProps = {
  photoUrl: string
  videoUrl: string
  style?: React.CSSProperties
}

export const LivePhotoPlayer = ({
  photoUrl,
  videoUrl,
  style,
}: LivePhotoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)
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

  const handlePointerDown = useCallback(() => {
    timerRef.current = setTimeout(() => {
      playerRef.current?.play()
    }, 200)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playerRef.current?.stop()
  }, [])

  return (
    <div
      ref={containerRef}
      style={style}
      className="cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  )
}
