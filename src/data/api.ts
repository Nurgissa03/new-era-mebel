// Единственное место, откуда сайт берёт и куда отправляет данные.
// Сейчас (этап 3) — тестовая версия без сервера. На этапе 4 здесь будут
// запросы к Supabase, а остальной код сайта менять не придётся.

import { MOCK } from './mock';
import type { OrderInput, OrderStatus, ReviewInput, SiteData } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Заказы, «созданные» в этой вкладке, — чтобы можно было проверить статус.
const mockOrders = new Map<string, { phone: string; status: OrderStatus }>([
  // Демо: телефон +7 700 000 00 00, номер 1234 → «Идёт сборка»
  ['1234', { phone: '77000000000', status: 'assembling' }],
]);

export async function fetchSiteData(): Promise<SiteData> {
  await wait(200);
  const data: SiteData = structuredClone(MOCK);
  // Для проверки режима «Цена — по звонку»: откройте сайт с ?noprices
  if (new URLSearchParams(window.location.search).has('noprices')) data.settings.show_prices = false;
  return data;
}

/** Создаёт заявку и возвращает короткий номер заказа для клиента. */
export async function submitOrder(input: OrderInput, photos: Blob[]): Promise<{ publicCode: string }> {
  await wait(800);
  void photos;
  let code = '';
  do code = String(1000 + Math.floor(Math.random() * 9000));
  while (mockOrders.has(code));
  mockOrders.set(code, { phone: input.phone, status: 'new' });
  return { publicCode: code };
}

/** Возвращает только статус и только если совпали и телефон, и номер. */
export async function checkOrderStatus(phone: string, code: string): Promise<OrderStatus | null> {
  await wait(500);
  const o = mockOrders.get(code.trim());
  return o && o.phone === phone ? o.status : null;
}

export async function submitReview(input: ReviewInput): Promise<void> {
  await wait(600);
  void input;
}
