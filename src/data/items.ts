import type { ItemType, TimeSlot } from './types';

/** Виды мебели в калькуляторе (короткие подписи, как в макете). */
export const CALC_ITEMS: { id: ItemType; label: string }[] = [
  { id: 'wardrobe', label: 'Шкаф' },
  { id: 'kitchen', label: 'Кухня' },
  { id: 'bed', label: 'Кровать' },
  { id: 'table', label: 'Стол / стулья' },
  { id: 'kids', label: 'Детская' },
  { id: 'office', label: 'Офисная' },
];

/** Что можно выбрать в заявке. */
export const ORDER_ITEMS: { id: ItemType; label: string }[] = [
  { id: 'wardrobe', label: 'Шкаф' },
  { id: 'kitchen', label: 'Кухня' },
  { id: 'bed', label: 'Кровать' },
  { id: 'table', label: 'Стол / стулья' },
  { id: 'kids', label: 'Детская мебель' },
  { id: 'office', label: 'Офисная мебель' },
  { id: 'move', label: 'Разборка при переезде' },
  { id: 'other', label: 'Другое' },
];

export const TIME_SLOTS: { id: TimeSlot; label: string }[] = [
  { id: 'morning', label: 'Утро · 9–12' },
  { id: 'day', label: 'День · 12–16' },
  { id: 'evening', label: 'Вечер · 16–20' },
];

export const itemLabel = (id: ItemType) => ORDER_ITEMS.find((x) => x.id === id)?.label ?? id;
