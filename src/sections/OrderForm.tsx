import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { IconCamera, IconCheckCircle, IconClose } from '../components/Icons';
import { submitOrder } from '../data/api';
import { CALC_ITEMS, ORDER_ITEMS, TIME_SLOTS } from '../data/items';
import { priceOf, useSiteData } from '../data/SiteDataContext';
import type { ItemType, TimeSlot } from '../data/types';
import { calcTotal, fmtMoney, type CalcState } from '../lib/calc';
import { compressImage } from '../lib/images';
import { formatPhoneInput, normalizePhone } from '../lib/phone';
import { load, save } from '../lib/storage';
import type { LastOrder } from './OrderStatus';

const MAX_PHOTOS = 5;
const COOLDOWN_MS = 60_000; // не чаще одной заявки в минуту с одного устройства
const LAST_SENT_KEY = 'nem:lastSentAt';

type Photo = { blob: Blob; url: string };

type Props = {
  calc: CalcState;
  item: ItemType;
  setItem: (t: ItemType) => void;
  onSent: (o: LastOrder) => void;
};

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function OrderForm({ calc, item, setItem, onSent }: Props) {
  const data = useSiteData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<TimeSlot>('morning');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // ловушка для ботов (honeypot)
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [bad, setBad] = useState<Record<string, boolean>>({});
  const [sentCode, setSentCode] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Освобождаем память от превью фото
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  // Если вид мебели совпадает с калькулятором — берём оттуда кол-во, этаж и т.д.
  const fromCalc = CALC_ITEMS.some((x) => x.id === item) && item === calc.type;
  const showPrices = data?.settings.show_prices ?? false;
  const price = priceOf(data, item);
  const estimate =
    fromCalc && showPrices && data && price != null ? calcTotal(calc, price, data.settings.floor_fee, data.settings.dismantle_pct) : null;

  const addPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    e.target.value = '';
    const room = MAX_PHOTOS - photos.length;
    if (!files.length || room <= 0) return;
    setPhotoBusy(true);
    try {
      const out: Photo[] = [];
      for (const f of files.slice(0, room)) {
        const blob = await compressImage(f).catch(() => f);
        out.push({ blob, url: URL.createObjectURL(blob) });
      }
      setPhotos((p) => [...p, ...out].slice(0, MAX_PHOTOS));
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = (i: number) =>
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, k) => k !== i);
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const p = normalizePhone(phone);
    const nextBad = { name: !name.trim(), phone: !p, address: !address.trim() };
    setBad(nextBad);
    if (nextBad.name || nextBad.phone || nextBad.address) {
      setError(nextBad.phone && phone ? 'Проверьте номер телефона' : 'Заполните имя, телефон и адрес');
      return;
    }

    const lastAt = load<number>(LAST_SENT_KEY) ?? 0;
    if (Date.now() - lastAt < COOLDOWN_MS) {
      setError('Заявка уже отправлена. Если нужно отправить ещё одну — подождите минуту.');
      return;
    }

    setBusy(true);
    try {
      // Бот заполнил скрытое поле — делаем вид, что всё хорошо, но ничего не отправляем
      const code = website
        ? String(1000 + Math.floor(Math.random() * 9000))
        : (
            await submitOrder(
              {
                name: name.trim(),
                phone: p!,
                address: address.trim(),
                date,
                time_slot: slot,
                item_type: item,
                qty: fromCalc ? calc.qty : 1,
                floor: fromCalc ? calc.floor : 1,
                has_lift: fromCalc ? calc.lift : true,
                needs_dismantle: fromCalc ? calc.dis : false,
                comment: comment.trim(),
                estimated_price: estimate,
              },
              photos.map((x) => x.blob),
            )
          ).publicCode;
      save(LAST_SENT_KEY, Date.now());
      setSentCode(code);
      if (!website) onSent({ phone: p!, code });
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error(err);
      setError('Не получилось отправить. Проверьте интернет и попробуйте ещё раз — или просто позвоните нам.');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    photos.forEach((x) => URL.revokeObjectURL(x.url));
    setPhotos([]);
    setComment('');
    setDate('');
    setSentCode(null);
  };

  return (
    <section id="order" className="sec sec-center" data-scene="bolt" data-side="right" style={{ minHeight: '100vh' }}>
      <div className="wrap split">
        <div ref={topRef} style={{ scrollMarginTop: 90 }}>
          <div className="kicker">09 — ЗАЯВКА</div>
          <h2 className="h2" style={{ marginBottom: 32 }}>
            Оставьте заявку — перезвоним
          </h2>

          {sentCode ? (
            <div className="sent" role="status">
              <IconCheckCircle />
              <div className="sent-title">Заявка отправлена</div>
              <div className="code">
                <span>НОМЕР ЗАКАЗА</span>
                <b>{sentCode}</b>
              </div>
              <p>
                Сохраните номер — по нему и телефону можно проверить статус в разделе <a href="#status">«Мой заказ»</a>.
              </p>
              <p style={{ marginBottom: 28 }}>Перезвоним в течение [N] минут, чтобы подтвердить время.</p>
              <button type="button" className="ghost btn-md" onClick={reset}>
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form className="glass form" onSubmit={submit} noValidate>
              <div className="g2">
                <div>
                  <label htmlFor="f-name">Имя</label>
                  <input id="f-name" className="fld" type="text" autoComplete="name" placeholder="Как к вам обращаться" maxLength={80} aria-invalid={bad.name} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="f-phone">Телефон</label>
                  <input id="f-phone" className="fld" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 ___ ___ __ __" aria-invalid={bad.phone} value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} />
                </div>
              </div>
              <div>
                <label htmlFor="f-addr">Адрес</label>
                <input id="f-addr" className="fld" type="text" autoComplete="street-address" placeholder="Улица, дом, квартира, этаж" maxLength={200} aria-invalid={bad.address} value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="g2">
                <div>
                  <label htmlFor="f-date">Дата</label>
                  <input id="f-date" className="fld" type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="f-slot">Время</label>
                  <select id="f-slot" className="fld" value={slot} onChange={(e) => setSlot(e.target.value as TimeSlot)}>
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="f-item">Что собрать</label>
                <select id="f-item" className="fld" value={item} onChange={(e) => setItem(e.target.value as ItemType)}>
                  {ORDER_ITEMS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {fromCalc && (
                  <div className="calc-sum">
                    Из калькулятора: {calc.qty} шт · {calc.floor} этаж{calc.floor > 1 ? (calc.lift ? ', есть лифт' : ', без лифта') : ''}
                    {calc.dis ? ' · разборка старой' : ''}
                    {estimate != null ? ` · ≈ ${fmtMoney(estimate)} ₸` : ''} · <a href="#calc">изменить</a>
                  </div>
                )}
              </div>
              <div>
                <span className="flabel">Фото мебели или коробок · до {MAX_PHOTOS} шт</span>
                <div className="photos">
                  {photos.map((p, i) => (
                    <div key={p.url} className="thumb">
                      <img src={p.url} alt={`Фото ${i + 1}`} />
                      <button type="button" aria-label={`Удалить фото ${i + 1}`} onClick={() => removePhoto(i)}>
                        <IconClose size={14} />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <button type="button" className="add-photo" onClick={() => fileRef.current?.click()} disabled={photoBusy}>
                      <IconCamera />
                      {photoBusy ? '…' : 'Добавить'}
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} />
              </div>
              <div>
                <label htmlFor="f-comment">Комментарий</label>
                <textarea id="f-comment" className="fld" rows={3} maxLength={1000} placeholder="Например: нужен ещё монтаж полки" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>

              {/* Скрытое поле-ловушка: люди его не видят, боты заполняют */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="f-website">Сайт</label>
                <input id="f-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              {error && (
                <p className="err" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-lg" style={{ marginTop: 8 }} disabled={busy || photoBusy}>
                {busy ? 'Отправляем…' : 'Отправить заявку'}
              </button>
            </form>
          )}
        </div>
        <div className="stage" style={{ height: 560 }} />
      </div>
    </section>
  );
}
