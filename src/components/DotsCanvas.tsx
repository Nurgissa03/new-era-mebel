import { useEffect, useRef } from 'react';
import { startDots } from '../lib/dots/engine';

/** Полноэкранный фон с точками, которые собираются в мебель при прокрутке. */
export default function DotsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return startDots(ref.current);
  }, []);

  return <canvas ref={ref} className="dots-canvas" aria-hidden="true" />;
}
