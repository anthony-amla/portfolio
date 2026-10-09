import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../config/site'
import { readStorage, writeStorage } from '../lib/storage'

const THEMES = ['day', 'night']
const LIGHT_QUERY = '(prefers-color-scheme: light)'

const systemTheme = () => (window.matchMedia?.(LIGHT_QUERY).matches ? 'day' : 'night')

/** Theme set by the inline script in index.html, so the first paint is already correct. */
const initialTheme = () => {
  const current = document.documentElement.dataset.theme
  return THEMES.includes(current) ? current : systemTheme()
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

/**
 * Day/night theme. Follows the OS until the visitor picks one, then the
 * choice is persisted.
 *
 * @returns {{ theme: 'day' | 'night', toggleTheme: () => void }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    if (readStorage(STORAGE_KEYS.theme)) return

    const media = window.matchMedia?.(LIGHT_QUERY)
    const handleChange = () => {
      const next = systemTheme()
      applyTheme(next)
      setTheme(next)
    }
    media?.addEventListener('change', handleChange)
    return () => media?.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next = previous === 'day' ? 'night' : 'day'
      applyTheme(next)
      writeStorage(STORAGE_KEYS.theme, next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
