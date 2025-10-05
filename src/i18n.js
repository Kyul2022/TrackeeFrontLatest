import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import translationEn from "./locales/en/translation.json"
import translationFr from "./locales/fr/translation.json"

i18n.use(initReactI18next).init({
    resources: {
        fr: {
            translation : translationFr,
        },
        en: {
            translation : translationEn,
        }

    },
    lng : "fr", //default language
    fallbackLng : "fr", //fallback language if current language is not available
    interpolation: {
        escapeValue : false, //react does escaping already
    }
});

export default i18n;