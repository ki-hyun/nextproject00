'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TabNavigation, { tabs } from '../components/TabNavigation';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 홈페이지에서 보여줄 내비게이션 아이템들 (홈 제외)
  const navigationItems = tabs.filter(tab => tab.href !== '/' && tab.description);


  useEffect(() => {
    // Check if user is logged in (you can implement proper session management here)
    const checkAuth = async () => {
      try {
        // For now, we'll just check if there's a user in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Tab Navigation */}
      <TabNavigation user={user} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {user ? `안녕하세요, ${user.username}님! 👋` : '환영합니다! 👋'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {user 
              ? '로그인하신 것을 환영합니다! 아래 기능들을 탐색해보세요.'
              : 'Next.js 기반의 현대적인 웹 플랫폼입니다. 다양한 기능을 탐색해보세요.'
            }
          </p>
          {!user && (
            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg"
              >
                시작하기
              </Link>
              <Link
                href="/register"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-lg"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {navigationItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">둘러보기</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🚀 주요 기능</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">실시간 데이터</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">암호화폐 시세 및 거래 정보</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">커뮤니티</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">개발자들과의 소통 공간</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">포트폴리오</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">작품 공유 및 갤러리</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📊 최신 소식</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Next.js 15 새로운 기능</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">App Router와 Server Components의 향상된 성능</p>
                <span className="text-xs text-blue-600 dark:text-blue-400">2시간 전</span>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">React 19 업데이트</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">새로운 Hooks와 개선된 성능</p>
                <span className="text-xs text-green-600 dark:text-green-400">5시간 전</span>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tailwind CSS 4.0</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">베타 버전 출시 및 새로운 기능들</p>
                <span className="text-xs text-purple-600 dark:text-purple-400">1일 전</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Additional content can be added here */}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">© 2024 NextProject. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                이용약관
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                개인정보처리방침
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors text-sm">
                고객센터
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
