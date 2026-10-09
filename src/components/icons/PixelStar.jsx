/**
 * Rows of a 9x9 pixel star, as [y, x start, width]. Render it at a multiple
 * of 9px (9, 18, 27, 36) so every star pixel maps to whole screen pixels;
 * other sizes blur or jag the edges.
 */
const STAR_ROWS = [
  [0, 4, 1],
  [1, 4, 1],
  [2, 3, 3],
  [3, 0, 9],
  [4, 1, 7],
  [5, 2, 5],
  [6, 1, 7],
  [7, 1, 2],
  [7, 6, 2],
  [8, 0, 2],
  [8, 7, 2],
]

/**
 * Pixel art star, filled (gold) or empty.
 *
 * @param {{ filled: boolean, size?: number }} props
 */
export function PixelStar({ filled, size = 18 }) {
  return (
    <svg
      className={`pixel-star${filled ? ' pixel-star-filled' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {STAR_ROWS.map(([y, x, width]) => (
        <rect key={`${y}-${x}`} x={x} y={y} width={width} height="1" />
      ))}
    </svg>
  )
}

/**
 * Row of five stars with an accessible label.
 *
 * @param {{ rating: number, label: string, size?: number }} props
 */
export default function PixelStars({ rating, label, size }) {
  return (
    <span className="pixel-stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <PixelStar key={star} filled={star <= rating} size={size} />
      ))}
    </span>
  )
}
