import type { Dispatch, SetStateAction } from 'react';
import { IconPhone } from '../components/Icons';
import { CALC_ITEMS } from '../data/items';
import { priceOf, useSiteData } from '../data/SiteDataContext';
import { calcTotal, fmtMoney, type CalcState } from '../lib/calc';
import { telHref } from '../lib/phone';

type Props = {
  calc: CalcState;
  setCalc: Dispatch<SetStateAction<CalcState>>;
  onOrder: () => void;
};

export default function Calculator({ calc, setCalc, onOrder }: Props) {
  const data = useSiteData();
  const show = data?.settings.show_prices ?? true;
  const price = priceOf(data, calc.type);
  const total = data && price != null ? calcTotal(calc, price, data.settings.floor_fee, data.settings.dismantle_pct) : null;
  const upd = (patch: Partial<CalcState>) => setCalc((s) => ({ ...s, ...patch }));

  return (
    <section id="calc" className="sec sec-center" data-scene="kitchen" data-side="right" style={{ minHeight: '90vh' }}>
      <div className="wrap split">
        <div>
          <div className="kicker">03 — КАЛЬКУЛЯТОР</div>
          <h2 className="h2" style={{ marginBottom: 32 }}>
            Сколько это стоит?
          </h2>

          {show ? (
            <div className="glass calc">
              <div>
                <div className="lbl" id="calc-type">
                  ЧТО СОБРАТЬ
                </div>
                <div className="chips" role="group" aria-labelledby="calc-type">
                  {CALC_ITEMS.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      className="chip"
                      aria-pressed={calc.type === it.id}
                      onClick={() => upd({ type: it.id })}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="g2" style={{ gap: 24 }}>
                <div>
                  <div className="lbl">КОЛИЧЕСТВО</div>
                  <div className="stepper">
                    <button type="button" className="step" aria-label="Меньше" disabled={calc.qty <= 1} onClick={() => upd({ qty: Math.max(1, calc.qty - 1) })}>
                      −
                    </button>
                    <output aria-live="polite">{calc.qty}</output>
                    <button type="button" className="step" aria-label="Больше" disabled={calc.qty >= 20} onClick={() => upd({ qty: Math.min(20, calc.qty + 1) })}>
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <div className="lbl">ЭТАЖ</div>
                  <div className="stepper">
                    <button type="button" className="step" aria-label="Ниже" disabled={calc.floor <= 1} onClick={() => upd({ floor: Math.max(1, calc.floor - 1) })}>
                      −
                    </button>
                    <output aria-live="polite">{calc.floor}</output>
                    <button type="button" className="step" aria-label="Выше" disabled={calc.floor >= 30} onClick={() => upd({ floor: Math.min(30, calc.floor + 1) })}>
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="g2" style={{ gap: 12 }}>
                <button type="button" className="toggle" aria-pressed={calc.lift} onClick={() => upd({ lift: !calc.lift })}>
                  <span>Есть лифт</span>
                  <span className="switch" />
                </button>
                <button type="button" className="toggle" aria-pressed={calc.dis} onClick={() => upd({ dis: !calc.dis })}>
                  <span>Нужна разборка старой</span>
                  <span className="switch" />
                </button>
              </div>

              <div className="calc-foot">
                <div>
                  <div className="lbl" style={{ marginBottom: 0 }}>
                    ПРИМЕРНО
                  </div>
                  <div className="total" aria-live="polite">
                    ≈ {total == null ? '…' : fmtMoney(total)} <span className="accent">₸</span>
                  </div>
                  <div className="note">Цены актуальные — точную сумму подтвердим по телефону</div>
                </div>
                <a className="btn btn-md" href="#order" onClick={onOrder}>
                  Оформить заявку
                </a>
              </div>
            </div>
          ) : (
            <div className="glass byphone">
              <div className="total" style={{ fontSize: 32 }}>
                Цена — по звонку
              </div>
              <p>Стоимость зависит от мебели и адреса. Позвоните или оставьте заявку — перезвоним и назовём точную цену.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="btn btn-md" href="#order">
                  Оставить заявку
                </a>
                <a className="ghost btn-md" href={telHref(data?.settings.phone ?? '')}>
                  <IconPhone />
                  Позвонить
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="stage" style={{ height: 560 }} />
      </div>
    </section>
  );
}
