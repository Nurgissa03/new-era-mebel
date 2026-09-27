// Движок эффекта точек (перенесено из design/Main.dc.html, runDots, + телефонный
// цикл фигур из design/Mobile.dc.html).
//
// Как это работает:
// - у секций страницы есть data-scene (wardrobe/bed/kitchen/table/bolt/scatter)
//   и data-side (left/right). Движок смотрит, какая секция сейчас в центре экрана,
//   и тянет каждую точку к её месту в силуэте этой секции (пружина);
// - между двумя секциями цель плавно смешивается — точки «перетекают»;
// - на телефоне главный экран (data-cycle="1") сам меняет фигуры по кругу;
// - в кадре ничего не создаётся: все данные в заранее выделенных typed arrays.

import { buildShapes, CYCLE, cycleStore, type ShapeName } from './shapes';

interface Sec {
  el: HTMLElement;
  shape: string;
  side: string;
  cycle: boolean;
}

interface Place {
  scatter: boolean;
  cycle: boolean;
  a1: Float32Array | null;
  a2: Float32Array | null;
  mix: number;
  burst: number;
  cx: number;
  cy: number;
  S: number;
}

const PERIOD = 4.6; // секунд на одну фигуру в телефонном цикле
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const newPlace = (): Place => ({ scatter: true, cycle: false, a1: null, a2: null, mix: 0, burst: 0, cx: 0, cy: 0, S: 0 });

/** Запускает анимацию на canvas. Возвращает функцию остановки. */
export function startDots(cv: HTMLCanvasElement): () => void {
  const ctx = cv.getContext('2d');
  if (!ctx) return () => {};

  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = rm.matches;
  const onRm = () => {
    reduce = rm.matches;
  };

  const small = window.innerWidth < 900;
  const N = small ? 900 : 1500; // точки фигуры
  const M = small ? 110 : 240; // фоновые точки
  const shapes = buildShapes(N) as Partial<Record<string, Float32Array>>;
  const cycleShapes = CYCLE.map((k: ShapeName) => shapes[k]!);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0;
  let H = 0;
  let narrow = false;
  let accent = '#4C8DFF';
  const resize = () => {
    W = window.innerWidth || 1;
    H = window.innerHeight || 1;
    narrow = W < 900;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || accent;
  };
  resize();

  // Состояние точек
  const px = new Float32Array(N), py = new Float32Array(N);
  const vx = new Float32Array(N), vy = new Float32Array(N);
  const z = new Float32Array(N), sd = new Float32Array(N);
  const sx = new Float32Array(N), sy = new Float32Array(N);
  const ac = new Uint8Array(N); // 1 = акцентная точка (~12%)
  for (let i = 0; i < N; i++) {
    px[i] = Math.random() * W;
    py[i] = Math.random() * H;
    z[i] = 0.35 + Math.random() * 0.65;
    sd[i] = Math.random() * 6.283;
    sx[i] = Math.random();
    sy[i] = Math.random();
    ac[i] = Math.random() < 0.12 ? 1 : 0;
  }
  // Фоновые точки (параллакс)
  const ax = new Float32Array(M), ay = new Float32Array(M), az = new Float32Array(M);
  for (let k = 0; k < M; k++) {
    ax[k] = Math.random();
    ay[k] = Math.random();
    az[k] = 0.2 + Math.random() * 0.8;
  }

  const NEAR_MAX = 26;
  const near = new Int32Array(NEAR_MAX);

  let secs: Sec[] = [];
  let cs = new Float64Array(32);
  const readScenes = () => {
    secs = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'), (el) => ({
      el,
      shape: el.dataset.scene || 'scatter',
      side: el.dataset.side || 'right',
      cycle: el.dataset.cycle === '1',
    }));
    if (cs.length < secs.length) cs = new Float64Array(secs.length * 2);
  };
  readScenes();

  // Мышь / палец
  let mx = -9999;
  let my = -9999;
  const onMove = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  const onLeave = () => {
    mx = -9999;
    my = -9999;
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') onLeave();
  };
  const onDown = (e: PointerEvent) => {
    if (reduce) return;
    const cx = e.clientX, cy = e.clientY;
    for (let i = 0; i < N; i++) {
      const dx = px[i] - cx, dy = py[i] - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < 200) {
        const f = (1 - d / 200) * 16;
        vx[i] += (dx / d) * f;
        vy[i] += (dy / d) * f;
      }
    }
  };

  // Телефонный цикл фигур (обновляется каждый кадр)
  let cycA = 0, cycB = 1, cycMix = 0, cycBurst = 0;

  const pa = newPlace();
  const pb = newPlace();
  const place = (d: Sec | null, out: Place) => {
    out.cycle = false;
    out.burst = 0;
    out.mix = 0;
    if (!d) {
      out.scatter = true;
      return;
    }
    if (narrow && d.cycle) {
      out.scatter = false;
      out.cycle = true;
      out.a1 = cycleShapes[cycA];
      out.a2 = cycleShapes[cycB];
      out.mix = cycMix;
      out.burst = cycBurst;
      out.cx = W * 0.5;
      out.cy = H * 0.265;
      out.S = Math.min(W * 0.77, H * 0.34);
      return;
    }
    const arr = shapes[d.shape];
    if (!arr) {
      out.scatter = true;
      return;
    }
    out.scatter = false;
    out.a1 = arr;
    out.a2 = arr;
    const half = Math.min(W, 1240) / 2;
    out.S = narrow ? Math.min(W * 0.82, H * 0.46) : Math.min(H * 0.64, W * 0.34);
    out.cx = narrow ? W * 0.5 : d.side === 'left' ? W / 2 - half * 0.5 : d.side === 'center' ? W / 2 : W / 2 + half * 0.5;
    out.cy = narrow ? H * 0.5 : H * 0.54;
  };

  let prevTop: number | null = null;
  let frameN = 0;
  let raf = 0;
  let stopped = false;
  const t0 = performance.now();

  const frame = (now: number) => {
    raf = 0;
    if (stopped) return;
    frameN++;
    if (frameN % 90 === 0 || !secs.length || !secs[0].el.isConnected) readScenes();
    // Время первого кадра бывает чуть меньше t0 — не даём ему уйти в минус
    const t = Math.max(0, (now - t0) / 1000);

    // Цикл фигур для телефона
    const k = Math.floor(t / PERIOD);
    const ph = (t % PERIOD) / PERIOD;
    cycA = k % CYCLE.length;
    cycB = (k + 1) % CYCLE.length;
    cycMix = smooth(clamp01((ph - 0.72) / 0.28));
    cycBurst = Math.sin(cycMix * Math.PI);
    cycleStore.set(cycMix > 0.5 ? cycB : cycA);

    // Какая секция сейчас в центре экрана и насколько мы продвинулись к следующей
    let A: Sec | null = null;
    let B: Sec | null = null;
    let e = 0;
    let top0 = 0;
    const n = secs.length;
    if (n) {
      const mid = H / 2;
      let last = -1;
      for (let q = 0; q < n; q++) {
        const r = secs[q].el.getBoundingClientRect();
        if (q === 0) top0 = r.top;
        cs[q] = r.top + r.height / 2 - mid;
        if (cs[q] <= 0) last = q;
      }
      if (last < 0) {
        A = B = secs[0];
      } else if (last >= n - 1) {
        A = B = secs[n - 1];
      } else {
        A = secs[last];
        B = secs[last + 1];
        const tt = -cs[last] / (cs[last + 1] - cs[last]);
        e = smooth(clamp01((tt - 0.25) / 0.5));
      }
    }
    place(A, pa);
    place(B, pb);

    // Скорость прокрутки — точки «тянутся» за страницей
    let sv = prevTop === null ? 0 : prevTop - top0;
    prevTop = top0;
    if (reduce) sv = 0;
    sv = Math.max(-70, Math.min(70, sv));
    const scroll = -top0;

    const scat = (pa.scatter ? 1 - e : 0) + (pb.scatter ? e : 0);
    const cyc = (pa.cycle ? 1 - e : 0) + (pb.cycle ? e : 0);
    let alphaMul = 0.95 - scat * 0.6;
    if (narrow) alphaMul *= 0.5 + 0.5 * cyc; // на телефоне фигуры бледнее, кроме главного экрана

    ctx.clearRect(0, 0, W, H);

    // Фоновые точки
    ctx.fillStyle = '#FFFFFF';
    const mouseOn = mx > -9000;
    for (let q = 0; q < M; q++) {
      const zz = az[q];
      let y = ay[q] * H - scroll * zz * 0.35 - t * 6 * zz;
      y = ((y % H) + H) % H;
      const x = ax[q] * W + (mouseOn ? (mx - W / 2) * -0.02 * zz : 0);
      ctx.globalAlpha = (0.07 + zz * 0.28) * (0.65 + 0.35 * Math.sin(t * 1.3 + q));
      const sz = 0.7 + zz * 1.1;
      ctx.fillRect(x, y, sz, sz);
    }

    // Физика точек фигуры
    const R = 130, R2 = R * R;
    const kS = reduce ? 0.2 : 0.05;
    const damp = 0.84;
    const wob = reduce ? 0 : 1.1 + scat * 14 + (pa.burst * (1 - e) + pb.burst * e) * 22;
    let nearN = 0;
    for (let i = 0; i < N; i++) {
      const i2 = i * 2;
      let tax: number, tay: number, tbx: number, tby: number;
      if (pa.scatter) {
        tax = sx[i] * W;
        tay = sy[i] * H;
      } else {
        const a1 = pa.a1!, a2 = pa.a2!;
        tax = pa.cx + (a1[i2] + (a2[i2] - a1[i2]) * pa.mix) * pa.S;
        tay = pa.cy + (a1[i2 + 1] + (a2[i2 + 1] - a1[i2 + 1]) * pa.mix) * pa.S;
      }
      if (pb.scatter) {
        tbx = sx[i] * W;
        tby = sy[i] * H;
      } else {
        const a1 = pb.a1!, a2 = pb.a2!;
        tbx = pb.cx + (a1[i2] + (a2[i2] - a1[i2]) * pb.mix) * pb.S;
        tby = pb.cy + (a1[i2 + 1] + (a2[i2 + 1] - a1[i2 + 1]) * pb.mix) * pb.S;
      }
      let tx = tax + (tbx - tax) * e;
      let ty = tay + (tby - tay) * e;
      if (wob) {
        tx += Math.sin(t * 0.7 + sd[i]) * wob;
        ty += Math.cos(t * 0.6 + sd[i] * 1.7) * wob;
      }
      vx[i] += (tx - px[i]) * kS;
      vy[i] += (ty - py[i]) * kS;
      py[i] -= sv * z[i] * 0.8;
      if (mouseOn) {
        const dx = px[i] - mx, dy = py[i] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 3.4;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
          if (nearN < NEAR_MAX && d > 30) near[nearN++] = i;
        }
      }
      vx[i] *= damp;
      vy[i] *= damp;
      px[i] += vx[i];
      py[i] += vy[i];
    }

    // Точки: сначала белые, потом акцентные
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? accent : '#FFFFFF';
      for (let i = 0; i < N; i++) {
        if (ac[i] !== pass) continue;
        ctx.globalAlpha = alphaMul * (0.4 + z[i] * 0.6);
        const sz = 1.1 + z[i] * 1.4;
        ctx.fillRect(px[i] - sz / 2, py[i] - sz / 2, sz, sz);
      }
    }

    // Хвосты у быстрых точек
    ctx.globalAlpha = 0.3 * alphaMul;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      if (vx[i] * vx[i] + vy[i] * vy[i] > 5) {
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(px[i] - vx[i] * 3, py[i] - vy[i] * 3);
      }
    }
    ctx.stroke();

    // Линии от курсора к ближним точкам
    if (nearN) {
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      for (let q = 0; q < nearN; q++) {
        ctx.moveTo(mx, my);
        ctx.lineTo(px[near[q]], py[near[q]]);
      }
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
  };

  // Вкладка скрыта — не рисуем
  const onVis = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf && !stopped) {
      prevTop = null;
      raf = requestAnimationFrame(frame);
    }
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onLeave, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVis);
  rm.addEventListener('change', onRm);
  if (!document.hidden) raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onLeave);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVis);
    rm.removeEventListener('change', onRm);
  };
}
