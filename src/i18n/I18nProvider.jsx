import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../config/site'
import { readStorage, writeStorage } from '../lib/storage'
import { DEFAULT_LOCALE, LOCALES, createTranslator, isLocale, localize } from './config'
import { I18nContext } from './context'

function initialLocale() {
  const saved = readStorage(STORAGE_KEYS.locale)
  return isLocale(saved) ? saved : DEFAULT_LOCALE
}

export default function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = useCallback((next) => {
    if (!isLocale(next)) return
    setLocaleState(next)
    writeStorage(STORAGE_KEYS.locale, next)
  }, [])

  const t = useMemo(() => createTranslator(locale), [locale])
  const l = useCallback((value) => localize(value, locale), [locale])

  useEffect(() => {
    document.documentElement.lang = LOCALES[locale].htmlLang
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  }, [locale, t])

  const value = useMemo(() => ({ locale, setLocale, t, l }), [locale, setLocale, t, l])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
