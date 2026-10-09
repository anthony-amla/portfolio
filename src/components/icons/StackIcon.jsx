const SOURCES = import.meta.glob('../../assets/stack/*.svg', { query: '?raw', import: 'default', eager: true })

const SVG_BY_NAME = Object.fromEntries(
  Object.entries(SOURCES).map(([path, svg]) => [path.split('/').pop().replace('.svg', ''), svg]),
)

/**
 * Technology logo (devicon, MIT) inlined as SVG. Single-color logos use
 * `currentColor` and follow the theme.
 *
 * @param {object} props
 * @param {string} props.icon File name in src/assets/stack, without extension.
 * @param {number} [props.size=40] Size in px.
 */
export default function StackIcon({ icon, size = 40 }) {
  const svg = SVG_BY_NAME[icon]
  if (!svg) return null

  return (
    <span
      className="stack-icon"
      style={{ width: size, height: size }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
