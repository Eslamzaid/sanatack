import "i18next";
import translation from "../locales/ar/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof translation;
    };
  }
}
