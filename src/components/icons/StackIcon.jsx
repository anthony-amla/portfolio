import { SVG_BY_NAME, stackIconFor } from './stackIcons'

/**
 * Technology logo (devicon, MIT) inlined as SVG. Single-color logos use
 * `currentColor` and follow the theme.
 *
 * @param {object} props
 * @param {string} [props.icon] File name in src/assets/stack, without extension.
 * @param {string} [props.name] Technology name, used to find the logo when `icon` is not set.
 * @param {number} [props.size=40] Size in px.
 */
export default function StackIcon({ icon, name, size = 40 }) {
  const svg = SVG_BY_NAME[icon ?? (name && stackIconFor(name))]
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
