import { useState, type FormEvent } from 'react';
import { submitReview } from '../data/api';
import { useSiteData } from '../data/SiteDataContext';

export default function Reviews() {
  const data = useSiteData();
  const reviews = data?.reviews ?? [];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || text.trim().length < 5) return;
    setState('busy');
    try {
      await submitReview({ name: name.trim(), item: item.trim(), text: text.trim() });
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <section className="sec" data-scene="scatter" style={{ padding: '100px 0' }}>
      <div className="wrap">
        <div className="kicker">06 — ОТЗЫВЫ</div>
        <h2 className="h2" style={{ marginBottom: 48 }}>
          Что говорят клиенты
        </h2>
        {reviews.length > 0 ? (
          <div className="g3">
            {reviews.map((r) => (
              <figure key={r.id} className="card rv">
                <blockquote>«{r.text}»</blockquote>
                <figcaption>
                  {r.name}
                  {r.item ? ` · ${r.item}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="lead">Отзывы появятся после первых заказов.</p>
        )}

        <div className="rv-add">
          {!open && state !== 'done' && (
            <button type="button" className="ghost btn-md" onClick={() => setOpen(true)}>
              Оставить отзыв
            </button>
          )}
          {state === 'done' && <p className="lead">Спасибо за отзыв! Он появится на сайте после проверки.</p>}
          {open && state !== 'done' && (
            <form className="glass rv-form" onSubmit={send}>
              <div className="g2">
                <div>
                  <label className="flabel" htmlFor="rv-name">
                    Имя
                  </label>
                  <input id="rv-name" className="fld" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="flabel" htmlFor="rv-item">
                    Что собирали
                  </label>
                  <input id="rv-item" className="fld" maxLength={60} placeholder="Например: шкаф-купе" value={item} onChange={(e) => setItem(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="flabel" htmlFor="rv-text">
                  Отзыв
                </label>
                <textarea id="rv-text" className="fld" required minLength={5} maxLength={1000} rows={4} value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              {state === 'error' && <p className="err">Не получилось отправить. Попробуйте ещё раз.</p>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-md" disabled={state === 'busy'}>
                  {state === 'busy' ? 'Отправляем…' : 'Отправить отзыв'}
                </button>
                <button type="button" className="ghost btn-md" onClick={() => setOpen(false)}>
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
