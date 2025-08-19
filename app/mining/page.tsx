'use client';

import { useState, useEffect } from 'react';
import TabNavigation from '../../components/TabNavigation';

export default function MiningPage() {
  const [hashPower, setHashPower] = useState(100);
  const [miningActive, setMiningActive] = useState(false);
  const [minedCoins, setMinedCoins] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [electricityCost, setElectricityCost] = useState(0);
  const [miningTime, setMiningTime] = useState(0);

  // 마이닝 시뮬레이션
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (miningActive) {
      interval = setInterval(() => {
        // 채굴 시뮬레이션 (랜덤 요소 포함)
        const miningRate = (hashPower / 1000) * (0.8 + Math.random() * 0.4);
        const newCoins = miningRate * 0.00001; // 작은 단위로 채굴
        const coinPrice = 50000; // 가상의 코인 가격
        const earnings = newCoins * coinPrice;
        const electricityUsage = (hashPower / 100) * 0.1; // 전기 비용
        
        setMinedCoins(prev => prev + newCoins);
        setTotalEarnings(prev => prev + earnings);
        setElectricityCost(prev => prev + electricityUsage);
        setMiningTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [miningActive, hashPower]);

  const handleStartMining = () => {
    setMiningActive(true);
  };

  const handleStopMining = () => {
    setMiningActive(false);
  };

  const profit = totalEarnings - electricityCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">⛏️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">암호화폐 마이닝 시뮬레이터</h1>
            <p className="text-gray-600 dark:text-gray-300">가상으로 암호화폐를 채굴하고 수익을 확인해보세요</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 마이닝 컨트롤 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 마이닝 상태 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">마이닝 상태</h2>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${miningActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {miningActive ? '마이닝 중...' : '대기 중'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    운영 시간: {Math.floor(miningTime / 60)}분 {miningTime % 60}초
                  </div>
                </div>

                {/* 해시파워 조절 */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">해시파워</label>
                    <span className="text-sm font-bold text-blue-600">{hashPower} TH/s</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    value={hashPower}
                    onChange={(e) => setHashPower(Number(e.target.value))}
                    disabled={miningActive}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 TH/s</span>
                    <span>1000 TH/s</span>
                  </div>
                </div>

                {/* 컨트롤 버튼 */}
                <div className="flex space-x-4">
                  {!miningActive ? (
                    <button
                      onClick={handleStartMining}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      마이닝 시작
                    </button>
                  ) : (
                    <button
                      onClick={handleStopMining}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all"
                    >
                      마이닝 중지
                    </button>
                  )}
                </div>
              </div>

              {/* 실시간 통계 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">실시간 통계</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">채굴된 코인</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {minedCoins.toFixed(8)} BTC
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 수익</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">전기 비용</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ${electricityCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">순수익</p>
                    <p className={`text-2xl font-bold ${profit >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 마이닝 풀 정보 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">마이닝 풀 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">풀 이름</span>
                    <span className="font-medium text-gray-900 dark:text-white">NextPool</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">수수료</span>
                    <span className="font-medium text-gray-900 dark:text-white">1%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">최소 출금</span>
                    <span className="font-medium text-gray-900 dark:text-white">0.001 BTC</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">예상 일일 수익</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${((minedCoins * 50000 * 86400) / Math.max(miningTime, 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 마이닝 장비 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">내 마이닝 장비</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">ASIC Miner S19</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">활성</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>해시레이트: {hashPower} TH/s</p>
                      <p>전력 소비: {(hashPower * 3).toFixed(0)}W</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                    + 장비 추가
                  </button>
                </div>
              </div>

              {/* 시장 정보 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">시장 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">BTC 가격</span>
                    <span className="font-medium text-gray-900 dark:text-white">$50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">네트워크 난이도</span>
                    <span className="font-medium text-gray-900 dark:text-white">25.05T</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">블록 보상</span>
                    <span className="font-medium text-gray-900 dark:text-white">6.25 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">다음 반감기</span>
                    <span className="font-medium text-gray-900 dark:text-white">2024년</span>
                  </div>
                </div>
              </div>

              {/* 알림 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">시뮬레이션 모드</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      이것은 교육 목적의 시뮬레이션입니다. 실제 암호화폐를 채굴하지 않습니다.
                    </p>
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