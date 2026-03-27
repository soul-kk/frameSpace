import React, { useEffect, useRef, useCallback } from 'react'
import * as LivePhotosKitNS from 'livephotoskit'

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
  const playerRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const player = LivePhotosKit.Player(containerRef.current)
    player.photoSrc = photoUrl
    player.videoSrc = videoUrl
    player.showsNativeControls = true //显示一个icon控件
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
