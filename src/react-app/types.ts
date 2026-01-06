import { IconName } from "./components/DynamicIcon";
export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Appointment {
  id: number;
  customer_name: string;
  phone_number: string;
  email: string;
  device_model: string;
  problem_description?: string;
  booking_time: number;
  status: string;
  created_at: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: number;
  created_at: number;
}

export interface ServiceItem {
  id: number;
  category: string;
  icon_name: IconName;
  title_it: string;
  title_cn: string;
  description_it?: string;
  description_cn?: string;
  price_display?: string;
  order: number;
  is_active: number;
}

export interface ServiceCategory {
  id: number;
  name_it: string;
  name_cn: string;
  slug: string;
  order: number;
}

export interface Carrier {
  id: number;
  name: string;
  tracking_url: string;
  order: number;
  is_active: number;
}

export interface BusinessHour {
  id: number;
  day_of_week: number;
  is_open: number;
  morning_open: string | null;
  morning_close: string | null;
  afternoon_open: string | null;
  afternoon_close: string | null;
}

export interface Holiday {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: number;
}

export interface Settings {
  shop_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  p_iva?: string;
  website_description_it?: string;
  website_description_cn?: string;
  opening_hours?: string;
  map_embed_url?: string;
  announcement_it?: string;
  announcement_cn?: string;
  instagram_url?: string;
  facebook_url?: string;
  logo_url?: string;
  is_initialized?: boolean;
}
