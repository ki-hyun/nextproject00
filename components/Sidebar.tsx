'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/SidebarContext';

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
  { href: '/block', name: '블록', icon: '🧱', description: '블록 정보' },
  { href: '/graph', name: '그래프', icon: '📈', description: '데이터 시각화 및 그래프 차트' },
  { href: '/redis', name: 'Redis', icon: '🔴', description: 'Redis 데이터 저장 및 조회 테스트' },
];

const asideStyle = {
  backgroundColor: 'var(--theme-primary)',
  borderColor: 'color-mix(in srgb, var(--theme-text-on-primary) 10%, transparent)',
};

function SidebarContent({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <>
      {/* 로고 */}
      <div className="h-14 flex items-center px-5 border-b shrink-0" style={{ borderColor: asideStyle.borderColor }}>
        <Link href="/" onClick={onClose} className="flex items-center space-x-2">
          <span className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--theme-text-on-primary)' }}>
            BitCoinBoard
          </span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'var(--theme-text-muted-on-primary)' }}>메뉴</p>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'font-semibold' : 'hover:bg-black/5 hover:dark:bg-white/5'}`}
              style={isActive
                ? { backgroundColor: 'color-mix(in srgb, var(--theme-text-on-primary) 15%, transparent)', color: 'var(--theme-text-on-primary)' }
                : { color: 'var(--theme-text-muted-on-primary)' }}
            >
              <span className="text-base w-4 text-center">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* 하단 푸터 */}
      <div className="p-4 border-t shrink-0" style={{ borderColor: asideStyle.borderColor }}>
        <p className="text-xs" style={{ color: 'var(--theme-text-muted-on-primary)' }}>© 2026 BitCoinBoard</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--theme-text-muted-on-primary)' }}>All rights reserved.</p>
      </div>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* ── 모바일: 열렸을 때만 fixed 오버레이로 표시 ── */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={close} />
          <aside
            className="fixed top-0 left-0 z-40 w-52 flex flex-col h-screen border-r md:hidden"
            style={{ ...asideStyle, paddingTop: 'env(safe-area-inset-top)' }}
          >
            <SidebarContent pathname={pathname} onClose={close} />
          </aside>
        </>
      )}

      {/* ── 데스크탑: 항상 sticky in-flow 사이드바 ── */}
      <aside
        className="hidden md:flex md:flex-col w-52 flex-shrink-0 border-r h-screen sticky top-0"
        style={{ ...asideStyle, paddingTop: 'env(safe-area-inset-top)' }}
      >
        <SidebarContent pathname={pathname} onClose={close} />
      </aside>
    </>
  );
}
