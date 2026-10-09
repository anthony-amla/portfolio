/**
 * Minimal pixel art rasterizer for canvas: everything is drawn with fillRect
 * on integer coordinates, so there is no anti-aliasing.
 */
export function createRaster(ctx) {
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), w, h)
  }

  function px(x, y, color) {
    rect(x, y, 1, 1, color)
  }

  /** Scanline polygon fill; a pixel is painted when its center is inside. */
  function poly(points, color) {
    let minY = Infinity
    let maxY = -Infinity
    for (const [, y] of points) {
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    ctx.fillStyle = color
    for (let y = Math.floor(minY); y < Math.ceil(maxY); y++) {
      const sy = y + 0.5
      const xs = []
      for (let k = 0; k < points.length; k++) {
        const [x1, y1] = points[k]
        const [x2, y2] = points[(k + 1) % points.length]
        if ((y1 <= sy && y2 > sy) || (y2 <= sy && y1 > sy)) {
          xs.push(x1 + ((sy - y1) * (x2 - x1)) / (y2 - y1))
        }
      }
      xs.sort((a, b) => a - b)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const a = Math.round(xs[k])
        const b = Math.round(xs[k + 1])
        if (b > a) ctx.fillRect(a, y, b - a, 1)
      }
    }
  }

  /** Bresenham line. */
  function line(x0, y0, x1, y1, color) {
    x0 = Math.round(x0)
    y0 = Math.round(y0)
    x1 = Math.round(x1)
    y1 = Math.round(y1)
    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx + dy
    ctx.fillStyle = color
    for (;;) {
      ctx.fillRect(x0, y0, 1, 1)
      if (x0 === x1 && y0 === y1) break
      const e2 = 2 * err
      if (e2 >= dy) {
        err += dy
        x0 += sx
      }
      if (e2 <= dx) {
        err += dx
        y0 += sy
      }
    }
  }

  function outline(points, color) {
    for (let k = 0; k < points.length; k++) {
      const [x1, y1] = points[k]
      const [x2, y2] = points[(k + 1) % points.length]
      line(x1, y1, x2, y2, color)
    }
  }

  /**
   * Draws a sprite from text rows; each character is a key of `colors`
   * ('.' or any unknown key is transparent).
   */
  function sprite(rows, x, y, colors) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r]
      for (let c = 0; c < row.length; c++) {
        const color = colors[row[c]]
        if (color) px(x + c, y + r, color)
      }
    }
  }

  return { rect, px, poly, line, outline, sprite }
}
