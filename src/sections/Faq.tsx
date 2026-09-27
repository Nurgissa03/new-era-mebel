import { useState } from 'react';
import { IconPlus } from '../components/Icons';

// Ответы в [квадратных скобках] — заглушки, заменим на ваши.
const FAQ = [
  { q: 'Сколько длится сборка?', a: 'Зависит от мебели: шкаф — обычно [N] часа, кухня — [N] часов. Точное время скажем, когда увидим фото.' },
  { q: 'Нужно ли что-то подготовить?', a: 'Освободите место, где будет стоять мебель, и не выбрасывайте инструкцию и пакеты с фурнитурой. Инструмент у нас свой.' },
  { q: 'Как оплатить?', a: 'После сборки и проверки — наличными или переводом [укажите способы].' },
  { q: 'Есть ли гарантия?', a: 'Да, на нашу сборку — [срок гарантии]. Если что-то разболтается, приедем и подтянем.' },
  { q: 'Вывозите упаковку?', a: '[Да / нет / за доплату — укажите, как у вас принято].' },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="sec" data-scene="scatter" style={{ padding: '120px 0' }}>
      <div className="wrap" style={{ maxWidth: 900 }}>
        <div className="kicker">08 — ВОПРОСЫ</div>
        <h2 className="h2">Частые вопросы</h2>
        <div className="faq">
          {FAQ.map((f, i) => (
            <div key={f.q} className="faq-item">
              <button
                type="button"
                className="faq-q"
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q}
                <IconPlus />
              </button>
              {open === i && (
                <p id={`faq-a-${i}`} className="faq-a">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
