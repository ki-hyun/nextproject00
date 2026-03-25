'use client';

import { useLanguage } from '@/lib/LanguageContext';
import koHashrate from '@/app/hashrate/ko.json';
import enHashrate from '@/app/hashrate/en.json';

// namespace → 번역 맵
const translations: Record<string, Record<string, string>> = {
  hashrate: { ko: JSON.stringify(koHashrate), en: JSON.stringify(enHashrate) },
};

// 번역 캐시
const parsed: Record<string, Record<string, string>> = {};
function getDict(ns: string, lang: string): Record<string, string> {
  const key = `${ns}_${lang}`;
  if (!parsed[key]) {
    parsed[key] = JSON.parse(translations[ns]?.[lang] ?? '{}');
  }
  return parsed[key];
}

interface TProps {
  ns: string;   // namespace (페이지名, ex: "hashrate")
  k: string;    // translation key
  fallback?: string;
}

export default function T({ ns, k, fallback }: TProps) {
  const { language } = useLanguage();
  const dict = getDict(ns, language);
  return <>{dict[k] ?? fallback ?? k}</>;
}
