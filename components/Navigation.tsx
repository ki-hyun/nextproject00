'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('ko');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // 언어 설정 로드
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
    // 여기서 전역 언어 상태 변경 로직 추가 가능
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 언어 선택 */}
          <div className="flex items-center">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ko">🇰🇷 한국어</option>
                <option value="en">🇺🇸 English</option>
                <option value="ja">🇯🇵 日본語</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>
          </div>

          {/* 가운데: 로고와 제목 */}
          <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BitCoinBoard</h1>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">Modern Web Platform</p> */}
            </div>
          </div>
          
          {/* 오른쪽: 레벨, 포인트, 사용자 정보 */}
          <div className="flex items-center space-x-4">

          <span className="text-sm text-gray-600 dark:text-gray-400">레벨(4)</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">포인트(250)</span>
          
          <div className="ml-8">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  안녕하세요, {user.username}님!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
}