-- =========================================================
-- D1 Database Schema for Phone Repair Shop
-- =========================================================

-- =========================================================
-- 1. 预约表 (Bookings)
-- =========================================================
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  device_model TEXT NOT NULL,
  problem_description TEXT,
  booking_time INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at INTEGER DEFAULT (unixepoch())
);

-- 为常用查询创建索引
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_time ON bookings(booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- =========================================================
-- 2. 服务项目表 (Services)
-- =========================================================
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Wrench',
  title_it TEXT NOT NULL,
  title_cn TEXT NOT NULL,
  description_it TEXT,
  description_cn TEXT,
  price_display TEXT,
  "order" INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1))
);

-- 为分类和排序创建索引
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

CREATE TABLE IF NOT EXISTS service_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_it TEXT NOT NULL,
  name_cn TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  "order" INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_categories_order ON service_categories("order");

-- =========================================================
-- 3. 留言/联系表 (Contacts)
-- =========================================================
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0 CHECK(is_read IN (0, 1)),
  created_at INTEGER DEFAULT (unixepoch())
);

-- 为已读状态和创建时间创建索引
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- =========================================================
-- 4. 管理员表 (Users)
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

-- 为用户名创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- =========================================================
-- 5. 设置表 (Settings) - KV 存储
-- =========================================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- =========================================================
-- 7. 快递公司表 (Carriers) - 新增
-- =========================================================
CREATE TABLE IF NOT EXISTS carriers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  tracking_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_carriers_order ON carriers("order");

-- =========================================================
-- 8. 营业时间表 (Business Hours) - 新增
-- =========================================================
CREATE TABLE IF NOT EXISTS business_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
  is_open INTEGER DEFAULT 1 CHECK(is_open IN (0, 1)),
  morning_open TEXT,
  morning_close TEXT,
  afternoon_open TEXT,
  afternoon_close TEXT,
  UNIQUE(day_of_week)
);

-- =========================================================
-- 9. 节假日表 (Holidays) - 新增
-- =========================================================
CREATE TABLE IF NOT EXISTS holidays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_holidays_dates ON holidays(start_date, end_date);

-- =========================================================
-- 初始数据 (Optional)
-- =========================================================

-- 插入默认服务分类
INSERT INTO service_categories (name_it, name_cn, slug, "order") VALUES
('Riparazione', '维修服务', 'repair', 1),
('SIM Card', 'SIM卡服务', 'sim', 2),
('Spedizioni', '快递服务', 'shipping', 3),
('Pagamenti', '缴费服务', 'money', 4);

-- 插入默认服务项目
INSERT INTO services (category, icon_name, title_it, title_cn, description_it, description_cn, price_display, "order", is_active) VALUES
('repair', 'Smartphone', 'Riparazione Schermo', '屏幕维修', 'Riparazione professionale dello schermo del telefono', '专业手机屏幕维修服务', 'da €50', 1, 1),
('repair', 'Battery', 'Sostituzione Batteria', '电池更换', 'Sostituzione rapida della batteria', '快速电池更换服务', 'da €30', 2, 1),
('repair', 'Droplet', 'Riparazione Danni Liquidi', '进水维修', 'Riparazione danni causati da liquidi', '液体损坏维修', 'da €40', 3, 1),
('sim', 'CreditCard', 'Attivazione SIM', 'SIM卡激活', 'Attivazione di nuove carte SIM', '新SIM卡激活服务', '€10', 4, 1),
('sim', 'Phone', 'Ricarica Telefonica', '话费充值', 'Ricarica per tutte le compagnie', '支持所有运营商充值', '-', 5, 1),
('shipping', 'Truck', 'Servizio Spedizioni', '快递服务', 'Spedizioni nazionali e internazionali', '国内国际快递服务', '-', 6, 1),
('money', 'Wallet', 'Pagamento Bollette', '代缴费用', 'Pagamento di bollette e servizi', '代缴各类账单服务', '-', 7, 1);

-- 插入默认快递公司
INSERT INTO carriers (name, tracking_url, "order", is_active) VALUES
('DHL', 'https://www.dhl.com/it-it/home/tracking.html?tracking-id=', 1, 1),
('UPS', 'https://www.ups.com/track?tracknum=', 2, 1),
('FedEx', 'https://www.fedex.com/fedextrack/?trknbr=', 3, 1),
('Poste Italiane', 'https://www.poste.it/cerca/index.html#/risultati-spedizioni/', 4, 1),
('BRT', 'https://vas.brt.it/vas/sped_numsped_par.hsm?referer=sped_numsped_par.htm&Nspediz=', 5, 1),
('GLS', 'https://gls-group.com/IT/it/ricerca-spedizione?match=', 6, 1);

-- 插入默认营业时间 (周一到周日)
INSERT INTO business_hours (day_of_week, is_open, morning_open, morning_close, afternoon_open, afternoon_close) VALUES
(1, 1, '09:00', '12:30', '14:30', '19:00'),
(2, 1, '09:00', '12:30', '14:30', '19:00'),
(3, 1, '09:00', '12:30', '14:30', '19:00'),
(4, 1, '09:00', '12:30', '14:30', '19:00'),
(5, 1, '09:00', '12:30', '14:30', '19:00'),
(6, 1, '09:00', '13:00', NULL, NULL),
(0, 0, NULL, NULL, NULL, NULL);

-- 插入默认系统设置 (新增字段)
INSERT INTO settings (key, value) VALUES
('shop_name', 'Phone Repair Shop'),
('address', 'Via Example 123, Milano'),
('phone', '+39 123 456 7890'),
('email', 'info@example.com'),
('p_iva', 'IT12345678901'),
('website_description_it', 'Riparazione professionale di smartphone e tablet'),
('website_description_cn', '专业智能手机和平板电脑维修'),
('opening_hours', 'Lun-Sab: 9:00-19:00'),
('announcement_it', 'Benvenuti nel nostro negozio!'),
('announcement_cn', '欢迎光临我们的店铺!'),
('booking_interval_minutes', '30'),
('max_bookings_per_day', '20');