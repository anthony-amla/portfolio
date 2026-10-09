import { useEffect, useRef } from 'react'
import { AVATAR_H, AVATAR_W, drawAvatar } from './scene'

/**
 * Avatar sprite upscaled without smoothing.
 * @param {{ scale?: number }} props
 */
export default function Portrait({ scale = 4 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) drawAvatar(ctx)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={AVATAR_W}
      height={AVATAR_H}
      className="pixelated"
      style={{ width: AVATAR_W * scale, height: AVATAR_H * scale }}
      aria-hidden
    />
  )
}
