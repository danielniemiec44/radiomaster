// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

void i18n // Using `void` to acknowledge the promise if you prefer
  .use(Backend)                  // load translations via http (default public/locales)
  .use(LanguageDetector)         // detect user language
  .use(initReactI18next)        // pass the i18n instance to react-i18next
  .init({
    fallbackLng: 'pl',          // use en if detected language is not available
    debug: false,               // set true only for dev
    interpolation: {
      escapeValue: false        // react already safe from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    }
  });

export default i18n;
