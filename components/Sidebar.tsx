'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface Tab {
  href: string;
  name: string;
  icon: string;
  description?: string;
}

export const tabs: Tab[] = [
  { href: '/', name: '홈', icon: '🏠', description: 'NextProject 메인 홈페이지' },
  { href: '/hashrate', name: '해시레이트', icon: '⚡', description: '네트워크 해시레이트 정보' },
  { href: '/mining', name: '마이닝', icon: '⛏️', description: '암호화폐 채굴 시뮬레이션' },
  { href: '/block', name: '블록', icon: '🧱', description: '블록체인 블록 정보 및 탐색' },
  { href: '/crypto', name: '암호화폐', icon: '₿', description: '실시간 암호화폐 시세 확인' },
  { href: '/community', name: '커뮤니티', icon: '💬', description: '개발자들과 소통하고 지식 공유' },
  { href: '/exchange', name: '거래소/차트', icon: '📊', description: '실시간 거래 및 차트 분석' },
  { href: '/graph', name: '그래프', icon: '📈', description: '데이터 시각화 및 그래프 차트' },
  { href: '/redis', name: 'Redis', icon: '🔴', description: 'Redis 데이터 저장 및 조회 테스트' },
  { href: '/trans', name: '변환', icon: '🔄', description: '데이터변환' },  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
      {/* 로고 영역 */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            BitCoinBoard
          </span>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
          메뉴
        </div>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center space-x-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-base w-4 text-center">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* 하단 푸터 영역 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>© 2026 BitCoinBoard</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
}
