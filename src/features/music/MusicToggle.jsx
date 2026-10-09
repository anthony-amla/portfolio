import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../../components/icons/Icon'
import { STORAGE_KEYS } from '../../config/site'
import { useI18n } from '../../i18n/context'
import { readStorage, writeStorage } from '../../lib/storage'
import { createChiptune } from './chiptune'

const USER_GESTURES = ['pointerdown', 'keydown', 'touchstart']

/** On by default; stays off only if the visitor turned it off before. */
const initiallyEnabled = () => readStorage(STORAGE_KEYS.music) !== 'off'

/**
 * Soundtrack toggle. Browsers block audio until the visitor interacts with
 * the page, so when autoplay is refused playback starts on the first click,
 * tap or key press.
 */
export default function MusicToggle() {
  const { t } = useI18n()
  const synthRef = useRef(null)
  const [enabled, setEnabled] = useState(initiallyEnabled)
  const [running, setRunning] = useState(false)

  const synth = () => (synthRef.current ??= createChiptune())

  const start = useCallback(async () => {
    setRunning(await synth().play())
  }, [])

  useEffect(() => {
    if (!enabled || running) return
    start()

    const handleGesture = (event) => {
      if (event.target.closest?.('.music-toggle')) return
      start()
    }
    USER_GESTURES.forEach((type) => window.addEventListener(type, handleGesture, { capture: true }))
    return () => USER_GESTURES.forEach((type) => window.removeEventListener(type, handleGesture, { capture: true }))
  }, [enabled, running, start])

  useEffect(() => {
    if (!running) return
    const handleVisibility = () => (document.hidden ? synth().pause() : synth().play())
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [running])

  function handleClick() {
    // Enabled but blocked by the browser: this click is the gesture it was waiting for.
    if (enabled && !running) {
      start()
      return
    }

    const next = !enabled
    if (next) {
      start()
    } else {
      synth().pause()
      setRunning(false)
    }
    setEnabled(next)
    writeStorage(STORAGE_KEYS.music, next ? 'on' : 'off')
  }

  const playing = enabled && running

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={handleClick}
      aria-pressed={enabled}
      aria-label={t(playing ? 'music.pause' : 'music.play')}
      title={t(playing ? 'music.pause' : 'music.play')}
    >
      <Icon name={playing ? 'pause' : 'music'} size={20} />
      <span className="control-label">{t(playing ? 'music.playing' : 'music.idle')}</span>
      {playing && (
        <span className="equalizer" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      )}
    </button>
  )
}
