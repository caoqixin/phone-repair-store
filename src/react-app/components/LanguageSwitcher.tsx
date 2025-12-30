import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 border border-gray-200">
      <button
        onClick={() => changeLanguage("it")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          i18n.language === "it"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        IT
      </button>
      <button
        onClick={() => changeLanguage("zh")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          i18n.language === "zh"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;
