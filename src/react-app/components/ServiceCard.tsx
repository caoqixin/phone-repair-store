import React from "react";
import DynamicIcon, { IconName } from "./DynamicIcon";

interface Props {
  title: string;
  description?: string;
  iconName: IconName;
  color?: string;
  price?: string;
  category?: string;
  onClick?: () => void;
  className?: string;
}

const ServiceCard: React.FC<Props> = ({
  title,
  description,
  iconName,
  color = "text-emerald-600",
  price,
  category,
  onClick,
  className = "",
}) => {
  // 根据类别动态设置颜色
  const getCategoryColor = (cat?: string) => {
    const colors: Record<string, { icon: string; bg: string; border: string }> =
      {
        repair: {
          icon: "text-blue-600",
          bg: "bg-blue-50",
          border: "hover:border-blue-300",
        },
        sim: {
          icon: "text-purple-600",
          bg: "bg-purple-50",
          border: "hover:border-purple-300",
        },
        shipping: {
          icon: "text-orange-600",
          bg: "bg-orange-50",
          border: "hover:border-orange-300",
        },
        money: {
          icon: "text-green-600",
          bg: "bg-green-50",
          border: "hover:border-green-300",
        },
      };

    return (
      colors[cat || ""] || {
        icon: color,
        bg: "bg-gray-50",
        border: "hover:border-emerald-300",
      }
    );
  };

  const categoryColors = getCategoryColor(category);

  return (
    <div
      onClick={onClick}
      className={`
        bg-white p-6 rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 border border-gray-100 
        ${categoryColors.border}
        flex flex-col items-center text-center h-full
        group
        ${onClick ? "cursor-pointer hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {/* 图标容器 */}
      <div
        className={`
          p-4 rounded-full mb-4 
          ${categoryColors.bg} ${categoryColors.icon}
          transition-transform duration-300
          group-hover:scale-110
        `}
      >
        <DynamicIcon name={iconName} className="w-8 h-8" />
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 min-h-12 flex items-center justify-center">
        {title}
      </h3>

      {/* 描述 */}
      {description && (
        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>
      )}

      {/* 价格标签 */}
      {price && (
        <div className="mt-4 pt-3 border-t border-gray-100 w-full">
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-bold rounded-full">
            {price}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
