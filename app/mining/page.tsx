'use client';

import { useState } from 'react';
import TabNavigation from '../../components/TabNavigation';
import DeleteIndexButton from '@/components/DeleteIndexButton';


export default function MiningPage() {
  // Calculator input states
  const [hashRate, setHashRate] = useState(200);
  const [powerConsumption, setPowerConsumption] = useState(3500);
  const [electricityRate, setElectricityRate] = useState(0.1);
  const [poolFee, setPoolFee] = useState(0);
  const [hardwareCost, setHardwareCost] = useState(0);
  const [btcPrice, setBtcPrice] = useState(67000);
  const [difficulty, setDifficulty] = useState(72676943932377);
  const [blockReward, setBlockReward] = useState(6.25);
  const [networkHashRate, setNetworkHashRate] = useState(520000000);

  // Results state
  const [results, setResults] = useState({
    hourly: { btc: 0, usd: 0, cost: 0, profit: 0 },
    daily: { btc: 0, usd: 0, cost: 0, profit: 0 },
    weekly: { btc: 0, usd: 0, cost: 0, profit: 0 },
    monthly: { btc: 0, usd: 0, cost: 0, profit: 0 }
  });

  // Mining profitability calculation
  const calculateProfitability = () => {
    // Convert TH/s to H/s for calculation
    const hashRateHs = hashRate * Math.pow(10, 12);

    // Calculate expected BTC per second
    const btcPerSecond = (hashRateHs * blockReward) / (difficulty * Math.pow(2, 32) / Math.pow(10, 12));

    // Calculate power cost per hour
    const powerCostPerHour = (powerConsumption / 1000) * electricityRate;

    // Calculate for different time periods
    const periods = {
      hourly: {
        btc: btcPerSecond * 3600,
        cost: powerCostPerHour
      },
      daily: {
        btc: btcPerSecond * 86400,
        cost: powerCostPerHour * 24
      },
      weekly: {
        btc: btcPerSecond * 604800,
        cost: powerCostPerHour * 168
      },
      monthly: {
        btc: btcPerSecond * 2629746,
        cost: powerCostPerHour * 730
      }
    };

    // Calculate USD earnings and profit for each period
    const newResults: any = {};
    Object.keys(periods).forEach(period => {
      const { btc, cost } = periods[period as keyof typeof periods];
      const grossUsd = btc * btcPrice;
      const poolFeeAmount = grossUsd * (poolFee / 100);
      const netUsd = grossUsd - poolFeeAmount;
      const profit = netUsd - cost;

      newResults[period] = {
        btc: btc,
        usd: netUsd,
        cost: cost,
        profit: profit
      };
    });

    setResults(newResults);
  };

  const handleCalculate = () => {
    calculateProfitability();
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">비트코인 마이닝 수익성 계산기</h1>
            <p className="text-gray-600 dark:text-gray-300">마이닝 장비 사양과 전기료를 입력하여 예상 수익을 계산해보세요</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 계산기 입력 폼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 마이닝 하드웨어 설정 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">마이닝 하드웨어 설정</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 해시레이트 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      해시레이트 (TH/s)
                    </label>
                    <input
                      type="number"
                      value={hashRate}
                      onChange={(e) => setHashRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>

                  {/* 전력 소비 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      전력 소비 (W)
                    </label>
                    <input
                      type="number"
                      value={powerConsumption}
                      onChange={(e) => setPowerConsumption(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3500"
                    />
                  </div>

                  {/* 전기료 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      전기료 ($/kWh)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={electricityRate}
                      onChange={(e) => setElectricityRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.10"
                    />
                  </div>

                  {/* 풀 수수료 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      풀 수수료 (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={poolFee}
                      onChange={(e) => setPoolFee(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>

                  {/* 하드웨어 비용 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      하드웨어 비용 ($)
                    </label>
                    <input
                      type="number"
                      value={hardwareCost}
                      onChange={(e) => setHardwareCost(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  {/* BTC 가격 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      BTC 가격 ($)
                    </label>
                    <input
                      type="number"
                      value={btcPrice}
                      onChange={(e) => setBtcPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="67000"
                    />
                  </div>
                </div>

                {/* 계산 버튼 */}
                <div className="mt-6">
                  <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    수익성 계산하기
                  </button>
                </div>
              </div>

              {/* 수익성 결과 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">예상 수익</h3>

                {/* 시간별 결과 탭 */}
                <div className="space-y-4">
                  {/* 시간당 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">시간당</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">BTC</p>
                        <p className="text-sm font-bold text-blue-600">{results.hourly.btc.toFixed(8)}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">수익</p>
                        <p className="text-sm font-bold text-green-600">${results.hourly.usd.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">전기료</p>
                        <p className="text-sm font-bold text-red-600">${results.hourly.cost.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">순이익</p>
                        <p className={`text-sm font-bold ${results.hourly.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          ${results.hourly.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 일일 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">일일</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">BTC</p>
                        <p className="text-sm font-bold text-blue-600">{results.daily.btc.toFixed(8)}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">수익</p>
                        <p className="text-sm font-bold text-green-600">${results.daily.usd.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">전기료</p>
                        <p className="text-sm font-bold text-red-600">${results.daily.cost.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">순이익</p>
                        <p className={`text-sm font-bold ${results.daily.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          ${results.daily.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 주간 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">주간</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">BTC</p>
                        <p className="text-sm font-bold text-blue-600">{results.weekly.btc.toFixed(8)}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">수익</p>
                        <p className="text-sm font-bold text-green-600">${results.weekly.usd.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">전기료</p>
                        <p className="text-sm font-bold text-red-600">${results.weekly.cost.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">순이익</p>
                        <p className={`text-sm font-bold ${results.weekly.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          ${results.weekly.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 월간 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">월간</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">BTC</p>
                        <p className="text-sm font-bold text-blue-600">{results.monthly.btc.toFixed(8)}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">수익</p>
                        <p className="text-sm font-bold text-green-600">${results.monthly.usd.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">전기료</p>
                        <p className="text-sm font-bold text-red-600">${results.monthly.cost.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">순이익</p>
                        <p className={`text-sm font-bold ${results.monthly.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                          ${results.monthly.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 네트워크 정보 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">네트워크 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      난이도
                    </label>
                    <input
                      type="number"
                      value={difficulty}
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="72676943932377"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      블록 보상 (BTC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={blockReward}
                      onChange={(e) => setBlockReward(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6.25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      네트워크 해시레이트 (TH/s)
                    </label>
                    <input
                      type="number"
                      value={networkHashRate}
                      onChange={(e) => setNetworkHashRate(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="520000000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 인기 마이닝 장비 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">인기 마이닝 장비</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                       onClick={() => {setHashRate(200); setPowerConsumption(3500);}}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Antminer S19 Pro+</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">추천</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>해시레이트: 200 TH/s</p>
                      <p>전력 소비: 3500W</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                       onClick={() => {setHashRate(110); setPowerConsumption(3250);}}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Antminer S19 XP</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">효율성</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>해시레이트: 110 TH/s</p>
                      <p>전력 소비: 3250W</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
                       onClick={() => {setHashRate(95); setPowerConsumption(3010);}}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">Antminer S19</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">경제적</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>해시레이트: 95 TH/s</p>
                      <p>전력 소비: 3010W</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 계산 참고사항 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">계산 참고사항</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500">ℹ️</span>
                    <p>실제 수익은 네트워크 난이도 변화, 전기료 변동, 하드웨어 고장 등으로 인해 달라질 수 있습니다.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500">⚠️</span>
                    <p>마이닝 풀 수수료, 하드웨어 감가상각, 유지보수 비용 등을 고려해야 합니다.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">💡</span>
                    <p>전기료가 수익성에 가장 큰 영향을 미치므로 정확한 전기료를 입력하세요.</p>
                  </div>
                </div>
              </div>

              {/* 면책 조항 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">면책 조항</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      이 계산기는 참고용이며, 실제 마이닝 수익을 보장하지 않습니다. 투자 결정 전 충분한 검토가 필요합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 사이트 관리 버튼 */}
              <DeleteIndexButton />


            </div>
          </div>
        </div>
      </main>
    </div>
  );
}