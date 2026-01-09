import React from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

// 维修相关 (5个)
import { Wrench, Settings, Toolbox, Hammer, Cog } from "lucide-react";

// 设备相关 (10个)
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Headphones,
  Speaker,
  Keyboard,
  Mouse,
  Camera,
} from "lucide-react";

// 电池相关 (5个)
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
} from "lucide-react";

// 硬件相关 (5个)
import { Cpu, HardDrive, MemoryStick, Usb, Plug } from "lucide-react";

// 通信相关 (8个)
import {
  Wifi,
  Signal,
  Bluetooth,
  Radio,
  Phone,
  MessageSquare,
  Mail,
  Video,
} from "lucide-react";

// 商业相关 (10个)
import {
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  ShoppingCart,
  Package,
  Truck,
  Store,
  Building,
  MapPin,
} from "lucide-react";

// 状态/操作 (15个)
import {
  Check,
  CheckCircle,
  X,
  XCircle,
  Star,
  Heart,
  ThumbsUp,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Zap,
  Sparkles,
  Award,
  HelpCircle,
} from "lucide-react";

// 导航/UI (10个)
import {
  Home,
  Menu,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Info,
} from "lucide-react";

// SIM卡/通信 (3个)
import { CardSim, Archive, FileText } from "lucide-react";

// 其他常用 (8个)
import {
  Clock,
  Calendar,
  User,
  Users,
  LogOut,
  Plus,
  Minus,
  Edit,
} from "lucide-react";

// ==========================================
// 图标映射表 (80个图标,约40KB)
// ==========================================
export const ICON_MAP = {
  // 维修相关
  Wrench,
  Settings,
  Toolbox,
  Hammer,
  Cog,

  // 设备相关
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Headphones,
  Speaker,
  Keyboard,
  Mouse,
  Camera,

  // 电池相关
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,

  // 硬件相关
  Cpu,
  HardDrive,
  MemoryStick,
  Usb,
  Plug,

  // 通信相关
  Wifi,
  Signal,
  Bluetooth,
  Radio,
  Phone,
  MessageSquare,
  Mail,
  Video,

  // 商业相关
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  ShoppingCart,
  Package,
  Truck,
  Store,
  Building,
  MapPin,

  // 状态/操作
  Check,
  CheckCircle,
  X,
  XCircle,
  Star,
  Heart,
  ThumbsUp,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Zap,
  Sparkles,
  Award,
  HelpCircle,

  // 导航/UI
  Home,
  Menu,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Info,

  // SIM卡/通信
  CardSim,
  Archive,
  FileText,

  // 其他常用
  Clock,
  Calendar,
  User,
  Users,
  LogOut,
  Plus,
  Minus,
  Edit,
} as const;

// 导出所有可用的图标名称类型
export type IconName = keyof typeof ICON_MAP;

interface DynamicIconProps extends LucideProps {
  name: IconName | string;
  fallback?: LucideIcon;
}

/**
 * 动态图标组件 - 支持所有 Lucide React 图标
 *
 * @param name - 图标名称 (例如: 'Wrench', 'Smartphone', 'Battery')
 * @param fallback - 可选的后备图标组件
 * @param props - Lucide 图标的其他属性 (size, color, className 等)
 *
 * @example
 * <DynamicIcon name="Smartphone" className="size-6 text-blue-500" />
 * <DynamicIcon name="Battery" size={24} color="red" />
 * <DynamicIcon name="InvalidIcon" fallback={HelpCircle} />
 */
const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback,
  ...props
}) => {
  // 从映射表获取图标组件
  const IconComponent = ICON_MAP[name as IconName] as LucideIcon | undefined;

  // 如果找不到图标
  if (!IconComponent) {
    console.warn(
      `Icon "${name}" not found in ICON_MAP. Available icons: ${Object.keys(ICON_MAP).join(", ")}`
    );

    // 使用提供的 fallback 或默认的 HelpCircle
    const FallbackIcon = fallback || HelpCircle;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
