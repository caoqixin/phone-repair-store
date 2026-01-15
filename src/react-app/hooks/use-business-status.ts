import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BusinessHour, Holiday } from "../types"; // 确保路径正确
import dayjs from "dayjs";
import { inRange } from "../lib/utils";

interface BusinessStatus {
  isOpen: boolean;
  message: string;
  type: "open" | "closed" | "holiday";
}

export function useBusinessStatus(
  businessHours: BusinessHour[],
  holidays: Holiday[]
) {
  const { i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  const [status, setStatus] = useState<BusinessStatus>({
    isOpen: false,
    message: "",
    type: "closed",
  });

  useEffect(() => {
    if (!businessHours.length) return;

    const calculateStatus = () => {
      // 1. 获取意大利(博洛尼亚)的当前时间
      const italyNow = dayjs();

      const dayOfWeek = italyNow.day(); // 0-6 (周日-周六)

      // 2. 检查节假日
      const activeHoliday = holidays.find(
        (h) =>
          h.is_active &&
          dayjs().isBetween(h.start_date, h.end_date, "day", "[]")
      );

      if (activeHoliday) {
        setStatus({
          isOpen: false,
          message: isZh
            ? `放假中 - ${activeHoliday.name}`
            : `Chiuso - ${activeHoliday.name}`,
          type: "holiday",
        });
        return;
      }

      // 3. 检查常规营业时间
      const todayConfig = businessHours.find(
        (h) => h.day_of_week === dayOfWeek
      );

      if (!todayConfig || !todayConfig.is_open) {
        setStatus({
          isOpen: false,
          message: isZh ? "今日休息" : "Chiuso oggi",
          type: "closed",
        });
        return;
      }

      // 4. 判断时间段
      const inMorning = inRange(
        todayConfig.morning_open,
        todayConfig.morning_close
      );

      const inAfternoon = inRange(
        todayConfig.afternoon_open,
        todayConfig.afternoon_close
      );

      const isPause = inRange(
        todayConfig.morning_close,
        todayConfig.afternoon_open
      );

      if (inMorning || inAfternoon) {
        setStatus({
          isOpen: true,
          message: isZh ? "营业中" : "Aperto",
          type: "open",
        });
      } else if (isPause) {
        setStatus({
          isOpen: false,
          message: isZh
            ? `午休中 (${todayConfig.afternoon_open} 开门)`
            : `Pausa (${todayConfig.afternoon_open})`,
          type: "closed",
        });
      } else {
        setStatus({
          isOpen: false,
          message: isZh ? "已关门" : "Chiuso",
          type: "closed",
        });
      }
    };

    calculateStatus();
    // 每分钟更新一次状态
    const timer = setInterval(calculateStatus, 60000);
    return () => clearInterval(timer);
  }, [businessHours, holidays, isZh]); // 依赖项加入 isZh，切换语言立即刷新

  return status;
}
