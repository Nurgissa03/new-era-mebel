export type ItemType = 'wardrobe' | 'kitchen' | 'bed' | 'table' | 'kids' | 'office' | 'move' | 'other';

export type TimeSlot = 'morning' | 'day' | 'evening';

export type OrderStatus = 'new' | 'on_way' | 'assembling' | 'done' | 'cancelled';

export interface PriceRow {
  item_type: ItemType;
  label: string;
  price: number;
  sort_order: number;
}

export interface Settings {
  floor_fee: number;
  dismantle_pct: number;
  show_prices: boolean;
  phone: string;
  whatsapp: string;
  work_hours: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  before_url: string | null;
  after_url: string | null;
  sort_order: number;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  item: string | null;
  created_at: string;
}

export interface SiteData {
  prices: PriceRow[];
  settings: Settings;
  portfolio: PortfolioItem[];
  reviews: Review[];
}

export interface OrderInput {
  name: string;
  phone: string; // только цифры, 7XXXXXXXXXX
  address: string;
  date: string; // YYYY-MM-DD
  time_slot: TimeSlot;
  item_type: ItemType;
  qty: number;
  floor: number;
  has_lift: boolean;
  needs_dismantle: boolean;
  comment: string;
  estimated_price: number | null;
}

export interface ReviewInput {
  name: string;
  text: string;
  item: string;
}
