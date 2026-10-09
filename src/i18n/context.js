import { createContext, useContext } from 'react'

export const I18nContext = createContext(null)

/**
 * `t` translates UI keys from the locale files; `l` picks the current language
 * out of a localized content value (see `localize` in ./config).
 *
 * @returns {{ locale: string, setLocale: (locale: string) => void, t: (key: string, vars?: object) => any, l: (value: any) => any }}
 */
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>')
  return context
}
