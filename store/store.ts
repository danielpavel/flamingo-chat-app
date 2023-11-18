import { create } from "zustand";
import Subscription from "@/types/Subscription";

export type SupportedLanguages =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "ro"
  | "ja"
  | "ru"
  | "zh";

const LanguageSupportedMap: Record<SupportedLanguages, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  ro: "Romanian",
  ja: "Japanese",
  ru: "Russian",
  zh: "Chinese",
};

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