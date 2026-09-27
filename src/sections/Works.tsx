import { useRef, useState, type PointerEvent } from 'react';
import { IconDrag } from '../components/Icons';
import { useSiteData } from '../data/SiteDataContext';

// Рисунки-заглушки из макета — пока брат не загрузил настоящие фото.
const BeforeSketch = () => (
  <svg width="320" height="260" viewBox="0 0 320 260" fill="none" stroke="#8A919C" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" style={{ maxWidth: '80%' }}>
    <path d="M30 150h120v90H30zM30 150l20-22h120l-20 22M150 150l20-22v90l-20 22M170 170h120v70H170zM170 170l16-18h120l-16 18M290 170l16-18v70l-16 18M80 60h140v68H80zM80 60l18-20h140l-18 20M220 60l18-20v68l-18 20M75 150v-10h40v10" />
  </svg>
);
const AfterSketch = () => (
  <svg width="300" height="360" viewBox="0 0 300 360" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" style={{ maxWidth: '70%', maxHeight: '80%' }}>
    <path d="M40 30h200v300H40zM40 30l24-16h200l-24 16M240 30l24-16v296l-24 20M140 30v230M40 260h200M140 260v70M128 130v34M152 130v34M80 295h26M174 295h26" />
  </svg>
);

export default function Works() {
  const data = useSiteData();
  const projects = data?.portfolio ?? [];
  const [projId, setProjId] = useState<string | null>(null);
  const [pos, setPos] = useState(52);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const proj = projects.find((p) => p.id === projId) ?? projects[0];

  const moveTo = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <section id="works" className="sec" data-scene="scatter">
      <div className="wrap">
        <div className="works-head">
          <div>
            <div className="kicker">04 — НАШИ РАБОТЫ</div>
            <h2 className="h2">До и после</h2>
          </div>
          {projects.length > 1 && (
            <div className="chips" role="group" aria-label="Проекты">
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="chip"
                  aria-pressed={p.id === proj?.id}
                  onClick={() => {
                    setProjId(p.id);
                    setPos(52);
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          ref={boxRef}
          className="ba"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="ba-layer ba-before">
            {proj?.before_url ? <img src={proj.before_url} alt={`${proj.title} — до сборки`} loading="lazy" /> : <BeforeSketch />}
            <div className="ba-tag ba-tag-l">ДО{proj?.before_url ? '' : ' · [ФОТО КОРОБОК]'}</div>
          </div>
          <div className="ba-layer ba-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            {proj?.after_url ? <img src={proj.after_url} alt={`${proj.title} — после сборки`} loading="lazy" /> : <AfterSketch />}
            <div className="ba-tag ba-tag-r">ПОСЛЕ · {(proj?.title ?? '').toUpperCase()}</div>
          </div>
          <div className="ba-line" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="ba-knob">
              <IconDrag />
            </span>
          </div>
          <label htmlFor="ba" className="sr-only">
            Сравнить до и после
          </label>
          <input
            id="ba"
            className="ba-range"
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
}
