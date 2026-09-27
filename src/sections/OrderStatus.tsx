import { useEffect, useState, type FormEvent } from 'react';
import { IconSearch } from '../components/Icons';
import { checkOrderStatus } from '../data/api';
import type { OrderStatus as Status } from '../data/types';
import { formatPhoneInput, normalizePhone } from '../lib/phone';

export type LastOrder = { phone: string; code: string };

const STEPS = [
  { label: 'Заявка принята', note: 'Скоро перезвоним и подтвердим время' },
  { label: 'Мастера выехали', note: 'Уже едут к вам' },
  { label: 'Идёт сборка', note: 'Работаем у вас' },
  { label: 'Готово', note: 'Проверяем вместе с вами' },
];
const STEP_OF: Record<Exclude<Status, 'cancelled'>, number> = { new: 0, on_way: 1, assembling: 2, done: 3 };

type Result =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; status: Status; code: string }
  | { kind: 'notfound' }
  | { kind: 'error'; text: string };

export default function OrderStatus({ lastOrder }: { lastOrder: LastOrder | null }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [res, setRes] = useState<Result>({ kind: 'idle' });

  // Подставляем данные последней заявки с этого телефона
  useEffect(() => {
    if (!lastOrder) return;
    setPhone(formatPhoneInput(lastOrder.phone));
    setCode(lastOrder.code);
  }, [lastOrder]);

  const check = async (e: FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!p) return setRes({ kind: 'error', text: 'Проверьте номер телефона' });
    if (!code.trim()) return setRes({ kind: 'error', text: 'Введите номер заказа' });
    setRes({ kind: 'loading' });
    try {
      const st = await checkOrderStatus(p, code.trim());
      setRes(st ? { kind: 'found', status: st, code: code.trim() } : { kind: 'notfound' });
    } catch {
      setRes({ kind: 'error', text: 'Не получилось проверить. Попробуйте ещё раз.' });
    }
  };

  return (
    <section id="status" className="sec" data-scene="scatter" style={{ padding: '100px 0' }}>
      <div className="wrap split" style={{ alignItems: 'start' }}>
        <div>
          <div className="kicker">05 — МОЙ ЗАКАЗ</div>
          <h2 className="h2" style={{ marginBottom: 20 }}>
            Где мастера сейчас?
          </h2>
          <p className="lead">Введите телефон и номер заказа из заявки — покажем, на каком этапе ваш заказ.</p>
          <form className="status-form" onSubmit={check} noValidate>
            <label htmlFor="st-phone" className="sr-only">
              Номер телефона
            </label>
            <input
              id="st-phone"
              className="fld"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 ___ ___ __ __"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
            />
            <div className="status-row">
              <label htmlFor="st-code" className="sr-only">
                Номер заказа
              </label>
              <input
                id="st-code"
                className="fld"
                type="text"
                inputMode="numeric"
                placeholder="Номер заказа"
                maxLength={12}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
              />
              <button type="submit" className="btn btn-md" style={{ borderRadius: 12 }} disabled={res.kind === 'loading'}>
                {res.kind === 'loading' ? 'Ищем…' : 'Проверить'}
              </button>
            </div>
          </form>
        </div>

        <div className="glass status-card" aria-live="polite">
          {res.kind === 'found' && res.status !== 'cancelled' && (
            <>
              <div className="status-top">
                <span>ЗАКАЗ № {res.code}</span>
              </div>
              <div>
                {STEPS.map((s, i) => {
                  const active = STEP_OF[res.status as Exclude<Status, 'cancelled'>];
                  const cls = 'tl' + (i <= active ? ' on' : '') + (i < active ? ' past' : '');
                  return (
                    <div key={s.label} className={cls}>
                      <div className="tl-rail">
                        <span className={'tl-dot' + (i === active && active < 3 ? ' pulse' : '')} style={i === active && active === 3 ? { background: 'var(--accent)' } : undefined} />
                        <span className="tl-line" />
                      </div>
                      <div className="tl-txt">
                        <b>{s.label}</b>
                        <span>{s.note}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {res.kind === 'found' && res.status === 'cancelled' && (
            <div className="empty">
              Заказ № {res.code} отменён.
              <br />
              Если это ошибка — позвоните нам.
            </div>
          )}
          {res.kind === 'notfound' && (
            <div className="empty">
              Заказ не найден.
              <br />
              Проверьте телефон и номер заказа.
            </div>
          )}
          {res.kind === 'error' && <div className="empty">{res.text}</div>}
          {(res.kind === 'idle' || res.kind === 'loading') && (
            <div className="empty">
              <IconSearch />
              Здесь появится статус заказа
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
