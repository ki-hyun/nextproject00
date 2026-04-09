
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

    // 세 API를 병렬로 호출하여 속도 개선 - 30초 캐싱
    const [statsResponse, blockHeightResponse, coinwarzResponse] = await Promise.all([
      // 통계 데이터 가져오기
      fetch('https://api.blockchain.info/stats', {
        next: { revalidate: 60 }
      }),
      // 현재 블록 높이 가져오기
      fetch('https://blockchain.info/q/getblockcount', {
        next: { revalidate: 60 }
      }),
      // 코인워즈 해시레이트 파싱
      fetch('https://www.coinwarz.com/mining/bitcoin/hashrate-chart', {
        next: { revalidate: 60 },
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }).catch(() => null)
    ]);

    if (!statsResponse.ok) {
      throw new Error(`HTTP error! status: ${statsResponse.status}`);
    }

    const [data, currentBlockHeight, coinwarzHtml] = await Promise.all([
      statsResponse.json(),
      blockHeightResponse.text(),
      coinwarzResponse ? coinwarzResponse.text() : Promise.resolve('')
    ]);

    // 코인워즈 해시레이트 파싱
    if (coinwarzHtml) {
      const match = coinwarzHtml.match(/(?:Bitcoin Global Hashrate|BTC Hashrate)\s+([\d,.]+)\s+(E|Z|T|P)H\/s/i);
      if (match) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2].toUpperCase();
        let multiplier = 1;
        if (unit === 'T') multiplier = 1e12;
        else if (unit === 'P') multiplier = 1e15;
        else if (unit === 'E') multiplier = 1e18;
        else if (unit === 'Z') multiplier = 1e21;

        // 파싱 성공시 stats 데이터의 hash_rate 값을 덮어씌움 (H/s 기준)
        data.hash_rate = value * multiplier;
      }
    }

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

        console.log("레디스에 있음", lastDifficultyAdjustmentBlock)
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
    console.log(data)

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
export function formatHashrate(hashrate: number, decimals: number = 2): string {
  if (hashrate === 0) return 'N/A';

  const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s', 'ZH/s', 'YH/s'];
  let unitIndex = 0;
  let value = hashrate;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // 소수점 표시
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export { getRealTimeHashrate };