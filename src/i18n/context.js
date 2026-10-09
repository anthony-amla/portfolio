import { createContext, useContext } from 'react'

export const I18nContext = createContext(null)

/** @returns {{ locale: string, setLocale: (locale: string) => void, t: (key: string, vars?: object) => any }} */
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>')
  return context
}
