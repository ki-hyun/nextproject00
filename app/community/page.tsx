'use client';

import Link from 'next/link';

export default function CommunityPage() {
  const categories = [
    { id: 'free', name: '자유게시판', count: 1234, icon: '💬' },
    { id: 'qna', name: '질문/답변', count: 567, icon: '❓' },
    { id: 'humor', name: '유머/감동', count: 890, icon: '😄' },
    { id: 'hot', name: 'HOT게시물', count: 123, icon: '🔥' },
  ];

  const recentPosts = [
    { title: 'Next.js 15 새로운 기능에 대해', author: '개발자123', time: '5분 전', replies: 12 },
    { title: 'React 19 업데이트 후기', author: 'react_user', time: '10분 전', replies: 8 },
    { title: 'Tailwind CSS 팁 공유합니다', author: 'css_master', time: '15분 전', replies: 23 },
    { title: 'TypeScript 베스트 프랙티스', author: 'ts_guru', time: '30분 전', replies: 45 },
    { title: '프로젝트 리뷰 요청드립니다', author: 'newbie_dev', time: '1시간 전', replies: 7 },
  ];

  const hotPosts = [
    { title: '2024년 프론트엔드 트렌드 정리', views: '1.2K', replies: 89 },
    { title: 'Next.js vs Nuxt.js 비교 분석', views: '980', replies: 67 },
    { title: '개발자 취업 준비 완벽 가이드', views: '2.1K', replies: 134 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">커뮤니티</h1>
            <p className="text-gray-600 dark:text-gray-300">개발자들과 소통하고 지식을 공유하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 게시판 카테고리 */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">게시판</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/community/${category.id}`}
                      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{category.count}개 게시물</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 최신 게시물 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">최신 게시물</h2>
                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {post.author} • {post.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 글쓰기 버튼 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-semibold">
                  ✏️ 새 글 작성
                </button>
              </div>

              {/* HOT 게시물 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  🔥 인기 게시물
                </h3>
                <div className="space-y-3">
                  {hotPosts.map((post, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>👁️ {post.views}</span>
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 커뮤니티 규칙 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 커뮤니티 규칙</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 서로 존중하며 예의를 지켜주세요</li>
                  <li>• 스팸이나 광고성 글은 금지입니다</li>
                  <li>• 개발 관련 내용을 공유해주세요</li>
                  <li>• 질문할 때는 구체적으로 작성해주세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}