import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    // 切换语言并自动保存到 localStorage
    i18n.changeLanguage(lang);
  };

  // 获取当前语言(确保只比较语言代码,不包括地区)
  const currentLang = i18n.language.split("-")[0];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 border border-gray-200">
      <button
        onClick={() => changeLanguage("it")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          currentLang === "it"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Switch to Italian"
      >
        IT
      </button>
      <button
        onClick={() => changeLanguage("zh")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          currentLang === "zh"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Switch to Chinese"
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;
