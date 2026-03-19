'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tabs } from './Sidebar';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('ko');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // 현재 페이지 타이틀 찾기
  const currentTab = tabs.find(t => t.href === pathname);
  const pageTitle = currentTab ? currentTab.name : '대시보드';

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* 왼쪽: 현재 페이지 타이틀 */}
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {pageTitle}
          </h2>
        </div>

        {/* 오른쪽: 언어 선택 및 유저 정보 */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
            >
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 English</option>
              <option value="ja">🇯🇵 日본語</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-4 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Lv.4</span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">250 P</span>
          </div>
          
          <div className="flex items-center border-l pl-4 border-gray-200 dark:border-gray-700 shrink-0">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden sm:block">
                  {user.username}님
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors text-sm font-medium"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  로그인
                </Link>
                {/* <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  회원가입
                </Link> */}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </header>
  );
}
