import React from "react";
import { icons, type LucideProps } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// 导出所有可用的图标名称类型
export type IconName = keyof typeof icons;

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
  // 从 lucide-react 的 icons 对象中动态获取图标组件
  const IconComponent = icons[name as IconName] as LucideIcon;

  // 如果找不到对应图标
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react icons.`);

    // 使用提供的 fallback 或默认的 HelpCircle
    if (fallback) {
      const FallbackIcon = fallback;
      return <FallbackIcon {...props} />;
    }

    // 使用 HelpCircle 作为最终后备
    const HelpCircle = icons.MessageCircleQuestionMark as LucideIcon;
    return <HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
