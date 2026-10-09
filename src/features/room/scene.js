import { createRaster } from './raster'

/**
 * Isometric pixel art room, drawn at native ROOM_W x ROOM_H resolution and
 * upscaled with `image-rendering: pixelated`.
 *
 * World coordinates: `i` grows down-right, `j` grows down-left, `z` is height
 * in pixels. One floor tile is 16x8 px.
 */
export const ROOM_W = 144
export const ROOM_H = 128

const OX = 72
const OY = 56
const N = 8
const WALL = 48
const WALL_THICKNESS = 0.4 // in tiles

const P = (i, j, z = 0) => [OX + (i - j) * 8, OY + (i + j) * 4 - z]

const THEMES = {
  night: {
    wallL: '#34426e',
    wallR: '#2a365c',
    wallTop: '#56679c',
    wallEdge: '#1f2848',
    base: '#1c2443',
    floorA: '#4a3e62',
    floorB: '#433859',
    floorSideL: '#2f2644',
    floorSideR: '#251e37',
    sky: '#0f1838',
    skyHi: '#1b2a57',
    star: '#ffffff',
    starDim: '#7f8fc4',
    moon: '#fff1b8',
    moonShade: '#e2cf86',
    frame: '#c9d1e3',
    frameDark: '#8a93ad',
    rug: '#2f6f73',
    rugInner: '#3a868a',
    rugLine: '#e7c46c',
    light: 'rgba(124, 196, 255, 0.10)',
  },
  day: {
    wallL: '#cdd8ea',
    wallR: '#b6c3da',
    wallTop: '#eef3fa',
    wallEdge: '#93a1bd',
    base: '#8e9cb8',
    floorA: '#dcc59c',
    floorB: '#d2ba8f',
    floorSideL: '#a98b5f',
    floorSideR: '#8e734d',
    sky: '#86cdfc',
    skyHi: '#b9e3ff',
    sun: '#ffdf5c',
    sunHi: '#fff3b0',
    cloud: '#ffffff',
    frame: '#ffffff',
    frameDark: '#b9c2d6',
    rug: '#3f8f96',
    rugInner: '#4fa7ad',
    rugLine: '#f4d27a',
    light: 'rgba(255, 255, 255, 0.22)',
  },
}

const C = {
  wood: { top: '#b07a4c', left: '#94613a', right: '#764a2b', outline: '#3b2414' },
  shelfBack: '#4a2e1b',
  books: ['#d65a4a', '#f2b04a', '#5bb3d9', '#64b86a', '#9a72d6', '#e9e4d8', '#4f6bd8'],
  law: '#8e2333',
  lawBand: '#f0c75a',
  paper: '#f7f1de',
  seal: '#d9a93a',
  posterBg: '#f0892a',
  posterSky: '#ffb65c',
  posterSun: '#fff1c1',
  posterCity: '#5a2a10',
  metal: { top: '#4b5263', left: '#3a404f', right: '#2c313d', outline: '#14171f' },
  screen: '#0b1124',
  code: ['#7cc4ff', '#ffd479', '#9be27a', '#ff8fa3', '#c9a6ff'],
  keyboard: '#dfe3ea',
  keyDot: '#9aa3b5',
  mug: { top: '#6b3f22', left: '#f4f4f4', right: '#cfd3da', outline: '#3a3f4a' },
  chair: { top: '#e15a45', left: '#c2412f', right: '#963124', outline: '#3d1510' },
  pole: { top: '#3a3f4a', left: '#2b2f38', right: '#1f2229' },
  pot: { top: '#4a2f1d', left: '#c46a3a', right: '#9f5229', outline: '#4a2210' },
  leaf: { a: '#73c76f', g: '#3f9d4a', d: '#2c7a37' },
  shadow: 'rgba(0, 0, 0, 0.28)',
  avatar: {
    o: '#1d1612',
    h: '#2b211c',
    s: '#f2c8a2',
    e: '#1d1612',
    m: '#b06e55',
    w: '#3e7fdc',
    l: '#ffffff',
    p: '#2d3445',
    b: '#f0f0f0',
  },
}

// Avatar sprite, 16x25. Palette keys: o outline, h hair, s skin, e eye, m mouth, w shirt, l logo, p pants, b shoes.
const AVATAR = [
  '....ooooooo.....',
  '...ohhhhhhho....',
  '..ohhhhhhhhho...',
  '..ohhhhhhhhho...',
  '..ohhssssshho...',
  '..ohsssssssho...',
  '..ossesssesso...',
  '..ossssssssso...',
  '..ossssmsssso...',
  '...ossssssso....',
  '....oosssoo.....',
  '...owwwwwwwo....',
  '..owwwwwwwwwo...',
  '.owwwwwlwwwwwo..',
  '.owowwwwwwwowo..',
  '.owowwwwwwwowo..',
  '.owowwwwwwwowo..',
  '.osoppppppposo..',
  '..oopppppppoo...',
  '...opppopppo....',
  '...opppopppo....',
  '...opppopppo....',
  '...obbbobbbo....',
  '..obbbbobbbbo...',
  '..ooooooooooo...',
]

function editSprite(rows, edits) {
  const out = rows.map((r) => r.split(''))
  for (const [r, c, ch] of edits) out[r][c] = ch
  return out.map((r) => r.join(''))
}

const AVATAR_BLINK = editSprite(AVATAR, [
  [6, 5, 's'],
  [6, 9, 's'],
])

// Screen-right arm raised for the wave animation.
const WAVE_EDITS = [
  [14, 12, '.'],
  [14, 13, '.'],
  [15, 12, '.'],
  [15, 13, '.'],
  [16, 12, '.'],
  [16, 13, '.'],
  [17, 12, '.'],
  [17, 13, '.'],
  [18, 12, '.'],
  [18, 11, 'o'],
  [14, 11, 'o'],
  [15, 11, 'o'],
  [16, 11, 'o'],
  [17, 11, 'o'],
  [13, 13, 'w'],
  [13, 14, 'o'],
  [12, 13, 'o'],
  [12, 14, 'o'],
  [11, 13, 'w'],
  [11, 14, 'o'],
  [11, 12, 'o'],
  [10, 13, 'w'],
  [10, 14, 'o'],
  [10, 12, 'o'],
  [9, 13, 'w'],
  [9, 14, 'o'],
  [9, 12, 'o'],
  [8, 13, 's'],
  [8, 14, 'o'],
  [8, 12, 'o'],
  [7, 13, 's'],
  [7, 14, 'o'],
  [7, 12, 'o'],
  [6, 13, 'o'],
]
const AVATAR_WAVE = editSprite(AVATAR, WAVE_EDITS)
const AVATAR_WAVE_B = editSprite(AVATAR, [
  ...WAVE_EDITS,
  [7, 13, 'o'],
  [8, 13, 's'],
  [7, 14, 's'],
  [6, 14, 'o'],
  [7, 15, 'o'],
  [8, 14, 'o'],
  [6, 13, '.'],
])

const LEAVES = [
  '....a......',
  '...aga..a..',
  '..agg..aga.',
  '.agdg.aggd.',
  '.gdg.aggd..',
  '..gdgaggd.a',
  'a..gdggd.ag',
  'ga.gdgdd.gd',
  'gda.gdd..d.',
  '.dg.gd.dg..',
  '..ddgddd...',
  '...dddd....',
]

const STARS = [
  [3.6, 34, 0],
  [4.9, 32, 7],
  [3.9, 23, 13],
  [5.05, 22, 4],
  [4.55, 34.5, 18],
  [3.5, 28, 9],
]

const CODE_LEN = [0.9, 0.55, 1.0, 0.4, 0.8, 0.7, 0.5, 0.95, 0.6, 0.85]
const CODE_INDENT = [0, 0.15, 0.15, 0.3, 0.3, 0.15, 0, 0.15, 0.3, 0]

/** Clickable areas in native canvas pixels. */
export const HOTSPOTS = {
  avatar: { x: 66, y: 62, w: 20, h: 30 },
  shelf: { x: 39, y: 24, w: 35, h: 50 },
  poster: { x: 23, y: 33, w: 17, h: 34 },
  window: { x: 95, y: 27, w: 25, h: 20 },
  desk: { x: 93, y: 47, w: 40, h: 46 },
  plant: { x: 14, y: 65, w: 17, h: 27 },
}

/** Point above the avatar's head, used to anchor the speech bubble. */
export const AVATAR_HEAD = { x: 76, y: 62 }

function box(r, i0, j0, i1, j1, z0, h, c) {
  const z1 = z0 + h
  r.poly([P(i0, j1, z0), P(i1, j1, z0), P(i1, j1, z1), P(i0, j1, z1)], c.left)
  r.poly([P(i1, j0, z0), P(i1, j1, z0), P(i1, j1, z1), P(i1, j0, z1)], c.right)
  r.poly([P(i0, j0, z1), P(i1, j0, z1), P(i1, j1, z1), P(i0, j1, z1)], c.top)
  if (c.outline) {
    r.outline([P(i0, j0, z1), P(i1, j0, z1), P(i1, j0, z0), P(i1, j1, z0), P(i0, j1, z0), P(i0, j1, z1)], c.outline)
  }
}

const wallL = (j0, j1, z0, z1) => [P(0, j0, z0), P(0, j1, z0), P(0, j1, z1), P(0, j0, z1)]
const wallR = (i0, i1, z0, z1) => [P(i0, 0, z0), P(i1, 0, z0), P(i1, 0, z1), P(i0, 0, z1)]
const shelfFace = (j0, j1, z0, z1) => [P(1, j0, z0), P(1, j1, z0), P(1, j1, z1), P(1, j0, z1)]

function drawWalls(r, t) {
  r.poly([P(0, 0, 0), P(0, N, 0), P(0, N, WALL), P(0, 0, WALL)], t.wallL)
  r.poly([P(0, 0, 0), P(N, 0, 0), P(N, 0, WALL), P(0, 0, WALL)], t.wallR)
  r.poly(wallL(0, N, 0, 3), t.base)
  r.poly(wallR(0, N, 0, 3), t.base)
  // Wall caps and outer edges.
  r.poly(
    [P(0, 0, WALL), P(0, N, WALL), P(-WALL_THICKNESS, N, WALL), P(-WALL_THICKNESS, -WALL_THICKNESS, WALL)],
    t.wallTop,
  )
  r.poly(
    [P(0, 0, WALL), P(N, 0, WALL), P(N, -WALL_THICKNESS, WALL), P(-WALL_THICKNESS, -WALL_THICKNESS, WALL)],
    t.wallTop,
  )
  r.poly([P(-WALL_THICKNESS, N, -4), P(0, N, -4), P(0, N, WALL), P(-WALL_THICKNESS, N, WALL)], t.wallEdge)
  r.poly([P(N, -WALL_THICKNESS, -4), P(N, 0, -4), P(N, 0, WALL), P(N, -WALL_THICKNESS, WALL)], t.wallEdge)
}

function drawWindow(r, t, theme, frame) {
  r.poly(wallR(2.9, 5.7, 15, 39), t.frameDark)
  r.poly(wallR(3.0, 5.6, 16, 38), t.frame)
  r.poly(wallR(3.3, 5.3, 18, 36), t.sky)
  r.poly(wallR(3.3, 5.3, 30, 36), t.skyHi)
  if (theme === 'night') {
    for (const [i, z, phase] of STARS) {
      const [x, y] = P(i, 0, z)
      r.px(x, y, (frame + phase) % 24 < 19 ? t.star : t.starDim)
    }
    const [mx, my] = P(4.75, 0, 31)
    r.rect(mx, my, 3, 3, t.moon)
    r.rect(mx + 2, my, 1, 1, t.moonShade)
    r.rect(mx, my + 2, 1, 1, t.moonShade)
  } else {
    const [sx, sy] = P(3.65, 0, 34)
    r.rect(sx, sy, 3, 3, t.sun)
    r.px(sx + 1, sy + 1, t.sunHi)
    const drift = Math.floor(frame / 12) % 3
    const [cx, cy] = P(4.5, 0, 25)
    r.rect(cx + drift, cy, 4, 1, t.cloud)
    r.rect(cx + drift - 1, cy + 1, 6, 1, t.cloud)
  }
  // Window muntins.
  r.poly(wallR(4.24, 4.36, 18, 36), t.frame)
  const [ax, ay] = P(3.3, 0, 27)
  const [bx, by] = P(5.3, 0, 27)
  r.line(ax, ay, bx, by, t.frame)
  box(r, 2.8, 0, 5.8, 0.35, 13.5, 1.5, { top: t.frame, left: t.frameDark, right: t.frameDark })
}

function drawPoster(r) {
  r.poly(wallL(4.15, 5.85, 13, 39), C.posterCity)
  r.poly(wallL(4.25, 5.75, 14, 38), C.posterBg)
  r.poly(wallL(4.25, 5.75, 26, 38), C.posterSky)
  r.poly(wallL(4.85, 5.25, 28, 32), C.posterSun)
  const city = [
    [4.35, 4.6, 24],
    [4.65, 4.95, 29],
    [5.0, 5.25, 22],
    [5.3, 5.65, 26],
  ]
  for (const [j0, j1, top] of city) r.poly(wallL(j0, j1, 14, top), C.posterCity)
}

function drawDiploma(r) {
  r.poly(wallL(3.3, 3.98, 27, 37), C.wood.right)
  r.poly(wallL(3.38, 3.9, 28, 36), C.paper)
  const [sx, sy] = P(0, 3.75, 30)
  r.rect(sx, sy, 2, 2, C.seal)
  const [lx, ly] = P(0, 3.45, 34)
  const [lx2, ly2] = P(0, 3.85, 34)
  r.line(lx, ly, lx2, ly2, C.keyDot)
}

function drawFloor(r, t) {
  r.poly([P(-WALL_THICKNESS, N, 0), P(N, N, 0), P(N, N, -4), P(-WALL_THICKNESS, N, -4)], t.floorSideL)
  r.poly([P(N, -WALL_THICKNESS, 0), P(N, N, 0), P(N, N, -4), P(N, -WALL_THICKNESS, -4)], t.floorSideR)
  r.poly([P(0, 0), P(N, 0), P(N, N), P(0, N)], t.floorA)
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if ((i + j) % 2) r.poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], t.floorB)
    }
  }
}

function drawRug(r, t) {
  r.poly([P(2.6, 3.1), P(6.2, 3.1), P(6.2, 6.5), P(2.6, 6.5)], t.rugLine)
  r.poly([P(2.75, 3.25), P(6.05, 3.25), P(6.05, 6.35), P(2.75, 6.35)], t.rug)
  r.poly([P(4.4, 3.7), P(5.65, 4.8), P(4.4, 5.9), P(3.15, 4.8)], t.rugInner)
}

function drawShelf(r) {
  box(r, 0, 1, 1, 3, 0, 34, C.wood)
  r.poly(shelfFace(1.15, 2.85, 2, 32), C.shelfBack)
  const rows = [2, 12.5, 23]
  rows.forEach((z, row) => {
    let j = 1.2
    let k = row * 3
    while (j < 2.75) {
      const w = row === 1 && k % 7 === 3 ? 0.3 : 0.2 + ((k * 7) % 3) * 0.04
      const h = row === 1 && k % 7 === 3 ? 9 : 6 + ((k * 5) % 4)
      const j1 = Math.min(j + w, 2.8)
      const isLaw = row === 1 && k % 7 === 3
      r.poly(shelfFace(j, j1, z, z + h), isLaw ? C.law : C.books[k % C.books.length])
      if (isLaw) r.poly(shelfFace(j, j1, z + 5, z + 6.2), C.lawBand)
      j = j1 + 0.04
      k++
    }
  })
  for (const z of [1, 11.5, 22, 32]) r.poly(shelfFace(1, 3, z, z + 1.5), C.wood.top)
  r.outline([P(1, 1, 0), P(1, 3, 0), P(1, 3, 34), P(1, 1, 34)], C.wood.outline)
}

function drawDesk(r, frame) {
  const legs = [
    [4.45, 0.05],
    [6.85, 0.05],
    [4.45, 1.25],
    [6.85, 1.25],
  ]
  for (const [i, j] of legs) box(r, i, j, i + 0.3, j + 0.3, 0, 11, C.wood)
  box(r, 4.4, 0, 7.2, 1.6, 11, 2.5, C.wood)

  box(r, 5.65, 0.25, 5.95, 0.5, 13.5, 3, C.pole)
  box(r, 5.0, 0.12, 6.6, 0.45, 16, 11, C.metal)
  r.poly([P(5.15, 0.45, 17.5), P(6.45, 0.45, 17.5), P(6.45, 0.45, 25.5), P(5.15, 0.45, 25.5)], C.screen)
  const offset = Math.floor(frame / 3)
  for (let k = 0; k < 5; k++) {
    const n = (k + offset) % CODE_LEN.length
    const i0 = 5.25 + CODE_INDENT[n]
    const i1 = Math.min(6.35, i0 + CODE_LEN[n])
    const z = 24.2 - k * 1.6
    const [ax, ay] = P(i0, 0.45, z)
    const [bx, by] = P(i1, 0.45, z)
    r.line(ax, ay, bx, by, C.code[n % C.code.length])
  }

  r.poly([P(5.0, 0.75, 13.5), P(6.4, 0.75, 13.5), P(6.4, 1.2, 13.5), P(5.0, 1.2, 13.5)], C.keyboard)
  for (let i = 5.2; i < 6.3; i += 0.3) {
    const [x, y] = P(i, 0.97, 13.5)
    r.px(x, y, C.keyDot)
  }
  box(r, 4.6, 0.85, 4.85, 1.1, 13.5, 3, C.mug)
}

function drawChair(r) {
  box(r, 5.7, 2.3, 5.9, 2.5, 0, 7, C.pole)
  box(r, 5.25, 1.9, 6.35, 2.9, 7, 2, C.chair)
  box(r, 5.25, 2.75, 6.35, 2.95, 9, 11, C.chair)
}

function drawAvatarInRoom(r, frame, wave) {
  const [x, y] = P(4.4, 4.0)
  const fx = Math.round(x)
  const fy = Math.round(y)
  r.rect(fx - 5, fy - 1, 11, 2, C.shadow)
  r.rect(fx - 6, fy, 13, 1, C.shadow)
  let rows = AVATAR
  if (wave) rows = Math.floor(frame / 2) % 2 ? AVATAR_WAVE_B : AVATAR_WAVE
  else if (frame % 40 < 2) rows = AVATAR_BLINK
  r.sprite(rows, fx - 7, fy - 25, C.avatar)
}

function drawPlant(r) {
  box(r, 0.3, 6.6, 1.0, 7.3, 0, 7, C.pot)
  const [x, y] = P(0.65, 6.95, 7)
  r.sprite(LEAVES, Math.round(x) - 5, Math.round(y) - 11, C.leaf)
}

export const AVATAR_W = 16
export const AVATAR_H = 25

/** Draws only the avatar, for the profile portrait. */
export function drawAvatar(ctx) {
  ctx.clearRect(0, 0, AVATAR_W, AVATAR_H)
  createRaster(ctx).sprite(AVATAR, 0, 0, C.avatar)
}

/**
 * Draws the whole room for one animation frame.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ theme: 'day' | 'night', frame: number, wave: boolean }} state
 */
export function drawRoom(ctx, { theme, frame, wave }) {
  const t = THEMES[theme] ?? THEMES.night
  const r = createRaster(ctx)
  ctx.clearRect(0, 0, ROOM_W, ROOM_H)

  drawWalls(r, t)
  drawWindow(r, t, theme, frame)
  drawPoster(r)
  drawDiploma(r)
  drawFloor(r, t)
  // Window light (day) or monitor glow (night) on the floor.
  if (theme === 'day') r.poly([P(3.1, 0.2), P(5.5, 0.2), P(6.2, 3.2), P(3.8, 3.2)], t.light)
  drawRug(r, t)
  if (theme === 'night') r.poly([P(4.4, 1.6), P(7.2, 1.6), P(7.2, 3.6), P(4.4, 3.6)], t.light)
  drawShelf(r)
  drawDesk(r, frame)
  drawChair(r)
  drawAvatarInRoom(r, frame, wave)
  drawPlant(r)
}
