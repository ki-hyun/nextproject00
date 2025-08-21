
import { setSimple, getSimple } from './redis';

async function getRealTimeHashrate() {
  // console.log('[getRealTimeHashrate] 함수 호출됨:', new Date().toISOString());
  
  try {

    // const [statsResponse, blockHeightResponse] = await Promise.all([
    //   // 통계 데이터 가져오기
    //   fetch('https://api.blockchain.info/stats', {
    //     cache: 'no-store',
    //     headers: {
    //       'Cache-Control': 'no-cache, no-store, must-revalidate',
    //       'Pragma': 'no-cache'
    //     }
    //   }),
    //   // 현재 블록 높이 가져오기
    //   fetch('https://blockchain.info/q/getblockcount', {
    //     cache: 'no-store',
    //     headers: {
    //       'Cache-Control': 'no-cache, no-store, must-revalidate',
    //       'Pragma': 'no-cache'
    //     }
    //   })
    // ]);

    // 두 API를 병렬로 호출하여 속도 개선 - 1분 캐싱
    const [statsResponse, blockHeightResponse] = await Promise.all([
      // 통계 데이터 가져오기
      fetch('https://api.blockchain.info/stats', {
        next: { revalidate: 30 } // 30초 동안 캐시
      }),
      // 현재 블록 높이 가져오기
      fetch('https://blockchain.info/q/getblockcount', {
        next: { revalidate: 30 } // 30초 동안 캐시
      })
    ]);
    
    if (!statsResponse.ok) {
      throw new Error(`HTTP error! status: ${statsResponse.status}`);
    }
    
    const [data, currentBlockHeight] = await Promise.all([
      statsResponse.json(),
      blockHeightResponse.text()
    ]);
    
    // 최근 난이도 조정 블록 높이 계산
    const currentHeight = parseInt(currentBlockHeight);
    const BLOCKS_PER_ADJUSTMENT = 2016;
    const lastDifficultyAdjustmentBlock = Math.floor(currentHeight / BLOCKS_PER_ADJUSTMENT) * BLOCKS_PER_ADJUSTMENT;
    
    // 최근 난이도 조정 블록 정보 가져오기 (타임스탬프)
    let lastDifficultyAdjustmentTime = null;
    try {
      // Redis에서 먼저 확인
      const cacheKey = `blocktime_${lastDifficultyAdjustmentBlock}`;
      const cachedData = await getSimple(cacheKey);
      
      if (cachedData && cachedData.timestamp) {
        // Redis에 데이터가 있으면 사용
        lastDifficultyAdjustmentTime = cachedData.timestamp * 1000;

        console.log("레디스에 있음",lastDifficultyAdjustmentBlock)
        console.log(cachedData)

      } else {
        // Redis에 없으면 API 호출
        const adjustmentBlockResponse = await fetch(`https://blockchain.info/block-height/${lastDifficultyAdjustmentBlock}?format=json`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (adjustmentBlockResponse.ok) {
          const adjustmentBlockData = await adjustmentBlockResponse.json();
          
          if (adjustmentBlockData.blocks && adjustmentBlockData.blocks.length > 0) {
            const blockTime = adjustmentBlockData.blocks[0].time;
            
            // Redis에 저장 (간단한 형식으로, TTL 3주)
            await setSimple(cacheKey, {
              value: lastDifficultyAdjustmentBlock,
              timestamp: blockTime
            }, 60 * 60 * 24 * 21); // 3주 = 21일 * 24시간 * 60분 * 60초
            
            lastDifficultyAdjustmentTime = blockTime * 1000; // Unix timestamp to milliseconds
          }
        }
      }
    } catch (error) {
      console.log('Failed to fetch difficulty adjustment block info:', error);
    }
    
    console.log('[getRealTimeHashrate] API 호출 성공, 데이터 반환');
    
    return {
      ...data, // API의 모든 데이터를 포함
      currentBlockHeight: currentHeight,
      lastDifficultyAdjustmentBlock,
      lastDifficultyAdjustmentTime
    };
  } catch (error) {
    console.error('Failed to fetch Bitcoin hashrate:', error);
    return {
      hashrate: 0,
      unit: 'H/s',
      formattedHashrate: 'N/A',
      blocksMinedLast24h: 0,
      avgBlockTime: 0,
      difficulty: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// 해시레이트를 읽기 쉬운 형식으로 변환하는 헬퍼 함수
export function formatHashrate(hashrate: number): string {
  if (hashrate === 0) return 'N/A';
  
  const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s', 'ZH/s', 'YH/s'];
  let unitIndex = 0;
  let value = hashrate;
  
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  
  // 소수점 2자리까지 표시
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export { getRealTimeHashrate };