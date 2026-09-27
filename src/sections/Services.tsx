import { ServiceIcon } from '../components/Icons';
import { priceOf, useSiteData } from '../data/SiteDataContext';
import type { ItemType } from '../data/types';
import { fmtMoney } from '../lib/calc';

const SERVICES: { id: ItemType; title: string; text: string }[] = [
  { id: 'wardrobe', title: 'Шкафы и гардеробные', text: 'Распашные, купе, встроенные. Навесим двери и выставим по уровню.' },
  { id: 'kitchen', title: 'Кухни', text: 'Нижние и верхние модули, столешница, фасады, ручки.' },
  { id: 'bed', title: 'Кровати', text: 'С подъёмным механизмом, двухъярусные, диваны-кровати.' },
  { id: 'table', title: 'Столы и стулья', text: 'Обеденные, письменные, компьютерные — быстро и крепко.' },
  { id: 'kids', title: 'Детская мебель', text: 'Стенки, кроватки, столы. Крепим к стене, чтобы ничего не упало.' },
  { id: 'move', title: 'Разборка при переезде', text: 'Аккуратно разберём, подпишем детали и соберём на новом месте.' },
];

export default function Services() {
  const data = useSiteData();
  const show = data?.settings.show_prices ?? true;

  const priceText = (id: ItemType) => {
    if (!data) return '…';
    if (!show) return 'Цена — по звонку';
    const p = priceOf(data, id);
    return p == null ? 'Цена — по звонку' : `от ${fmtMoney(p)} ₸`;
  };

  return (
    <section id="services" className="sec" data-scene="scatter">
      <div className="wrap">
        <div className="kicker">01 — УСЛУГИ</div>
        <h2 className="h2" style={{ maxWidth: 720, marginBottom: 56 }}>
          Соберём всё, что пришло в коробках
        </h2>
        <div className="g3">
          {SERVICES.map((s) => (
            <div key={s.id} className="card svc">
              <ServiceIcon name={s.id} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="svc-price">{priceText(s.id)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
