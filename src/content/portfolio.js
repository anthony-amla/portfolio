/**
 * Language-independent portfolio data: ids, links, images and relations.
 * Every visible text lives in src/i18n/locales/*.json, keyed by the ids below.
 *
 * Images accept a URL or a path inside /public (e.g. '/servers/revoada.webp').
 * An empty string renders the pixel art placeholder.
 */

export const profile = {
  name: 'Murilo Araujo',
  nick: 'Ghst',
  startYear: 2019,
  badges: [
    { id: 'since', icon: 'star' },
    { id: 'fullstack', icon: 'code' },
    { id: 'lead', icon: 'crown' },
    { id: 'store', icon: 'bag' },
    { id: 'law', icon: 'book' },
  ],
}

export const contacts = [
  { id: 'email', value: 'contatoamla@gmail.com', href: 'mailto:contatoamla@gmail.com', copyable: true },
  { id: 'discord', href: 'https://discord.com/users/170686037138341888' },
  { id: 'linkedin', value: 'in/contatoamla', href: 'https://www.linkedin.com/in/contatoamla/' },
  { id: 'github', value: 'anthony-amla', href: 'https://github.com/anthony-amla' },
  { id: 'instagram', value: '@murilo.araujjo', href: 'https://www.instagram.com/murilo.araujjo/' },
]

/** Social networks a server can link to. The key is also the icon name. */
export const NETWORKS = {
  instagram: 'Instagram',
  discord: 'Discord',
}

const instagram = (handle) => ({ network: 'instagram', href: `https://instagram.com/${handle}` })

/** Roleplay servers ("cidades"). `link` is `{ network, href }` or null. */
export const servers = [
  { id: 'revoada', name: 'Revoada RJ', link: instagram('joguerevoada'), image: '/servers/revoada.webp' },
  { id: 'central', name: 'Central RP', link: instagram('centralrp'), image: '/servers/central.webp' },
  { id: 'nacional', name: 'Nacional RP', link: instagram('joguenacional'), image: '/servers/nacional.webp' },
  { id: 'ladoleste', name: 'Lado Leste', link: instagram('ladolesterp'), image: '/servers/ladoleste.webp' },
  { id: 'miami', name: 'Miami RP', link: instagram('joguemiami'), image: '/servers/miami.webp' },
  { id: 'sete', name: 'Sete RP', link: instagram('joguesete'), image: '/servers/sete.webp' },
  { id: 'cpx', name: 'CPX RJ', link: instagram('complexorjbrasil'), image: '/servers/cpx.webp' },
  { id: 'fronteira', name: 'Fronteira Leste', link: instagram('fronteiraleste'), image: '/servers/fronteira.webp' },
  { id: 'midnight', name: 'Midnight City', link: null, image: '/servers/midnight.webp' },
  { id: 'beco', name: 'Beco RP', link: null, image: '/servers/beco.webp' },
  { id: 'atlantis', name: 'Atlantis RP', link: null, image: '/servers/atlantis.webp' },
]

/**
 * Career stages in chronological order. Text: `journey.items.<id>`.
 * `period`: `start`/`end` as 'YYYY' or 'YYYY-MM'; no `end` means ongoing.
 * `flagged` shows the red warning flag (text: `journey.items.<id>.flag`).
 */
export const journey = [
  { id: 'start', level: 1, period: { start: '2019' }, servers: ['midnight', 'beco', 'atlantis'] },
  { id: 'growth', level: 2, servers: [] },
  { id: 'store', level: 3, servers: [], flagged: true },
  { id: 'leste', level: 4, period: { start: '2025-08', end: '2025-12' }, servers: ['ladoleste', 'fronteira'] },
  {
    id: 'wins',
    level: 5,
    current: true,
    period: { start: '2025-12' },
    servers: ['revoada', 'central', 'nacional', 'ladoleste', 'miami', 'sete', 'cpx'],
  },
]

/**
 * Text: `projects.items.<id>`. While `flagged` is true the external link is
 * hidden and the warning flag is shown.
 */
export const projects = [
  {
    id: 'ghst-store',
    owned: true,
    flagged: true,
    tags: ['React', 'Node.js', 'Tailwind', 'MongoDB'],
    images: [1, 2, 3, 4].map((n) => `/projects/ghst-store/${n}.webp`),
    link: 'https://ghst.com.br',
  },
  {
    id: 'admin-panel',
    owned: false,
    tags: ['React', 'Node.js', 'WebSocket', 'Lua'],
    images: [],
    link: null,
  },
  {
    id: 'hud-framework',
    owned: false,
    tags: ['Lua', 'NUI', 'React'],
    images: [],
    link: null,
  },
]

/** Group labels: `stack.groups.<id>`. Icons: src/assets/stack/<icon>.svg. */
export const stack = [
  {
    id: 'languages',
    items: [
      { name: 'Lua', icon: 'lua' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Go', icon: 'go' },
    ],
  },
  {
    id: 'frontend',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Vue', icon: 'vuejs' },
      { name: 'Tailwind', icon: 'tailwindcss' },
      { name: 'Vite', icon: 'vitejs' },
    ],
  },
  {
    id: 'backend',
    items: [
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express', icon: 'express' },
      { name: 'Fastify', icon: 'fastify' },
    ],
  },
  {
    id: 'data',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Redis', icon: 'redis' },
      { name: 'ClickHouse', icon: 'clickhouse' },
      { name: 'Prisma', icon: 'prisma' },
    ],
  },
  {
    id: 'infra',
    items: [
      { name: 'Docker', icon: 'docker' },
      { name: 'Linux', icon: 'linux' },
      { name: 'Git', icon: 'git' },
    ],
  },
]
