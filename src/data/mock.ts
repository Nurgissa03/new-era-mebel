import type { SiteData } from './types';

// ТЕСТОВЫЕ ДАННЫЕ (этап 3). На этапе 4 всё это будет приходить из Supabase,
// а брат будет менять цены в кабинете.
export const MOCK: SiteData = {
  prices: [
    { item_type: 'wardrobe', label: 'Шкаф', price: 15000, sort_order: 1 },
    { item_type: 'kitchen', label: 'Кухня (комплект)', price: 60000, sort_order: 2 },
    { item_type: 'bed', label: 'Кровать', price: 10000, sort_order: 3 },
    { item_type: 'table', label: 'Стол / стулья', price: 5000, sort_order: 4 },
    { item_type: 'kids', label: 'Детская мебель', price: 12000, sort_order: 5 },
    { item_type: 'office', label: 'Офисная мебель', price: 8000, sort_order: 6 },
    { item_type: 'move', label: 'Разборка при переезде', price: 7000, sort_order: 7 },
  ],
  settings: {
    floor_fee: 1000,
    dismantle_pct: 50,
    show_prices: true,
    phone: '+7 700 000 00 00',
    whatsapp: '+7 700 000 00 00',
    work_hours: '[Дни и часы]',
  },
  portfolio: [
    { id: 'p1', title: 'Шкаф-купе', before_url: null, after_url: null, sort_order: 1 },
    { id: 'p2', title: 'Кухня', before_url: null, after_url: null, sort_order: 2 },
    { id: 'p3', title: 'Детская', before_url: null, after_url: null, sort_order: 3 },
  ],
  reviews: [
    { id: 'r1', name: '[Имя]', text: '[Текст отзыва клиента — появится после первых заказов]', item: '[что собирали]', created_at: '2026-01-01' },
    { id: 'r2', name: '[Имя]', text: '[Текст отзыва клиента]', item: '[что собирали]', created_at: '2026-01-01' },
    { id: 'r3', name: '[Имя]', text: '[Текст отзыва клиента]', item: '[что собирали]', created_at: '2026-01-01' },
  ],
};
