'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface Tab {
  href: string;
  name: string;
  icon: string;
  description?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface TabNavigationProps {
  user?: User | null;
}

export const tabs: Tab[] = [
  { href: '/', name: '홈', icon: '🏠', description: 'NextProject 메인 홈페이지' },
  { href: '/hashrate', name: '해시레이트', icon: '⚡', description: '네트워크 해시레이트 정보' },
  { href: '/mining', name: '마이닝', icon: '⛏️', description: '암호화폐 채굴 시뮬레이션' },
  { href: '/crypto', name: '암호화폐', icon: '₿', description: '실시간 암호화폐 시세 확인' },
  { href: '/futures', name: '선물/마진', icon: '📈', description: '레버리지 거래 및 선물 계약' },
  { href: '/community', name: '커뮤니티', icon: '💬', description: '개발자들과 소통하고 지식 공유' },
  { href: '/p2e', name: 'P2E 게임', icon: '🎮', description: '플레이하고 수익을 얻는 블록체인 게임' },
  { href: '/forum', name: '포럼', icon: '📝', description: '깊이 있는 토론과 지식 공유' },
  { href: '/gallery', name: '갤러리', icon: '🖼️', description: '크리에이터들의 작품 감상' },
  { href: '/exchange', name: '거래소/차트', icon: '📊', description: '실시간 거래 및 차트 분석' },
  { href: '/graph', name: '그래프', icon: '📈', description: '데이터 시각화 및 그래프 차트' },
  { href: '/redis', name: 'Redis', icon: '🔴', description: 'Redis 데이터 저장 및 조회 테스트' },
];

export default function TabNavigation({ user }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">

        {/* Tab Navigation */}
        <div className="py-3">
          <nav className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}