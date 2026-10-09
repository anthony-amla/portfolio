import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise

function loadTurnstile() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = () => {
      scriptPromise = undefined
      reject(new Error('Failed to load Turnstile'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Cloudflare Turnstile anti-spam widget (explicit rendering).
 *
 * @param {object} props
 * @param {string} props.siteKey
 * @param {'day' | 'night'} props.theme
 * @param {string} props.language Locale code, e.g. 'pt-BR'.
 * @param {(token: string) => void} props.onToken Receives the token, or '' when it expires or fails.
 * @param {number} props.resetKey Change it to get a fresh token (tokens are single-use).
 */
export default function TurnstileWidget({ siteKey, theme, language, onToken, resetKey }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let widgetId
    let cancelled = false
    onToken('')

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme === 'day' ? 'light' : 'dark',
          language,
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        })
      })
      .catch(() => onToken(''))

    return () => {
      cancelled = true
      if (widgetId !== undefined) window.turnstile?.remove(widgetId)
    }
  }, [siteKey, theme, language, onToken, resetKey])

  return <div ref={containerRef} className="turnstile" />
}
