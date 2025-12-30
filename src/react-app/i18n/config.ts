import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import it from "./it/translation.json";
import zh from "./zh/translation.json";

i18next.use(initReactI18next).init({
  lng: "it",
  debug: true,
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
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
});
