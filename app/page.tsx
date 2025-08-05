'use client';

import { useState, useEffect } from 'react';
import TabNavigation from '../components/TabNavigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'home', name: '홈', icon: '🏠' },
    { id: 'crypto', name: '암호화폐', icon: '₿' },
    { id: 'futures', name: '선물/마진', icon: '📈' },
    { id: 'community', name: '커뮤니티', icon: '💬' },
    { id: 'p2e', name: 'P2E 게임', icon: '🎮' },
    { id: 'forum', name: '포럼', icon: '📝' },
    { id: 'gallery', name: '갤러리', icon: '🖼️' },
    { id: 'exchange', name: '거래소/차트', icon: '📊' },
  ];

  const cryptoData = [
    { name: 'BTC', price: '7,892,099', change: '+0.59%', volume: '10,793 BTC' },
    { name: 'XRP', price: '1,245', change: '+2.31%', volume: '1,234,567 XRP' },
    { name: 'DOGE', price: '89', change: '-1.23%', volume: '5,678,901 DOGE' },
    { name: 'BNB', price: '456,789', change: '+0.87%', volume: '2,345 BNB' },
    { name: 'SOL', price: '123,456', change: '+3.45%', volume: '8,901 SOL' },
    { name: 'ADA', price: '789', change: '-0.67%', volume: '12,345 ADA' },
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">
                {user ? `안녕하세요, ${user.username}님! 👋` : '환영합니다! 👋'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {user 
                  ? '로그인하신 것을 환영합니다! 위의 탭을 클릭하여 다양한 기능을 탐색해보세요.'
                  : 'Next.js 프로젝트에 오신 것을 환영합니다. 로그인하여 더 많은 기능을 이용해보세요.'
                }
              </p>
              {!user && (
                <div className="mt-4 flex space-x-4">
                  <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="font-semibold mb-3">최신 소식</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Next.js 15 새로운 기능 발표</li>
                  <li>• React 19 업데이트 소식</li>
                  <li>• Tailwind CSS 4.0 베타 출시</li>
                </ul>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="font-semibold mb-3">빠른 링크</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <a href="#" className="text-blue-600 hover:underline">문서 보기</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:underline">예제 코드</a></li>
                  <li>• <a href="#" className="text-blue-600 hover:underline">커뮤니티</a></li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'crypto':
        return (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">암호화폐 시세</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-2">코인</th>
                      <th className="text-right py-2">가격 (KRW)</th>
                      <th className="text-right py-2">변동률</th>
                      <th className="text-right py-2">거래량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.map((crypto, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 font-medium">{crypto.name}</td>
                        <td className="text-right">{crypto.price}</td>
                        <td className={`text-right ${crypto.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.change}
                        </td>
                        <td className="text-right text-gray-500">{crypto.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'community':
        return (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">커뮤니티</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">게시판</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• 자유게시판</li>
                    <li>• 질문/답변</li>
                    <li>• 유머/감동</li>
                    <li>• HOT게시물</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">최신글</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Next.js 프로젝트 시작하기</li>
                    <li>• React 19 새로운 기능</li>
                    <li>• Tailwind CSS 팁과 트릭</li>
                    <li>• TypeScript 베스트 프랙티스</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'exchange':
        return (
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">거래소/차트</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">차트 영역 (실제 차트 라이브러리 연동 가능)</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">{tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              이 탭의 내용은 개발 중입니다. 곧 업데이트될 예정입니다.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NextProject
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">레벨(4)</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">포인트(250)</span>
              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {renderTabContent()}
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






