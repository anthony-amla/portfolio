/** Pixel art country flags on a 20x14 grid. */

function BrazilFlag() {
  return (
    <>
      <rect width="20" height="14" fill="#009c3b" />
      <g fill="#ffdf00">
        <rect x="9" y="1" width="2" height="1" />
        <rect x="7" y="2" width="6" height="1" />
        <rect x="5" y="3" width="10" height="1" />
        <rect x="3" y="4" width="14" height="1" />
        <rect x="2" y="5" width="16" height="1" />
        <rect x="1" y="6" width="18" height="2" />
        <rect x="2" y="8" width="16" height="1" />
        <rect x="3" y="9" width="14" height="1" />
        <rect x="5" y="10" width="10" height="1" />
        <rect x="7" y="11" width="6" height="1" />
        <rect x="9" y="12" width="2" height="1" />
      </g>
      <g fill="#002776">
        <rect x="8" y="4" width="4" height="1" />
        <rect x="7" y="5" width="6" height="1" />
        <rect x="6" y="6" width="8" height="2" />
        <rect x="7" y="8" width="6" height="1" />
        <rect x="8" y="9" width="4" height="1" />
      </g>
      <rect x="7" y="6" width="6" height="1" fill="#fff" />
    </>
  )
}

function UnitedKingdomFlag() {
  return (
    <>
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0L20 14M20 0L0 14" stroke="#fff" strokeWidth="3" />
      <path d="M0 0L20 14M20 0L0 14" stroke="#c8102e" strokeWidth="1" />
      <rect x="8" width="4" height="14" fill="#fff" />
      <rect y="5" width="20" height="4" fill="#fff" />
      <rect x="9" width="2" height="14" fill="#c8102e" />
      <rect y="6" width="20" height="2" fill="#c8102e" />
    </>
  )
}

const FLAGS = { br: BrazilFlag, gb: UnitedKingdomFlag }

/**
 * @param {object} props
 * @param {'br' | 'gb'} props.code
 * @param {number} [props.width=24] Width in px; height keeps the 10:7 ratio.
 */
export default function CountryFlag({ code, width = 24 }) {
  const Flag = FLAGS[code]
  if (!Flag) return null

  return (
    <svg
      className="country-flag"
      viewBox="0 0 20 14"
      width={width}
      height={(width * 14) / 20}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <Flag />
    </svg>
  )
}
