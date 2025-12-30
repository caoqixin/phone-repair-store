// 1. 按需导入具体的图标组件
// 这里的导入决定了最终打包体积，没导入的就不会被打包
import {
  Wrench,
  Smartphone,
  Battery,
  Cpu,
  Wifi,
  Archive,
  CreditCard,
  Truck,
  Star,
  ShieldCheck,
  Zap,
  Headphones,
  Laptop,
  Tablet,
  HelpCircle, // 导入一个默认图标作为回退
  type LucideProps,
} from "lucide-react";

// 2. 建立图标映射表
// Key 是数据库存的字符串，Value 是实际的组件
export const ICON_MAP = {
  Wrench,
  Smartphone,
  Battery,
  Cpu,
  Wifi,
  Archive,
  CreditCard,
  Truck,
  Star,
  ShieldCheck,
  Zap,
  Headphones,
  Laptop,
  Tablet,
};

// 3. 自动从映射表中提取 Key 类型
// 类型等同于: 'Wrench' | 'Smartphone' | 'Battery' ...
export type IconName = keyof typeof ICON_MAP;

interface DynamicIconProps extends LucideProps {
  name: IconName;
}

const DynamicIcon = ({ name, className, ...props }: DynamicIconProps) => {
  // 4. 从映射表中获取组件
  const IconComponent = ICON_MAP[name];

  // 5. 安全检查：虽然类型系统限制了 name，但为了防止运行时数据错误，
  // 如果找不到对应图标，渲染默认图标 (HelpCircle) 或 null
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ICON_MAP.`);
    return <HelpCircle className={className} {...props} />;
  }

  return <IconComponent className={className} {...props} />;
};

// 使用 memo 优化
export default DynamicIcon;
