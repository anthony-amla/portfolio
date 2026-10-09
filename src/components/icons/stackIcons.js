const SOURCES = import.meta.glob('../../assets/stack/*.svg', { query: '?raw', import: 'default', eager: true })

/** Raw SVG markup by file name (src/assets/stack/<name>.svg). */
export const SVG_BY_NAME = Object.fromEntries(
  Object.entries(SOURCES).map(([path, svg]) => [path.split('/').pop().replace('.svg', ''), svg]),
)

/** Technology names whose file name is not just the name in lowercase. */
const ALIASES = {
  node: 'nodejs',
  tailwind: 'tailwindcss',
  postgres: 'postgresql',
  vite: 'vitejs',
  vue: 'vuejs',
  golang: 'go',
  redisstreams: 'redis',
}

/** Skills without a logo: pixel icon names from components/icons/Icon.jsx. */
const GENERIC = {
  nui: 'gamepad',
  lideranca: 'users',
  leadership: 'users',
  arquitetura: 'blocks',
  architecture: 'blocks',
  pmavoice: 'mic',
}

/** "Liderança" -> "lideranca", "Node.js" -> "nodejs". */
const keyOf = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/**
 * Finds the logo file for a technology name ("Node.js" -> "nodejs").
 *
 * @param {string} name
 * @returns {string | undefined}
 */
export function stackIconFor(name) {
  const key = keyOf(name)
  const candidates = [key, ALIASES[key], key.replace(/js$/, '')]
  return candidates.find((candidate) => candidate && SVG_BY_NAME[candidate])
}

/**
 * Pixel icon for a skill that has no technology logo ("Liderança" -> "users").
 *
 * @param {string} name
 * @returns {string | undefined}
 */
export const genericIconFor = (name) => GENERIC[keyOf(name)]
