import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

export const DEFAULT_LOCALE = 'pt-BR'

export const LOCALES = {
  'pt-BR': { messages: ptBR, htmlLang: 'pt-BR', flag: 'br' },
  en: { messages: en, htmlLang: 'en', flag: 'gb' },
}

export const isLocale = (value) => Object.hasOwn(LOCALES, value)

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

function interpolate(text, vars) {
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match))
}

/**
 * Builds a translate function for a locale. Missing keys fall back to the
 * default locale, then to the key itself so gaps are visible.
 *
 * Strings get `{name}` placeholders replaced from `vars`; arrays and objects
 * are returned as-is.
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
    return typeof value === 'string' ? interpolate(value, vars) : value
  }
}
