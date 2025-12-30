import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import DynamicIcon, { IconName } from "../components/DynamicIcon";

const API_BASE_URL = "/api";

interface ServiceItem {
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

const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Load services error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 按类别分组
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const categoryNames: Record<string, { it: string; cn: string }> = {
    repair: { it: "Riparazione", cn: "维修服务" },
    sim: { it: "SIM Card", cn: "电话卡服务" },
    shipping: { it: "Spedizione", cn: "快递服务" },
    money: { it: "Pagamenti", cn: "缴费服务" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 text-slate-900">
        {t("services.title")}
      </h1>
      <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
        {t("services.subtitle") || "专业的维修服务，值得信赖"}
      </p>

      {Object.keys(groupedServices).length === 0 ? (
        <div className="text-center text-slate-500 py-12">暂无服务项目</div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedServices).map(([category, items]) => (
            <div key={category}>
              {/* 类别标题 */}
              <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-3 border-b-2 border-primary-500 inline-block">
                {isZh
                  ? categoryNames[category]?.cn || category
                  : categoryNames[category]?.it || category}
              </h2>

              {/* 服务卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                        <DynamicIcon
                          name={item.icon_name}
                          className="w-6 h-6"
                        />
                      </div>
                      {item.price_display && (
                        <span className="text-primary-600 font-bold text-sm bg-primary-50 px-3 py-1 rounded-full">
                          {item.price_display}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-slate-900">
                      {isZh ? item.title_cn : item.title_it}
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm">
                      {isZh ? item.description_cn : item.description_it}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
