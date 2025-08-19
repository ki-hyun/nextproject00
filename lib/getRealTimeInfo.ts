
async function getRealTimeHashrate() {
  try {
    // blockchain.com API 사용 - 최근 통계 데이터 가져오기
    // revalidate: 60 = 60초마다 캐시 갱신 (매번 호출 방지)
    // cache: 'no-store' = 캐싱 안함 (실시간 데이터가 필요한 경우)
    const response = await fetch('https://api.blockchain.info/stats', {
      next: { revalidate: 60 } // 60초 동안 캐시, 그 후 재검증
      // cache: 'no-store'
      // 또는 cache: 'no-store' // 캐싱 완전 비활성화 (매번 새로 호출)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 현재 블록 높이 가져오기 (최신 블록 정보)
    const blockHeightResponse = await fetch('https://blockchain.info/q/getblockcount', {
      next: { revalidate: 60 }
    });
    const currentBlockHeight = await blockHeightResponse.text();
    
    return {
      ...data, // API의 모든 데이터를 포함
      currentBlockHeight: parseInt(currentBlockHeight)
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