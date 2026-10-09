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
  { id: SECTION.contact, icon: 'message' },
]
