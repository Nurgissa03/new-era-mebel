// Силуэты мебели для эффекта точек (перенесено из design/Main.dc.html, buildShapes).
// Каждая фигура — набор отрезков в квадрате 0..1. Точки равномерно
// раскладываются вдоль всех отрезков, потом перемешиваются, чтобы при
// переходе между фигурами они «перетекали», а не ползли по контуру.

export type ShapeName = 'wardrobe' | 'bed' | 'kitchen' | 'table' | 'bolt';

/** Фигуры, которые на телефоне сменяют друг друга на главном экране. */
export const CYCLE: ShapeName[] = ['wardrobe', 'bed', 'kitchen', 'table'];
export const CYCLE_LABELS = ['ШКАФЫ', 'КРОВАТИ', 'КУХНИ', 'СТОЛЫ'];

type Seg = [number, number, number, number];

const R = (a: number, b: number, c: number, d: number): Seg[] => [
  [a, b, c, b],
  [c, b, c, d],
  [c, d, a, d],
  [a, d, a, b],
];
const L = (a: number, b: number, c: number, d: number): Seg[] => [[a, b, c, d]];
const P = (pts: [number, number][]): Seg[] =>
  pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    return [p[0], p[1], q[0], q[1]];
  });
const E = (cx: number, cy: number, rx: number, ry: number, n: number): Seg[] => {
  const o: Seg[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const b = ((i + 1) / n) * Math.PI * 2;
    o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, cx + Math.cos(b) * rx, cy + Math.sin(b) * ry]);
  }
  return o;
};
const mirror = (segs: Seg[]): Seg[] => segs.map((s) => [1 - s[0], s[1], 1 - s[2], s[3]]);

function defs(): Record<ShapeName, Seg[]> {
  const chair = [...L(0.04, 0.3, 0.04, 0.86), ...R(0.02, 0.3, 0.06, 0.5), ...R(0.04, 0.6, 0.17, 0.63), ...L(0.16, 0.63, 0.16, 0.86)];
  const hex: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    hex.push([0.5 + Math.cos(a) * 0.44, 0.5 + Math.sin(a) * 0.44]);
  }
  return {
    wardrobe: [
      ...R(0.14, 0.06, 0.8, 0.94),
      ...P([[0.14, 0.06], [0.22, 0.01], [0.88, 0.01], [0.8, 0.06]]),
      ...P([[0.8, 0.06], [0.88, 0.01], [0.88, 0.89], [0.8, 0.94]]),
      ...L(0.47, 0.06, 0.47, 0.72), ...L(0.14, 0.72, 0.8, 0.72), ...L(0.47, 0.72, 0.47, 0.94),
      ...L(0.43, 0.34, 0.43, 0.46), ...L(0.51, 0.34, 0.51, 0.46),
      ...L(0.27, 0.83, 0.34, 0.83), ...L(0.6, 0.83, 0.67, 0.83),
      ...L(0.18, 0.94, 0.18, 0.98), ...L(0.76, 0.94, 0.76, 0.98),
    ],
    bed: [
      ...R(0.04, 0.3, 0.12, 0.82), ...R(0.12, 0.56, 0.9, 0.68), ...R(0.12, 0.68, 0.92, 0.76), ...R(0.9, 0.48, 0.96, 0.82),
      ...E(0.24, 0.52, 0.09, 0.035, 28), ...L(0.4, 0.555, 0.9, 0.555), ...L(0.4, 0.555, 0.46, 0.68),
      ...L(0.16, 0.76, 0.16, 0.84), ...L(0.88, 0.76, 0.88, 0.84),
    ],
    kitchen: [
      ...R(0.04, 0.08, 0.96, 0.36), ...L(0.35, 0.08, 0.35, 0.36), ...L(0.65, 0.08, 0.65, 0.36),
      ...L(0.16, 0.32, 0.23, 0.32), ...L(0.46, 0.32, 0.54, 0.32), ...L(0.77, 0.32, 0.84, 0.32),
      ...R(0.02, 0.56, 0.98, 0.59), ...R(0.04, 0.59, 0.96, 0.92),
      ...L(0.27, 0.59, 0.27, 0.92), ...L(0.5, 0.59, 0.5, 0.92), ...L(0.73, 0.59, 0.73, 0.92),
      ...L(0.12, 0.64, 0.19, 0.64), ...L(0.35, 0.64, 0.42, 0.64), ...L(0.58, 0.64, 0.65, 0.64), ...L(0.81, 0.64, 0.88, 0.64),
      ...E(0.66, 0.545, 0.05, 0.012, 18), ...E(0.82, 0.545, 0.05, 0.012, 18),
      ...L(0.26, 0.56, 0.26, 0.46), ...L(0.26, 0.46, 0.32, 0.46), ...L(0.32, 0.46, 0.32, 0.5),
    ],
    table: [
      ...R(0.22, 0.44, 0.78, 0.48), ...L(0.26, 0.48, 0.26, 0.86), ...L(0.74, 0.48, 0.74, 0.86),
      ...L(0.34, 0.48, 0.34, 0.8), ...L(0.66, 0.48, 0.66, 0.8),
      ...chair, ...mirror(chair),
      ...L(0.5, 0.02, 0.5, 0.16), ...P([[0.42, 0.26], [0.58, 0.26], [0.54, 0.16], [0.46, 0.16]]),
    ],
    bolt: [...P(hex), ...E(0.5, 0.5, 0.37, 0.37, 60), ...E(0.5, 0.5, 0.2, 0.2, 40)],
  };
}

/** Для каждой фигуры — Float32Array [x0, y0, x1, y1, ...] длиной N*2, координаты от -0.5 до 0.5. */
export function buildShapes(N: number): Record<ShapeName, Float32Array> {
  let seed = 1337;
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const all = defs();
  const out = {} as Record<ShapeName, Float32Array>;
  (Object.keys(all) as ShapeName[]).forEach((k) => {
    const segs = all[k];
    const lens = segs.map((s) => Math.hypot(s[2] - s[0], s[3] - s[1]));
    const tot = lens.reduce((a, b) => a + b, 0);
    const arr = new Float32Array(N * 2);
    let si = 0;
    let acc = 0;
    for (let j = 0; j < N; j++) {
      const d = ((j + 0.5) / N) * tot;
      while (si < segs.length - 1 && acc + lens[si] < d) {
        acc += lens[si];
        si++;
      }
      const sg = segs[si];
      const u = lens[si] ? Math.min(1, (d - acc) / lens[si]) : 0;
      arr[j * 2] = sg[0] + (sg[2] - sg[0]) * u - 0.5 + (rnd() - 0.5) * 0.006;
      arr[j * 2 + 1] = sg[1] + (sg[3] - sg[1]) * u - 0.5 + (rnd() - 0.5) * 0.006;
    }
    for (let j = N - 1; j > 0; j--) {
      const r = Math.floor(rnd() * (j + 1));
      const tx = arr[j * 2];
      const ty = arr[j * 2 + 1];
      arr[j * 2] = arr[r * 2];
      arr[j * 2 + 1] = arr[r * 2 + 1];
      arr[r * 2] = tx;
      arr[r * 2 + 1] = ty;
    }
    out[k] = arr;
  });
  return out;
}

/** Какая фигура сейчас на телефоне (для надписи «СОБИРАЕМ: …»). */
export const cycleStore = {
  value: 0,
  listeners: new Set<() => void>(),
  set(v: number) {
    if (v === this.value) return;
    this.value = v;
    this.listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    cycleStore.listeners.add(fn);
    return () => {
      cycleStore.listeners.delete(fn);
    };
  },
};
