import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import it from './locales/it.json'
import ptBR from './locales/pt-BR.json'

export const DEFAULT_LOCALE = 'pt-BR'

/** `name` is the language's own name, shown as-is in every locale; `short` labels the corner button. */
export const LOCALES = {
  'pt-BR': { messages: ptBR, htmlLang: 'pt-BR', flag: 'br', name: 'Português', short: 'PT' },
  en: { messages: en, htmlLang: 'en', flag: 'gb', name: 'English', short: 'EN' },
  es: { messages: es, htmlLang: 'es', flag: 'es', name: 'Español', short: 'ES' },
  it: { messages: it, htmlLang: 'it', flag: 'it', name: 'Italiano', short: 'IT' },
  de: { messages: de, htmlLang: 'de', flag: 'de', name: 'Deutsch', short: 'DE' },
}

export const isLocale = (value) => Object.hasOwn(LOCALES, value)

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

function interpolate(value, vars) {
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match))
  }
  if (Array.isArray(value)) return value.map((item) => interpolate(item, vars))
  return value
}

/**
 * Resolves a localized value from content files: either a plain value shared
 * by every language, or an object keyed by locale (`{ "pt-BR": ..., "en": ... }`).
 * Missing locales fall back to the default one.
 *
 * @param {unknown} value
 * @param {keyof typeof LOCALES} locale
 */
export function localize(value, locale) {
  if (value && typeof value === 'object' && !Array.isArray(value) && DEFAULT_LOCALE in value) {
    return value[locale] ?? value[DEFAULT_LOCALE]
  }
  return value
}

/**
 * Builds a translate function for a locale. Missing keys fall back to the
 * default locale, then to the key itself so gaps are visible.
 *
 * `{name}` placeholders are replaced from `vars` in strings and in arrays of
 * strings; objects are returned as-is.
 *
 * @param {keyof typeof LOCALES} locale
 * @returns {(key: string, vars?: Record<string, string | number>) => any}
 */
export function createTranslator(locale) {
  const messages = LOCALES[locale].messages
  const fallback = LOCALES[DEFAULT_LOCALE].messages

  return (key, vars = {}) => {
    const value = lookup(messages, key) ?? lookup(fallback, key)
    if (value == null) return key
    return interpolate(value, vars)
  }
}
