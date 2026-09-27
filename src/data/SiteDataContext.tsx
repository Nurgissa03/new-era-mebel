import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchSiteData } from './api';
import type { ItemType, SiteData } from './types';

const Ctx = createContext<SiteData | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSiteData()
      .then((d) => alive && setData(d))
      .catch((err) => console.error('Не удалось загрузить данные сайта', err));
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

/** Данные сайта (цены, настройки, фото, отзывы). null — ещё загружаются. */
export const useSiteData = () => useContext(Ctx);

export const priceOf = (data: SiteData | null, type: ItemType): number | null =>
  data?.prices.find((p) => p.item_type === type)?.price ?? null;
