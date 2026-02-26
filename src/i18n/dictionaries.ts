import enDict from "./dictionaries/en.json";
import hiDict from "./dictionaries/hi.json";
import teDict from "./dictionaries/te.json";
import taDict from "./dictionaries/ta.json";
import knDict from "./dictionaries/kn.json";
import mlDict from "./dictionaries/ml.json";
import paDict from "./dictionaries/pa.json";
import bnDict from "./dictionaries/bn.json";
import asDict from "./dictionaries/as.json";
import mniDict from "./dictionaries/mni.json";
import mrDict from "./dictionaries/mr.json";
import guDict from "./dictionaries/gu.json";
import neDict from "./dictionaries/ne.json";
import orDict from "./dictionaries/or.json";

export type Locale =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "kn"
  | "ml"
  | "pa"
  | "bn"
  | "as"
  | "mni"
  | "mr"
  | "gu"
  | "ne"
  | "or";

export const locales: Locale[] = [
  "en",
  "hi",
  "te",
  "ta",
  "kn",
  "ml",
  "pa",
  "bn",
  "as",
  "mni",
  "mr",
  "gu",
  "ne",
  "or",
];

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
  bn: "বাংলা",
  as: "অসমীয়া",
  mni: "মৈতৈলোন্",
  mr: "मराठी",
  gu: "ગુજરાતી",
  ne: "नेपाली",
  or: "ଓଡ଼ିଆ",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  hi: "🇮🇳",
  te: "🇮🇳",
  ta: "🇮🇳",
  kn: "🇮🇳",
  ml: "🇮🇳",
  pa: "🇮🇳",
  bn: "🇮🇳",
  as: "🇮🇳",
  mni: "🇮🇳",
  mr: "🇮🇳",
  gu: "🇮🇳",
  ne: "🇳🇵",
  or: "🇮🇳",
};

export const defaultLocale: Locale = "en";

export type Dictionary = typeof enDict;

const dictionaries: Record<Locale, Dictionary> = {
  en: enDict,
  hi: hiDict,
  te: teDict,
  ta: taDict,
  kn: knDict,
  ml: mlDict,
  pa: paDict,
  bn: bnDict,
  as: asDict,
  mni: mniDict,
  mr: mrDict,
  gu: guDict,
  ne: neDict,
  or: orDict,
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries[defaultLocale];
};

export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};
