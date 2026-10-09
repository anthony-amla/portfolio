/** Turnstile site key (widget allows ghst.com.br, www.ghst.com.br and ghst-portfolio.pages.dev). Site keys are public by design. */
const PRODUCTION_TURNSTILE_SITE_KEY = '0x4AAAAAAFSAcec-kIs5FDYk'

/**
 * Active Turnstile site key: `VITE_TURNSTILE_SITE_KEY` when set, otherwise the
 * production key in builds only (the widget rejects localhost). Empty disables it.
 */
export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ?? (import.meta.env.PROD ? PRODUCTION_TURNSTILE_SITE_KEY : '')

export const CONTACT_ENDPOINT = '/api/contact'

export const STORAGE_KEYS = {
  theme: 'ghst-theme',
  music: 'ghst-music',
  locale: 'ghst-locale',
}

/** Anchor ids of the home page sections, in page order. */
export const SECTION = {
  home: 'home',
  about: 'about',
  journey: 'journey',
  servers: 'servers',
  projects: 'projects',
  stack: 'stack',
  testimonials: 'testimonials',
  contact: 'contact',
}

/** Navbar entries. Labels come from `nav.items.<id>` in the locale files. */
export const NAV_ITEMS = [
  { id: SECTION.home, icon: 'home' },
  { id: SECTION.about, icon: 'user' },
  { id: SECTION.journey, icon: 'map' },
  { id: SECTION.servers, icon: 'server' },
  { id: SECTION.projects, icon: 'archive' },
  { id: SECTION.stack, icon: 'backpack' },
  { id: SECTION.testimonials, icon: 'star' },
  { id: SECTION.contact, icon: 'message' },
]
