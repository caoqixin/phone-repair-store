import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector, {
  DetectorOptions,
} from "i18next-browser-languagedetector";
import it from "./it/translation.json";
import zh from "./zh/translation.json";

// 语言持久化配置
const languageDetectorOptions: DetectorOptions = {
  // 检测顺序: localStorage > cookie > navigator
  order: ["localStorage", "cookie", "navigator"],

  // localStorage 的键名
  lookupLocalStorage: "i18nextLng",

  // cookie 的键名
  lookupCookie: "i18next",

  // 缓存用户选择的语言
  caches: ["localStorage", "cookie"],

  // cookie 过期时间 (365天)
  cookieMinutes: 525600,

  // cookie 配置
  cookieOptions: { path: "/", sameSite: "strict" },
};

const languagedetector = new LanguageDetector(null, languageDetectorOptions);

i18next
  .use(languagedetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "it", // 默认语言(当检测失败时)

    debug: import.meta.env.DEV, // 生产环境设为 false
    resources: {
      it: {
        translation: it,
      },
      zh: {
        translation: zh,
      },
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    // 支持的语言列表
    supportedLngs: ["it", "zh"],

    // 当检测到不支持的语言时,使用 fallbackLng
    nonExplicitSupportedLngs: false,
  });
