import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../locales/en/common.json";
import neCommon from "../locales/ne/common.json";

let initialLanguage = "en";
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("i18nextLng");
  if (saved === "en" || saved === "ne") initialLanguage = saved;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ne: { common: neCommon },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
    localStorage.setItem("i18nextLng", lng);
  });
}

export default i18n;
