import archive from 'pixelarticons/svg/archive.svg?raw'
import arrowRight from 'pixelarticons/svg/arrow-right.svg?raw'
import backpack from 'pixelarticons/svg/backpack.svg?raw'
import bag from 'pixelarticons/svg/briefcase.svg?raw'
import blocks from 'pixelarticons/svg/blocks.svg?raw'
import book from 'pixelarticons/svg/book-open.svg?raw'
import chart from 'pixelarticons/svg/chart-bar-big.svg?raw'
import check from 'pixelarticons/svg/check.svg?raw'
import chevronDown from 'pixelarticons/svg/chevron-down.svg?raw'
import chevronLeft from 'pixelarticons/svg/chevron-left.svg?raw'
import chevronRight from 'pixelarticons/svg/chevron-right.svg?raw'
import code from 'pixelarticons/svg/code.svg?raw'
import copy from 'pixelarticons/svg/copy.svg?raw'
import crown from 'pixelarticons/svg/crown.svg?raw'
import discord from 'pixelarticons/svg/discord.svg?raw'
import externalLink from 'pixelarticons/svg/external-link.svg?raw'
import flag from 'pixelarticons/svg/flag.svg?raw'
import gamepad from 'pixelarticons/svg/gamepad.svg?raw'
import gitBranch from 'pixelarticons/svg/git-branch.svg?raw'
import github from 'pixelarticons/svg/github.svg?raw'
import home from 'pixelarticons/svg/home.svg?raw'
import info from 'pixelarticons/svg/info-box.svg?raw'
import instagram from 'pixelarticons/svg/instagram.svg?raw'
import linkedin from 'pixelarticons/svg/linkedin.svg?raw'
import mail from 'pixelarticons/svg/mail.svg?raw'
import map from 'pixelarticons/svg/map.svg?raw'
import message from 'pixelarticons/svg/message.svg?raw'
import mic from 'pixelarticons/svg/mic.svg?raw'
import moon from 'pixelarticons/svg/moon.svg?raw'
import music from 'pixelarticons/svg/music.svg?raw'
import pause from 'pixelarticons/svg/pause.svg?raw'
import play from 'pixelarticons/svg/play.svg?raw'
import server from 'pixelarticons/svg/server.svg?raw'
import star from 'pixelarticons/svg/star.svg?raw'
import sun from 'pixelarticons/svg/sun.svg?raw'
import translate from 'pixelarticons/svg/languages.svg?raw'
import user from 'pixelarticons/svg/avatar-square.svg?raw'
import users from 'pixelarticons/svg/users.svg?raw'

const ICONS = {
  archive,
  arrowRight,
  backpack,
  bag,
  blocks,
  book,
  chart,
  check,
  chevronDown,
  chevronLeft,
  chevronRight,
  code,
  copy,
  crown,
  discord,
  email: mail,
  externalLink,
  flag,
  gamepad,
  gitBranch,
  github,
  home,
  info,
  instagram,
  linkedin,
  mail,
  map,
  message,
  mic,
  moon,
  music,
  pause,
  play,
  server,
  star,
  sun,
  translate,
  user,
  users,
}

/**
 * Pixel art icon from pixelarticons (MIT). Inherits the current text color.
 *
 * @param {object} props
 * @param {keyof typeof ICONS} props.name
 * @param {number} [props.size=20] Size in px.
 * @param {string} [props.label] Accessible name; omit for decorative icons.
 * @param {string} [props.className]
 */
export default function Icon({ name, size = 20, label, className = '' }) {
  const svg = ICONS[name]
  if (!svg) return null

  return (
    <span
      className={`px-icon ${className}`}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
