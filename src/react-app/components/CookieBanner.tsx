import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, Shield, X, ExternalLink } from "lucide-react";

const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // 延迟显示,改善用户体验
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie_consent", "false");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary-600 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2.5 rounded-lg shrink-0">
              <Cookie className="size-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {t("cookie.title")}
              </h3>
              <p className="text-sm text-slate-500">{t("cookie.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={reject}
            className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="mb-4">
          <p className="text-slate-600 leading-relaxed mb-3">
            {t("cookie.text")}
          </p>

          {/* Privacy Badge */}
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 ">
            <Shield className="size-4" />
            <span className="font-medium">{t("cookie.no_third_party")}</span>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
              <h4 className="font-bold text-slate-900 mb-2 text-sm">
                {t("cookie.details_title")}
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 shrink-0">•</span>
                  <span>{t("cookie.detail_essential")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 shrink-0">•</span>
                  <span>{t("cookie.detail_analytics")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 shrink-0">•</span>
                  <span>{t("cookie.detail_cloudflare")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 shrink-0">•</span>
                  <span>{t("cookie.detail_no_tracking")}</span>
                </li>
              </ul>
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-3 font-medium"
              >
                {t("cookie.cloudflare_privacy")}
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={accept}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary-900/20 flex-1 sm:flex-none"
          >
            {t("cookie.accept")}
          </button>
          <button
            onClick={reject}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors flex-1 sm:flex-none"
          >
            {t("cookie.reject")}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-slate-600 hover:text-slate-900 px-4 py-3 text-sm font-medium underline"
          >
            {showDetails ? t("cookie.hide_details") : t("cookie.show_details")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
