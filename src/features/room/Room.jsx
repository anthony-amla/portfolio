import { useCallback, useEffect, useRef, useState } from 'react'
import { SECTION } from '../../config/site'
import { profile } from '../../content/portfolio'
import { useI18n } from '../../i18n/context'
import { AVATAR_HEAD, HOTSPOTS, ROOM_H, ROOM_W, drawRoom } from './scene'

const FRAME_MS = 125
const WAVE_FRAMES = 16
const MIN_SCALE = 2
const MAX_SCALE = 5

/** Clickable objects. `target` scrolls to a section; the others trigger a reaction. */
const OBJECTS = [
  { id: 'avatar' },
  { id: 'shelf', target: SECTION.about },
  { id: 'poster', target: SECTION.servers },
  { id: 'window' },
  { id: 'desk', target: SECTION.projects },
  { id: 'plant' },
]

const percent = (value, total) => `${(value / total) * 100}%`

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Interactive pixel art room rendered on a canvas, with clickable hotspots
 * and a speech bubble.
 *
 * @param {object} props
 * @param {'day' | 'night'} props.theme
 * @param {() => void} props.onToggleTheme
 */
export default function Room({ theme, onToggleTheme }) {
  const { t } = useI18n()
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const waveUntilRef = useRef(WAVE_FRAMES)
  const themeRef = useRef(theme)

  const [scale, setScale] = useState(3)
  const [lineIndex, setLineIndex] = useState(0)
  const [reaction, setReaction] = useState(null)
  // Incremented on every new speech to restart the bubble animation.
  const [speechId, setSpeechId] = useState(0)

  const lines = t('room.lines', { startYear: profile.startYear })

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const frame = frameRef.current
    drawRoom(ctx, { theme: themeRef.current, frame, wave: frame < waveUntilRef.current })
  }, [])

  useEffect(() => {
    themeRef.current = theme
    draw()
  }, [theme, draw])

  // Integer scaling keeps the pixels crisp.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new ResizeObserver(([entry]) => {
      const fit = Math.floor(entry.contentRect.width / ROOM_W)
      setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, fit)))
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      waveUntilRef.current = 0
      draw()
      return
    }
    const timer = window.setInterval(() => {
      if (document.hidden) return
      frameRef.current += 1
      draw()
    }, FRAME_MS)
    return () => window.clearInterval(timer)
  }, [draw])

  function wave() {
    waveUntilRef.current = frameRef.current + WAVE_FRAMES
    draw()
  }

  function say(text) {
    setReaction(text)
    setSpeechId((id) => id + 1)
  }

  function handleObjectClick({ id, target }) {
    if (target) {
      scrollToSection(target)
      return
    }
    switch (id) {
      case 'avatar':
        wave()
        setLineIndex((index) => (index + 1) % lines.length)
        say(null)
        break
      case 'window':
        onToggleTheme()
        say(t(theme === 'day' ? 'room.reactions.toNight' : 'room.reactions.toDay'))
        break
      case 'plant':
        wave()
        say(t('room.reactions.plant'))
        break
    }
  }

  function objectHint(id) {
    if (id === 'window') return t(theme === 'day' ? 'room.objects.window.hintDay' : 'room.objects.window.hintNight')
    return t(`room.objects.${id}.hint`)
  }

  const width = ROOM_W * scale
  const height = ROOM_H * scale

  return (
    <div ref={wrapperRef} className="room-wrapper">
      <div className="room" style={{ width, height }}>
        <canvas
          ref={canvasRef}
          width={ROOM_W}
          height={ROOM_H}
          style={{ width, height }}
          role="img"
          aria-label={t('room.label')}
        />

        <p
          key={speechId}
          className="speech-bubble"
          style={{ left: percent(AVATAR_HEAD.x, ROOM_W), top: percent(AVATAR_HEAD.y, ROOM_H) }}
          aria-live="polite"
        >
          <strong>{t('room.speaker')}:</strong> {reaction ?? lines[lineIndex]}
        </p>

        {OBJECTS.map((object) => {
          const area = HOTSPOTS[object.id]
          const label = t(`room.objects.${object.id}.label`)
          const hint = objectHint(object.id)
          return (
            <button
              key={object.id}
              type="button"
              className="hotspot"
              style={{
                left: percent(area.x, ROOM_W),
                top: percent(area.y, ROOM_H),
                width: percent(area.w, ROOM_W),
                height: percent(area.h, ROOM_H),
              }}
              onClick={() => handleObjectClick(object)}
              aria-label={`${label}: ${hint}`}
            >
              <span className="hotspot-tooltip">
                <strong>{label}</strong> {hint}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
