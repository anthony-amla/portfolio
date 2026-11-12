/** 12x15 pixel hot-air balloon: envelope rows as [y, x start, width]. */
const ENVELOPE = [
  [0, 4, 4],
  [1, 2, 8],
  [2, 1, 10],
  [3, 0, 12],
  [4, 0, 12],
  [5, 0, 12],
  [6, 1, 10],
  [7, 2, 8],
  [8, 3, 6],
  [9, 4, 4],
]

/** Vertical stripes, 3 pixels wide, alternating the two envelope colors. */
const stripeOf = (x) => (Math.floor(x / 3) % 2 === 0 ? 'a' : 'b')

/** Envelope rows split into runs of the same stripe color. */
const ENVELOPE_RUNS = ENVELOPE.flatMap(([y, start, width]) => {
  const runs = []
  for (let x = start; x < start + width; x++) {
    const stripe = stripeOf(x)
    const last = runs.at(-1)
    if (last && last.stripe === stripe) last.width += 1
    else runs.push({ y, x, width: 1, stripe })
  }
  return runs
})

/**
 * Pixel hot-air balloon floating at the bottom of the hero with a sign that
 * scrolls to the next section.
 *
 * @param {{ href: string, label: string, ariaLabel: string }} props
 */
export default function ScrollBalloon({ href, label, ariaLabel }) {
  return (
    <a href={href} className="scroll-balloon" aria-label={ariaLabel}>
      <svg
        className="scroll-balloon-art"
        viewBox="0 0 12 15"
        width="48"
        height="60"
        shapeRendering="crispEdges"
        aria-hidden
      >
        {ENVELOPE_RUNS.map(({ y, x, width, stripe }) => (
          <rect key={`${y}-${x}`} className={`balloon-${stripe}`} x={x} y={y} width={width} height="1" />
        ))}
        <rect className="balloon-shine" x="2" y="3" width="1" height="2" />
        <rect className="balloon-rope" x="4" y="10" width="1" height="2" />
        <rect className="balloon-rope" x="7" y="10" width="1" height="2" />
        <rect className="balloon-basket" x="4" y="12" width="4" height="3" />
        <rect className="balloon-basket-shade" x="4" y="14" width="4" height="1" />
      </svg>
      <span className="scroll-balloon-sign">{label}</span>
    </a>
  )
}
