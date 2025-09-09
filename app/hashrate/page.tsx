// 'use client';

import TabNavigation from '../../components/TabNavigation';
import { getRealTimeHashrate, formatHashrate } from "@/lib/getRealTimeInfo";
import Chart from '@/components/Chart';
// import { useState } from 'react';

// 페이지 레벨에서 캐싱 비활성화 및 런타임 강제
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export default async function HashratePage() {

  // const [chartHeight, setChartHeight] = useState(800);

  const chartSeries = [
    {
      name: 'Price',
      type: 'line' as const,
      data: [],
      color: '#3b82f6',
      lineWidth: 1,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 0,
      visible: true,  // Price만 처음에 표시
      tooltip: {
        valueDecimals: 2,
        valuePrefix: '$',
        valueSuffix: ' USD'
      },
      customData: {
        dataSource: 'coinprice',
      }
    },
    {
      name: 'HashRate',
      type: 'line' as const,
      data: [],
      color: '#10b981',
      lineWidth: 1,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 1,
      visible: true,  // 처음에 표시
      tooltip: {
        valueDecimals: 2,
        valueSuffix: 'TH/s'
      },
      customData: {
        dataSource: 'hashrate',
      }
    },
    {
      name: 'Difficulty',
      type: 'line' as const,
      data: [],
      color: '#f59e0b',
      lineWidth: 1,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 2,
      visible: true,  // 처음에 표시
      tooltip: {
        valueDecimals: 2,
        valueSuffix: ''
      },
      customData: {
        dataSource: 'difficulty',
        displayUnit: 'trillion' // Chart 컴포넌트에서 처리하도록 표시
      }
    },
  ]

  const _realtimehashrate = await getRealTimeHashrate()

  // 난이도 조정 관련 계산
  const BLOCKS_PER_ADJUSTMENT = 2016;
  const currentHeight = _realtimehashrate?.currentBlockHeight || 0;
  const blocksUntilAdjustment = BLOCKS_PER_ADJUSTMENT - (currentHeight % BLOCKS_PER_ADJUSTMENT);
  const nextAdjustmentBlock = currentHeight + blocksUntilAdjustment;
  
  // 현재 난이도 기간의 평균 블록시간 계산
  let currentDifficultyAvgBlockTime = 10; // 기본값 10분
  if (_realtimehashrate?.lastDifficultyAdjustmentTime && currentHeight > _realtimehashrate?.lastDifficultyAdjustmentBlock) {
    const blocksSinceDifficultyAdjustment = currentHeight - _realtimehashrate.lastDifficultyAdjustmentBlock;
    const timeSinceDifficultyAdjustment = Date.now() - _realtimehashrate.lastDifficultyAdjustmentTime;
    const minutesSinceDifficultyAdjustment = timeSinceDifficultyAdjustment / (1000 * 60);
    currentDifficultyAvgBlockTime = minutesSinceDifficultyAdjustment / blocksSinceDifficultyAdjustment;
  }
  
  // 예상 시간 계산 (현재 난이도 기간의 평균 블록 시간 * 남은 블록 수)
  const minutesUntilAdjustment = blocksUntilAdjustment * currentDifficultyAvgBlockTime;
  const hoursUntilAdjustment = minutesUntilAdjustment / 60;
  const daysUntilAdjustment = hoursUntilAdjustment / 24;
  
  // 예상 난이도 조정 시간
  const nextAdjustmentTime = new Date(Date.now() + minutesUntilAdjustment * 60 * 1000);
  
  // 다음 난이도 예측 계산
  // 목표 블록 시간: 10분
  // 현재 평균 블록 시간이 목표보다 빠르면 난이도 증가, 느리면 감소
  const TARGET_BLOCK_TIME = 10; // 10분
  const currentAvgBlockTime = currentDifficultyAvgBlockTime; // 현재 난이도 기간의 평균 사용
  const currentDifficulty = _realtimehashrate?.difficulty || 0;
  
  // 난이도 조정 비율 = 목표 시간 / 실제 시간
  // 최대 4배, 최소 0.25배로 제한 (비트코인 프로토콜 규칙)
  let adjustmentRatio = TARGET_BLOCK_TIME / currentAvgBlockTime;
  adjustmentRatio = Math.max(0.25, Math.min(4, adjustmentRatio));
  
  // 예상 다음 난이도
  const expectedNextDifficulty = currentDifficulty * adjustmentRatio;
  
  // 난이도 변화율 (%)
  const difficultyChangePercent = ((adjustmentRatio - 1) * 100);

  console.log('HashratePage:', new Date(_realtimehashrate.timestamp).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }))

  // console.log(_realtimehashrate)
  
  // <div className="max-w-full mx-auto px-1">

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* <div className="max-w-4xl mx-auto"> */}
        <div className="max-w-full mx-auto px-1 mt-1">
          
            {/* 업데이트 시간 */}
            <div className="mb-4 md:mb-6 text-center space-y-2">
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
                현재 시간: {new Date().toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </p>
              <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400">
                <span className="block sm:inline">마지막 업데이트:</span> {new Date(_realtimehashrate.timestamp).toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
                <span className="text-sm ml-2 text-gray-400">
                  ({(() => {
                    const timeDiff = Date.now() - _realtimehashrate.timestamp;
                    const seconds = Math.floor(timeDiff / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    
                    if (hours > 0) {
                      return `${hours}시간 ${minutes % 60}분 전`;
                    } else if (minutes > 0) {
                      return `${minutes}분 ${seconds % 60}초 전`;
                    } else {
                      return `${seconds}초 전`;
                    }
                  })()})
                </span>
              </p>
            </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-gray-200/50 dark:border-gray-700/50">


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {/* 해시레이트 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">⚡</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">해시레이트</h3>
                <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {_realtimehashrate?.hash_rate ? formatHashrate(_realtimehashrate.hash_rate) : 'N/A'}
                </p>
              </div>

              {/* 평균 블록시간 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">📊</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">평균 블록시간</h3>
                <p className="text-lg md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {currentDifficultyAvgBlockTime ? currentDifficultyAvgBlockTime.toFixed(2) + ' 분' : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {_realtimehashrate?.lastDifficultyAdjustmentBlock ? 
                    `블록 #${_realtimehashrate.lastDifficultyAdjustmentBlock.toLocaleString()} 이후` : ''}
                </p>
              </div>

              {/* 다음 예상 난이도 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">🎯</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">다음 예상 난이도</h3>
                <p className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {expectedNextDifficulty ? (expectedNextDifficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
                </p>
                <p className={`text-xs mt-1 font-semibold ${difficultyChangePercent > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {difficultyChangePercent > 0 ? '▲' : '▼'} {Math.abs(difficultyChangePercent).toFixed(2)}%
                </p>
              </div>

              {/* 난이도 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">🎯</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">채굴 난이도</h3>
                <p className="text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {_realtimehashrate?.difficulty ? (_realtimehashrate.difficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
                </p>
              </div>

              {/* 24시간 평균 블록 시간 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">⏱️</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">24시간 평균 블록시간</h3>
                <p className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {_realtimehashrate?.minutes_between_blocks ? _realtimehashrate.minutes_between_blocks.toFixed(2) + ' 분' : 'N/A'}
                </p>
              </div>

              {/* 총 채굴량 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">💰</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">총 채굴량</h3>
                <p className="text-lg md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {_realtimehashrate?.totalbc ? (_realtimehashrate.totalbc / 1e8).toLocaleString() + ' BTC' : 'N/A'}
                </p>
              </div>

              {/* 24시간 BTC 발행량 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">📈</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">24시간 BTC 발행</h3>
                <p className="text-lg md:text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {_realtimehashrate?.n_btc_mined ? (_realtimehashrate.n_btc_mined / 1e8).toFixed(2) + ' BTC' : 'N/A'}
                </p>
              </div>

              {/* 24시간 거래 수수료 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">💸</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">24시간 거래 수수료</h3>
                <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {_realtimehashrate?.total_fees_btc ? (_realtimehashrate.total_fees_btc / 1e8).toFixed(4) + ' BTC' : 'N/A'}
                </p>
              </div>

              {/* 블록 크기 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">📦</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">평균 블록 크기</h3>
                <p className="text-lg md:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {_realtimehashrate?.blocks_size ? (_realtimehashrate.blocks_size / 1e6).toFixed(2) + ' MB' : 'N/A'}
                </p>
              </div>

              {/* 예상 거래 볼륨 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-lime-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">💳</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">예상 거래 볼륨</h3>
                <p className="text-lg md:text-2xl font-bold text-lime-600 dark:text-lime-400">
                  {_realtimehashrate?.estimated_transaction_volume_usd ? 
                    '$' + (_realtimehashrate.estimated_transaction_volume_usd / 1e9).toFixed(2) + 'B' : 'N/A'}
                </p>
              </div>

              {/* 24시간 채굴 블록 */}
              <div className="text-center p-3 md:p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">⛏️</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">24시간 채굴 블록</h3>
                <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                  {_realtimehashrate?.n_blocks_mined || 'N/A'}
                </p>
              </div>

            </div>

            {/* 난이도 조정 정보 - 전체 너비로 표시 */}
            <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
              <div className="w-full">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                  🎯 다음 난이도 조정 예측
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">남은 블록</p>
                    <p className="text-base md:text-xl lg:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {blocksUntilAdjustment}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">예상 시간</p>
                    <p className="text-base md:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {daysUntilAdjustment.toFixed(2)}일
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">현재 블록</p>
                    <p className="text-base md:text-xl lg:text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {currentHeight.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">조정 블록</p>
                    <p className="text-base md:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {nextAdjustmentBlock.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">예정 시간</p>
                    <p className="text-sm md:text-base lg:text-lg font-bold text-gray-600 dark:text-gray-400">
                        {nextAdjustmentTime.toLocaleString('ko-KR', {
                          timeZone: 'Asia/Seoul',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                    </p>
                  </div>
                </div>
                
                {/* 난이도 예측 섹션 */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 md:pt-4">
                  <h4 className="text-sm md:text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                    📊 예상 난이도 변화
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">현재 난이도</p>
                      <p className="text-sm md:text-lg lg:text-xl font-bold text-gray-600 dark:text-gray-400">
                        {currentDifficulty ? (currentDifficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">예상 난이도</p>
                      <p className="text-sm md:text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {expectedNextDifficulty ? (expectedNextDifficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">예상 변화율</p>
                      <p className={`text-sm md:text-lg lg:text-xl font-bold ${difficultyChangePercent > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {difficultyChangePercent > 0 ? '+' : ''}{difficultyChangePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">평균 블록시간</p>
                      <p className="text-sm md:text-lg lg:text-xl font-bold text-gray-600 dark:text-gray-400">
                        {currentDifficultyAvgBlockTime ? currentDifficultyAvgBlockTime.toFixed(2) + ' 분' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Chart 
              series={chartSeries}
              title="Chart"
              firstloding={3}
              height={800}
              />
          </div>

        </div>
      </main>
    </div>
  );
}