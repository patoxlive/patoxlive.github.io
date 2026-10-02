/**
 * Utilitários de geometria usados para desenhar os ovos em SVG no build.
 */
export const r1 = (n) => Math.round(n * 10) / 10;

/** Ovo = duas meias-elipses: a de cima (ryTop) mais alta que a de baixo (ryBottom). */
export function eggPath({ cx, cy, rx, ryTop, ryBottom }) {
  return `M${r1(cx - rx)} ${r1(cy)}A${rx} ${ryTop} 0 0 1 ${r1(cx + rx)} ${r1(cy)}A${rx} ${ryBottom} 0 0 1 ${r1(cx - rx)} ${r1(cy)}Z`;
}

export function eggPolygon({ cx, cy, rx, ryTop, ryBottom }, n = 160) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const s = Math.sin(t);
    pts.push([cx + rx * Math.cos(t), cy + (s < 0 ? ryTop : ryBottom) * s]);
  }
  return pts;
}

const cross = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);

function intersect(p, q, a, b) {
  const a1 = q[1] - p[1], b1 = p[0] - q[0], c1 = a1 * p[0] + b1 * p[1];
  const a2 = b[1] - a[1], b2 = a[0] - b[0], c2 = a2 * a[0] + b2 * a[1];
  const det = a1 * b2 - a2 * b1;
  return [(b2 * c1 - b1 * c2) / det, (a1 * c2 - a2 * c1) / det];
}

/** Recorte Sutherland–Hodgman: recorta `subject` pela forma convexa `clip`. */
export function clipToConvex(subject, clip) {
  let area = 0;
  for (let i = 0; i < clip.length; i++) {
    const [x1, y1] = clip[i], [x2, y2] = clip[(i + 1) % clip.length];
    area += x1 * y2 - x2 * y1;
  }
  const dir = area > 0 ? 1 : -1;
  let output = subject;
  for (let i = 0; i < clip.length && output.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length];
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const p = input[j], q = input[(j + 1) % input.length];
      const pin = dir * cross(a, b, p) >= 0, qin = dir * cross(a, b, q) >= 0;
      if (pin) {
        output.push(p);
        if (!qin) output.push(intersect(p, q, a, b));
      } else if (qin) {
        output.push(intersect(p, q, a, b));
      }
    }
  }
  return output;
}

export const polygonPath = (pts) => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + 'Z';
export const polylinePath = (pts) => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L');
