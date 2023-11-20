import { create } from "zustand";
import { Subscription } from "@/types/Subscription";

export type SupportedLanguages =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "ro"
  | "ja"
  | "ru"
  | "zh";

export const LanguageSupportedMap: Record<SupportedLanguages, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  ro: "Romanian",
  ja: "Japanese",
  ru: "Russian",
  zh: "Chinese",
};

const LANGUAGES_IN_FREE = 2

interface LanguageState {
  language: SupportedLanguages;
  setLanguage: (language: SupportedLanguages) => void;
  getLanguages: (isPro: boolean) => SupportedLanguages[];
  getNoTLanguagesSupported: (isPro: boolean) => SupportedLanguages[];
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
  getLanguages: (isPro) =>
    isPro
      ? (Object.keys(LanguageSupportedMap) as SupportedLanguages[])
      : (Object.keys(LanguageSupportedMap).slice(
          0,
          LANGUAGES_IN_FREE
        ) as SupportedLanguages[]),
  getNoTLanguagesSupported: (isPro) =>
    isPro
      ? []
      : (Object.keys(LanguageSupportedMap).slice(
          LANGUAGES_IN_FREE
        ) as SupportedLanguages[]),
}));

interface SubscriptionState {
  subscription?: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  // language: SupportedLanguages;
  // setLanguage: (language: SupportedLanguages) => void;
  // languageName: string;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription) => set({ subscription }),
  // language: "en",
  // setLanguage: (language) => set({ language }),
  // languageName: LanguageSupportedMap.en,
}));