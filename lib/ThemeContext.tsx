'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'light' | 'slate' | 'blue' | 'yellow';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  primary: string;     // 버튼·강조색
  accent: string;      // 사이드바 활성, 진행 바
  bgLight: string;     // 카드 배경 tint
  swatch: string;      // TopBar 색상 원형 표시용
  textOnPrimary: string;
  textMutedOnPrimary: string;
}

export const THEMES: ThemeConfig[] = [
  { name: 'light', label: 'Light', primary: '#ecf0f1', accent: '#bdc3c7', bgLight: '#ffffff', swatch: '#ecf0f1', textOnPrimary: '#1f2937', textMutedOnPrimary: '#6b7280' },
  { name: 'slate', label: 'Slate', primary: '#34495e', accent: '#2c3e50', bgLight: '#edf0f3', swatch: '#34495e', textOnPrimary: '#ffffff', textMutedOnPrimary: '#cbd5e1' },
  { name: 'blue',  label: 'Blue',  primary: '#3498db', accent: '#2980b9', bgLight: '#eaf4fb', swatch: '#3498db', textOnPrimary: '#ffffff', textMutedOnPrimary: '#bfdbfe' },
  { name: 'yellow',label: 'Yellow',primary: '#f1c40f', accent: '#f39c12', bgLight: '#fff8e1', swatch: '#f1c40f', textOnPrimary: '#1f2937', textMutedOnPrimary: '#6b7280' },
];

interface ThemeContextType {
  theme: ThemeConfig;
  nextTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[2], // blue 기본
  nextTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(2); // blue 기본

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName | null;
    const idx = THEMES.findIndex(t => t.name === saved);
    if (idx !== -1) setThemeIndex(idx);
  }, []);

  useEffect(() => {
    const t = THEMES[themeIndex];
    const root = document.documentElement;
    root.setAttribute('data-theme', t.name);
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-accent', t.accent);
    root.style.setProperty('--theme-bg-light', t.bgLight);
    root.style.setProperty('--theme-text-on-primary', t.textOnPrimary);
    root.style.setProperty('--theme-text-muted-on-primary', t.textMutedOnPrimary);
  }, [themeIndex]);

  const nextTheme = () => {
    const next = (themeIndex + 1) % THEMES.length;
    setThemeIndex(next);
    localStorage.setItem('theme', THEMES[next].name);
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeIndex], nextTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
