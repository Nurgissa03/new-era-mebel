// Телефоны Казахстана: +7 XXX XXX XX XX

const digits = (s: string) => s.replace(/\D/g, '');

/** Приводит ввод к 7XXXXXXXXXX (11 цифр) или возвращает null. */
export function normalizePhone(input: string): string | null {
  let d = digits(input);
  if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
  if (d.length === 10) d = '7' + d;
  return d.length === 11 && d[0] === '7' ? d : null;
}

/** Красиво форматирует во время ввода: +7 700 123 45 67 */
export function formatPhoneInput(input: string): string {
  let d = digits(input);
  if (!d) return '';
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') d = '7' + d;
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean);
  return '+7' + (p.length ? ' ' + p.join(' ') : '');
}

export const telHref = (phone: string) => 'tel:+' + (normalizePhone(phone) ?? digits(phone));
export const waHref = (phone: string) => 'https://wa.me/' + (normalizePhone(phone) ?? digits(phone));
