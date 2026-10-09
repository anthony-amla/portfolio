export const currentYear = () => new Date().getFullYear()

export const yearsSince = (year) => currentYear() - year

/** Share of the current year already elapsed, 0–100. */
export const yearProgress = () => Math.round(((new Date().getMonth() + 1) / 12) * 100)

const PERIOD_SEPARATOR = ' — '

/** Short month name for a locale, without trailing dot and capitalized: "Ago", "Aug". */
function shortMonth(date, locale) {
  const name = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(date).replace('.', '')
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1)
}

/**
 * Formats 'YYYY' as the year and 'YYYY-MM' as "Mon YYYY" in the given locale.
 * @param {string} value
 * @param {string} locale
 */
function formatMonthYear(value, locale) {
  const [year, month] = value.split('-').map(Number)
  if (!month) return String(year)
  return `${shortMonth(new Date(Date.UTC(year, month - 1, 1)), locale)} ${year}`
}

/**
 * @param {{ start: string, end?: string } | undefined} period
 * @param {string} locale
 * @param {string} presentLabel Shown when the period has no end.
 * @returns {string} Empty string when there is no period.
 */
export function formatPeriod(period, locale, presentLabel) {
  if (!period) return ''
  const end = period.end ? formatMonthYear(period.end, locale) : presentLabel
  return `${formatMonthYear(period.start, locale)}${PERIOD_SEPARATOR}${end}`
}
