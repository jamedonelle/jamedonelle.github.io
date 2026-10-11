// Tiny helpers for drawing pixel art on a canvas where 1 canvas unit = 1 art pixel.

export function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Draw a sprite from rows of characters; '.' is transparent, others look up `colors`. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  colors: Record<string, string>,
  ox = 0,
  oy = 0,
) {
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.' && colors[ch]) px(ctx, ox + x, oy + y, colors[ch]);
    }),
  );
}

/** Bresenham line, one art pixel thick. */
export function line(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const xe = Math.round(x1);
  const ye = Math.round(y1);
  const dx = Math.abs(xe - x);
  const dy = -Math.abs(ye - y);
  const sx = x < xe ? 1 : -1;
  const sy = y < ye ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    px(ctx, x, y, color);
    if (x === xe && y === ye) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}
