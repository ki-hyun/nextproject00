'use client';

import TabNavigation from '../../components/TabNavigation';

export default function P2EPage() {
  const games = [
    {
      id: 1,
      title: 'CryptoAdventure',
      image: '🗡️',
      genre: 'RPG',
      reward: 'CAT Token',
      players: '12.5K',
      rating: 4.8,
      earnings: '$15-50/day'
    },
    {
      id: 2,
      title: 'NFT Racing',
      image: '🏎️',
      genre: 'Racing',
      reward: 'RACE Token',
      players: '8.3K',
      rating: 4.6,
      earnings: '$10-35/day'
    },
    {
      id: 3,
      title: 'MetaFarm',
      image: '🌾',
      genre: 'Simulation',
      reward: 'FARM Token',
      players: '25.1K',
      rating: 4.9,
      earnings: '$8-25/day'
    },
    {
      id: 4,
      title: 'Battle Arena',
      image: '⚔️',
      genre: 'Strategy',
      reward: 'WAR Token',
      players: '15.7K',
      rating: 4.7,
      earnings: '$12-40/day'
    }
  ];

  const myGames = [
    { name: 'MetaFarm', level: 25, earnings: '$145.30', status: '플레이 중' },
    { name: 'CryptoAdventure', level: 18, earnings: '$89.45', status: '대기 중' },
  ];

  const leaderboard = [
    { rank: 1, player: 'GameMaster99', earnings: '$2,340', games: 5 },
    { rank: 2, player: 'CryptoKing', earnings: '$1,890', games: 3 },
    { rank: 3, player: 'NFTHunter', earnings: '$1,654', games: 4 },
    { rank: 4, player: 'MetaPlayer', earnings: '$1,432', games: 2 },
    { rank: 5, player: 'BlockGamer', earnings: '$1,123', games: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">P2E 게임</h1>
            <p className="text-gray-600 dark:text-gray-300">플레이하고 수익을 얻는 블록체인 게임</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 내 게임 현황 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">내 게임 현황</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {myGames.map((game, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{game.name}</h3>
                          <p className="text-sm opacity-80">Level {game.level}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          game.status === '플레이 중' 
                            ? 'bg-green-500/20 text-green-100' 
                            : 'bg-yellow-500/20 text-yellow-100'
                        }`}>
                          {game.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold">{game.earnings}</p>
                          <p className="text-sm opacity-80">총 수익</p>
                        </div>
                        <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all">
                          플레이
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 인기 게임 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">인기 P2E 게임</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {games.map((game) => (
                    <div key={game.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                            {game.image}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{game.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{game.genre}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm">⭐ {game.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">리워드 토큰:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{game.reward}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">활성 플레이어:</span>
                          <span className="font-medium">{game.players}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">예상 수익:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{game.earnings}</span>
                        </div>
                      </div>

                      <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-cyan-700 transition-all font-medium">
                        게임 시작
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 총 수익 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💰 총 수익</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">$234.75</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">이번 달 수익</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">$1,456.30</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">총 누적 수익</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm">
                  출금하기
                </button>
              </div>

              {/* 리더보드 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏆 리더보드</h3>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          player.rank === 1 ? 'bg-yellow-500' : 
                          player.rank === 2 ? 'bg-gray-400' : 
                          player.rank === 3 ? 'bg-orange-500' : 'bg-gray-600'
                        }`}>
                          {player.rank}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{player.player}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{player.games} games</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400 text-sm">{player.earnings}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 가이드 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📚 P2E 가이드</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 게임별 특성을 파악하세요</li>
                  <li>• 초기 투자금을 계획하세요</li>
                  <li>• 리스크 관리가 중요합니다</li>
                  <li>• 커뮤니티와 정보를 공유하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}