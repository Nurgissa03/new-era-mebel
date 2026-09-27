import type { ItemType } from '../data/types';

export interface CalcState {
  type: ItemType;
  qty: number;
  floor: number;
  lift: boolean;
  dis: boolean;
}

export const CALC_DEFAULT: CalcState = { type: 'wardrobe', qty: 1, floor: 1, lift: true, dis: false };

/**
 * итог = цена_вида × кол-во
 *      + (этаж − 1) × доплата_за_этаж × кол-во, если лифта нет
 *      + цена_вида × процент_разборки / 100 × кол-во, если нужна разборка
 */
export function calcTotal(s: CalcState, price: number, floorFee: number, disPct: number): number {
  let total = price * s.qty;
  if (!s.lift && s.floor > 1) total += (s.floor - 1) * floorFee * s.qty;
  if (s.dis) total += Math.round((price * disPct) / 100) * s.qty;
  return total;
}

export const fmtMoney = (n: number) => n.toLocaleString('ru-RU');
