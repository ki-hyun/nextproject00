// 'use client';

import TabNavigation from '../../components/TabNavigation';
import { getRealTimeHashrate, formatHashrate } from "@/lib/getRealTimeInfo";
import Chart from '@/components/Chart';
import DeleteIndexButton from '@/components/DeleteIndexButton';
// import { useState } from 'react';

// 페이지 레벨에서 캐싱 비활성화 및 런타임 강제
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export default async function BlockPage() {

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
  console.log(_realtimehashrate)
  // {
  //   timestamp: 1758719814000,                    // 데이터 수집 시점 (Unix 타임스탬프, 밀리초)
  //   market_price_usd: 112979.79,                 // 비트코인 현재 시장 가격 (USD)
  //   hash_rate: 1082611043219.257,                // 네트워크 해시레이트 (H/s, 약 1.08 EH/s)
  //   total_fees_btc: -47812500000,                // 총 거래 수수료 (사토시 단위)
  //   n_btc_mined: 47812500000,                    // 최근 채굴된 BTC (사토시 단위, 478.125 BTC)
  //   n_tx: 552322,                                // 최근 24시간 총 거래 수
  //   n_blocks_mined: 153,                         // 최근 24시간 채굴된 블록 수
  //   minutes_between_blocks: 8.6776,              // 최근 블록 간 평균 시간 (분)
  //   totalbc: 1992558125000000,                   // 현재까지 총 발행된 BTC (사토시 단위, 약 19.93M BTC)
  //   n_blocks_total: 916186,                      // 전체 채굴된 블록 수 (현재 블록 높이와 동일)
  //   estimated_transaction_volume_usd: 12763303078.197489,  // 예상 거래량 (USD)
  //   blocks_size: 219168003,                      // 최근 블록들의 총 크기 (바이트)
  //   miners_revenue_usd: 0,                       // 채굴자 수익 (USD)
  //   nextretarget: 917279,                        // 다음 난이도 조정 예정 블록 높이
  //   difficulty: 142342602928674,                 // 현재 채굴 난이도 (약 142.34T)
  //   estimated_btc_sent: 11296978935965,          // 예상 전송된 BTC 총량 (사토시 단위)
  //   miners_revenue_btc: 0,                       // 채굴자 수익 (BTC)
  //   total_btc_sent: 71667806263676,              // 전체 전송된 BTC 총량 (사토시 단위)
  //   trade_volume_btc: 2917.11,                   // 거래소 거래량 (BTC)
  //   trade_volume_usd: 329574475.2069,            // 거래소 거래량 (USD)
  //   currentBlockHeight: 916186,                  // 현재 블록 높이 (커스텀 필드)
  //   lastDifficultyAdjustmentBlock: 915264,       // 마지막 난이도 조정된 블록 (커스텀 필드)
  //   lastDifficultyAdjustmentTime: 1758206848000  // 마지막 난이도 조정 시간 (커스텀 필드)
  // }
  
  // <div className="max-w-full mx-auto px-1">

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* <div className="max-w-4xl mx-auto"> */}
        <div className="max-w-full mx-auto px-1 mt-1">
          
            {/* 업데이트 시간 */}
            <div className="mb-4 md:mb-6 text-center space-y-2">
              {/* <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
                현재 시간: {new Date().toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </p> */}
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
                <span className="text-sm md:text-lg ml-2 text-gray-400">
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

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50">

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

            </div>

            {/* 난이도 조정 정보 - 전체 너비로 표시 */}
            <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl">
              <div className="w-full">
                
                {/* 현재 난이도 블록 진행상황 */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 md:pt-4">
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 md:p-6">
                    {/* 진행률 표시 */}
                    <div className="text-center mb-4 md:mb-6">
                      <div className="text-3xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {((currentHeight % BLOCKS_PER_ADJUSTMENT) / BLOCKS_PER_ADJUSTMENT * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        {(currentHeight % BLOCKS_PER_ADJUSTMENT).toLocaleString()} / {BLOCKS_PER_ADJUSTMENT.toLocaleString()} 블록
                      </div>
                    </div>

                    {/* 큰 진행률 바 */}
                    <div className="mb-4 md:mb-6">
                      {/* 블록 넘버 표시 */}
                      <div className="flex justify-between text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="font-medium">
                          {(_realtimehashrate?.lastDifficultyAdjustmentBlock || (currentHeight - (currentHeight % BLOCKS_PER_ADJUSTMENT))).toLocaleString()}
                        </div>
                        <div className="font-medium">
                          {nextAdjustmentBlock.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 md:h-8 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-6 md:h-8 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                          style={{
                            width: `${((currentHeight % BLOCKS_PER_ADJUSTMENT) / BLOCKS_PER_ADJUSTMENT * 100).toFixed(1)}%`
                          }}
                        >
                          {/* 애니메이션 효과 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 text-center">
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">남은 블록</div>
                        <div className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">
                          {blocksUntilAdjustment.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">현재 블록</div>
                        <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {currentHeight.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">예상 완료</div>
                        <div className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400">
                          {(() => {
                            const days = Math.floor(hoursUntilAdjustment / 24);
                            const hours = Math.floor(hoursUntilAdjustment % 24);
                            if (days > 0) {
                              return `${days}일 ${hours}시간`;
                            } else {
                              return `${hours}시간`;
                            }
                          })()}
                        </div>
                      </div>
                      {/* <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 md:p-4">
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">평균 블록시간</div>
                        <div className={`text-lg md:text-xl font-bold ${
                          currentDifficultyAvgBlockTime <= TARGET_BLOCK_TIME 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {currentDifficultyAvgBlockTime ? currentDifficultyAvgBlockTime.toFixed(2) : 'N/A'} 분
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* 난이도 예측 섹션 */}
                {/* <div className="border-t border-gray-200 dark:border-gray-600 pt-3 md:pt-4 mt-3 md:mt-4">
                  <h4 className="text-sm md:text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                    🎯 예상 난이도 변화
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
                </div> */}
              </div>
            </div>
          </div>

          <div className="mt-150">
            <Chart
              series={chartSeries}
              title="Chart"
              firstloding={3}
              height={800}
              />
          </div>

          {/* 사이트 관리 버튼 */}
          <DeleteIndexButton />

        </div>
      </main>
    </div>
  );
}