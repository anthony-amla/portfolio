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

export const servers = [
  { id: 'revoada', name: 'Revoada RJ', href: 'https://instagram.com/joguerevoada', image: '/servers/revoada.webp' },
  { id: 'central', name: 'Central RP', href: 'https://instagram.com/centralrp', image: '/servers/central.webp' },
  { id: 'nacional', name: 'Nacional RP', href: 'https://instagram.com/joguenacional', image: '/servers/nacional.webp' },
  { id: 'ladoleste', name: 'Lado Leste', href: 'https://instagram.com/ladolesterp', image: '/servers/ladoleste.webp' },
  { id: 'miami', name: 'Miami RP', href: 'https://instagram.com/joguemiami', image: '/servers/miami.webp' },
  { id: 'sete', name: 'Sete RP', href: 'https://instagram.com/joguesete', image: '/servers/sete.webp' },
  { id: 'cpx', name: 'CPX RJ', href: 'https://instagram.com/complexorjbrasil', image: '/servers/cpx.webp' },
  {
    id: 'fronteira',
    name: 'Fronteira Leste',
    href: 'https://instagram.com/fronteiraleste',
    image: '/servers/fronteira.webp',
  },
  { id: 'midnight', name: 'Midnight City', href: '', image: '/servers/midnight.webp' },
  { id: 'beco', name: 'Beco RP', href: '', image: '/servers/beco.webp' },
  { id: 'atlantis', name: 'Atlantis RP', href: '', image: '/servers/atlantis.webp' },
]

/**
 * Career stages in chronological order. Text: `journey.items.<id>`.
 * `flagged` shows the red warning flag (text: `journey.items.<id>.flag`).
 */
export const journey = [
  { id: 'start', level: 1, servers: ['midnight', 'beco', 'atlantis'] },
  { id: 'growth', level: 2, servers: [] },
  { id: 'store', level: 3, servers: [], flagged: true },
  { id: 'leste', level: 4, servers: ['ladoleste', 'fronteira'] },
  {
    id: 'wins',
    level: 5,
    current: true,
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
    images: [
      'https://i.ibb.co/QqrMxNp/FEE4-BB2-E-8-CC7-44-FB-BCE6-FEFCDBD2-CABC.png',
      'https://i.ibb.co/TBTS2c5j/EEADE720-3022-47-A0-A120-897-A8-FBF4051.png',
      'https://i.ibb.co/gbzTWdS1/C12-CAAE5-42-D4-4-F83-A75-E-827-E732330-D8.png',
      'https://i.ibb.co/4w53GrpR/959-DA4-D8-A1-AB-4327-A5-BC-A9-CC7166-B4-FF.png',
    ],
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
