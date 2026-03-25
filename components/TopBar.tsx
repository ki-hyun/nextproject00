'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tabs } from './Sidebar';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme, THEMES } from '@/lib/ThemeContext';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggle: toggleLang } = useLanguage();
  const { theme, nextTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const currentTab = tabs.find(t => t.href === pathname);
  const pageTitle = currentTab ? currentTab.name : '대시보드';

  return (
    <header
      className="h-14 border-b sticky top-0 z-40"
      style={{ backgroundColor: 'var(--theme-primary)', borderColor: 'color-mix(in srgb, var(--theme-text-on-primary) 10%, transparent)' }}
    >
      <div className="h-full px-5 flex items-center justify-between">

        {/* 왼쪽: 현재 페이지 타이틀 */}
        <h2 className="text-base font-bold" style={{ color: 'var(--theme-text-on-primary)' }}>{pageTitle}</h2>

        {/* 오른쪽 컨트롤 */}
        <div className="flex items-center gap-2">

          {/* 언어 토글 버튼 */}
          <div className="flex items-center border rounded-lg overflow-hidden text-xs font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--theme-text-on-primary) 20%, transparent)' }}>
            <button
              onClick={() => toggleLang()}
              className={`px-2.5 py-1.5 transition-colors font-bold ${language === 'ko' ? '' : 'hover:bg-black/5 hover:dark:bg-white/5'}`}
              style={language === 'ko' ? { backgroundColor: theme.textOnPrimary, color: theme.primary } : { color: theme.textMutedOnPrimary }}
            >
              한
            </button>
            <div className="w-px h-4" style={{ backgroundColor: theme.textMutedOnPrimary, opacity: 0.3 }} />
            <button
              onClick={() => toggleLang()}
              className={`px-2.5 py-1.5 transition-colors font-bold ${language === 'en' ? '' : 'hover:bg-black/5 hover:dark:bg-white/5'}`}
              style={language === 'en' ? { backgroundColor: theme.textOnPrimary, color: theme.primary } : { color: theme.textMutedOnPrimary }}
            >
              EN
            </button>
          </div>

          {/* 테마 순환 버튼 */}
          <button
            onClick={nextTheme}
            title={`테마: ${theme.label} → 다음`}
            className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 hover:bg-black/5 hover:dark:bg-white/5 transition-colors text-xs"
            style={{ borderColor: 'color-mix(in srgb, var(--theme-text-on-primary) 20%, transparent)' }}
          >
            {/* 4개 테마 스와치 미리보기 */}
            <span className="flex gap-0.5">
              {THEMES.map(t => (
                <span
                  key={t.name}
                  className="w-3 h-3 rounded-full block border border-white/50"
                  style={{
                    backgroundColor: t.swatch,
                    opacity: t.name === theme.name ? 1 : 0.35,
                    transform: t.name === theme.name ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}
