'use client';

import Link from 'next/link';

export default function ForumPage() {
  const forumCategories = [
    { id: 'general', name: '일반 토론', description: '일반적인 주제에 대한 토론', posts: 1234, icon: '💭' },
    { id: 'tech', name: '기술 토론', description: '개발 및 기술 관련 토론', posts: 567, icon: '💻' },
    { id: 'news', name: '뉴스 & 소식', description: '최신 뉴스와 업계 소식', posts: 890, icon: '📰' },
    { id: 'help', name: '도움 요청', description: '기술적 도움이나 조언 요청', posts: 345, icon: '🆘' },
    { id: 'showcase', name: '프로젝트 쇼케이스', description: '개인 프로젝트 및 작업물 공유', posts: 234, icon: '🎨' },
    { id: 'career', name: '커리어 & 취업', description: '취업, 이직, 커리어 관련 정보', posts: 456, icon: '💼' },
  ];

  const recentTopics = [
    {
      title: '2024년 프론트엔드 트렌드 분석',
      author: 'TechGuru',
      category: '기술 토론',
      replies: 23,
      views: 456,
      lastActivity: '2분 전',
      isHot: true
    },
    {
      title: 'Next.js 15 마이그레이션 경험 공유',
      author: 'ReactDev',
      category: '기술 토론',
      replies: 15,
      views: 234,
      lastActivity: '5분 전',
      isHot: false
    },
    {
      title: '주니어 개발자 취업 포트폴리오 조언',
      author: 'SeniorDev',
      category: '커리어 & 취업',
      replies: 34,
      views: 678,
      lastActivity: '10분 전',
      isHot: true
    },
    {
      title: 'AI 개발 도구들의 실무 활용 후기',
      author: 'AIEnthusiast',
      category: '기술 토론',
      replies: 12,
      views: 123,
      lastActivity: '15분 전',
      isHot: false
    },
    {
      title: '개인 프로젝트 피드백 부탁드립니다',
      author: 'NewbieCoder',
      category: '프로젝트 쇼케이스',
      replies: 8,
      views: 89,
      lastActivity: '20분 전',
      isHot: false
    },
  ];

  const activeUsers = [
    { name: 'TechMaster', status: 'online', role: '모더레이터' },
    { name: 'CodeNinja', status: 'online', role: '멤버' },
    { name: 'DevGuru', status: 'away', role: '멤버' },
    { name: 'ReactPro', status: 'online', role: '멤버' },
    { name: 'FullStackDev', status: 'online', role: '멤버' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">포럼</h1>
            <p className="text-gray-600 dark:text-gray-300">깊이 있는 토론과 지식 공유의 공간</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 포럼 카테고리 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">포럼 카테고리</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {forumCategories.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/forum/${category.id}`}
                      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {category.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">{category.posts}개 게시물</span>
                            <span className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 최근 토픽 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 토픽</h2>
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all text-sm">
                    새 토픽 작성
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTopics.map((topic, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {topic.isHot && (
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                                🔥 HOT
                              </span>
                            )}
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                              {topic.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                            {topic.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>👤 {topic.author}</span>
                            <span>💬 {topic.replies}</span>
                            <span>👁️ {topic.views}</span>
                            <span>🕒 {topic.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 포럼 통계 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 포럼 통계</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총 토픽</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">3,726</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총 댓글</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">15,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">멤버</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">온라인</span>
                    <span className="font-bold text-green-600 dark:text-green-400">87</span>
                  </div>
                </div>
              </div>

              {/* 활성 사용자 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👥 활성 사용자</h3>
                <div className="space-y-3">
                  {activeUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 포럼 규칙 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 포럼 규칙</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 건설적인 토론을 지향해주세요</li>
                  <li>• 개인 공격이나 비방은 금지입니다</li>
                  <li>• 주제에 맞는 카테고리에 작성해주세요</li>
                  <li>• 중복 토픽 생성을 피해주세요</li>
                  <li>• 소스 코드는 코드 블록을 사용해주세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}