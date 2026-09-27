import { useSyncExternalStore } from 'react';
import { IconArrow, IconPhone } from '../components/Icons';
import { useSiteData } from '../data/SiteDataContext';
import { CYCLE_LABELS, cycleStore } from '../lib/dots/shapes';
import { telHref } from '../lib/phone';

export default function Hero() {
  const data = useSiteData();
  const scene = useSyncExternalStore(cycleStore.subscribe, () => cycleStore.value);
  const phone = data?.settings.phone ?? '';

  return (
    // data-cycle: на телефоне фигуры на этом экране меняются сами по кругу
    <section className="hero" data-scene="wardrobe" data-side="right" data-cycle="1">
      <div className="wrap split hero-in">
        <div>
          <div className="badge badge-d i1">
            <span className="dot pulse" />
            ТУРКЕСТАН · СБОРКА МЕБЕЛИ
          </div>
          <div className="badge badge-m i1" aria-hidden="true">
            <span className="dot pulse" />
            <span>СОБИРАЕМ:</span>
            <b key={scene} className="swap">
              {CYCLE_LABELS[scene]}
            </b>
          </div>
          <h1 className="h1 i2">
            Соберём мебель
            <br />
            точно<span className="accent">.</span>
          </h1>
          <p className="hero-p i3">
            Семейная бригада — отец и сын. Шкафы, кухни, кровати и всё, что приехало в коробках. Аккуратно, по инструкции, без
            спешки.
          </p>
          <div className="hero-actions i4">
            <a className="btn btn-lg" href="#calc">
              Рассчитать стоимость
              <IconArrow />
            </a>
            <a className="ghost btn-lg" href={telHref(phone)}>
              <IconPhone />
              Позвонить
            </a>
          </div>
          <a className="hero-calc-m i4" href="#calc">
            <span>Рассчитать стоимость</span>
            <IconArrow />
          </a>
          <div className="stats i4">
            <span>
              <b>[N] лет</b>
              <br />
              опыта сборки
            </span>
            <span>
              <b>Свой</b>
              <br />
              инструмент
            </span>
            <span>
              <b>Весь</b>
              <br />
              город
            </span>
          </div>
        </div>
        <div className="stage" />
      </div>
      <div className="scroll-hint" aria-hidden="true">
        ЛИСТАЙТЕ — МЕБЕЛЬ СОБЕРЁТСЯ
        <span className="scroll-line">
          <span />
        </span>
      </div>
    </section>
  );
}
