'use client';

import { useState } from 'react';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: '전체', count: 48 },
    { id: 'ui-design', name: 'UI 디자인', count: 15 },
    { id: 'web-dev', name: '웹 개발', count: 12 },
    { id: 'mobile', name: '모바일', count: 8 },
    { id: 'illustration', name: '일러스트', count: 9 },
    { id: 'photography', name: '사진', count: 4 },
  ];

  const galleries = [
    {
      id: 1,
      title: 'Modern Dashboard UI Kit',
      author: 'DesignPro',
      category: 'ui-design',
      likes: 234,
      views: '1.2K',
      image: '🎨',
      tags: ['Dashboard', 'UI Kit', 'Modern'],
      description: '깔끔하고 모던한 대시보드 UI 키트'
    },
    {
      id: 2,
      title: 'E-commerce Website',
      author: 'WebMaster',
      category: 'web-dev',
      likes: 189,
      views: '890',
      image: '🛒',
      tags: ['E-commerce', 'React', 'Next.js'],
      description: 'React와 Next.js로 구축한 전자상거래 사이트'
    },
    {
      id: 3,
      title: 'Mobile Banking App',
      author: 'MobileDesigner',
      category: 'mobile',
      likes: 156,
      views: '654',
      image: '📱',
      tags: ['Mobile', 'Banking', 'FinTech'],
      description: '사용자 친화적인 모바일 뱅킹 앱 디자인'
    },
    {
      id: 4,
      title: 'Brand Illustration Set',
      author: 'ArtistCreator',
      category: 'illustration',
      likes: 278,
      views: '1.5K',
      image: '🎭',
      tags: ['Illustration', 'Brand', 'Vector'],
      description: '브랜드용 벡터 일러스트레이션 세트'
    },
    {
      id: 5,
      title: 'SaaS Landing Page',
      author: 'LandingExpert',
      category: 'web-dev',
      likes: 203,
      views: '987',
      image: '🌐',
      tags: ['Landing', 'SaaS', 'Conversion'],
      description: '높은 전환율을 위한 SaaS 랜딩 페이지'
    },
    {
      id: 6,
      title: 'Travel App Interface',
      author: 'TravelDesigner',
      category: 'mobile',
      likes: 145,
      views: '743',
      image: '✈️',
      tags: ['Travel', 'Mobile', 'UX'],
      description: '여행 예약을 위한 모바일 앱 인터페이스'
    },
    {
      id: 7,
      title: 'Corporate Website',
      author: 'CorpDesigner',
      category: 'web-dev',
      likes: 167,
      views: '834',
      image: '🏢',
      tags: ['Corporate', 'Business', 'Professional'],
      description: '전문적인 기업 웹사이트 디자인'
    },
    {
      id: 8,
      title: 'Food Photography',
      author: 'FoodPhotographer',
      category: 'photography',
      likes: 312,
      views: '2.1K',
      image: '📸',
      tags: ['Food', 'Photography', 'Commercial'],
      description: '상업적 음식 사진 포트폴리오'
    }
  ];

  const filteredGalleries = activeFilter === 'all' 
    ? galleries 
    : galleries.filter(item => item.category === activeFilter);

  const featuredWork = {
    title: 'Award-Winning Dashboard Design',
    author: 'TopDesigner',
    views: '5.2K',
    likes: 892,
    description: '2024년 디자인 어워드 수상작'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🖼️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">갤러리</h1>
            <p className="text-gray-600 dark:text-gray-300">크리에이터들의 작품을 감상하고 영감을 얻어보세요</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 필터 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-wrap gap-3">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-pink-500 to-orange-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter.name} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* 갤러리 그리드 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleries.map((item) => (
                  <div key={item.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <span className="text-6xl">{item.image}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          by {item.author}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{item.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>👁️</span>
                            <span>{item.views}</span>
                          </span>
                        </div>
                        <button className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium">
                          자세히 보기 →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 업로드 버튼 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <button className="w-full bg-gradient-to-r from-pink-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-orange-700 transition-all font-semibold">
                  📤 작품 업로드
                </button>
              </div>

              {/* 이번 주 추천 작품 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⭐ 이번 주 추천</h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{featuredWork.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {featuredWork.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{featuredWork.description}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>❤️ {featuredWork.likes}</span>
                    <span>👁️ {featuredWork.views}</span>
                  </div>
                </div>
              </div>

              {/* 인기 태그 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏷️ 인기 태그</h3>
                <div className="flex flex-wrap gap-2">
                  {['UI/UX', 'Web Design', 'Mobile App', 'Branding', 'Illustration', 'Photography', 'Animation', 'Typography'].map((tag, index) => (
                    <span key={index} className="bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/20 dark:to-orange-900/20 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm hover:from-pink-200 hover:to-orange-200 dark:hover:from-pink-800/30 dark:hover:to-orange-800/30 cursor-pointer transition-all">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 갤러리 통계 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 갤러리 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총 작품</span>
                    <span className="font-bold text-pink-600 dark:text-pink-400">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">크리에이터</span>
                    <span className="font-bold text-pink-600 dark:text-pink-400">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총 조회수</span>
                    <span className="font-bold text-pink-600 dark:text-pink-400">98.7K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">이번 달 업로드</span>
                    <span className="font-bold text-green-600 dark:text-green-400">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}